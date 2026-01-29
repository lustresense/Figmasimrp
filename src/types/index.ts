// SIMRP TYPE DEFINITIONS - KAMPUNG-CENTRIC SYSTEM
// Based on Grand Design v1.0

// ============================================
// CORE PILLARS - 4 Pilar Kampung Pancasila
// ============================================
export type Pillar = 'ketuhanan' | 'kemanusiaan' | 'persatuan' | 'kerakyatan';

export interface PillarScore {
  ketuhanan: number;    // Divinity pillar
  kemanusiaan: number;  // Humanity pillar
  persatuan: number;    // Unity pillar
  kerakyatan: number;   // Democracy pillar
}

export interface PillarLevel {
  ketuhanan: number;    // Level 1-10
  kemanusiaan: number;  // Level 1-10
  persatuan: number;    // Level 1-10
  kerakyatan: number;   // Level 1-10
}

// ============================================
// KAMPUNG (VILLAGE) - Main Entity
// ============================================
export interface Kampung {
  id: string;
  nama: string;
  kelurahan: string;
  kecamatan: string;
  kodePos: string;
  
  // XP & Level System (Kampung-Centric)
  xpTotal: number;
  levelKampung: number;
  xpPerPillar: PillarScore;
  levelPerPillar: PillarLevel;
  
  // Balance tracking
  balanceScore: number; // 0-100, higher = more balanced
  dominantPillar?: Pillar;
  weakestPillar?: Pillar;
  
  // Metadata
  totalKegiatan: number;
  totalRelawan: number;
  createdAt: string;
  lastActivityAt?: string;
}

// ============================================
// USER MANAGEMENT
// ============================================
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Not stored in frontend
  name: string;
  nik?: string;
  phone?: string;
  
  // Role attributes (single account type)
  isVerifiedKSH: boolean; // Kader Surabaya Hebat
  kampungId?: string; // For KSH - which kampung they represent
  
  // Location
  kecamatan: string;
  kelurahan: string;
  kampung?: string;
  rw?: string;
  rt?: string;
  
  // Volunteer tracking (simple, non-competitive)
  participationCount: number;
  contributionPoints: number; // For optional rewards only
  certificates: Certificate[];
  
  // Metadata
  createdAt: string;
  lastActive?: string;
}

export interface Certificate {
  id: string;
  activityId: string;
  activityTitle: string;
  pillar: Pillar;
  date: string;
  issuedAt: string;
}

// ============================================
// MODERATOR (3-TIER GOVERNANCE)
// ============================================
export type ModeratorTier = 'tier1_asn' | 'tier2_kelurahan' | 'tier2_kecamatan' | 'tier3_opd';

export interface Moderator {
  id: string;
  userId: string;
  name: string;
  email: string;
  tier: ModeratorTier;
  
  // Tier 1 - ASN Pendamping
  kampungBinaan?: string[]; // IDs of kampung they supervise
  
  // Tier 2 - Kelurahan/Kecamatan
  wilayahKelurahan?: string;
  wilayahKecamatan?: string;
  
  // Tier 3 - OPD
  opdName?: string;
  scopeCity?: boolean; // City-wide access
  
  // Metadata
  assignedAt: string;
  assignedBy: string;
  isActive: boolean;
}

// ============================================
// ACTIVITY/EVENT MANAGEMENT
// ============================================
export interface Activity {
  id: string;
  kampungId: string;
  kampungName: string;
  
  // Basic info
  title: string;
  description: string;
  pillar: Pillar;
  
  // Scheduling
  date: string;
  time: string;
  location: string;
  
  // Volunteer quota
  maxVolunteers: number;
  currentVolunteers: number;
  registeredVolunteers: string[]; // User IDs
  
  // Status
  status: 'draft' | 'open' | 'full' | 'ongoing' | 'completed' | 'cancelled';
  
  // Created by KSH
  createdBy: string; // KSH User ID
  createdByName: string;
  createdAt: string;
  
  // Output (filled after completion)
  output?: ActivityOutput;
  
  // Verification
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ActivityOutput {
  summary: string; // Brief impact summary
  participantCount: number;
  photoUrls?: string[];
  outcomes: string[]; // Structured outcomes
  filledBy: string; // KSH User ID
  filledAt: string;
}

export interface VolunteerChecklist {
  id: string;
  activityId: string;
  userId: string;
  
  // Simple checklist (no subjective evaluation)
  attended: boolean;
  checkedInAt?: string;
  
  // Metadata
  createdAt: string;
}

// ============================================
// PROPOSAL SYSTEM
// ============================================
export interface Proposal {
  id: string;
  kampungId: string;
  
