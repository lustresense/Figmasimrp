import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, AlertCircle, Loader2, Shield } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface AdminLoginPageProps {
  onNavigate: (page: 'landing') => void;
  onLogin: (user: any, token: string) => void;
}

export function AdminLoginPage({ onNavigate, onLogin }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            username: username,
            password: password
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
    <div className="size-full overflow-auto bg-gradient-to-b from-[#FDB913] to-[#E5A711]">
      {/* Header */}
      <header className="bg-black shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-[#FDB913] hover:text-[#E5A711]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDB913] rounded-full flex items-center justify-center">
              <Shield className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#FDB913]">ADMIN PANEL</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Login Form */}
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md border-2 border-black shadow-2xl">
          <CardHeader className="bg-black text-[#FDB913]">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              Admin Access
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Restricted area - Authorized personnel only
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription>
                  <strong>Default Credentials:</strong><br />
                  Username: <code className="bg-gray-200 px-1 rounded">admin</code><br />
                  Password: <code className="bg-gray-200 px-1 rounded">admin</code>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="font-mono"
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
                className="w-full bg-[#FDB913] text-black hover:bg-[#E5A711] font-bold text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Login as Administrator
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                <p>⚠️ This page is for administrators only.</p>
                <p className="mt-1">Regular users should use the main login page.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
