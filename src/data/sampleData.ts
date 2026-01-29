// SAMPLE DATA - KAMPUNG-CENTRIC SIMRP
// For development and demonstration purposes

import type {
  Kampung,
  User,
  Moderator,
  Activity,
  Proposal,
  Recommendation,
  LeaderboardEntry,
  PillarScore,
  PillarLevel
} from '@/types';

// ============================================
// KAMPUNG DATA
// ============================================

export const sampleKampung: Kampung[] = [
  {
    id: 'kmp-001',
    nama: 'Kampung Pancasila Airlangga',
    kelurahan: 'Airlangga',
    kecamatan: 'Gubeng',
    kodePos: '60286',
    xpTotal: 4200,
    levelKampung: 8,
    xpPerPillar: {
      ketuhanan: 1100,
      kemanusiaan: 1050,
      persatuan: 1000,
      kerakyatan: 1050
    },
    levelPerPillar: {
      ketuhanan: 3,
      kemanusiaan: 3,
      persatuan: 2,
      kerakyatan: 3
    },
    balanceScore: 92,
    totalKegiatan: 42,
    totalRelawan: 87,
    createdAt: '2025-01-01T00:00:00Z',
    lastActivityAt: '2026-01-28T10:30:00Z'
  },
  {
    id: 'kmp-002',
    nama: 'Kampung Pancasila Wonorejo',
    kelurahan: 'Wonorejo',
    kecamatan: 'Rungkut',
    kodePos: '60296',
    xpTotal: 3800,
    levelKampung: 7,
    xpPerPillar: {
      ketuhanan: 800,
      kemanusiaan: 1500,
      persatuan: 900,
      kerakyatan: 600
    },
    levelPerPillar: {
      ketuhanan: 2,
      kemanusiaan: 3,
      persatuan: 2,
      kerakyatan: 2
    },
    balanceScore: 68,
    dominantPillar: 'kemanusiaan',
    weakestPillar: 'kerakyatan',
    totalKegiatan: 38,
    totalRelawan: 65,
    createdAt: '2025-01-01T00:00:00Z',
    lastActivityAt: '2026-01-27T14:15:00Z'
  },
  {
    id: 'kmp-003',
    nama: 'Kampung Pancasila Ketabang',
    kelurahan: 'Ketabang',
    kecamatan: 'Genteng',
    kodePos: '60272',
    xpTotal: 2500,
    levelKampung: 5,
    xpPerPillar: {
      ketuhanan: 1800,
      kemanusiaan: 300,
      persatuan: 250,
      kerakyatan: 150
    },
    levelPerPillar: {
      ketuhanan: 4,
      kemanusiaan: 1,
      persatuan: 1,
      kerakyatan: 1
    },
    balanceScore: 42,
    dominantPillar: 'ketuhanan',
    weakestPillar: 'kerakyatan',
    totalKegiatan: 25,
    totalRelawan: 45,
    createdAt: '2025-01-15T00:00:00Z',
    lastActivityAt: '2026-01-26T09:00:00Z'
  }
];

// ============================================
// USER DATA (RELAWAN & KSH)
// ============================================

export const sampleUsers: User[] = [
  {
    id: 'usr-001',
    username: 'andi_mahasiswa',
    email: 'andi@example.com',
    name: 'Andi Pratama',
    nik: '3578010101990001',
    phone: '081234567890',
    isVerifiedKSH: false,
    kecamatan: 'Gubeng',
    kelurahan: 'Airlangga',
    kampung: 'Kampung Pancasila Airlangga',
    rw: '03',
    rt: '05',
    participationCount: 12,
    contributionPoints: 120,
    certificates: [],
    createdAt: '2025-06-01T00:00:00Z',
    lastActive: '2026-01-28T10:30:00Z'
  },
  {
    id: 'usr-002',
    username: 'esa_ksh',
    email: 'esa@example.com',
    name: 'Esa Wijaya',
    nik: '3578020202880001',
    phone: '081234567891',
    isVerifiedKSH: true,
    kampungId: 'kmp-001',
    kecamatan: 'Gubeng',
    kelurahan: 'Airlangga',
    kampung: 'Kampung Pancasila Airlangga',
    rw: '03',
    rt: '02',
    participationCount: 28,
    contributionPoints: 350,
    certificates: [],
    createdAt: '2025-03-01T00:00:00Z',
    lastActive: '2026-01-29T08:00:00Z'
  },
  {
    id: 'usr-003',
    username: 'siti_relawan',
    email: 'siti@example.com',
    name: 'Siti Nurhaliza',
    phone: '081234567892',
    isVerifiedKSH: false,
    kecamatan: 'Rungkut',
    kelurahan: 'Wonorejo',
    kampung: 'Kampung Pancasila Wonorejo',
    participationCount: 8,
    contributionPoints: 80,
    certificates: [],
    createdAt: '2025-09-15T00:00:00Z',
    lastActive: '2026-01-27T14:15:00Z'
  },
  {
    id: 'usr-004',
    username: 'budi_ksh',
    email: 'budi@example.com',
    name: 'Budi Santoso',
    nik: '3578030303850001',
    phone: '081234567893',
    isVerifiedKSH: true,
    kampungId: 'kmp-002',
    kecamatan: 'Rungkut',
    kelurahan: 'Wonorejo',
    kampung: 'Kampung Pancasila Wonorejo',
    rw: '05',
    rt: '01',
    participationCount: 35,
    contributionPoints: 420,
    certificates: [],
    createdAt: '2025-02-01T00:00:00Z',
    lastActive: '2026-01-28T16:30:00Z'
  }
];

