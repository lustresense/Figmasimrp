import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import type { User, Activity, Kampung } from '@/types';
import { sampleActivities, sampleKampung } from '@/data/sampleData';
import { KampungLeaderboard } from '@/app/components/KampungLeaderboard';
import { sampleLeaderboard } from '@/data/sampleData';
import { getPillarIcon } from '@/data/pillarBalanceEngine';

interface RelawanDashboardProps {
  user: User;
  onLogout: () => void;
}

export function RelawanDashboard({ user, onLogout }: RelawanDashboardProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Find user's kampung
  const userKampung = sampleKampung.find(k => 
    k.kelurahan === user.kelurahan && k.kecamatan === user.kecamatan
  ) || sampleKampung[0];

  // Filter activities by status
  const upcomingActivities = sampleActivities.filter(a => a.status === 'open' || a.status === 'upcoming');
  const myActivities = sampleActivities.filter(a => 
    a.registeredVolunteers?.includes(user.id)
  );

  const handleJoinActivity = (activity: Activity) => {
    if (activity.currentVolunteers < activity.maxVolunteers) {
      // In real implementation, this would make an API call
      alert(`Berhasil mendaftar ke: ${activity.title}`);
    }
  };

  const ActivityCard = ({ activity }: { activity: Activity }) => {
    const isRegistered = activity.registeredVolunteers?.includes(user.id);
    const isFull = activity.currentVolunteers >= activity.maxVolunteers;
    const canJoin = !isRegistered && !isFull && activity.status === 'open';

    return (
      <Card className={isRegistered ? 'border-blue-500 border-2' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{activity.title}</CardTitle>
              <CardDescription>{activity.kampungName}</CardDescription>
            </div>
            <div className="text-3xl">{getPillarIcon(activity.pillar)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">{activity.description}</p>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">📅 {activity.date}</Badge>
            <Badge variant="outline">🕐 {activity.time}</Badge>
            <Badge variant="outline">📍 {activity.location}</Badge>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm">
              <span className="font-medium">
                {activity.currentVolunteers}/{activity.maxVolunteers === 0 ? '∞' : activity.maxVolunteers}
              </span>
              <span className="text-gray-500 ml-1">relawan</span>
            </div>
            
            {isRegistered ? (
              <Badge className="bg-blue-600">✓ Terdaftar</Badge>
            ) : isFull ? (
              <Badge variant="secondary">Penuh</Badge>
            ) : activity.status === 'open' ? (
              <Button size="sm" onClick={() => handleJoinActivity(activity)}>
                Daftar
              </Button>
            ) : (
              <Badge variant="outline">{activity.status}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Relawan</h1>
              <p className="text-sm text-gray-600">
                {user.name} • {user.kampung || user.kelurahan}
              </p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Partisipasi Saya</CardDescription>
                  <CardTitle className="text-3xl">{user.participationCount}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Total kegiatan diikuti</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Poin Kontribusi</CardDescription>
                  <CardTitle className="text-3xl">{user.contributionPoints}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Dapat ditukar dengan reward</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Sertifikat</CardDescription>
                  <CardTitle className="text-3xl">{user.certificates?.length || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Sertifikat diperoleh</p>
                </CardContent>
              </Card>
            </div>

            {/* Activities Tabs */}
            <Tabs defaultValue="available">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="available">
                  Kegiatan Tersedia ({upcomingActivities.length})
                </TabsTrigger>
                <TabsTrigger value="my-activities">
                  Kegiatan Saya ({myActivities.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-4 mt-4">
                {upcomingActivities.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      Belum ada kegiatan tersedia saat ini
                    </CardContent>
                  </Card>
                ) : (
                  upcomingActivities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="my-activities" className="space-y-4 mt-4">
                {myActivities.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      Anda belum mendaftar kegiatan apapun
                    </CardContent>
                  </Card>
                ) : (
                  myActivities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Kampung Info */}
            <Card>
              <CardHeader>
                <CardTitle>Kampung Saya</CardTitle>
                <CardDescription>{userKampung.nama}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level Kampung</span>
                  <span className="text-2xl font-bold">{userKampung.levelKampung}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total XP</span>
                  <span className="font-medium">{userKampung.xpTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Keseimbangan</span>
                  <Badge variant={userKampung.balanceScore >= 80 ? 'default' : 'secondary'}>
                    {userKampung.balanceScore}/100
                  </Badge>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">Total Aktivitas & Relawan</p>
                  <div className="flex gap-4">
                    <div className="text-center flex-1">
                      <div className="text-lg font-bold">{userKampung.totalKegiatan}</div>
                      <div className="text-xs text-gray-500">Kegiatan</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-lg font-bold">{userKampung.totalRelawan}</div>
                      <div className="text-xs text-gray-500">Relawan</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">💡 Info Penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-gray-600">
                  • Daftar ke kegiatan yang sesuai minat Anda
                </p>
                <p className="text-gray-600">
                  • Hadir dan isi checklist sederhana
                </p>
                <p className="text-gray-600">
                  • Dapatkan sertifikat dan poin kontribusi
                </p>
                <p className="text-gray-600">
                  • Bantu kampung berkembang seimbang
                </p>
              </CardContent>
            </Card>

            {/* Rewards Teaser */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">🎁 Tukar Poin</CardTitle>
                <CardDescription>
                  Anda punya {user.contributionPoints} poin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>🚌 Tiket Suroboyo Bus</span>
                  <Badge variant="outline">50 poin</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>📜 Sertifikat Prioritas</span>
                  <Badge variant="outline">100 poin</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Lihat Semua Reward
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-6">
          <KampungLeaderboard 
            leaderboard={sampleLeaderboard} 
            currentKampungId={userKampung.id}
          />
        </div>
      </div>
    </div>
  );
}
