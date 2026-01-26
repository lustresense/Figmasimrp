import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { X, Camera, Upload, Loader2, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

interface ReportingWizardProps {
  authToken: string | null;
  userId: string;
  onClose: () => void;
}

export function ReportingWizard({ authToken, userId, onClose }: ReportingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Step 1: Evidence
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [participants, setParticipants] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Step 2: Outcome
  const [outcomeTags, setOutcomeTags] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Get location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran foto maksimal 5MB');
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const toggleOutcomeTag = (tag: string) => {
    setOutcomeTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!photo) {
      toast.error('Foto wajib diupload');
      return;
    }

    if (!participants || parseInt(participants) <= 0) {
      toast.error('Jumlah peserta harus diisi');
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        userId,
        photoUrl: photo, // In production, upload to cloud storage first
        participants: parseInt(participants),
        outcomeTags,
        location,
        isOfflineSubmission: !isOnline,
        createdAt: new Date().toISOString()
      };

      if (isOnline) {
        // Submit directly to server
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/reports`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken || publicAnonKey}`
            },
            body: JSON.stringify(reportData)
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success('Laporan berhasil dikirim!');
          onClose();
        } else {
          throw new Error(data.error || 'Gagal mengirim laporan');
        }
      } else {
        // Save to localStorage for offline mode
        const drafts = JSON.parse(localStorage.getItem('simrp_report_drafts') || '[]');
        drafts.push({
          ...reportData,
          id: `draft-${Date.now()}`,
          status: 'draft'
        });
        localStorage.setItem('simrp_report_drafts', JSON.stringify(drafts));
        
        toast.success('Laporan disimpan sebagai draft. Akan dikirim saat online.');
        onClose();
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-[#0B6E4F]">
              Lapor Kegiatan
            </CardTitle>
            <div className="text-sm text-gray-500 mt-1">
              Step {step} dari 2
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isOnline ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600 text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Capture Evidence */}
          {step === 1 && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-lg">📸 Bukti Kegiatan</h3>
                
                {!isOnline && (
                  <Alert className="mb-4 border-orange-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Mode Offline: Laporan akan disimpan sebagai draft dan dikirim otomatis saat online.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Photo Upload */}
                  <div>
                    <Label>Foto Kegiatan (Wajib)</Label>
                    <div className="mt-2">
                      {photo ? (
                        <div className="relative">
                          <img 
                            src={photo} 
                            alt="Preview" 
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setPhoto(null);
                              setPhotoFile(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={handleCameraClick}
                          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-[#0B6E4F] transition-colors"
                        >
                          <Camera className="w-12 h-12 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            Klik untuk ambil foto
                          </div>
                          <div className="text-xs text-gray-500">
                            GPS akan otomatis tercatat
                          </div>
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Participants Count */}
                  <div>
                    <Label htmlFor="participants">Jumlah Peserta</Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      placeholder="Contoh: 25"
                      value={participants}
                      onChange={(e) => setParticipants(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Location Info */}
                  {location && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        📍 Lokasi GPS tercatat: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!photo || !participants}
                className="w-full bg-[#0B6E4F] hover:bg-[#085A3E]"
              >
                Lanjut ke Step 2
              </Button>
            </>
          )}

          {/* Step 2: Outcome Reporting */}
          {step === 2 && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-lg">📊 Dampak Kegiatan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih dampak yang sesuai dengan kegiatan (bisa lebih dari satu)
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'resolved', label: '✅ Masalah Teratasi', description: 'Kegiatan berhasil menyelesaikan masalah' },
                    { id: 'followup', label: '⚠️ Butuh Tindak Lanjut Dinas', description: 'Perlu intervensi pemerintah' },
                    { id: 'economic', label: '💰 Ada Transaksi Ekonomi', description: 'Terjadi aktivitas ekonomi/UMKM' },
                    { id: 'participation', label: '📈 Partisipasi Meningkat', description: 'Warga semakin aktif terlibat' }
                  ].map((tag) => (
                    <div
                      key={tag.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        outcomeTags.includes(tag.id)
                          ? 'border-[#0B6E4F] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleOutcomeTag(tag.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={outcomeTags.includes(tag.id)}
                          onCheckedChange={() => toggleOutcomeTag(tag.id)}
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{tag.label}</div>
                          <div className="text-sm text-gray-600">{tag.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || outcomeTags.length === 0}
                  className="flex-1 bg-[#FDB913] text-black hover:bg-[#E5A711]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isOnline ? 'Mengirim...' : 'Menyimpan...'}
                    </>
                  ) : (
                    isOnline ? 'Kirim Laporan' : 'Simpan Draft'
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
