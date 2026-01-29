import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                SP
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SIMRP</h1>
                <p className="text-xs text-gray-600">Sistem Informasi Manajemen Relawan</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onNavigate('login')}>
                Masuk
              </Button>
              <Button onClick={() => onNavigate('register')}>
                Daftar Relawan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            The Pillar-Balance & Maturity Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kampung Pancasila Surabaya
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sistem informasi <strong>kampung-centric</strong> untuk mengelola data relawan, kegiatan, 
            dan capaian Kampung Pancasila secara terstruktur dan terukur.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('register')} className="text-lg px-8">
              Bergabung Sebagai Relawan
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="text-lg px-8">
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">4 Pilar Kampung Pancasila</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-yellow-400 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-4xl mb-4">
                🙏
              </div>
              <CardTitle className="text-center">Ketuhanan</CardTitle>
              <CardDescription className="text-center">
                Ketuhanan Yang Maha Esa
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-2 hover:border-red-400 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-4xl mb-4">
                ❤️
              </div>
              <CardTitle className="text-center">Kemanusiaan</CardTitle>
              <CardDescription className="text-center">
                Kemanusiaan yang Adil dan Beradab
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-2 hover:border-teal-400 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-4xl mb-4">
                🤝
              </div>
              <CardTitle className="text-center">Persatuan</CardTitle>
              <CardDescription className="text-center">
                Persatuan Indonesia
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-2 hover:border-green-400 transition-colors">
            <CardHeader>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl mb-4">
                ⚖️
              </div>
              <CardTitle className="text-center">Kerakyatan</CardTitle>
              <CardDescription className="text-center">
                Kerakyatan yang Dipimpin oleh Hikmat
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Fitur Utama SIMRP</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Kampung-Centric
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fokus pada performa kampung, bukan kompetisi individual. 
                  Setiap aktivitas berkontribusi untuk kemajuan kampung.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚖️</span>
                  Pillar-Balance Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mekanisme otomatis untuk menjaga keseimbangan 4 pilar. 
                  Pilar yang tertinggal mendapat dampak XP lebih tinggi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  Partisipasi Mudah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Relawan cukup mendaftar dan checklist kehadiran. 
                  Tanpa beban laporan atau evaluasi subjektif.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  XP & Leaderboard Kampung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Setiap kampung memiliki XP total dan per pilar. 
                  Leaderboard menampilkan performa antar kampung.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  3-Tier Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ASN Pendamping, Kelurahan/Kecamatan, dan OPD 
                  memiliki dashboard sesuai kewenangan masing-masing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  Reward Ringan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Poin relawan dapat ditukar dengan reward non-fiskal 
                  seperti tiket bus, akses layanan, atau sertifikat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">SIMRP</h4>
              <p className="text-gray-400 text-sm">
                Sistem Informasi Manajemen Relawan Kampung Pancasila
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Project Owner</h4>
              <p className="text-gray-400 text-sm">
                Dinas Komunikasi dan Informatika<br />
                Kota Surabaya
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Tim Pengembang</h4>
              <p className="text-gray-400 text-sm">
                Mahasiswa Kerja Praktik PENS
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 SIMRP - Kampung Pancasila Surabaya
          </div>
        </div>
      </footer>
    </div>
  );
}
