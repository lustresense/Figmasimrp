import { useState, useEffect } from 'react';
import { Home, Calendar, User, Menu, LogOut, TrendingUp, Award, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { EventList } from '@/app/components/EventList';
import { ReportingWizard } from '@/app/components/ReportingWizard';
import { UserProfile } from '@/app/components/UserProfile';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { POVSwitcher } from '@/app/components/POVSwitcher';
import { getLevelByRole, getProgressToNextLevel } from '@/data/levelingSystem';

interface UserDashboardProps {
  user: any;
  authToken: string | null;
  onLogout: () => void;
  onNavigate: (page: any) => void;
  currentView: 'admin' | 'moderator' | 'user';
  onViewChange: (view: 'admin' | 'moderator' | 'user') => void;
}

type Tab = 'home' | 'events' | 'profile' | 'more';

export function UserDashboard({ user, authToken, onLogout, onNavigate, currentView, onViewChange }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'events' | 'report' | 'profile' | 'more'>('home');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Calculate user level
  const userLevel = getLevelByRole('user', user?.points || 0);
  const levelProgress = getProgressToNextLevel('user', user?.points || 0);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle scroll for navigation opacity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Throttle scroll events
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        setScrolled(scrollPosition > 10);
      }, 50); // Throttle to 50ms
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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
    const pillars = ['Lingkungan', 'Gotong Royong', 'Ekonomi Kreatif', 'Keamanan'];
    return pillars[pillar - 1] || 'Umum';
  };

  const getPillarColor = (pillar: number) => {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    return colors[pillar - 1] || '#6B7280';
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Top Navigation - Floating with scroll-based opacity */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-white/60 backdrop-blur-sm shadow-md'
        }`}
      >
        <div className="flex items-center justify-around h-14 px-2">
          <button
            onClick={() => setActivePage('home')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
              activePage === 'home' 
                ? 'bg-[#FDB913] text-black shadow-md' 
                : 'text-gray-600 hover:text-[#0B6E4F] hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-semibold mt-0.5">Home</span>
          </button>
          
          <button
            onClick={() => setActivePage('events')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
              activePage === 'events' 
                ? 'bg-[#FDB913] text-black shadow-md' 
                : 'text-gray-600 hover:text-[#0B6E4F] hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-semibold mt-0.5">Event</span>
          </button>
          
          <button
            onClick={() => setActivePage('profile')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
              activePage === 'profile' 
                ? 'bg-[#FDB913] text-black shadow-md' 
                : 'text-gray-600 hover:text-[#0B6E4F] hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-semibold mt-0.5">Profile</span>
          </button>
          
          <button
            onClick={() => setActivePage('more')}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
              activePage === 'more' 
                ? 'bg-[#FDB913] text-black shadow-md' 
                : 'text-gray-600 hover:text-[#0B6E4F] hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-semibold mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* Top Header - Below Navigation */}
      <header className="bg-[#0B6E4F] text-white px-4 py-3 shadow-lg mt-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-bold text-sm">{user.name}</div>
              <div className="text-xs text-green-200">{userLevel.name || 'Pendatang Baru'}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{user.points || 0}</div>
            <div className="text-xs text-green-200">Poin</div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Home Tab */}
        {activePage === 'home' && (
          <div className="p-4 space-y-4">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-[#0B6E4F] to-[#0D8A62] text-white">
              <CardHeader>
                <CardTitle>Selamat Datang, {user.name?.split(' ')[0]}! 👋</CardTitle>
                <CardDescription className="text-green-100">
                  Ayo berkontribusi untuk kampung yang lebih baik
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Level Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Progress Level</CardTitle>
                  <Badge className="bg-[#FDB913] text-black">
                    Level {levelProgress.current.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">{levelProgress.current.name}</span>
                    {levelProgress.next && (
                      <span className="text-gray-500">{levelProgress.next.name}</span>
                    )}
                  </div>
                  <Progress value={levelProgress.progress} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{user.points || 0} poin</span>
                    {levelProgress.next && (
                      <span>{levelProgress.next.minPoints} poin</span>
                    )}
                  </div>
                </div>
                {levelProgress.next && (
                  <p className="text-sm text-gray-600">
                    💪 Kumpulkan {levelProgress.pointsNeeded} poin lagi untuk naik level!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setActivePage('events')}
                  className="h-24 flex flex-col gap-2 bg-[#0B6E4F] hover:bg-[#085A3E]"
                >
                  <Calendar className="w-8 h-8" />
                  <span>Gabung Event</span>
                </Button>
                <Button
                  onClick={() => setActivePage('report')}
                  className="h-24 flex flex-col gap-2 bg-[#FDB913] text-black hover:bg-[#E5A711]"
                >
                  <TrendingUp className="w-8 h-8" />
                  <span>Buat Laporan</span>
                </Button>
              </CardContent>
            </Card>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Badge Saya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge: any, idx: number) => (
                      <div key={idx} className="bg-[#FDB913] text-black px-3 py-1 rounded-full text-sm font-semibold">
                        🏆 {badge.name || badge}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activePage === 'events' && (
          <EventList 
            events={events}
            authToken={authToken}
            onEventJoined={fetchEvents}
          />
        )}

        {/* Profile Tab */}
        {activePage === 'profile' && (
          <UserProfile 
            user={user}
          />
        )}

        {/* More Tab */}
        {activePage === 'more' && (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActivePage('profile')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profil Saya
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{user.kelurahan}, {user.kecamatan}</span>
                </div>
                <p className="text-gray-500">
                  SIM Relawan Kampung Pancasila v1.0
                </p>
                <p className="text-xs text-gray-400">
                  © 2025 Diskominfo Kota Surabaya
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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