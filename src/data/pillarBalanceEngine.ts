// PILLAR-BALANCE ENGINE
// The core mechanism for kampung-centric gamification

import type { 
  Pillar, 
  PillarScore, 
  PillarLevel, 
  PillarBalanceEngine,
  XPCalculation,
  Kampung
} from '@/types';

// ============================================
// CONFIGURATION
// ============================================

const BASE_XP_PER_ACTIVITY = 100;
const XP_PER_LEVEL = 500; // XP needed to level up a pillar

// Balance thresholds
const BALANCED_THRESHOLD = 80; // Score above this is "balanced"
const SLIGHT_IMBALANCE_THRESHOLD = 60; // Between 60-80 is "slight imbalance"
// Below 60 is "significant imbalance"

// Multiplier ranges
const MIN_MULTIPLIER = 0.5; // For dominant pillars
const MAX_MULTIPLIER = 2.0; // For weak pillars
const NORMAL_MULTIPLIER = 1.0; // For balanced state

// ============================================
// BALANCE CALCULATION
// ============================================

/**
 * Calculate balance score (0-100) based on pillar distribution
 * Higher score = more balanced
 */
export function calculateBalanceScore(scores: PillarScore): number {
  const values = [
    scores.ketuhanan,
    scores.kemanusiaan,
    scores.persatuan,
    scores.kerakyatan
  ];
  
  const total = values.reduce((sum, val) => sum + val, 0);
  if (total === 0) return 100; // All zeros = balanced
  
  const average = total / 4;
  
  // Calculate variance
  const variance = values.reduce((sum, val) => {
    const diff = val - average;
    return sum + (diff * diff);
  }, 0) / 4;
  
  // Standard deviation
  const stdDev = Math.sqrt(variance);
  
  // Convert to 0-100 scale (lower stdDev = higher score)
  // Normalize: if average is 1000, stdDev of 500 would be very unbalanced
  const normalizedStdDev = average > 0 ? stdDev / average : 0;
  
  // Map to score: 0 variance = 100, high variance = 0
  // Using exponential decay for smoother curve
  const balanceScore = Math.max(0, Math.min(100, 100 * Math.exp(-normalizedStdDev * 2)));
  
  return Math.round(balanceScore);
}

/**
 * Identify dominant and weakest pillars
 */
export function identifyPillarExtremes(scores: PillarScore): {
  dominant: Pillar;
  weakest: Pillar;
} {
  const pillars: Pillar[] = ['ketuhanan', 'kemanusiaan', 'persatuan', 'kerakyatan'];
  
  let dominant: Pillar = 'ketuhanan';
  let weakest: Pillar = 'ketuhanan';
  let maxScore = scores.ketuhanan;
  let minScore = scores.ketuhanan;
  
  pillars.forEach(pillar => {
    const score = scores[pillar];
    if (score > maxScore) {
      maxScore = score;
      dominant = pillar;
    }
    if (score < minScore) {
      minScore = score;
      weakest = pillar;
    }
  });
  
  return { dominant, weakest };
}

/**
 * Calculate multipliers for each pillar based on balance
 * Dominant pillars get lower multipliers (0.5-1.0)
 * Weak pillars get higher multipliers (1.0-2.0)
 */
export function calculateMultipliers(
  scores: PillarScore,
  balanceScore: number
): PillarScore {
  const { dominant, weakest } = identifyPillarExtremes(scores);
  const pillars: Pillar[] = ['ketuhanan', 'kemanusiaan', 'persatuan', 'kerakyatan'];
  
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const average = total / 4;
  
  const multipliers: PillarScore = {
    ketuhanan: NORMAL_MULTIPLIER,
    kemanusiaan: NORMAL_MULTIPLIER,
    persatuan: NORMAL_MULTIPLIER,
    kerakyatan: NORMAL_MULTIPLIER
  };
  
  // If perfectly balanced, all multipliers are 1.0
  if (balanceScore >= BALANCED_THRESHOLD) {
    return multipliers;
  }
  
  // Calculate multiplier for each pillar
  pillars.forEach(pillar => {
    const score = scores[pillar];
    const deviation = average > 0 ? (score - average) / average : 0;
    
    if (deviation > 0) {
      // Above average (dominant) - reduce multiplier
      // More dominant = lower multiplier
      const reduction = Math.min(deviation, 1) * (NORMAL_MULTIPLIER - MIN_MULTIPLIER);
      multipliers[pillar] = NORMAL_MULTIPLIER - reduction;
    } else if (deviation < 0) {
      // Below average (weak) - increase multiplier
      // Weaker = higher multiplier
      const increase = Math.min(Math.abs(deviation), 1) * (MAX_MULTIPLIER - NORMAL_MULTIPLIER);
      multipliers[pillar] = NORMAL_MULTIPLIER + increase;
    }
  });
  
  return multipliers;
}

// ============================================
// XP CALCULATION
// ============================================