  // Content
  title: string;
  description: string;
  pillar: Pillar;
  estimatedBudget?: number;
  targetDate?: string;
  
  // Created by KSH only
  createdBy: string;
  createdByName: string;
  createdAt: string;
  
  // Review flow
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  
  // Content (aspirational, non-binding)
  title: string;
  description: string;
  pillar?: Pillar;
  kampungId?: string;
  
  // Metadata
  createdAt: string;
  status: 'open' | 'acknowledged' | 'considered';
}

// ============================================
// RECOMMENDATION SYSTEM (ASN Pendamping)
// ============================================
export interface Recommendation {
  id: string;
  kampungId: string;
  moderatorId: string;
  moderatorName: string;
  
  // Content
  context: string; // Based on data observation
  recommendation: string;
  targetPillar?: Pillar;
  priority: 'low' | 'medium' | 'high';
  
  // Metadata
  createdAt: string;
  status: 'active' | 'implemented' | 'archived';
}

// ============================================
// PILLAR-BALANCE ENGINE
// ============================================
export interface PillarBalanceEngine {
  kampungId: string;
  
  // Current state
  currentBalance: number; // 0-100
  pillarScores: PillarScore;
  pillarLevels: PillarLevel;
  
  // Multipliers (based on balance)
  multipliers: {
    ketuhanan: number;    // 0.5 - 2.0
    kemanusiaan: number;  // 0.5 - 2.0
    persatuan: number;    // 0.5 - 2.0
    kerakyatan: number;   // 0.5 - 2.0
  };
  
  // Analysis
  dominantPillar: Pillar;
  weakestPillar: Pillar;
  balanceStatus: 'balanced' | 'slight_imbalance' | 'significant_imbalance';
  
  // Recommendations
  suggestedPillar: Pillar;
  
  lastCalculatedAt: string;
}

export interface XPCalculation {
  activityId: string;
  kampungId: string;
  pillar: Pillar;
  
  // Raw XP
  baseXP: number;
  
  // Multiplier from balance engine
  balanceMultiplier: number;
  
  // Final XP awarded
  finalXP: number;
  
  // Context
  balanceScoreBefore: number;
  balanceScoreAfter: number;
  
  calculatedAt: string;
}

// ============================================
// LEADERBOARD (KAMPUNG-BASED)
// ============================================
export interface LeaderboardEntry {
  rank: number;
  kampungId: string;
  kampungName: string;
  kelurahan: string;
  kecamatan: string;
  
  xpTotal: number;
  levelKampung: number;
  balanceScore: number;
  
  // Per-pillar breakdown
  xpPerPillar: PillarScore;
  levelPerPillar: PillarLevel;
}

export interface LeaderboardPillar {
  pillar: Pillar;
  entries: {
    rank: number;
    kampungId: string;
    kampungName: string;
    xp: number;
    level: number;
  }[];
}

// ============================================
// REWARDS (VOLUNTEER - OPTIONAL)
// ============================================
export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'certificate' | 'bus_ticket' | 'service_access' | 'priority';
  
  // Cost in contribution points
  pointsCost: number;
  
  // Availability
  isActive: boolean;
  stock?: number;
  
  // Metadata
  icon?: string;
  imageUrl?: string;
}

export interface RewardClaim {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  
  pointsSpent: number;
  
  status: 'pending' | 'approved' | 'claimed' | 'expired';
  claimedAt: string;
  expiresAt?: string;
}

// ============================================
// ANALYTICS & REPORTING
// ============================================
export interface KampungAnalytics {
  kampungId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  
  // Activity metrics
  totalActivities: number;
  activitiesPerPillar: PillarScore;
  averageParticipation: number;
  
  // XP trends
  xpGrowth: number;
  xpGrowthPerPillar: PillarScore;
  
  // Balance trends
  balanceHistory: {
    date: string;
    score: number;
  }[];
  
  // Volunteer engagement
  uniqueVolunteers: number;
  averageVolunteersPerActivity: number;
  
  generatedAt: string;
}

export interface CityAnalytics {
  period: 'week' | 'month' | 'quarter' | 'year';
  
  // Aggregate metrics
  totalKampung: number;
  activeKampung: number;
  totalActivities: number;
  totalVolunteers: number;
  
  // Top performers
  topKampung: LeaderboardEntry[];
  
  // Pillar distribution
  activitiesByPillar: PillarScore;
  averageBalanceScore: number;
  
  // Trends
  activityTrend: {
    date: string;
    count: number;
  }[];
  
  generatedAt: string;
}
