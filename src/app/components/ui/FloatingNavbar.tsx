import { useState, useEffect } from 'react';
import { Home, Calendar, TrendingUp, User as UserIcon, Menu, X, LogOut, BadgeCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface FloatingNavbarProps {
  user: any;
  activePage: 'home' | 'events' | 'report' | 'profile' | 'more';
  onLogout: () => void;
  onNavigate: (page: any) => void;
  userMode: 'relawan' | 'ksh';
  onModeChange: (mode: 'relawan' | 'ksh') => void;
  currentView: 'admin' | 'moderator' | 'user';
  onViewChange: (view: 'admin' | 'moderator' | 'user') => void;
  moderatorTier: 1 | 2 | 3;
  onModeratorTierChange: (tier: 1 | 2 | 3) => void;
  theme?: 'user' | 'moderator';
}

export function FloatingNavbar({
  user,
  activePage,
  onLogout,
  onNavigate,
  userMode,
  onModeChange,
  currentView,
  onViewChange,
  moderatorTier,
  onModeratorTierChange,
  theme = 'user'
}: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isModeratorTheme = theme === 'moderator';
  const palette = isModeratorTheme
    ? {
        border: 'border-cyan-200',
        active: 'bg-cyan-600 text-white',
        inactive: 'text-cyan-900 hover:bg-cyan-50',
        menu: 'bg-cyan-700 hover:bg-cyan-800',
        badge: 'bg-cyan-500 text-white',
        ksh: 'bg-cyan-200 text-cyan-900'
      }
    : {
        border: 'border-green-200',
        active: 'bg-green-600 text-white',
        inactive: 'text-green-800 hover:bg-green-50',
        menu: 'bg-green-700 hover:bg-green-800',
        badge: 'bg-yellow-400 text-black',
        ksh: 'bg-yellow-400 text-black'
      };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-3 left-0 right-0 z-50">
        <div className="mx-auto flex items-center justify-center gap-3 px-4">
          <div
            className={`flex items-center gap-1 rounded-2xl border bg-white/95 px-3 py-2 shadow-lg backdrop-blur transition-all ${
              isScrolled ? 'shadow-xl' : ''
            } ${palette.border}`}
          >
            {[
              { key: 'home', label: 'Home', icon: Home },
              { key: 'events', label: 'Event', icon: Calendar },
              { key: 'report', label: 'Lapor', icon: TrendingUp },
              { key: 'profile', label: 'Profil', icon: UserIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive ? palette.active : palette.inactive
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-12 w-12 rounded-full text-white shadow-lg transition ${palette.menu} ${
              isScrolled ? 'shadow-xl' : ''
            }`}
          >
            {isMenuOpen ? <X className="mx-auto h-5 w-5" /> : <Menu className="mx-auto h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-24 right-4 w-64 bg-white rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center font-bold ${
                  isModeratorTheme ? 'bg-cyan-700' : 'bg-green-700'
                }`}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm">{user?.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{user?.role}</span>
                    {userMode === 'ksh' && (
                      <Badge className={`${palette.ksh} text-[10px] px-2 py-0.5`}>
                        <BadgeCheck className="mr-1 h-3 w-3" />
                        KSH Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2">
              {user?.role === 'admin' && (
                <div className="px-2 pb-2 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400 mb-2">Kategori User</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant={userMode === 'relawan' ? 'default' : 'outline'}
                        onClick={() => {
                          onModeChange('relawan');
                        }}
                        className={userMode === 'relawan' ? (isModeratorTheme ? 'bg-cyan-600 text-white' : 'bg-green-600 text-white') : ''}
                      >
                        Relawan
                      </Button>
                      <Button
                        size="sm"
                        variant={userMode === 'ksh' ? 'default' : 'outline'}
                        onClick={() => {
                          onModeChange('ksh');
                        }}
                        className={userMode === 'ksh' ? (isModeratorTheme ? 'bg-cyan-200 text-cyan-900' : 'bg-yellow-400 text-black') : ''}
                      >
                        KSH
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400 mb-2">Moderator Tier</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((tier) => (
                        <Button
                          key={tier}
                          size="sm"
                          variant={moderatorTier === tier ? 'default' : 'outline'}
                          onClick={() => {
                            onModeratorTierChange(tier as 1 | 2 | 3);
                            onViewChange('moderator');
                          }}
                          className={moderatorTier === tier ? 'bg-cyan-600 text-white' : ''}
                        >
                          Tier {tier}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-gray-400 mb-2">Admin</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant={currentView === 'user' ? 'default' : 'outline'}
                        onClick={() => onViewChange('user')}
                        className={currentView === 'user' ? (isModeratorTheme ? 'bg-cyan-700 text-white' : 'bg-green-700 text-white') : ''}
                      >
                        User View
                      </Button>
                      <Button
                        size="sm"
                        variant={currentView === 'admin' ? 'default' : 'outline'}
                        onClick={() => onViewChange('admin')}
                        className={currentView === 'admin' ? 'bg-black text-white' : ''}
                      >
                        Admin View
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  onNavigate('more');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Menu className="w-4 h-4" />
                Menu Lainnya
              </button>
              <button 
                onClick={() => {
                  onNavigate('profile');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Profil Saya
              </button>
              <button 
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
