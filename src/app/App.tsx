import { useState, useEffect } from 'react';
import { LandingPage } from '@/app/components/LandingPage';
import { SimpleLoginPage } from '@/app/components/SimpleLoginPage';
import { SimpleRegisterPage } from '@/app/components/SimpleRegisterPage';
import { RelawanDashboard } from '@/app/components/RelawanDashboard';
import { KSHDashboard } from '@/app/components/KSHDashboard';
import { Toaster } from 'sonner';
import type { User } from '@/types';

type Page = 'landing' | 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const userStr = localStorage.getItem('simrp_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('simrp_user');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('simrp_user', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('simrp_user');
    setCurrentPage('landing');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'login' && (
        <SimpleLoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'register' && (
        <SimpleRegisterPage onRegister={handleLogin} onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'dashboard' && currentUser && (
        <>
          {currentUser.isVerifiedKSH ? (
            <KSHDashboard user={currentUser} onLogout={handleLogout} />
          ) : (
            <RelawanDashboard user={currentUser} onLogout={handleLogout} />
          )}
        </>
      )}

      <Toaster />
    </div>
  );
}
