import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Leaf, Coins, Users, HeartHandshake, Shield, BarChart3, Medal, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const pillars = [
    {
      id: 1,
      name: 'Lingkungan',
      description: 'Kepedulian terhadap kebersihan dan pengelolaan sampah.',
      icon: Leaf,
      color: '#10B981' // Keep green for environment context
    },
    {
      id: 2,
      name: 'Ekonomi',
      description: 'Pemberdayaan UMKM dan pelatihan usaha mandiri.',
      icon: Coins,
      color: '#F59E0B' // Amber for economy
    },
    {
      id: 3,
      name: 'Kemasyarakatan',
      description: 'Penyelesaian persoalan sosial internal dan keamanan.',
      icon: Shield,
      color: '#EF4444' // Red for security/social issues
    },
    {
      id: 4,
      name: 'Sosial Budaya',
      description: 'Penanaman nilai gotong royong dan keguyuban.',
      icon: HeartHandshake,
      color: '#3B82F6' // Blue for culture
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFC107] rounded-lg flex items-center justify-center font-bold text-xl">
              SR
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">SIMRP</h1>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">The Pillar-Balance Engine</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('login')}
              className="font-medium hover:bg-gray-100"
            >
              Masuk
            </Button>
            <Button 
              onClick={() => onNavigate('register')}
              className="bg-[#FFC107] text-black hover:bg-[#FFD54F] font-bold shadow-sm"
            >
              Daftar Relawan
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center max-w-5xl">
        <div className="inline-block mb-6 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-600">
          ✨ Gamifikasi Tanpa Kompetisi
        </div>
        <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-black">
          Sistem Informasi Manajemen <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600">Relawan Kampung Pancasila</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Mewujudkan Kampung yang Seimbang dan Mandiri melalui Pendekatan Holistik Berbasis Data Real-time dan Pillar-Balance Engine.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={() => onNavigate('register')}
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 rounded-full w-full sm:w-auto transition-all hover:scale-105"
          >
            Gabung Sekarang
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-6 rounded-full w-full sm:w-auto"
          >
            Pelajari Konsep
          </Button>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">4 Pilar Utama Program</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fokus bukan pada individu, melainkan pada keseimbangan kampung secara keseluruhan di empat aspek vital.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div key={pillar.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-opacity-90" style={{ backgroundColor: `${pillar.color}20` }}>
                    <IconComponent className="w-7 h-7" style={{ color: pillar.color }} />
                  </div>
                  <h4 className="font-bold text-xl mb-3">{pillar.name}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engine & Methodology Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-[#FFC107] text-black text-xs font-bold rounded uppercase tracking-wider">
              Core Technology
            </div>
            <h3 className="text-4xl font-bold mb-6">The Pillar-Balance Engine</h3>
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                <strong className="text-black block mb-1">Membangun Keseimbangan Secara Adaptif</strong>
                Sistem memantau status empat pilar secara instan. Jika satu pilar tertinggal, dampak XP dipercepat; jika terlalu aktif, diperlambat.
              </p>
              <p>
                <strong className="text-black block mb-1">Tanpa Leaderboard Individu</strong>
                Tidak ada peringkat antar relawan untuk menghindari persaingan. Fokus pada kolaborasi dan kematangan kampung (Maturity Engine).
              </p>
              <p>
                <strong className="text-black block mb-1">Indikator Kematangan (XP Kampung)</strong>
                Menggunakan diagram radar untuk menunjukkan proporsi aktivitas antar pilar dan skor kesehatan keseluruhan.
              </p>
            </div>
          </div>
          <div className="bg-black text-white p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold mb-8 text-[#FFC107]">Simulasi XP Adaptif</h4>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Lingkungan (Tertinggal)</span>
                    <span className="text-[#FFC107] font-mono">2.5x XP Boost ⚡</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[30%]"></div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Ekonomi (Stabil)</span>
                    <span className="text-gray-400 font-mono">1.0x Normal</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFC107] w-[60%]"></div>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sosial Budaya (Dominan)</span>
                    <span className="text-blue-300 font-mono">0.5x Slowed 🐢</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[90%]"></div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-400 italic">
                *Sistem secara otomatis menyeimbangkan pertumbuhan agar tidak ada aspek yang tertinggal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem & Roles */}
      <section className="bg-gray-900 text-white py-24">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-16">Ekosistem & Peran Pengguna</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Relawan */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-[#FFC107]" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-[#FFC107]">Relawan & KSH</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-[#FFC107]">•</span> Pendaftaran akun & presensi acara
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFC107]">•</span> Penyelesaian tugas & unduh sertifikat
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFC107]">•</span> KSH: Buat draft kegiatan & badge khusus
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFC107]">•</span> Reward: Sertifikat & Tiket Transportasi
                </li>
              </ul>
            </div>

            {/* Moderator */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-blue-400">Moderator (ASN)</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span> Tier 1: Pendamping (Monitoring)
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span> Tier 2 (Kelurahan): Approval Kegiatan
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span> Tier 2 (Kecamatan): Analisis Lintas Kampung
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400">•</span> Tier 3 (OPD): Dashboard Kota Surabaya
                </li>
              </ul>
            </div>

            {/* Admin */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="text-green-400" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-green-400">Platform Features</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400">•</span> Offline Mode dengan GPS-locked
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">•</span> View As Mode untuk Simulasi
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">•</span> Pelaporan Real-time
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">•</span> Integrasi Kode Pos Surabaya
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="bg-[#FFC107] rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-bold text-black mb-6">
              Mulai Perjalanan Kebaikan Anda
            </h3>
            <p className="text-xl text-black/80 mb-10 font-medium">
              Bergabunglah dengan ribuan relawan lainnya untuk membangun Surabaya yang lebih baik, seimbang, dan bergotong royong.
            </p>
            <div className="flex justify-center gap-4 flex-col sm:flex-row">
              <Button 
                size="lg"
                onClick={() => onNavigate('register')}
                className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-6 rounded-xl border-2 border-transparent"
              >
                Daftar Sekarang
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-black text-black hover:bg-black hover:text-white text-lg px-12 py-6 rounded-xl"
              >
                Lihat Demo
              </Button>
            </div>
          </div>
          
          {/* Decorative pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-overlay blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-12 max-w-2xl mx-auto text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <p className="font-semibold mb-3 uppercase tracking-wide text-xs">Akses Demo Pengembang</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <span className="block font-medium text-black">Admin Login:</span>
              <code className="bg-gray-200 px-2 py-1 rounded text-xs mt-1 inline-block">user: admin | pass: admin</code>
            </div>
            <div>
              <span className="block font-medium text-black">Testing Area:</span>
              <span className="text-gray-600">Gunakan kode pos <code className="bg-gray-200 px-1 rounded">60111</code> untuk simulasi wilayah Sukolilo.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black text-[#FFC107] rounded flex items-center justify-center font-bold text-sm">
              SR
            </div>
            <span className="font-bold text-lg">SIMRP</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            © 2026 Sistem Informasi Manajemen Relawan Kampung Pancasila.<br/>
            Dinas Komunikasi dan Informatika Kota Surabaya.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-black">Kebijakan Privasi</a>
            <a href="#" className="hover:text-black">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-black">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}