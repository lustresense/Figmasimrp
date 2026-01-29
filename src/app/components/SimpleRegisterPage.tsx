import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { User } from '@/types';

interface SimpleRegisterPageProps {
  onRegister: (user: User) => void;
  onNavigate: (page: 'landing' | 'login') => void;
}

export function SimpleRegisterPage({ onRegister, onNavigate }: SimpleRegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    kecamatan: '',
    kelurahan: '',
    kampung: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new user
    const newUser: User = {
      id: `usr-${Date.now()}`,
      ...formData,
      isVerifiedKSH: false,
      participationCount: 0,
      contributionPoints: 0,
      certificates: [],
      createdAt: new Date().toISOString()
    };

    alert('Registrasi berhasil! Silakan login dengan email Anda.');
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
            SP
          </div>
          <CardTitle className="text-2xl">Daftar Sebagai Relawan</CardTitle>
          <CardDescription>
            Bergabung dalam membangun Kampung Pancasila Surabaya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama lengkap Anda"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username_anda"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Nomor HP</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-4">Informasi Lokasi</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kecamatan">Kecamatan *</Label>
                  <Input
                    id="kecamatan"
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    placeholder="Contoh: Gubeng"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="kelurahan">Kelurahan *</Label>
                  <Input
                    id="kelurahan"
                    value={formData.kelurahan}
                    onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                    placeholder="Contoh: Airlangga"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="kampung">Kampung (Opsional)</Label>
                <Input
                  id="kampung"
                  value={formData.kampung}
                  onChange={(e) => setFormData({ ...formData, kampung: e.target.value })}
                  placeholder="Nama kampung Anda"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                <p className="font-medium mb-2">💡 Informasi Penting:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Relawan dapat mendaftar dan mengikuti kegiatan kampung</li>
                  <li>• Partisipasi Anda membantu kampung berkembang seimbang</li>
                  <li>• Dapatkan sertifikat dan poin untuk ditukar dengan reward</li>
                </ul>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Daftar Sekarang
            </Button>

            <div className="text-center text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Masuk
              </button>
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
