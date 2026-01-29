import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { sampleUsers } from '@/data/sampleData';
import type { User } from '@/types';

interface SimpleLoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: 'landing' | 'register') => void;
}

export function SimpleLoginPage({ onLogin, onNavigate }: SimpleLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple demo login - find user by email
    const user = sampleUsers.find(u => u.email === email);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
            SP
          </div>
          <CardTitle className="text-2xl">Masuk ke SIMRP</CardTitle>
          <CardDescription>
            Sistem Informasi Manajemen Relawan Kampung Pancasila
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@example.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Masuk
            </Button>

            <div className="text-center text-sm text-gray-600">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-blue-600 hover:underline font-medium"
              >
                Daftar Relawan
              </button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center mb-3">Demo Login:</p>
              <div className="grid gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <strong>Relawan:</strong> andi@example.com
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <strong>KSH:</strong> esa@example.com
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => onNavigate('landing')}>
              ← Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
