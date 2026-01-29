import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import type { LeaderboardEntry, Pillar } from '@/types';
import { getPillarIcon } from '@/data/pillarBalanceEngine';

interface KampungLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentKampungId?: string;
}

export function KampungLeaderboard({ leaderboard, currentKampungId }: KampungLeaderboardProps) {
  const pillars: Pillar[] = ['ketuhanan', 'kemanusiaan', 'persatuan', 'kerakyatan'];

  // Sort by pillar for pillar-specific leaderboards
  const getPillarLeaderboard = (pillar: Pillar) => {
    return [...leaderboard]
      .sort((a, b) => b.xpPerPillar[pillar] - a.xpPerPillar[pillar])
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  const getBalanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏆 Leaderboard Kampung</CardTitle>
        <CardDescription>
          Peringkat kampung berdasarkan XP dan keseimbangan pilar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="ketuhanan">🙏</TabsTrigger>
            <TabsTrigger value="kemanusiaan">❤️</TabsTrigger>
            <TabsTrigger value="persatuan">🤝</TabsTrigger>
            <TabsTrigger value="kerakyatan">⚖️</TabsTrigger>
          </TabsList>

          {/* Overall Leaderboard */}
          <TabsContent value="overall" className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.kampungId}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  entry.kampungId === currentKampungId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${getRankColor(entry.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl font-bold w-12 text-center">
                      {getRankBadge(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">
                        {entry.kampungName}
                        {entry.kampungId === currentKampungId && (
                          <Badge variant="secondary" className="ml-2">Kampung Anda</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.kelurahan}, {entry.kecamatan}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-medium">
                          Level {entry.levelKampung}
                        </span>
                        <span className="text-gray-500">
                          {entry.xpTotal} XP
                        </span>
                        <span className={`font-medium ${getBalanceColor(entry.balanceScore)}`}>
                          Balance: {entry.balanceScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini pillar indicators */}
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t">
                  {pillars.map((pillar) => (
                    <div key={pillar} className="text-center">
                      <div className="text-lg">{getPillarIcon(pillar)}</div>
                      <div className="text-xs font-medium">
                        L{entry.levelPerPillar[pillar]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.xpPerPillar[pillar]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Pillar-specific Leaderboards */}
          {pillars.map((pillar) => (
            <TabsContent key={pillar} value={pillar} className="space-y-3">
              {getPillarLeaderboard(pillar).map((entry) => (
                <div
                  key={entry.kampungId}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    entry.kampungId === currentKampungId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl font-bold w-12 text-center">
                        {getRankBadge(entry.rank)}
                      </div>
                      <div className="text-2xl">{getPillarIcon(pillar)}</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">
                          {entry.kampungName}
                          {entry.kampungId === currentKampungId && (
                            <Badge variant="secondary" className="ml-2">Kampung Anda</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.kelurahan}, {entry.kecamatan}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {entry.xpPerPillar[pillar]}
                      </div>
                      <div className="text-sm text-gray-500">
                        Level {entry.levelPerPillar[pillar]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
