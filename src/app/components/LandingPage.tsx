import { Button } from '@/app/components/ui/button';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0b5d3b] text-[#FFC107] rounded-lg flex items-center justify-center font-bold text-xl">
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b5d3b] via-[#0f6a43] to-[#14824f]"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,214,79,0.45) 0 20%, transparent 22%), radial-gradient(circle at 80% 25%, rgba(255,214,79,0.3) 0 18%, transparent 20%), radial-gradient(circle at 35% 80%, rgba(255,255,255,0.2) 0 16%, transparent 18%)'
        }} />
        <div className="container mx-auto px-4 py-24 md:py-32 text-center max-w-5xl relative text-white">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white/90">
            ? Gerakan Kampung Pancasila
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
            Mulai Perjalanan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC107] to-white">Kebaikan Anda</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/85 mb-10 max-w-3xl mx-auto leading-relaxed">
            Satu kampung. Satu arah. Kolaborasi nyata berbasis data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => onNavigate('register')}
              className="bg-[#FFC107] text-black hover:bg-[#FFD54F] text-lg px-10 py-6 rounded-full w-full sm:w-auto transition-all hover:scale-105"
            >
              Mulai Perjalanan Kebaikan Anda
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full w-full sm:w-auto"
              onClick={() => onNavigate('login')}
            >
              Masuk
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#0b5d3b] text-[#FFC107] rounded flex items-center justify-center font-bold text-sm">
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