/**
 * Calculate XP awarded for an activity, applying balance multiplier
 */
export function calculateActivityXP(
  pillar: Pillar,
  kampung: Kampung,
  baseXP: number = BASE_XP_PER_ACTIVITY
): XPCalculation {
  const balanceScoreBefore = calculateBalanceScore(kampung.xpPerPillar);
  const multipliers = calculateMultipliers(kampung.xpPerPillar, balanceScoreBefore);
  
  const balanceMultiplier = multipliers[pillar];
  const finalXP = Math.round(baseXP * balanceMultiplier);
  
  // Simulate score after adding XP
  const updatedScores = { ...kampung.xpPerPillar };
  updatedScores[pillar] += finalXP;
  const balanceScoreAfter = calculateBalanceScore(updatedScores);
  
  return {
    activityId: '', // Will be filled by caller
    kampungId: kampung.id,
    pillar,
    baseXP,
    balanceMultiplier,
    finalXP,
    balanceScoreBefore,
    balanceScoreAfter,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Convert XP to level for a pillar
 */
export function calculatePillarLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/**
 * Calculate kampung overall level based on pillar levels
 * Uses average of pillar levels
 */
export function calculateKampungLevel(pillarLevels: PillarLevel): number {
  const average = (
    pillarLevels.ketuhanan +
    pillarLevels.kemanusiaan +
    pillarLevels.persatuan +
    pillarLevels.kerakyatan
  ) / 4;
  
  return Math.floor(average);
}

// ============================================
// ENGINE STATE
// ============================================

/**
 * Create or update Pillar-Balance Engine state for a kampung
 */
export function updateEngineState(kampung: Kampung): PillarBalanceEngine {
  const balanceScore = calculateBalanceScore(kampung.xpPerPillar);
  const { dominant, weakest } = identifyPillarExtremes(kampung.xpPerPillar);
  const multipliers = calculateMultipliers(kampung.xpPerPillar, balanceScore);
  
  let balanceStatus: 'balanced' | 'slight_imbalance' | 'significant_imbalance';
  if (balanceScore >= BALANCED_THRESHOLD) {
    balanceStatus = 'balanced';
  } else if (balanceScore >= SLIGHT_IMBALANCE_THRESHOLD) {
    balanceStatus = 'slight_imbalance';
  } else {
    balanceStatus = 'significant_imbalance';
  }
  
  return {
    kampungId: kampung.id,
    currentBalance: balanceScore,
    pillarScores: kampung.xpPerPillar,
    pillarLevels: kampung.levelPerPillar,
    multipliers,
    dominantPillar: dominant,
    weakestPillar: weakest,
    balanceStatus,
    suggestedPillar: weakest, // Always suggest focusing on weakest
    lastCalculatedAt: new Date().toISOString()
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get pillar name in Indonesian
 */
export function getPillarName(pillar: Pillar): string {
  const names: Record<Pillar, string> = {
    ketuhanan: 'Ketuhanan Yang Maha Esa',
    kemanusiaan: 'Kemanusiaan yang Adil dan Beradab',
    persatuan: 'Persatuan Indonesia',
    kerakyatan: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan'
  };
  return names[pillar];
}

/**
 * Get pillar icon/emoji
 */
export function getPillarIcon(pillar: Pillar): string {
  const icons: Record<Pillar, string> = {
    ketuhanan: '🙏',
    kemanusiaan: '❤️',
    persatuan: '🤝',
    kerakyatan: '⚖️'
  };
  return icons[pillar];
}

/**
 * Get pillar color for UI
 */
export function getPillarColor(pillar: Pillar): string {
  const colors: Record<Pillar, string> = {
    ketuhanan: '#FFD700',     // Gold
    kemanusiaan: '#FF6B6B',   // Red
    persatuan: '#4ECDC4',     // Teal
    kerakyatan: '#95E1D3'     // Light green
  };
  return colors[pillar];
}

/**
 * Get balance status description
 */
export function getBalanceStatusText(score: number): string {
  if (score >= BALANCED_THRESHOLD) {
    return 'Seimbang';
  } else if (score >= SLIGHT_IMBALANCE_THRESHOLD) {
    return 'Sedikit Timpang';
  } else {
    return 'Sangat Timpang';
  }
}

/**
 * Get recommendation text based on balance
 */
export function getBalanceRecommendation(engine: PillarBalanceEngine): string {
  const { balanceStatus, weakestPillar, dominantPillar } = engine;
  
  if (balanceStatus === 'balanced') {
    return 'Kampung sudah seimbang! Pertahankan aktivitas di semua pilar.';
  } else if (balanceStatus === 'slight_imbalance') {
    return `Fokuskan kegiatan pada pilar ${getPillarName(weakestPillar)} untuk meningkatkan keseimbangan.`;
  } else {
    return `Pilar ${getPillarName(weakestPillar)} sangat tertinggal. Prioritaskan kegiatan di pilar ini untuk dampak XP maksimal.`;
  }
}
