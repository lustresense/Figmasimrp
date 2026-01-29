import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import type { Kampung, PillarScore, PillarLevel } from '@/types';
import { getPillarIcon, getPillarName, getPillarColor } from '@/data/pillarBalanceEngine';

interface PillarProgressVisualizationProps {
  kampung: Kampung;
  showDetails?: boolean;
}

export function PillarProgressVisualization({ kampung, showDetails = true }: PillarProgressVisualizationProps) {
  const pillars: Array<keyof PillarScore> = ['ketuhanan', 'kemanusiaan', 'persatuan', 'kerakyatan'];
  
  // Calculate max XP for progress bar normalization
  const maxXP = Math.max(...pillars.map(p => kampung.xpPerPillar[p]));
  const maxLevel = Math.max(...pillars.map(p => kampung.levelPerPillar[p]));

  // Balance indicator
  const getBalanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBalanceText = (score: number) => {
    if (score >= 80) return 'Seimbang';
    if (score >= 60) return 'Sedikit Timpang';
    return 'Sangat Timpang';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progres 4 Pilar</CardTitle>
            <CardDescription>{kampung.nama}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{kampung.levelKampung}</div>
            <div className="text-sm text-gray-500">Level Kampung</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Score Indicator */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Skor Keseimbangan</span>
            <span className={`text-lg font-bold ${getBalanceColor(kampung.balanceScore)}`}>
              {kampung.balanceScore}/100
            </span>
          </div>
          <Progress value={kampung.balanceScore} className="h-2" />
          <p className="text-xs text-gray-600 mt-2">
            Status: <span className={getBalanceColor(kampung.balanceScore)}>
              {getBalanceText(kampung.balanceScore)}
            </span>
          </p>
        </div>

        {/* Individual Pillars */}
        <div className="space-y-4">
          {pillars.map((pillar) => {
            const xp = kampung.xpPerPillar[pillar];
            const level = kampung.levelPerPillar[pillar];
            const progressPercent = maxXP > 0 ? (xp / maxXP) * 100 : 0;
            const xpInLevel = xp % 500; // Assuming 500 XP per level
            const xpToNextLevel = 500 - xpInLevel;
            const levelProgress = (xpInLevel / 500) * 100;

            return (
              <div key={pillar} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPillarIcon(pillar)}</span>
                    <div>
                      <div className="font-medium text-sm">
                        {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
                      </div>
                      {showDetails && (
                        <div className="text-xs text-gray-500">
                          {getPillarName(pillar)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">Level {level}</div>
                    <div className="text-xs text-gray-500">{xp} XP</div>
                  </div>
                </div>
                
                {/* Progress bar for XP within level */}
                <div className="space-y-1">
                  <Progress 
                    value={levelProgress} 
                    className="h-2"
                    style={{
                      '--progress-color': getPillarColor(pillar)
                    } as React.CSSProperties}
                  />
                  {showDetails && (
                    <p className="text-xs text-gray-500">
                      {xpToNextLevel} XP lagi untuk Level {level + 1}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total XP */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total XP Kampung</span>
            <span className="text-xl font-bold text-blue-600">{kampung.xpTotal}</span>
          </div>
        </div>

        {/* Balance Recommendation */}
        {kampung.balanceScore < 80 && kampung.weakestPillar && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Rekomendasi</p>
                <p className="text-blue-700">
                  Fokuskan kegiatan pada pilar <strong>{kampung.weakestPillar}</strong> 
                  untuk meningkatkan keseimbangan dan mendapat dampak XP lebih tinggi.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