// ============================================
// MODERATOR DATA (3-TIER)
// ============================================

export const sampleModerators: Moderator[] = [
  {
    id: 'mod-001',
    userId: 'mod-usr-001',
    name: 'Pak Hendra (ASN Pendamping)',
    email: 'hendra.asn@surabaya.go.id',
    tier: 'tier1_asn',
    kampungBinaan: ['kmp-001', 'kmp-002'],
    assignedAt: '2025-01-01T00:00:00Z',
    assignedBy: 'system',
    isActive: true
  },
  {
    id: 'mod-002',
    userId: 'mod-usr-002',
    name: 'Bu Ratna (Koordinator Kelurahan Airlangga)',
    email: 'ratna.kel@surabaya.go.id',
    tier: 'tier2_kelurahan',
    wilayahKelurahan: 'Airlangga',
    wilayahKecamatan: 'Gubeng',
    assignedAt: '2025-01-01T00:00:00Z',
    assignedBy: 'system',
    isActive: true
  },
  {
    id: 'mod-003',
    userId: 'mod-usr-003',
    name: 'Pak Joko (PIC Kecamatan Gubeng)',
    email: 'joko.kec@surabaya.go.id',
    tier: 'tier2_kecamatan',
    wilayahKecamatan: 'Gubeng',
    assignedAt: '2025-01-01T00:00:00Z',
    assignedBy: 'system',
    isActive: true
  },
  {
    id: 'mod-004',
    userId: 'mod-usr-004',
    name: 'Bu Sri (OPD Diskominfo)',
    email: 'sri.opd@surabaya.go.id',
    tier: 'tier3_opd',
    opdName: 'Dinas Komunikasi dan Informatika',
    scopeCity: true,
    assignedAt: '2025-01-01T00:00:00Z',
    assignedBy: 'system',
    isActive: true
  }
];

// ============================================
// ACTIVITY DATA
// ============================================

export const sampleActivities: Activity[] = [
  {
    id: 'act-001',
    kampungId: 'kmp-001',
    kampungName: 'Kampung Pancasila Airlangga',
    title: 'Pengajian Rutin Bulanan',
    description: 'Pengajian rutin untuk warga kampung',
    pillar: 'ketuhanan',
    date: '2026-02-05',
    time: '19:00',
    location: 'Musholla Al-Ikhlas',
    maxVolunteers: 5,
    currentVolunteers: 3,
    registeredVolunteers: ['usr-001', 'usr-002', 'usr-003'],
    status: 'open',
    createdBy: 'usr-002',
    createdByName: 'Esa Wijaya',
    createdAt: '2026-01-20T10:00:00Z',
    verificationStatus: 'pending'
  },
  {
    id: 'act-002',
    kampungId: 'kmp-001',
    kampungName: 'Kampung Pancasila Airlangga',
    title: 'Bakti Sosial Kesehatan Gratis',
    description: 'Pemeriksaan kesehatan gratis untuk warga',
    pillar: 'kemanusiaan',
    date: '2026-02-10',
    time: '08:00',
    location: 'Balai RW 03',
    maxVolunteers: 10,
    currentVolunteers: 10,
    registeredVolunteers: ['usr-001', 'usr-002', 'usr-003'],
    status: 'full',
    createdBy: 'usr-002',
    createdByName: 'Esa Wijaya',
    createdAt: '2026-01-22T14:00:00Z',
    verificationStatus: 'pending'
  },
  {
    id: 'act-003',
    kampungId: 'kmp-002',
    kampungName: 'Kampung Pancasila Wonorejo',
    title: 'Gotong Royong Bersih Kampung',
    description: 'Kerja bakti membersihkan lingkungan kampung',
    pillar: 'persatuan',
    date: '2026-02-08',
    time: '06:00',
    location: 'Area Kampung',
    maxVolunteers: 20,
    currentVolunteers: 12,
    registeredVolunteers: ['usr-003', 'usr-004'],
    status: 'open',
    createdBy: 'usr-004',
    createdByName: 'Budi Santoso',
    createdAt: '2026-01-25T09:00:00Z',
    verificationStatus: 'pending'
  },
  {
    id: 'act-004',
    kampungId: 'kmp-001',
    kampungName: 'Kampung Pancasila Airlangga',
    title: 'Musyawarah RT',
    description: 'Musyawarah pembahasan program kampung',
    pillar: 'kerakyatan',
    date: '2026-01-25',
    time: '19:30',
    location: 'Balai RT 05',
    maxVolunteers: 0,
    currentVolunteers: 0,
    registeredVolunteers: [],
    status: 'completed',
    createdBy: 'usr-002',
    createdByName: 'Esa Wijaya',
    createdAt: '2026-01-18T15:00:00Z',
    output: {
      summary: 'Musyawarah berjalan lancar, disepakati 3 program baru',
      participantCount: 25,
      outcomes: [
        'Program pengajian rutin',
        'Program bakti sosial kesehatan',
        'Program pelatihan UMKM'
      ],
      filledBy: 'usr-002',
      filledAt: '2026-01-26T08:00:00Z'
    },
    verificationStatus: 'verified',
    verifiedBy: 'mod-001',
    verifiedAt: '2026-01-26T10:00:00Z'
  }
];

