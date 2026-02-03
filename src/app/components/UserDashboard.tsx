import { useState, useEffect } from 'react';
import { Calendar, User, TrendingUp, MapPin, Crown, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { EventList } from '@/app/components/EventList';
import { ReportingWizard } from '@/app/components/ReportingWizard';
import { UserProfile } from '@/app/components/UserProfile';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { FloatingNavbar } from '@/app/components/ui/FloatingNavbar';

interface UserDashboardProps {
  user: any;
  authToken: string | null;
  onLogout: () => void;
  currentView: 'admin' | 'moderator' | 'user';
  onViewChange: (view: 'admin' | 'moderator' | 'user') => void;
  moderatorTier: 1 | 2 | 3;
  onModeratorTierChange: (tier: 1 | 2 | 3) => void;
}

export function UserDashboard({
  user,
  authToken,
  onLogout,
  currentView,
  onViewChange,
  moderatorTier,
  onModeratorTierChange
}: UserDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'events' | 'report' | 'profile' | 'more'>('home');
  const [events, setEvents] = useState<any[]>([]);
  const [userMode, setUserMode] = useState<'relawan' | 'ksh'>(user?.isKsh ? 'ksh' : 'relawan');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    pillar: '1',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/events`,
        {
          headers: {
            'Authorization': `Bearer ${authToken || publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        const allowLocalAdmin = import.meta.env.VITE_ALLOW_LOCAL_ADMIN === 'true';
        if (response.status === 401 && allowLocalAdmin) {
          setEvents([]);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.pillar) {
      toast.error('Judul, pilar, dan tanggal wajib diisi.');
      return;
    }

    setCreatingEvent(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/events`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken || publicAnonKey}`
          },
          body: JSON.stringify({
            title: newEvent.title,
            description: newEvent.description,
            pillar: parseInt(newEvent.pillar, 10),
            date: newEvent.date,
            time: newEvent.time,
            location: newEvent.location,
            organizer: user?.name || 'KSH'
          })
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal membuat event');
      }

      toast.success('Event berhasil dibuat.');
      setIsCreateOpen(false);
      setNewEvent({
        title: '',
        description: '',
        pillar: '1',
        date: '',
        time: '',
        location: ''
      });
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat event');
    } finally {
      setCreatingEvent(false);
    }
  };

  const kampungName = user?.kampung?.name || user?.kampungName || user?.kelurahan || 'Belum Terdata';
  const kampungXp = user?.kampung?.xp ?? 0;
  const kampungRelawan = user?.kampung?.volunteers ?? 0;
  const kampungLeaderboard = user?.kampungLeaderboard || [];
  const kampungDibantu = user?.kampungDibantu || [];
  const kampungPernahBantu = user?.kampungPernahBantu || [];

  return (
    <div className="size-full flex flex-col bg-white">
      <FloatingNavbar
        user={user}
        activePage={activePage}
        onLogout={onLogout}
        onNavigate={(page) => setActivePage(page)}
        userMode={userMode}
        onModeChange={setUserMode}
        currentView={currentView}
        onViewChange={onViewChange}
        moderatorTier={moderatorTier}
        onModeratorTierChange={onModeratorTierChange}
        theme="user"
      />

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-4 pt-24 pb-8">
        {/* Home Tab */}
        {activePage === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#0b5d3b] via-[#0f6a43] to-[#14824f] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,214,79,0.35) 0 20%, transparent 22%), radial-gradient(circle at 80% 30%, rgba(255,214,79,0.25) 0 16%, transparent 18%), radial-gradient(circle at 30% 80%, rgba(255,255,255,0.18) 0 18%, transparent 20%)'
              }} />
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rounded-full blur-[70px] opacity-25 -mr-16 -mt-12"></div>
              <div className="relative z-10 flex items-end justify-between gap-6">
                <div>
                  <p className="text-green-100 text-xs uppercase tracking-wide mb-1">Kampung Kamu</p>
                  <h2 className="text-2xl font-bold">{kampungName}</h2>
                  {userMode === 'ksh' && (
                    <Badge className="mt-2 bg-yellow-400 text-black w-fit">KSH Verified</Badge>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-green-100">
                    <MapPin className="w-4 h-4" />
                    <span>{user?.kecamatan || 'Kecamatan belum terdata'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-xs">XP Kampung</p>
                  <div className="text-3xl font-extrabold text-yellow-300">{kampungXp}</div>
                  <div className="text-xs text-green-100">Relawan: {kampungRelawan}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setActivePage('events')}
                className="h-auto aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-white border border-green-100 shadow-sm hover:shadow-md hover:bg-green-50 text-black rounded-2xl"
              >
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="font-semibold">Cari Event</span>
              </Button>
              <Button
                onClick={() => setActivePage('report')}
                className="h-auto aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-white border border-yellow-100 shadow-sm hover:shadow-md hover:bg-yellow-50 text-black rounded-2xl"
              >
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="font-semibold">Lapor Kegiatan</span>
              </Button>
            </div>

            <Card className="border border-green-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Leaderboard Kampung
                </CardTitle>
                <CardDescription>Peringkat berbasis performa kampung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {kampungLeaderboard.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada data leaderboard.</p>
                ) : (
                  kampungLeaderboard.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-green-200 flex items-center justify-center font-bold text-green-700">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.kecamatan}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-green-700">{item.xp} XP</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {userMode !== 'ksh' && (
              <>
                <Card className="border border-yellow-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                      <Users className="w-5 h-5 text-yellow-500" />
                      Kampung Pernah Dibantu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {kampungPernahBantu.length === 0 ? (
                      <p className="text-sm text-gray-500">Belum ada riwayat kampung yang kamu bantu.</p>
                    ) : (
                      kampungPernahBantu.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50">
                          <div>
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.kecamatan}</div>
                          </div>
                          <Badge className="bg-yellow-400 text-black">{item.xp} XP</Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-green-100">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Kampung Kamu Pernah Dibantu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {kampungDibantu.length === 0 ? (
                      <p className="text-sm text-gray-500">Belum ada data kampung yang pernah membantu.</p>
                    ) : (
                      kampungDibantu.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                          <div>
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.kecamatan}</div>
                          </div>
                          <Badge className="bg-green-600 text-white">{item.xp} XP</Badge>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activePage === 'events' && (
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Daftar Kegiatan</h2>
              {userMode === 'ksh' && (
                <Button
                  className="bg-green-700 text-white hover:bg-green-800"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Buat Kegiatan
                </Button>
              )}
            </div>
            <EventList 
              events={events}
              authToken={authToken}
              onEventJoined={fetchEvents}
            />
          </div>
        )}

        {/* Profile Tab */}
        {activePage === 'profile' && (
          <div className="pt-2">
             <UserProfile user={user} />
          </div>
        )}

        {/* More Tab */}
        {activePage === 'more' && (
          <div className="pt-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Lainnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-base"
                  onClick={() => setActivePage('profile')}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profil Lengkap
                </Button>
                {user.role === 'admin' && (
                  <div className="pt-4 border-t space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Kategori User</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={userMode === 'relawan' ? 'default' : 'outline'}
                          onClick={() => setUserMode('relawan')}
                          className={userMode === 'relawan' ? "bg-green-600 text-white" : ""}
                        >
                          Relawan
                        </Button>
                        <Button
                          size="sm"
                          variant={userMode === 'ksh' ? 'default' : 'outline'}
                          onClick={() => setUserMode('ksh')}
                          className={userMode === 'ksh' ? "bg-yellow-500 text-black" : ""}
                        >
                          KSH
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Moderator Tier</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[1,2,3].map((tier) => (
                          <Button
                            key={tier}
                            size="sm"
                            variant={moderatorTier === tier ? 'default' : 'outline'}
                            onClick={() => {
                              onModeratorTierChange(tier as 1|2|3);
                              onViewChange('moderator');
                            }}
                            className={moderatorTier === tier ? "bg-cyan-600 text-white" : ""}
                          >
                            Tier {tier}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Admin</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={currentView === 'user' ? 'default' : 'outline'}
                          onClick={() => onViewChange('user')}
                          className={currentView === 'user' ? "bg-green-700 text-white" : ""}
                        >
                          User View
                        </Button>
                        <Button
                          size="sm"
                          variant={currentView === 'admin' ? 'default' : 'outline'}
                          onClick={() => onViewChange('admin')}
                          className={currentView === 'admin' ? "bg-black text-white" : ""}
                        >
                          Admin View
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Button 
              variant="destructive" 
              className="w-full h-12"
              onClick={onLogout}
            >
              Keluar Aplikasi
            </Button>

            <div className="text-center text-xs text-gray-400 mt-8">
              <p>SIM Relawan Kampung Pancasila v2.0</p>
              <p>Diskominfo Kota Surabaya</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buat Kegiatan Baru (KSH)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Judul Kegiatan</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Aksi Bersih Kampung"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Deskripsi</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ringkasan kegiatan..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">Pilar</label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={newEvent.pillar}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, pillar: e.target.value }))}
                >
                  <option value="1">Lingkungan</option>
                  <option value="2">Ekonomi</option>
                  <option value="3">Kemasyarakatan</option>
                  <option value="4">Sosial Budaya</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Tanggal</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">Waktu</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Lokasi</label>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Balai RW / Lapangan"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-green-700 text-white hover:bg-green-800"
              onClick={handleCreateEvent}
              disabled={creatingEvent}
            >
              {creatingEvent ? 'Membuat...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reporting Wizard Modal */}
      {activePage === 'report' && (
        <ReportingWizard
          authToken={authToken}
          userId={user?.id}
          onClose={() => {
            setActivePage('home');
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
