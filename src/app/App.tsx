import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { LandingPage } from '@/app/components/LandingPage';
import { LoginPage } from '@/app/components/LoginPage';
import { AdminLoginPage } from '@/app/components/AdminLoginPage';
import { RegisterPage } from '@/app/components/RegisterPage';
import { UserDashboard } from '@/app/components/UserDashboard';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { ModeratorDashboard } from '@/app/components/ModeratorDashboard';
import { POVSwitcher } from '@/app/components/POVSwitcher';
import { Toaster } from 'sonner';
import { useSeedData } from '@/app/components/SeedData';

type Page = 'landing' | 'login' | 'adminlogin' | 'register' | 'dashboard';

interface User {
  id?: string;
  username?: string;
  email?: string;
  name: string;
  role: 'user' | 'moderator' | 'admin';
  level?: number;
  levelName?: string;
  points?: number;
  badges?: any[];
  kecamatan?: string;
  kelurahan?: string;
  kodepos?: string;
  rw?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // POV Switcher State - Admin can switch views
  const [currentView, setCurrentView] = useState<'admin' | 'moderator' | 'user'>('user');

  // Seed database with sample data
  useSeedData();

  // Check for admin route on mount and URL changes
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      // Check if accessing admin route
      if (pathname === '/admin' || hash === '#/admin') {
        const token = localStorage.getItem('simrp_auth_token');
        const userStr = localStorage.getItem('simrp_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          // If already logged in as admin, go to dashboard
          if (user.role === 'admin') {
            setCurrentUser(user);
            setAuthToken(token);
            setCurrentPage('dashboard');
            setCurrentView('admin');
          } else {
            // Not admin, show admin login
            setCurrentPage('adminlogin');
          }
        } else {
          // Not logged in, show admin login
          setCurrentPage('adminlogin');
        }
        return;
      }
    };
    
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('simrp_auth_token');
    const userStr = localStorage.getItem('simrp_user');
    const savedView = localStorage.getItem('simrp_current_view') as 'admin' | 'moderator' | 'user' | null;
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthToken(token);
        setCurrentUser(user);
        
        // Set view based on role and saved preference
        if (savedView && canAccessView(user.role, savedView)) {
          setCurrentView(savedView);
        } else {
          // Default view based on role
          setCurrentView(user.role);
        }
        
        setCurrentPage('dashboard');
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('simrp_auth_token');
        localStorage.removeItem('simrp_user');
        localStorage.removeItem('simrp_current_view');
      }
    }
    
    setLoading(false);
  }, []);

  // Check if user can access a view
  const canAccessView = (userRole: string, view: 'admin' | 'moderator' | 'user'): boolean => {
    if (view === 'user') return true;
    if (view === 'moderator') return userRole === 'moderator' || userRole === 'admin';
    if (view === 'admin') return userRole === 'admin';
    return false;
  };

  const handleLogin = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('simrp_auth_token', token);
    localStorage.setItem('simrp_user', JSON.stringify(user));
    
    // Set initial view based on role
    const initialView = user.role;
    setCurrentView(initialView);
    localStorage.setItem('simrp_current_view', initialView);
    
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setCurrentView('user');
    localStorage.removeItem('simrp_auth_token');
    localStorage.removeItem('simrp_user');
    localStorage.removeItem('simrp_current_view');
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleViewChange = (view: 'admin' | 'moderator' | 'user') => {
    if (currentUser && canAccessView(currentUser.role, view)) {
      setCurrentView(view);
      localStorage.setItem('simrp_current_view', view);
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-[#0B6E4F]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading SIMRP...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      <Toaster position="top-center" richColors />
      
      {/* Fixed POV Switcher - Only visible for admins */}
      {currentPage === 'dashboard' && currentUser && currentUser.role === 'admin' && (
        <POVSwitcher
          currentRole={currentUser.role}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      )}
      
      {currentPage === 'landing' && (
        <LandingPage onNavigate={navigateTo} />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onNavigate={navigateTo} 
          onLogin={handleLogin}
        />
      )}
      
      {currentPage === 'adminlogin' && (
        <AdminLoginPage 
          onNavigate={navigateTo} 
          onLogin={handleLogin}
        />
      )}
      
      {currentPage === 'register' && (
        <RegisterPage 
          onNavigate={navigateTo}
          onRegister={handleLogin}
        />
      )}
      
      {currentPage === 'dashboard' && currentUser && (
        <>
          {/* Render based on CURRENT VIEW, not user role */}
          {currentView === 'user' && (
            <UserDashboard 
              user={currentUser}
              authToken={authToken}
              onLogout={handleLogout}
              onNavigate={navigateTo}
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          )}
          
          {currentView === 'moderator' && (
            <ModeratorDashboard 
              user={currentUser}
              authToken={authToken}
              onLogout={handleLogout}
              onNavigate={navigateTo}
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          )}
          
          {currentView === 'admin' && (
            <AdminDashboard 
              user={currentUser}
              authToken={authToken}
              onLogout={handleLogout}
              onNavigate={navigateTo}
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          )}
        </>
      )}
    </div>
  );
}
