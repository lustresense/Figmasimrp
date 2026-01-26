import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface LoginPageProps {
  onNavigate: (page: 'landing' | 'register') => void;
  onLogin: (user: any, token: string) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState('user');
  
  // User login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NIK login state
  const [nik, setNik] = useState('');
  const [nikPassword, setNikPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For MVP, using admin login endpoint with email/password
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/auth/admin-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            username: email,
            password: password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      if (data.success && data.token) {
        onLogin(data.user, data.token);
      } else {
        setError('Login gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      console.error('User login error:', err);
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  const handleNikLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate NIK format (16 digits)
    if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
      setError('NIK harus 16 digit angka');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/auth/nik-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            nik: nik,
            password: nikPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login dengan NIK gagal');
      }

      if (data.success && data.token) {
        // Auto-assign role based on NIK database
        onLogin(data.user, data.token);
      } else {
        setError('Login gagal. Periksa NIK dan password Anda.');
      }
    } catch (err: any) {
      console.error('NIK login error:', err);
      setError(err.message || 'Terjadi kesalahan saat login dengan NIK');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-full overflow-auto bg-gradient-to-b from-[#0B6E4F] to-[#064835]">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-[#0B6E4F] hover:text-[#085A3E]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B6E4F] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">SR</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#0B6E4F]">SIM RELAWAN</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#0B6E4F]">
              Masuk ke SIMRP
            </CardTitle>
            <CardDescription className="text-center">
              Masuk untuk melanjutkan ke dashboard Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user">Email</TabsTrigger>
                <TabsTrigger value="nik">NIK</TabsTrigger>
              </TabsList>

              {/* User/Relawan Login */}
              <TabsContent value="user">
                <form onSubmit={handleUserLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
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
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0B6E4F] hover:bg-[#085A3E]"
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

                  <div className="text-center text-sm">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="text-[#0B6E4F] font-semibold hover:underline"
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* NIK Login */}
              <TabsContent value="nik">
                <form onSubmit={handleNikLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription>
                      <strong>Login dengan NIK:</strong> Gunakan Nomor Induk Kependudukan (NIK) 16 digit Anda. 
                      Role akan otomatis ditentukan berdasarkan database.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK (16 Digit)</Label>
                    <Input
                      id="nik"
                      type="text"
                      placeholder="1234567890123456"
                      value={nik}
                      onChange={(e) => {
                        // Only allow numbers and max 16 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setNik(value);
                      }}
                      required
                      disabled={loading}
                      maxLength={16}
                      pattern="\d{16}"
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500">
                      {nik.length}/16 digit
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nik-password">Password</Label>
                    <Input
                      id="nik-password"
                      type="password"
                      placeholder="••••••••"
                      value={nikPassword}
                      onChange={(e) => setNikPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0B6E4F] hover:bg-[#085A3E]"
                    disabled={loading || nik.length !== 16}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memuat...
                      </>
                    ) : (
                      'Masuk dengan NIK'
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="text-[#0B6E4F] font-semibold hover:underline"
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
