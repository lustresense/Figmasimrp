import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Award, MapPin, Calendar, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

interface UserProfileProps {
  user: any;
  reports?: any[];
}

export function UserProfile({ user, reports = [] }: UserProfileProps) {
  const getLevelProgress = () => {
    const levels = [
      { level: 1, name: 'Pendatang Baru', min: 0, max: 50 },
      { level: 2, name: 'Tetangga Baik', min: 51, max: 150 },
      { level: 3, name: 'Warga Aktif', min: 151, max: 300 },
      { level: 4, name: 'Tokoh Masyarakat', min: 301, max: 600 },
      { level: 5, name: 'Pahlawan Kampung', min: 601, max: 1000 },
      { level: 6, name: 'Sesepuh Digital', min: 1001, max: 2000 },
      { level: 7, name: 'Legend Kampung', min: 2001, max: 9999 }
    ];

    const currentLevel = levels.find(l => l.level === (user.level || 1)) || levels[0];
    const points = user.points || 0;
    const progress = ((points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    
    return {
      current: currentLevel,
      next: levels.find(l => l.level === currentLevel.level + 1),
      progress: Math.min(Math.max(progress, 0), 100),
      allLevels: levels
    };
  };

  const levelInfo = getLevelProgress();

  const verifiedReports = reports.filter(r => r.status === 'verified').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;

  return (
    <div className="p-4 space-y-4">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-[#0B6E4F] to-[#0D8A62] text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-green-200 mb-4">{user.email}</p>
            
            <div className="flex gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{user.points || 0}</div>
                <div className="text-sm text-green-200">Total Poin</div>
              </div>
              <div className="w-px bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">{reports.length}</div>
                <div className="text-sm text-green-200">Laporan</div>
              </div>
            </div>

            <Badge className="bg-[#FDB913] text-black text-lg px-4 py-1">
              Level {user.level || 1} • {levelInfo.current.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Location Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0B6E4F]" />
            Informasi Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Kelurahan:</span>
            <span className="font-semibold">{user.kelurahan || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kecamatan:</span>
            <span className="font-semibold">{user.kecamatan || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kode Pos:</span>
            <span className="font-semibold">{user.kodepos || '-'}</span>
          </div>
          {user.rw && (
            <div className="flex justify-between">
              <span className="text-gray-600">RW:</span>
              <span className="font-semibold">{user.rw}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0B6E4F]" />
            Progress Menuju Level Berikutnya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">{levelInfo.current.name}</span>
              {levelInfo.next && (
                <span className="text-gray-500">{levelInfo.next.name}</span>
              )}
            </div>
            <Progress value={levelInfo.progress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{user.points || 0} poin</span>
              {levelInfo.next && (
                <span>{levelInfo.next.min} poin</span>
              )}
            </div>
          </div>

          {levelInfo.next ? (
            <p className="text-sm text-gray-600 text-center bg-green-50 p-3 rounded-lg">
              💪 Kumpulkan <strong>{levelInfo.next.min - (user.points || 0)} poin</strong> lagi untuk naik level!
            </p>
          ) : (
            <p className="text-sm text-center bg-[#FDB913]/20 p-3 rounded-lg">
              🎉 <strong>Selamat!</strong> Anda telah mencapai level tertinggi!
            </p>
          )}

          {/* All Levels */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Semua Level</h4>
            <div className="space-y-2">
              {levelInfo.allLevels.map((level) => (
                <div
                  key={level.level}
                  className={`flex items-center justify-between p-2 rounded ${
                    level.level === user.level
                      ? 'bg-[#0B6E4F] text-white'
                      : level.level < (user.level || 1)
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      level.level === user.level
                        ? 'bg-[#FDB913] text-black'
                        : level.level < (user.level || 1)
                        ? 'bg-gray-300'
                        : 'bg-gray-200'
                    }`}>
                      {level.level}
                    </div>
                    <span className="text-sm font-semibold">{level.name}</span>
                  </div>
                  <span className="text-xs">
                    {level.min}-{level.max === 9999 ? '∞' : level.max} poin
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0B6E4F]" />
            Badge Saya ({user.badges?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.badges && user.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {user.badges.map((badge: any, idx: number) => (
                <div key={idx} className="bg-gradient-to-br from-[#FDB913] to-[#F59E0B] p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="font-bold text-sm text-black">
                    {badge.name || badge}
                  </div>
                  {badge.awardedAt && (
                    <div className="text-xs text-black/70 mt-1">
                      {new Date(badge.awardedAt).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Belum ada badge. Ikuti lebih banyak kegiatan untuk mendapatkan badge!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0B6E4F]" />
            Statistik Aktivitas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{verifiedReports}</div>
              <div className="text-xs text-gray-600">Terverifikasi</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{pendingReports}</div>
              <div className="text-xs text-gray-600">Menunggu</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{rejectedReports}</div>
              <div className="text-xs text-gray-600">Ditolak</div>
            </div>
          </div>

          {reports.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-3">Riwayat Laporan Terbaru</h4>
              <div className="space-y-2">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-semibold">
                        Laporan Kegiatan
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <Badge
                      className={
                        report.status === 'verified' ? 'bg-green-500' :
                        report.status === 'rejected' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }
                    >
                      {report.status === 'verified' ? '✓' :
                       report.status === 'rejected' ? '✗' :
                       '⏱'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Since */}
      <Card>
        <CardContent className="text-center py-6">
          <div className="text-sm text-gray-500 mb-1">Bergabung sejak</div>
          <div className="font-semibold text-[#0B6E4F]">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : '-'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}