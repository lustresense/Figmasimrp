import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}

const dataPath = path.resolve('src', 'data', 'geographicData.ts');
const source = fs.readFileSync(dataPath, 'utf-8');

const match = source.match(/export const geographicData: GeographicData = (\{[\s\S]*?\});/);
if (!match) {
  console.error('Could not parse geographicData from src/data/geographicData.ts');
  process.exit(1);
}

// Safe-ish eval for a local file we control.
// eslint-disable-next-line no-new-func
const geographicData = Function(`return ${match[1]}`)();

const rows = [];
for (const kec of geographicData.kecamatan || []) {
  for (const kel of kec.kelurahan || []) {
    for (const kodepos of kel.kodepos || []) {
      rows.push({
        kodepos,
        kecamatan: kec.nama,
        kelurahan: kel.nama
      });
    }
  }
}

console.log(`Preparing ${rows.length} rows...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const chunkSize = 500;
for (let i = 0; i < rows.length; i += chunkSize) {
  const chunk = rows.slice(i, i + chunkSize);
  const { error } = await supabase
    .from('kodepos_surabaya')
    .upsert(chunk, { onConflict: 'kodepos,kecamatan,kelurahan' });
  if (error) {
    console.error('Upsert error:', error);
    process.exit(1);
  }
  console.log(`Upserted ${Math.min(i + chunkSize, rows.length)} / ${rows.length}`);
}

console.log('Done.');
