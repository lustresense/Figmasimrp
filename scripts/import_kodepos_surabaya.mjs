import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './loadEnv.mjs';

loadEnv();

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  (process.env.VITE_SUPABASE_PROJECT_ID
    ? `https://${process.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`
    : '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const upsertKv = async (key, value) => {
  const { error } = await supabase.from('kv_store_32aa5c5c').upsert({ key, value });
  if (error) throw error;
};

const CITY_URL = 'https://kodepos.co.id/kodepos/jawa-timur/kota-surabaya';

const cleanText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const parseKecamatanLinks = (html) => {
  const links = new Set();
  const regex = /href="(\/kodepos\/jawa-timur\/kota-surabaya\/[^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const path = match[1];
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 4) {
      links.add(`https://kodepos.co.id${path}`);
    }
  }
  return Array.from(links);
};

const parseKelurahanRows = (html) => {
  const rows = [];
  const rowRegex = /<tr>\s*<td>\s*(\d+)\s*<\/td>\s*<td>\s*<a[^>]*>([^<]+)<\/a>\s*<\/td>\s*<td>\s*(\d{5})\s*<\/td>\s*<td>\s*([\d.]+)\s*<\/td>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    rows.push({
      no: parseInt(match[1], 10),
      kelurahan: match[2].trim(),
      kodepos: match[3].trim(),
      kemendagri: match[4].trim()
    });
  }

  if (rows.length > 0) return rows;

  const text = cleanText(html);
  const section = text.split('No Nama Kelurahan Kode Pos')[1]?.split('Menampilkan')[0];
  if (!section) return rows;

  const fallbackRegex = /(\d+)\s+([A-Za-zÀ-ž'().\- ]+?)\s+(\d{5})\s+(\d{2}\.\d{2}\.\d{2}\.\d{4})/g;
  let m;
  while ((m = fallbackRegex.exec(section)) !== null) {
    rows.push({
      no: parseInt(m[1], 10),
      kelurahan: m[2].trim(),
      kodepos: m[3].trim(),
      kemendagri: m[4].trim()
    });
  }
  return rows;
};

const run = async () => {
  console.log('Fetching Surabaya kodepos data...');
  const cityRes = await fetch(CITY_URL);
  if (!cityRes.ok) throw new Error(`Failed to fetch city page: ${cityRes.status}`);
  const cityHtml = await cityRes.text();
  const kecamatanLinks = parseKecamatanLinks(cityHtml);

  const entries = [];
  for (const link of kecamatanLinks) {
    const res = await fetch(link);
    if (!res.ok) {
      console.warn('Skip', link, res.status);
      continue;
    }
    const html = await res.text();
    const slug = link.split('/').filter(Boolean).pop();
    const kecamatanName = slug
      ? slug
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ')
      : 'Unknown';

    const rows = parseKelurahanRows(html);
    rows.forEach((row) => {
      entries.push({
        kecamatan: kecamatanName,
        kelurahan: row.kelurahan,
        kodepos: row.kodepos,
        kemendagri: row.kemendagri
      });
    });
  }

  const byKodepos = new Map();
  for (const item of entries) {
    if (!byKodepos.has(item.kodepos)) {
      byKodepos.set(item.kodepos, []);
    }
    byKodepos.get(item.kodepos).push({
      kelurahan: item.kelurahan,
      kecamatan: item.kecamatan,
      kemendagri: item.kemendagri
    });
  }

  const kecamatanIndex = {};
  for (const item of entries) {
    if (!kecamatanIndex[item.kecamatan]) kecamatanIndex[item.kecamatan] = new Set();
    kecamatanIndex[item.kecamatan].add(item.kelurahan);
  }

  const now = new Date().toISOString();
  await upsertKv('surabaya:kecamatan', {
    city: 'Kota Surabaya',
    updatedAt: now,
    kecamatan: Object.keys(kecamatanIndex).sort().map((k) => ({
      name: k,
      kelurahanCount: kecamatanIndex[k].size
    }))
  });

  await upsertKv('surabaya:kodepos:index', {
    updatedAt: now,
    total: byKodepos.size,
    kodepos: Array.from(byKodepos.keys()).sort()
  });

  for (const [kodepos, list] of byKodepos.entries()) {
    await upsertKv(`kodepos:${kodepos}`, {
      kodepos,
      updatedAt: now,
      kelurahan: list.sort((a, b) => a.kelurahan.localeCompare(b.kelurahan))
    });
  }

  console.log(`Imported ${entries.length} kelurahan records.`);
  console.log(`Mapped ${byKodepos.size} kodepos.`);
};

run().catch((err) => {
  console.error('Import failed:', err.message || err);
  process.exit(1);
});

