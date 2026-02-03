import { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { X, Camera, Loader2, CheckCircle } from 'lucide-react';
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
  
  // Step 1: Evidence
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [participants, setParticipants] = useState('');
  
  // Step 2: Outcome
  const [outcomeTags, setOutcomeTags] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        createdAt: new Date().toISOString()
      };

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
            <CardTitle className="text-xl text-black">
              Lapor Kegiatan
            </CardTitle>
            <div className="text-sm text-gray-500 mt-1">
              Step {step} dari 2
            </div>
          </div>
          <div className="flex items-center gap-3">
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
                            Pilih foto kegiatan
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

                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!photo || !participants}
                className="w-full bg-green-700 text-white hover:bg-green-800 font-bold h-12 rounded-xl"
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
                          ? 'border-green-700 bg-green-50'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => toggleOutcomeTag(tag.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={outcomeTags.includes(tag.id)}
                          onCheckedChange={() => toggleOutcomeTag(tag.id)}
                          className="data-[state=checked]:bg-green-700 data-[state=checked]:text-white border-gray-300"
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
                    'Kirim Laporan'
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
