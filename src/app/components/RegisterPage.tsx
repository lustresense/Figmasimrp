import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { findByKodepos } from '@/data/geographicData';

interface RegisterPageProps {
  onNavigate: (page: 'landing' | 'login') => void;
  onRegister: (user: any, token: string) => void;
}

export function RegisterPage({ onNavigate, onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nik: '',
    kodepos: '',
    kecamatan: '',
    kelurahan: '',
    rw: ''
  });

  const [kodeposValid, setKodeposValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-fill kecamatan dan kelurahan based on kodepos
  useEffect(() => {
    if (formData.kodepos.length === 5) {
      const result = findByKodepos(formData.kodepos);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          kecamatan: result.kecamatan.nama,
          kelurahan: result.kelurahan.nama
        }));
        setKodeposValid(true);
      } else {
        setFormData(prev => ({
          ...prev,
          kecamatan: '',
          kelurahan: ''
        }));
        setKodeposValid(false);
      }
    } else {
      setKodeposValid(null);
      setFormData(prev => ({
        ...prev,
        kecamatan: '',
        kelurahan: ''
      }));
    }
  }, [formData.kodepos]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nama lengkap wajib diisi');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Email tidak valid');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }
    if (formData.kodepos.length !== 5) {
      setError('Kode pos harus 5 digit');
      return false;
    }
    if (!kodeposValid) {
      setError('Kode pos tidak valid untuk wilayah Surabaya');
      return false;
    }
    if (!formData.kecamatan || !formData.kelurahan) {
      setError('Kecamatan dan Kelurahan harus terisi otomatis dari kode pos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            nik: formData.nik,
            kecamatan: formData.kecamatan,
            kelurahan: formData.kelurahan,
            kodepos: formData.kodepos,
            rw: formData.rw
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pendaftaran gagal');
      }

      if (data.success) {
        setSuccess('Pendaftaran berhasil! Mengalihkan...');
        
        // Auto-login after successful registration
        setTimeout(() => {
          // Create user object for login
          const user = {
            id: data.user.id,
            email: data.user.email,
            name: formData.name,
            role: 'user' as const,
            level: 1,
            levelName: 'Pendatang Baru',
            points: 0,
            kecamatan: formData.kecamatan,
            kelurahan: formData.kelurahan,
            kodepos: formData.kodepos,
            rw: formData.rw
          };
          
          // Generate temporary token
          const token = `user-${data.user.id}`;
          
          onRegister(user, token);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Terjadi kesalahan saat pendaftaran');
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

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#0B6E4F]">
              Daftar Relawan Kampung Pancasila
            </CardTitle>
            <CardDescription className="text-center">
              Lengkapi data diri Anda untuk bergabung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Ahmad Suryadi"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (Opsional)</Label>
                  <Input
                    id="nik"
                    placeholder="16 digit NIK"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => handleChange('nik', e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 text-[#0B6E4F]">Informasi Wilayah</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kodepos">
                      Kode Pos <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="kodepos"
                        placeholder="60111"
                        maxLength={5}
                        value={formData.kodepos}
                        onChange={(e) => handleChange('kodepos', e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={loading}
                        className={
                          kodeposValid === true ? 'border-green-500' :
                          kodeposValid === false ? 'border-red-500' : ''
                        }
                      />
                      {kodeposValid === true && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                      {kodeposValid === false && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {kodeposValid === false && (
                      <p className="text-xs text-red-500">Kode pos tidak valid untuk Surabaya</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rw">RW (Opsional)</Label>
                    <Input
                      id="rw"
                      placeholder="Contoh: 001"
                      maxLength={3}
                      value={formData.rw}
                      onChange={(e) => handleChange('rw', e.target.value.replace(/\D/g, ''))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="kecamatan">
                      Kecamatan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="kecamatan"
                      placeholder="Otomatis terisi"
                      value={formData.kecamatan}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kelurahan">
                      Kelurahan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="kelurahan"
                      placeholder="Otomatis terisi"
                      value={formData.kelurahan}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertDescription className="text-xs">
                    💡 <strong>Tips:</strong> Masukkan kode pos wilayah Anda, dan sistem akan otomatis mengisi Kecamatan dan Kelurahan.
                  </AlertDescription>
                </Alert>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#FDB913] text-black hover:bg-[#E5A711] text-lg py-6"
                disabled={loading || !kodeposValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  'Daftar Sekarang'
                )}
              </Button>

              <div className="text-center text-sm">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-[#0B6E4F] font-semibold hover:underline"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
