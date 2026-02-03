import { useState, useEffect } from 'react';
import { Home, Calendar, User, Menu, TrendingUp, Award, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { EventList } from '@/app/components/EventList';
import { ReportingWizard } from '@/app/components/ReportingWizard';
import { UserProfile } from '@/app/components/UserProfile';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { getLevelByRole, getProgressToNextLevel } from '@/data/levelingSystem';
import { FloatingNavbar } from '@/app/components/ui/FloatingNavbar';

interface UserDashboardProps {
  user: any;
  authToken: string | null;
  onLogout: () => void;
  onNavigate: (page: any) => void;
  currentView: 'admin' | 'moderator' | 'user';
  onViewChange: (view: 'admin' | 'moderator' | 'user') => void;
}

export function UserDashboard({ user, authToken, onLogout, onNavigate, currentView, onViewChange }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'events' | 'report' | 'profile'>('home');
  const [events, setEvents] = useState<any[]>([]);
  
  // Calculate user level
  const userLevel = getLevelByRole('user', user?.points || 0);
  const levelProgress = getProgressToNextLevel('user', user?.points || 0);

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
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getPillarName = (pillar: number) => {
    // 1: Lingkungan, 2: Ekonomi, 3: Kemasyarakatan, 4: Sosial Budaya
    const pillars = ['Lingkungan', 'Ekonomi', 'Kemasyarakatan', 'Sosial Budaya'];
    return pillars[pillar - 1] || 'Umum';
  };

  const getPillarColor = (pillar: number) => {
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
    return colors[pillar - 1] || '#6B7280';
  };

  return (
    <div className="size-full flex flex-col bg-white">
      {/* Floating Navbar Replaces the old static header */}
      <FloatingNavbar 
        user={user} 
        onLogout={onLogout} 
        onNavigate={(page) => setActivePage(page)} 
      />

      {/* Content Area */}
      <div className="flex-1 overflow-auto pb-24 px-4">
        {/* Home Tab */}
        {activePage === 'home' && (
          <div className="space-y-6 pt-2">
            
            {/* User Stats Summary (Previously in Header) */}
            <div className="bg-black text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC107] rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
               <div className="relative z-10 flex justify-between items-end">
                 <div>
                   <p className="text-gray-400 text-sm mb-1">Total Poin</p>
                   <h2 className="text-4xl font-bold text-[#FFC107]">{user.points || 0} XP</h2>
                   <div className="flex items-center gap-2 mt-2">
                     <Badge variant="outline" className="text-white border-white/20 bg-white/10">
                        {userLevel.name}
                     </Badge>
                     <span className="text-xs text-gray-400">Level {userLevel.level}</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="w-12 h-12 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold text-xl mb-1 ml-auto">
                     {userLevel.badge}
                   </div>
                 </div>
               </div>
            </div>

            {/* Next Level Progress */}
            {levelProgress.next && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Progress Level</span>
                  <span>{Math.round(levelProgress.progress)}%</span>
                </div>
                <Progress value={levelProgress.progress} className="h-2 bg-gray-100" indicatorClassName="bg-black" />
                <p className="text-xs text-gray-400 text-right">
                  {levelProgress.pointsNeeded} XP lagi menuju {levelProgress.next.name}
                </p>
              </div>
            )}

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setActivePage('events')}
                className="h-auto aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 text-black rounded-2xl"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="font-semibold">Cari Event</span>
              </Button>
              <Button
                onClick={() => setActivePage('report')}
                className="h-auto aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 text-black rounded-2xl"
              >
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="font-semibold">Lapor Kegiatan</span>
              </Button>
            </div>

            {/* Badges Section */}
            {user.badges && user.badges.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FFC107]" />
                  Koleksi Badge
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {user.badges.map((badge: any, idx: number) => (
                    <div key={idx} className="flex-shrink-0 bg-gray-50 border border-gray-100 p-3 rounded-xl flex flex-col items-center gap-2 min-w-[100px]">
                      <span className="text-2xl">{badge.badge || '🏅'}</span>
                      <span className="text-xs font-medium text-center line-clamp-2">{badge.name || badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Location Info */}
             <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 text-sm text-gray-600">
               <MapPin className="w-4 h-4 text-gray-400" />
               <span>
                 Lokasi: <strong>{user.kelurahan}</strong>, {user.kecamatan}
               </span>
             </div>

          </div>
        )}

        {/* Events Tab */}
        {activePage === 'events' && (
          <div className="pt-2">
            <h2 className="text-2xl font-bold mb-4">Daftar Kegiatan</h2>
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
                 {/* POV Switcher for Admins */}
                {(user.role === 'admin' || user.role === 'moderator') && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Admin Controls</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        variant={currentView === 'user' ? 'default' : 'outline'}
                        onClick={() => onViewChange('user')}
                        className={currentView === 'user' ? "bg-black text-white" : ""}
                      >
                        User View
                      </Button>
                      <Button 
                        size="sm" 
                        variant={currentView === 'moderator' ? 'default' : 'outline'}
                        onClick={() => onViewChange('moderator')}
                        className={currentView === 'moderator' ? "bg-black text-white" : ""}
                      >
                        Mod View
                      </Button>
                      {user.role === 'admin' && (
                        <Button 
                          size="sm" 
                          variant={currentView === 'admin' ? 'default' : 'outline'}
                          onClick={() => onViewChange('admin')}
                          className={currentView === 'admin' ? "bg-black text-white" : ""}
                        >
                          Admin View
                        </Button>
                      )}
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

      {/* Bottom Navigation - Minimalist Black & White */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe pt-2 px-6 h-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePage('home')}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
              activePage === 'home' 
                ? 'bg-black text-[#FFC107]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            {activePage === 'home' && <span className="text-[10px] font-bold mt-1">Home</span>}
          </button>
          
          <button
            onClick={() => setActivePage('events')}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
              activePage === 'events' 
                ? 'bg-black text-[#FFC107]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Calendar className="w-6 h-6" />
            {activePage === 'events' && <span className="text-[10px] font-bold mt-1">Event</span>}
          </button>
          
          <button
            onClick={() => setActivePage('profile')}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
              activePage === 'profile' 
                ? 'bg-black text-[#FFC107]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User className="w-6 h-6" />
            {activePage === 'profile' && <span className="text-[10px] font-bold mt-1">Profile</span>}
          </button>
          
          <button
            onClick={() => setActivePage('more')}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
              activePage === 'more' 
                ? 'bg-black text-[#FFC107]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Menu className="w-6 h-6" />
            {activePage === 'more' && <span className="text-[10px] font-bold mt-1">Menu</span>}
          </button>
        </div>
      </nav>

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