// ============================================
// PROPOSAL DATA
// ============================================

export const sampleProposals: Proposal[] = [
  {
    id: 'prop-001',
    kampungId: 'kmp-002',
    title: 'Pelatihan UMKM Digital Marketing',
    description: 'Pelatihan untuk pelaku UMKM kampung dalam memasarkan produk secara digital',
    pillar: 'kerakyatan',
    estimatedBudget: 5000000,
    targetDate: '2026-03-15',
    createdBy: 'usr-004',
    createdByName: 'Budi Santoso',
    createdAt: '2026-01-20T10:00:00Z',
    status: 'submitted',
  },
  {
    id: 'prop-002',
    kampungId: 'kmp-001',
    title: 'Pembangunan Taman Bacaan',
    description: 'Membangun taman bacaan untuk anak-anak kampung',
    pillar: 'kemanusiaan',
    estimatedBudget: 10000000,
    targetDate: '2026-04-01',
    createdBy: 'usr-002',
    createdByName: 'Esa Wijaya',
    createdAt: '2026-01-15T14:30:00Z',
    status: 'under_review',
    reviewedBy: 'mod-001',
    reviewedAt: '2026-01-22T09:00:00Z'
  }
];

// ============================================
// RECOMMENDATION DATA (ASN)
// ============================================

export const sampleRecommendations: Recommendation[] = [
  {
    id: 'rec-001',
    kampungId: 'kmp-002',
    moderatorId: 'mod-001',
    moderatorName: 'Pak Hendra (ASN Pendamping)',
    context: 'Pilar Kemanusiaan sangat dominan (1500 XP) dibanding pilar lain (600-900 XP)',
    recommendation: 'Fokuskan kegiatan pada pilar Kerakyatan dan Persatuan untuk meningkatkan keseimbangan. Dampak XP akan lebih tinggi.',
    targetPillar: 'kerakyatan',
    priority: 'high',
    createdAt: '2026-01-27T10:00:00Z',
    status: 'active'
  },
  {
    id: 'rec-002',
    kampungId: 'kmp-003',
    moderatorId: 'mod-001',
    moderatorName: 'Pak Hendra (ASN Pendamping)',
    context: 'Ketimpangan sangat tinggi - Pilar Ketuhanan 1800 XP vs pilar lain 150-300 XP',
    recommendation: 'Segera laksanakan kegiatan di pilar Kerakyatan, Persatuan, dan Kemanusiaan. Balance score kampung hanya 42.',
    priority: 'high',
    createdAt: '2026-01-26T15:30:00Z',
    status: 'active'
  }
];

// ============================================
// LEADERBOARD DATA
// ============================================

export const sampleLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    kampungId: 'kmp-001',
    kampungName: 'Kampung Pancasila Airlangga',
    kelurahan: 'Airlangga',
    kecamatan: 'Gubeng',
    xpTotal: 4200,
    levelKampung: 8,
    balanceScore: 92,
    xpPerPillar: {
      ketuhanan: 1100,
      kemanusiaan: 1050,
      persatuan: 1000,
      kerakyatan: 1050
    },
    levelPerPillar: {
      ketuhanan: 3,
      kemanusiaan: 3,
      persatuan: 2,
      kerakyatan: 3
    }
  },
  {
    rank: 2,
    kampungId: 'kmp-002',
    kampungName: 'Kampung Pancasila Wonorejo',
    kelurahan: 'Wonorejo',
    kecamatan: 'Rungkut',
    xpTotal: 3800,
    levelKampung: 7,
    balanceScore: 68,
    xpPerPillar: {
      ketuhanan: 800,
      kemanusiaan: 1500,
      persatuan: 900,
      kerakyatan: 600
    },
    levelPerPillar: {
      ketuhanan: 2,
      kemanusiaan: 3,
      persatuan: 2,
      kerakyatan: 2
    }
  },
  {
    rank: 3,
    kampungId: 'kmp-003',
    kampungName: 'Kampung Pancasila Ketabang',
    kelurahan: 'Ketabang',
    kecamatan: 'Genteng',
    xpTotal: 2500,
    levelKampung: 5,
    balanceScore: 42,
    xpPerPillar: {
      ketuhanan: 1800,
      kemanusiaan: 300,
      persatuan: 250,
      kerakyatan: 150
    },
    levelPerPillar: {
      ketuhanan: 4,
      kemanusiaan: 1,
      persatuan: 1,
      kerakyatan: 1
    }
  }
];
