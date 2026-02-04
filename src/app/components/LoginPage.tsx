import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, AlertCircle, Loader2, Info } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

interface LoginPageProps {
  onNavigate: (page: 'landing' | 'register') => void;
  onLogin: (user: any, token: string) => void;
}

// Initialize Supabase client
const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState('user');
  
  // User login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.session) throw new Error('Sesi tidak ditemukan');

      // 2. Fetch User Profile from our Server (KV Store)
      // We use the access token to authenticate with our backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${authData.session.access_token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
         // Fallback if user exists in Auth but not in KV (shouldn't happen with our signup flow but possible)
         console.warn('Profile fetch failed, using basic auth data');
         const fallbackUser = {
            id: authData.user?.id,
            email: authData.user?.email,
            name: authData.user?.user_metadata?.name || 'User',
            role: 'user',
            points: 0,
            level: 1
         };
         onLogin(fallbackUser, authData.session.access_token);
         return;
      }

      onLogin(data.user, authData.session.access_token);
    } catch (err: any) {
      console.error('User login error:', err);
      setError(err.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/auth/admin-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login admin gagal');
      }

      if (data.success && data.token) {
        onLogin(data.user, data.token);
      } else {
        setError('Login admin gagal. Periksa username dan password.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Terjadi kesalahan saat login admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107] selection:text-black flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFC107] rounded-lg flex items-center justify-center font-bold text-xl">
              SR
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
           <div className="text-center mb-8">
             <h2 className="text-3xl font-bold mb-2">Selamat Datang Kembali</h2>
             <p className="text-gray-600">Masuk untuk mengelola kegiatan relawan</p>
           </div>

           <Card className="border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="bg-gray-50 border-b border-gray-100 p-1">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-12">
                  <TabsTrigger 
                    value="user"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-gray-600 data-[state=active]:text-black font-semibold"
                  >
                    Relawan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-gray-600 data-[state=active]:text-black font-semibold"
                  >
                    Admin
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6 md:p-8">
                {/* User/Relawan Login */}
                <TabsContent value="user" className="mt-0">
                  <form onSubmit={handleUserLogin} className="space-y-5">
                    {error && (
                      <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="h-12 border-gray-300 focus:border-black focus:ring-black rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="h-12 border-gray-300 focus:border-black focus:ring-black rounded-xl"
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3 border border-blue-100">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                           <p className="font-semibold mb-1">Akun Demo:</p>
                           <p>Email: <code className="bg-blue-100 px-1 rounded">budi@example.com</code></p>
                           <p>Pass: <code className="bg-blue-100 px-1 rounded">password123</code></p>
                        </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-black text-white hover:bg-gray-800 h-12 rounded-xl text-lg font-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memuat...
                        </>
                      ) : (
                        'Masuk'
                      )}
                    </Button>

                    <div className="text-center text-sm pt-2">
                      Belum punya akun?{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('register')}
                        className="text-black font-bold hover:underline"
                      >
                        Daftar Sekarang
                      </button>
                    </div>
                  </form>
                </TabsContent>

                {/* Admin Login */}
                <TabsContent value="admin" className="mt-0">
                  <form onSubmit={handleAdminLogin} className="space-y-5">
                    {error && (
                      <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Alert className="bg-[#FFC107]/10 border-[#FFC107] text-black">
                      <Info className="h-4 w-4 text-black" />
                    <AlertDescription className="text-sm">
                        <strong>Akses Admin:</strong><br/>
                        Gunakan akun ASN/Moderator yang terdaftar di Supabase Auth.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="nama@instansi.go.id"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="h-12 border-gray-300 focus:border-black focus:ring-black rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="h-12 border-gray-300 focus:border-black focus:ring-black rounded-xl"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#FFC107] text-black hover:bg-[#FFD54F] h-12 rounded-xl text-lg font-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memuat...
                        </>
                      ) : (
                        'Masuk sebagai Admin'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
             </Tabs>
           </Card>
        </div>
      </div>
    </div>
  );
}
