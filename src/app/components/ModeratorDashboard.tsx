import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { CheckCircle, XCircle, FileText, Clock, LayoutGrid, ShieldCheck, Lightbulb, BarChart3 } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import { FloatingNavbar } from '@/app/components/ui/FloatingNavbar';

interface ModeratorDashboardProps {
  user: any;
  authToken: string | null;
  onLogout: () => void;
  onNavigate: (page: any) => void;
  currentView: 'admin' | 'moderator' | 'user';
  onViewChange: (view: 'admin' | 'moderator' | 'user') => void;
  moderatorTier: 1 | 2 | 3;
}

export function ModeratorDashboard({ user, authToken, onLogout, onNavigate, currentView, onViewChange, moderatorTier }: ModeratorDashboardProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState<string>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const next = moderatorTier === 1 ? "monitor" : moderatorTier === 2 ? "verify" : "aggregate";
    setActivePage(next);
  }, [moderatorTier]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchReports(), fetchUsers()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/reports`,
        {
          headers: {
            'Authorization': `Bearer ${authToken || publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/users`,
        {
          headers: {
            'Authorization': `Bearer ${authToken || publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleVerifyReport = async (reportId: string, approved: boolean) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/reports/${reportId}/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken || publicAnonKey}`
          },
          body: JSON.stringify({
            approved,
            points: approved ? 50 : 0
          })
        }
      );

      if (response.ok) {
        toast.success(approved ? 'Laporan disetujui' : 'Laporan ditolak');
        fetchData();
      } else {
        toast.error('Gagal memverifikasi laporan');
      }
    } catch (error) {
      console.error('Error verifying report:', error);
      toast.error('Terjadi kesalahan');
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const verifiedReports = reports.filter(r => r.status === 'verified');

  return (
    <div className="size-full flex flex-col bg-white">
      <FloatingNavbar
        user={user}
        activePage={activePage}
        onLogout={onLogout}
        onNavigate={(page) => setActivePage(page)}
        userMode="relawan"
        onModeChange={() => {}}
        currentView={currentView}
        onViewChange={onViewChange}
        moderatorTier={moderatorTier}
        onModeratorTierChange={() => {}}
        theme="moderator"
        navItems={
          moderatorTier === 1
            ? [
                { key: "monitor", label: "Monitoring", icon: BarChart3 },
                { key: "rekom", label: "Rekom", icon: Lightbulb },
                { key: "overview", label: "Ringkas", icon: LayoutGrid }
              ]
            : moderatorTier === 2
            ? [
                { key: "verify", label: "Verifikasi", icon: ShieldCheck },
                { key: "events", label: "Kegiatan", icon: FileText },
                { key: "overview", label: "Ringkas", icon: LayoutGrid }
              ]
            : [
                { key: "aggregate", label: "Agregat", icon: BarChart3 },
                { key: "insight", label: "Insight", icon: Lightbulb },
                { key: "overview", label: "Ringkas", icon: LayoutGrid }
              ]
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 pt-24 space-y-4">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 text-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Moderator Dashboard</h1>
              <p className="text-sm text-cyan-100">Tier {moderatorTier}</p>
            </div>
            <Badge className="bg-white/20 text-white">{user?.name}</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-700">{pendingReports.length}</div>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Terverifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">{verifiedReports.length}</div>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{reports.length}</div>
            </CardContent>
          </Card>
        </div>

        {activePage === "verify" && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Laporan Menunggu Verifikasi
            </CardTitle>
            <CardDescription>
              {pendingReports.length} laporan perlu ditinjau
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada laporan yang menunggu verifikasi
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => {
                  const reporter = users.find(u => u.id === report.userId);
                  
                  return (
                    <div key={report.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold">{reporter?.name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <Badge className="bg-yellow-500">Pending</Badge>
                      </div>

                      {report.photoUrl && (
                        <img
                          src={report.photoUrl}
                          alt="Bukti Kegiatan"
                          className="w-full h-64 object-cover rounded-lg mb-3"
                        />
                      )}

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Peserta:</span>
                          <span>{report.participants} orang</span>
                        </div>

                        {report.outcomeTags?.length > 0 && (
                          <div>
                            <span className="font-semibold">Dampak:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {report.outcomeTags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag === 'resolved' ? 'Masalah Teratasi' :
                                   tag === 'followup' ? 'Butuh Tindak Lanjut' :
                                   tag === 'economic' ? 'Transaksi Ekonomi' :
                                   tag === 'participation' ? 'Partisipasi Meningkat' :
                                   tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVerifyReport(report.id, true)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Setujui (+50 poin)
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleVerifyReport(report.id, false)}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          </Card>
        )}

        {activePage === "overview" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5" />
                Ringkasan Moderator
              </CardTitle>
              <CardDescription>Ringkasan data sesuai tier.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Gunakan menu atas untuk fitur sesuai tier.</div>
            </CardContent>
          </Card>
        )}

        {activePage === "monitor" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monitoring Kampung Binaan
              </CardTitle>
              <CardDescription>Tier 1 fokus monitoring & rekomendasi.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Data monitoring kampung akan muncul di sini.</div>
            </CardContent>
          </Card>
        )}

        {activePage === "rekom" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Rekomendasi ASN
              </CardTitle>
              <CardDescription>Catatan rekomendasi berbasis data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Belum ada rekomendasi terbaru.</div>
            </CardContent>
          </Card>
        )}

        {activePage === "events" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Kegiatan & Approval
              </CardTitle>
              <CardDescription>Tier 2 memverifikasi kegiatan.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Data kegiatan menunggu approval akan muncul di sini.</div>
            </CardContent>
          </Card>
        )}

        {activePage === "aggregate" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Agregat Kota
              </CardTitle>
              <CardDescription>Tier 3 monitoring agregat kota.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Data agregat kota akan muncul di sini.</div>
            </CardContent>
          </Card>
        )}

        {activePage === "insight" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insight Program
              </CardTitle>
              <CardDescription>Analisis tren pilar dan rekomendasi kebijakan.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Belum ada insight terbaru.</div>
            </CardContent>
          </Card>
        )}

        {moderatorTier === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Laporan Terverifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verifiedReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada laporan terverifikasi
                </div>
              ) : (
                <div className="space-y-3">
                  {verifiedReports.slice(0, 10).map((report) => {
                    const reporter = users.find(u => u.id === report.userId);
                    
                    return (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{reporter?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500">Verified</Badge>
                          <div className="text-xs text-gray-500 mt-1">{report.points} poin</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
