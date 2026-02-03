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

const findUserByEmail = async (email) => {
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data?.users?.find((u) => u.email === email);
    if (user) return user;
    if (!data?.users || data.users.length < 200) break;
    page += 1;
  }
  return null;
};

const getOrCreateUser = async ({ email, password, name, metadata }) => {
  const existing = await findUserByEmail(email);
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      ...metadata
    }
  });
  if (error) throw error;
  return data.user;
};

const nowIso = () => new Date().toISOString();
const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const run = async () => {
  console.log('Seeding SIMRP demo data...');

  const kampungSamples = [
    {
      id: 'kampung-keputih',
      name: 'Kampung Pancasila Keputih',
      kecamatan: 'Sukolilo',
      kelurahan: 'Keputih',
      kodepos: '60111',
      xp: 820,
      volunteers: 32
    },
    {
      id: 'kampung-wonorejo',
      name: 'Kampung Pancasila Wonorejo',
      kecamatan: 'Rungkut',
      kelurahan: 'Wonorejo',
      kodepos: '60296',
      xp: 760,
      volunteers: 28
    },
    {
      id: 'kampung-tandes',
      name: 'Kampung Pancasila Tandes',
      kecamatan: 'Tandes',
      kelurahan: 'Tandes',
      kodepos: '60187',
      xp: 700,
      volunteers: 25
    }
  ];

  // Create users
  const kshUser = await getOrCreateUser({
    email: 'ksh.demo@simrp.app',
    password: 'password123',
    name: 'Kak Esa (KSH)',
    metadata: {
      role: 'user',
      isKsh: true
    }
  });

  const moderatorUser = await getOrCreateUser({
    email: 'moderator1.demo@simrp.app',
    password: 'password123',
    name: 'Pak Raka (ASN)',
    metadata: {
      role: 'moderator',
      moderatorTier: 1
    }
  });

  // KV user profiles
  await upsertKv(`user:${kshUser.id}`, {
    id: kshUser.id,
    email: kshUser.email,
    name: 'Kak Esa',
    role: 'user',
    isKsh: true,
    level: 1,
    levelName: 'Relawan Terverifikasi',
    points: 120,
    badges: ['KSH Verified'],
    kecamatan: kampungSamples[0].kecamatan,
    kelurahan: kampungSamples[0].kelurahan,
    kodepos: kampungSamples[0].kodepos,
    kampung: kampungSamples[0],
    kampungName: kampungSamples[0].name,
    kampungLeaderboard: kampungSamples.map((k) => ({ name: k.name, kecamatan: k.kecamatan, xp: k.xp })),
    kampungDibantu: [],
    kampungPernahBantu: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  });

  await upsertKv(`user:${moderatorUser.id}`, {
    id: moderatorUser.id,
    email: moderatorUser.email,
    name: 'Pak Raka',
    role: 'moderator',
    moderatorTier: 1,
    level: 1,
    levelName: 'ASN Pendamping',
    points: 0,
    badges: [],
    kecamatan: 'Sukolilo',
    kelurahan: 'Keputih',
    kodepos: '60111',
    createdAt: nowIso(),
    updatedAt: nowIso()
  });

  // Seed kampung entries
  for (const kampung of kampungSamples) {
    await upsertKv(`kampung:${kampung.id}`, {
      ...kampung,
      updatedAt: nowIso()
    });
  }

  // Seed events
  const events = [
    {
      id: 'event-seed-1',
      title: 'Aksi Bersih Taman Kampung',
      description: 'Gerakan bersih taman dan selokan utama kampung.',
      pillar: 1,
      date: addDays(5),
      time: '07:00 - 10:00',
      location: 'Balai RW Keputih',
      basePoints: 60,
      participants: [],
      organizer: 'KSH Keputih',
      createdBy: kshUser.id,
      status: 'upcoming'
    },
    {
      id: 'event-seed-2',
      title: 'Pelatihan UMKM Digital',
      description: 'Pendampingan promosi UMKM dan marketplace.',
      pillar: 2,
      date: addDays(10),
      time: '13:00 - 16:00',
      location: 'Aula Kelurahan Keputih',
      basePoints: 80,
      participants: [],
      organizer: 'KSH Keputih',
      createdBy: kshUser.id,
      status: 'upcoming'
    },
    {
      id: 'event-seed-3',
      title: 'Festival Budaya Kampung',
      description: 'Pelatihan seni dan pertunjukan gotong royong.',
      pillar: 4,
      date: addDays(14),
      time: '18:30 - 21:00',
      location: 'Pendopo Kampung',
      basePoints: 70,
      participants: [],
      organizer: 'KSH Keputih',
      createdBy: kshUser.id,
      status: 'upcoming'
    }
  ];

  for (const event of events) {
    await upsertKv(`event:${event.id}`, {
      ...event,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
  }

  console.log('Seed complete.');
  console.log('Dummy accounts:');
  console.log('- KSH: ksh.demo@simrp.app / password123');
  console.log('- Moderator Tier 1: moderator1.demo@simrp.app / password123');
};

run().catch((err) => {
  console.error('Seed failed:', err.message || err);
  process.exit(1);
});

