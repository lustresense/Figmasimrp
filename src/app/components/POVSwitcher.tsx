import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Eye, User, Shield, Crown, ChevronDown } from 'lucide-react';

interface POVSwitcherProps {
  currentRole: 'admin' | 'moderator' | 'user';
  currentView: 'admin' | 'moderator' | 'user';
  onViewChange: (view: 'admin' | 'moderator' | 'user') => void;
}

export function POVSwitcher({ currentRole, currentView, onViewChange }: POVSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const views = [
    {
      id: 'admin' as const,
      name: 'Admin View',
      icon: Crown,
      color: '#FDB913',
      description: 'Dashboard & Management',
      available: currentRole === 'admin'
    },
    {
      id: 'moderator' as const,
      name: 'Moderator View',
      icon: Shield,
      color: '#3B82F6',
      description: 'Verification & Approval',
      available: currentRole === 'admin' || currentRole === 'moderator'
    },
    {
      id: 'user' as const,
      name: 'User View',
      icon: User,
      color: '#0B6E4F',
      description: 'Relawan Experience',
      available: true
    }
  ];

  const currentViewData = views.find(v => v.id === currentView);
  const CurrentIcon = currentViewData?.icon || Eye;

  return (
    <div className="fixed top-4 right-4 z-[60]">
      {/* POV Switcher Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white hover:bg-gray-50 text-black border-2 border-black/20 shadow-lg"
        size="sm"
      >
        <Eye className="w-4 h-4 mr-2" />
        <span className="font-semibold">{currentViewData?.name}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <Card className="absolute top-full right-0 mt-2 w-80 shadow-2xl z-50 border-2">
            <CardContent className="p-3">
              <div className="space-y-2">
                {views.map((view) => {
                  const ViewIcon = view.icon;
                  const isActive = view.id === currentView;
                  const isAvailable = view.available;

                  return (
                    <button
                      key={view.id}
                      onClick={() => {
                        if (isAvailable) {
                          onViewChange(view.id);
                          setIsOpen(false);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#0B6E4F] to-[#0D8A62] text-white shadow-lg'
                          : isAvailable
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : 'bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-white/20' : 'bg-white'
                            }`}
                            style={{ 
                              backgroundColor: isActive ? undefined : `${view.color}20`,
                              color: isActive ? 'white' : view.color
                            }}
                          >
                            <ViewIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                              {view.name}
                            </div>
                            <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                              {view.description}
                            </div>
                          </div>
                        </div>
                        {isActive && (
                          <Badge className="bg-[#FDB913] text-black text-xs">
                            Active
                          </Badge>
                        )}
                        {!isAvailable && (
                          <Badge variant="outline" className="text-xs">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info Footer */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Eye className="w-3 h-3" />
                  <span>
                    {currentRole === 'admin' 
                      ? 'You can switch between all views'
                      : currentRole === 'moderator'
                      ? 'You can switch between Moderator & User views'
                      : 'You are in User view'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
