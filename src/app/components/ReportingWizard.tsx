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
          console.warn('Geolocation access denied or unavailable:', error.message);
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
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
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
                <h3 className="font-bold mb-3 text-lg text-black">📸 Bukti Kegiatan</h3>
                
                {!isOnline && (
                  <Alert className="mb-4 border-orange-200 bg-orange-50 text-orange-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Mode Offline: Laporan akan disimpan sebagai draft dan dikirim otomatis saat online.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Photo Upload */}
                  <div>
                    <Label className="text-black font-semibold">Foto Kegiatan (Wajib)</Label>
                    <div className="mt-2">
                      {photo ? (
                        <div className="relative">
                          <img 
                            src={photo} 
                            alt="Preview" 
                            className="w-full h-64 object-cover rounded-xl border border-gray-200"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
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
                          className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-black transition-all bg-gray-50 hover:bg-white group"
                        >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-black" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Klik untuk ambil foto
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            GPS Terkunci Otomatis 🔒
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
                    <Label htmlFor="participants" className="text-black font-semibold">Jumlah Peserta</Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      placeholder="Contoh: 25"
                      value={participants}
                      onChange={(e) => setParticipants(e.target.value)}
                      className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>

                  {/* Location Info */}
                  {location && (
                    <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex items-center gap-2 text-sm text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        📍 Lokasi GPS Valid: <strong>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!photo || !participants}
                className="w-full bg-black text-white hover:bg-gray-800 font-bold h-12 rounded-xl"
              >
                Lanjut ke Step 2
              </Button>
            </>
          )}

          {/* Step 2: Outcome Reporting */}
          {step === 2 && (
            <>
              <div>
                <h3 className="font-bold mb-3 text-lg text-black">📊 Dampak Kegiatan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih dampak nyata yang dihasilkan dari kegiatan ini.
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'resolved', label: '✅ Masalah Teratasi', description: 'Solusi langsung untuk masalah warga.' },
                    { id: 'followup', label: '⚠️ Butuh Tindak Lanjut', description: 'Perlu eskalasi ke Dinas terkait.' },
                    { id: 'economic', label: '💰 Transaksi Ekonomi', description: 'Ada perputaran uang / UMKM.' },
                    { id: 'participation', label: '📈 Guyub Rukun', description: 'Meningkatkan kohesi sosial warga.' }
                  ].map((tag) => (
                    <div
                      key={tag.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        outcomeTags.includes(tag.id)
                          ? 'border-black bg-gray-50'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => toggleOutcomeTag(tag.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={outcomeTags.includes(tag.id)}
                          onCheckedChange={() => toggleOutcomeTag(tag.id)}
                          className="data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{tag.label}</div>
                          <div className="text-sm text-gray-500">{tag.description}</div>
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
                  className="flex-1 h-12 rounded-xl border-gray-300"
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || outcomeTags.length === 0}
                  className="flex-1 bg-[#FFC107] text-black hover:bg-[#FFD54F] font-bold h-12 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Proses...
                    </>
                  ) : (
                    isOnline ? 'Kirim Laporan' : 'Simpan Offline'
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
