import { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FloatingNavbarProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: any) => void;
}

export function FloatingNavbar({ user, onLogout, onNavigate }: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content jump when navbar becomes fixed, if we wanted it to be initially static. 
          But the request says "atasnya navbar tanpa mengganggu ui lain" implying it takes space initially, 
          but "kalo discroll dia floating". 
          
          Strategy: A static header that disappears on scroll, replaced by a floating one? 
          Or just a sticky header that changes shape?
          
          The request: "atasnya navbar tanpa mengganggu ui lain. tapi kalo discroll dia floating dan stay on top gitu."
          
          Let's make it a fixed navbar that transforms.
      */}
      
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 px-6 pointer-events-none' // Floating state container
          : 'bg-white border-b border-gray-100 py-4 px-4' // Static state
      }`}>
        <div className={`mx-auto transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md text-white rounded-full shadow-2xl pointer-events-auto max-w-sm mx-auto'
            : 'bg-transparent text-black max-w-7xl'
        }`}>
          <div className={`flex items-center justify-between px-4 ${isScrolled ? 'h-14' : 'h-10'}`}>
            
            {/* Logo / Brand */}
            <div className="flex items-center gap-2">
              {!isScrolled && (
                <div className="w-8 h-8 bg-black text-[#FFC107] rounded-lg flex items-center justify-center font-bold text-sm">
                  SR
                </div>
              )}
              {isScrolled && (
                <div className="w-8 h-8 bg-[#FFC107] text-black rounded-full flex items-center justify-center font-bold text-sm">
                  SR
                </div>
              )}
              <span className={`font-bold ${isScrolled ? 'text-white' : 'text-black'}`}>
                {isScrolled ? 'SIMRP' : 'SIM Relawan'}
              </span>
            </div>

            {/* Desktop Actions / Mobile Menu Toggle */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <span className={`text-sm font-medium mr-2 ${isScrolled ? 'text-gray-300' : 'text-gray-600'}`}>
                  Halo, {user?.name?.split(' ')[0]}
                </span>
                <Button 
                  size="sm" 
                  variant={isScrolled ? "ghost" : "outline"}
                  className={isScrolled ? "text-white hover:bg-white/20" : ""}
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-full transition-colors ${
                  isScrolled ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-black'
                }`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for initial state so it doesn't overlap content */}
      <div className="h-20" />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-24 right-4 w-64 bg-white rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-[#FFC107] rounded-full flex items-center justify-center font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
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