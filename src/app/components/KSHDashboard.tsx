import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import type { User, Activity, Kampung, Pillar } from '@/types';
import { sampleActivities, sampleKampung, sampleRecommendations } from '@/data/sampleData';
import { PillarProgressVisualization } from '@/app/components/PillarProgressVisualization';
import { KampungLeaderboard } from '@/app/components/KampungLeaderboard';
import { sampleLeaderboard } from '@/data/sampleData';
import { getPillarIcon, getPillarName } from '@/data/pillarBalanceEngine';

interface KSHDashboardProps {
  user: User;
  onLogout: () => void;
}

export function KSHDashboard({ user, onLogout }: KSHDashboardProps) {
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    pillar: 'ketuhanan' as Pillar,
    date: '',
    time: '',
    location: '',
    maxVolunteers: 10
  });

  // Find user's kampung
  const userKampung = sampleKampung.find(k => k.id === user.kampungId) || sampleKampung[0];

  // Filter activities created by this KSH
  const myActivities = sampleActivities.filter(a => a.createdBy === user.id);
  const completedActivities = myActivities.filter(a => a.status === 'completed');

  // Get recommendations for this kampung
  const kampungRecommendations = sampleRecommendations.filter(r => r.kampungId === userKampung.id);

  const handleCreateActivity = () => {
    // In real implementation, this would make an API call
    alert(`Kegiatan "${newActivity.title}" berhasil dibuat!`);
    setShowCreateActivity(false);
    setNewActivity({
      title: '',
      description: '',
      pillar: 'ketuhanan',
      date: '',
      time: '',
      location: '',
      maxVolunteers: 10
    });
  };

  const ActivityManagementCard = ({ activity }: { activity: Activity }) => {
    return (
      <Card>
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
              <span className="text-gray-500 ml-1">relawan terdaftar</span>
            </div>
            
            <Badge variant={
              activity.status === 'completed' ? 'default' :
              activity.status === 'ongoing' ? 'secondary' :
              'outline'
            }>
              {activity.status}
            </Badge>
          </div>

          {activity.status === 'completed' && !activity.output && (
            <Button variant="outline" size="sm" className="w-full">
              Isi Output Kegiatan
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
                  ⭐ Verified KSH
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">Dashboard Kader Surabaya Hebat</h1>
              <p className="text-sm opacity-90">
                {user.name} • {userKampung.nama}
              </p>
            </div>
            <Button variant="secondary" onClick={onLogout}>
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                onClick={() => setShowCreateActivity(true)}
                className="h-auto py-6 flex-col gap-2"
              >
                <span className="text-2xl">➕</span>
                <span>Buat Kegiatan Kampung</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowCreateProposal(true)}
                className="h-auto py-6 flex-col gap-2"
              >
                <span className="text-2xl">📋</span>
                <span>Ajukan Proposal</span>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Kegiatan Dibuat</CardDescription>
                  <CardTitle className="text-3xl">{myActivities.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Selesai</CardDescription>
                  <CardTitle className="text-3xl">{completedActivities.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Partisipasi</CardDescription>
                  <CardTitle className="text-3xl">{user.participationCount}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Kontribusi Poin</CardDescription>
                  <CardTitle className="text-3xl">{user.contributionPoints}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Activities Management */}
            <Tabs defaultValue="active">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="active">
                  Aktif ({myActivities.filter(a => a.status !== 'completed').length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Selesai ({completedActivities.length})
                </TabsTrigger>
                <TabsTrigger value="pending-output">
                  Perlu Output
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4 mt-4">
                {myActivities.filter(a => a.status !== 'completed').map(activity => (
                  <ActivityManagementCard key={activity.id} activity={activity} />
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-4">
                {completedActivities.map(activity => (
                  <ActivityManagementCard key={activity.id} activity={activity} />
                ))}
              </TabsContent>

              <TabsContent value="pending-output" className="space-y-4 mt-4">
                {myActivities.filter(a => a.status === 'completed' && !a.output).length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-gray-500">
                      Tidak ada kegiatan yang perlu diisi output
                    </CardContent>
                  </Card>
                ) : (
                  myActivities.filter(a => a.status === 'completed' && !a.output).map(activity => (
                    <ActivityManagementCard key={activity.id} activity={activity} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pillar Progress */}
            <PillarProgressVisualization kampung={userKampung} />

            {/* ASN Recommendations */}
            {kampungRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">💡 Rekomendasi ASN Pendamping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {kampungRecommendations.map(rec => (
                    <div key={rec.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                        <div className="flex-1 text-sm">
                          <p className="font-medium text-gray-900 mb-1">{rec.context}</p>
                          <p className="text-gray-700">{rec.recommendation}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            - {rec.moderatorName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">📖 Panduan KSH</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Buat kegiatan yang seimbang di 4 pilar</p>
                <p>• Perhatikan rekomendasi ASN</p>
                <p>• Isi output setelah kegiatan selesai</p>
                <p>• Ajukan proposal untuk program besar</p>
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

      {/* Create Activity Dialog */}
      <Dialog open={showCreateActivity} onOpenChange={setShowCreateActivity}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Kegiatan Kampung</DialogTitle>
            <DialogDescription>
              Buat kegiatan baru untuk {userKampung.nama}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Judul Kegiatan</Label>
              <Input
                id="title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Contoh: Pengajian Rutin Bulanan"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Jelaskan kegiatan secara singkat"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="pillar">Pilar Kegiatan</Label>
              <Select
                value={newActivity.pillar}
                onValueChange={(value) => setNewActivity({ ...newActivity, pillar: value as Pillar })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ketuhanan">
                    🙏 Ketuhanan
                  </SelectItem>
                  <SelectItem value="kemanusiaan">
                    ❤️ Kemanusiaan
                  </SelectItem>
                  <SelectItem value="persatuan">
                    🤝 Persatuan
                  </SelectItem>
                  <SelectItem value="kerakyatan">
                    ⚖️ Kerakyatan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Waktu</Label>
                <Input
                  id="time"
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                placeholder="Contoh: Musholla Al-Ikhlas"
              />
            </div>

            <div>
              <Label htmlFor="maxVolunteers">Kuota Relawan (0 = tidak perlu relawan)</Label>
              <Input
                id="maxVolunteers"
                type="number"
                min="0"
                value={newActivity.maxVolunteers}
                onChange={(e) => setNewActivity({ ...newActivity, maxVolunteers: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateActivity(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateActivity}>
              Buat Kegiatan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
