import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Leaf, Users, Briefcase, Shield } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const pillars = [
    {
      id: 1,
      name: 'Lingkungan',
      description: 'Peduli Sampah - Manajemen limbah & lingkungan',
      icon: Leaf,
      color: '#10B981'
    },
    {
      id: 2,
      name: 'Gotong Royong',
      description: 'Kebersamaan - Kerja bakti & kohesi sosial',
      icon: Users,
      color: '#3B82F6'
    },
    {
      id: 3,
      name: 'Ekonomi Kreatif',
      description: 'Kemandirian - UMKM & Wirausaha',
      icon: Briefcase,
      color: '#F59E0B'
    },
    {
      id: 4,
      name: 'Keamanan',
      description: 'Siskamling - Jaga malam & keamanan warga',
      icon: Shield,
      color: '#EF4444'
    }
  ];

  return (
    <div className="size-full overflow-auto bg-gradient-to-b from-[#0B6E4F] to-[#064835]">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0B6E4F] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">SR</span>
            </div>
            <div>
              <h1 className="font-bold text-base md:text-xl text-[#0B6E4F]">SIM RELAWAN</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Kampung Pancasila</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('login')}
              className="border-[#0B6E4F] text-[#0B6E4F] hover:bg-[#0B6E4F] hover:text-white text-sm md:text-base px-3 md:px-4"
              size="sm"
            >
              Masuk
            </Button>
            <Button 
              onClick={() => onNavigate('register')}
              className="bg-[#FDB913] text-black hover:bg-[#E5A711] text-sm md:text-base px-3 md:px-4"
              size="sm"
            >
              Daftar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Bersama Membangun<br />Kampung Pancasila yang Lebih Baik
        </h2>
        <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
          Platform digital yang menghubungkan warga aktif untuk berkontribusi dalam program pembangunan kampung melalui gotong royong, lingkungan, ekonomi kreatif, dan keamanan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => onNavigate('register')}
            className="bg-[#FDB913] text-black hover:bg-[#E5A711] text-lg px-8"
          >
            Mulai Sekarang
          </Button>
          <Button 
            size="lg"
            className="bg-white text-[#0B6E4F] hover:bg-gray-100 border-2 border-white text-lg px-8"
            onClick={() => {
              // Scroll to features or events section
              const featuresSection = document.querySelector('#features-section');
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Lihat Event
          </Button>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-white mb-12">
          4 Pilar Kampung Pancasila
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <Card key={pillar.id} className="hover:shadow-xl transition-shadow border-2 flex flex-col" style={{ borderColor: pillar.color }}>
                <CardHeader className="flex-1">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: pillar.color }}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-lg">{pillar.name}</CardTitle>
                  <CardDescription className="text-center text-sm">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-[#0B6E4F] mb-12">
            Fitur Unggulan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FDB913] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Sistem Poin</h4>
              <p className="text-gray-600">
                Kumpulkan poin dari setiap kegiatan dan naik level
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FDB913] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏆</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Badge & Reward</h4>
              <p className="text-gray-600">
                Raih badge eksklusif dan sertifikat resmi
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FDB913] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <h4 className="font-bold text-xl mb-2">Offline Mode</h4>
              <p className="text-gray-600">
                Tetap bisa lapor kegiatan tanpa koneksi internet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Teaser */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#0B6E4F]">
              🌟 Top Relawan Minggu Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { rank: 1, name: '***', points: '***', badge: '🥇' },
                { rank: 2, name: '***', points: '***', badge: '🥈' },
                { rank: 3, name: '***', points: '***', badge: '🥉' }
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.badge}</span>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.points} poin</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => onNavigate('register')}
                className="bg-[#0B6E4F] hover:bg-[#085A3E]"
              >
                Daftar untuk Lihat Leaderboard Lengkap
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-2xl">
          <h3 className="text-3xl font-bold text-[#0B6E4F] mb-4">
            Siap Menjadi Pahlawan Kampung?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Bergabung dengan ribuan relawan lainnya dan buat dampak nyata!
          </p>
          <Button 
            size="lg"
            onClick={() => onNavigate('register')}
            className="bg-[#FDB913] text-black hover:bg-[#E5A711] text-xl px-12 py-6"
          >
            Daftar Sekarang
          </Button>
          
          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 mb-4">Demo Access (untuk testing):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-sm text-[#0B6E4F] mb-2">🔑 Admin Login</div>
                <div className="text-xs text-gray-600">
                  <div>Username: <code className="bg-gray-200 px-2 py-1 rounded">admin</code></div>
                  <div>Password: <code className="bg-gray-200 px-2 py-1 rounded">admin</code></div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-sm text-[#0B6E4F] mb-2">📝 Registrasi User</div>
                <div className="text-xs text-gray-600">
                  <div>Contoh Kode Pos:</div>
                  <div><code className="bg-gray-200 px-2 py-1 rounded">60111</code> (Keputih, Sukolilo)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#064835] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 SIM Relawan Kampung Pancasila</p>
          <p className="text-sm text-green-200">
            Dinas Komunikasi dan Informatika Kota Surabaya
          </p>
        </div>
      </footer>
    </div>
  );
}