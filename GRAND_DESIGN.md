# GRAND DESIGN DOCUMENTATION

## SISTEM INFORMASI MANAJEMEN RELAWAN KAMPUNG PANCASILA (SIMRP)

**"The Pillar-Balance & Maturity Engine"**

Project Owner: Dinas Komunikasi dan Informatika Kota Surabaya  
Tim Pengembang: Mahasiswa Kerja Praktik PENS  
Status: Conceptual–Operational Blueprint  
Versi: 1.0 (Kampung-Centric, sesuai Pola Kerja Operasional Kampung Pancasila)

---

## EXECUTIVE SUMMARY

SIMRP (Sistem Informasi Manajemen Relawan Kampung Pancasila) dirancang sebagai sistem informasi kampung-centric yang berfungsi untuk mengelola data relawan, kegiatan, serta capaian Kampung Pancasila secara terstruktur dan terukur. Sistem ini menempatkan **kampung sebagai objek utama**, sementara relawan dan aktor pendamping berperan sebagai pendukung ekosistem.

SIMRP tidak bertujuan menjadikan relawan sebagai objek penilaian kompetitif, melainkan sebagai sumber partisipasi yang tercatat secara sederhana. Seluruh mekanisme gamifikasi diarahkan untuk **menjaga keseimbangan 4 Pilar Kampung Pancasila**, meningkatkan kualitas data lapangan, serta memberikan apresiasi yang proporsional terhadap kontribusi aktor pelaksana.

---

## 1. SYSTEM CONTEXT & PROBLEM STATEMENT

Berdasarkan Pola Kerja Operasional Kampung Pancasila, keberhasilan kampung ditentukan oleh kesinambungan aktivitas lintas aktor dan keseimbangan antar pilar. Namun dalam praktik lapangan, sering terjadi dominasi satu pilar, minimnya data terstruktur, serta belum terdokumentasinya kontribusi relawan dan mahasiswa Surabaya sebagai bagian dari pembangunan kampung.

SIMRP hadir untuk menutup celah tersebut dengan menyediakan sistem pencatatan terintegrasi, mekanisme pemantauan pilar, dan struktur peran yang jelas sesuai tata kelola kampung.

---

## 2. SYSTEM OVERVIEW & ARCHITECTURE

SIMRP dirancang sebagai sistem web-based yang modular dan siap diintegrasikan dengan sistem eksisting Pemerintah Kota Surabaya. Pada tahap konsep ini, arsitektur difokuskan pada pemisahan peran, alur data, dan tanggung jawab antar aktor tanpa membahas detail integrasi API lintas aplikasi.

### 2.1 High-Level System Architecture

Arsitektur SIMRP dibagi ke dalam tiga lapisan utama untuk menjaga skalabilitas dan kejelasan fungsi.

**Presentation Layer** merupakan antarmuka web responsif yang diakses oleh user (relawan & KSH) serta moderator. Pada lapisan ini ditampilkan dashboard, formulir kegiatan, daftar event, serta visualisasi progres pilar kampung.

**Application Layer** menangani logika bisnis utama sistem. Di dalamnya terdapat layanan manajemen user, manajemen event dan proposal, Pillar-Balance Engine, serta modul analytics dan dashboard. Seluruh aturan mengenai siapa boleh melakukan apa berada di lapisan ini.

**Data Layer** menyimpan data utama seperti akun pengguna, data kampung, kegiatan, partisipasi relawan, rekomendasi ASN, serta histori progres pilar. Penyimpanan dirancang untuk mendukung pelaporan dan audit.

Pendekatan ini memastikan bahwa perubahan pada tampilan atau kebijakan tidak langsung berdampak pada struktur data inti.

---

## 3. GAMIFICATION FRAMEWORK (THE CORE SOLUTION)

Gamifikasi dalam SIMRP tidak diposisikan sebagai elemen hiburan, melainkan sebagai **mekanisme pengarah perilaku dan pembacaan kondisi kampung**. Seluruh elemen gamifikasi dirancang kampung-centric, sehingga fokus penilaian dan perbandingan berada pada kampung, bukan individu relawan.

Inti dari gamifikasi SIMRP adalah memastikan bahwa aktivitas kampung berkembang secara seimbang pada empat Pilar Kampung Pancasila. Untuk mencapai tujuan tersebut, sistem tidak melarang kegiatan pada pilar tertentu, tetapi mengatur bagaimana dampak kegiatan tersebut memengaruhi progres kampung.

### 3.1 The Pillar-Balance Engine

The Pillar-Balance Engine bekerja dengan memantau skor dan level kematangan empat pilar pada setiap kampung. Engine ini membaca ketimpangan antar pilar dan menyesuaikan laju peningkatan progres kampung secara otomatis.

Apabila satu pilar terlalu dominan sementara pilar lain tertinggal, kegiatan pada pilar dominan tetap dapat dilaksanakan, namun kontribusinya terhadap peningkatan level kampung menjadi lebih lambat. Sebaliknya, kegiatan pada pilar yang tertinggal akan memberikan dampak progres yang lebih signifikan. Dengan pendekatan ini, kampung diarahkan untuk menyusun kegiatan yang lebih seimbang tanpa paksaan administratif.

### 3.2 XP Kampung, Leaderboard, dan Visualisasi Progres

Setiap kampung memiliki indikator performa utama berupa XP Kampung. XP ini bersifat agregat dan menjadi dasar perbandingan antar kampung.

Untuk memudahkan pembacaan performa, sistem menyediakan beberapa lapisan informasi:

* **XP Total Kampung**, yang merepresentasikan performa keseluruhan kampung.
* **XP per Pilar**, yang menunjukkan kekuatan relatif kampung pada masing-masing pilar.
* **Leaderboard Kampung**, baik secara keseluruhan maupun per pilar, sebagai alat pembanding performa.

Sebagai pelengkap, progres kampung divisualisasikan dalam bentuk grafik empat pilar. Visualisasi ini berfungsi sebagai indikator cepat apakah perkembangan kampung sudah seimbang atau masih timpang.

### 3.3 Kontribusi Aktor Pendamping dalam Gamifikasi

Kontribusi ASN Pendamping, Koordinator Kelurahan, Kecamatan, dan OPD tidak diwujudkan dalam bentuk poin individual. Sebaliknya, kontribusi mereka tercermin dalam kualitas dan kestabilan progres kampung.

Rekomendasi ASN Pendamping serta tindak lanjut struktural berfungsi sebagai faktor penguat. Kegiatan yang dilaksanakan berdasarkan rekomendasi pendamping atau telah melalui proses verifikasi yang baik akan menghasilkan progres kampung yang lebih stabil dan berkelanjutan.

---

## 4. PERSONA & USER MANAGEMENT

Struktur pengguna dalam SIMRP disederhanakan untuk menjaga konsistensi pengalaman pengguna dan menghindari kompleksitas yang tidak perlu. Secara konseptual, sistem hanya mengenal satu jenis akun pengguna, dengan perbedaan akses ditentukan oleh atribut peran.

### 4.1 User (Relawan dan Verified KSH)

Relawan merupakan bentuk dasar dari pengguna SIMRP. Relawan dapat mendaftarkan akun, mengisi profil dasar, melihat kegiatan kampung, mendaftar kegiatan yang masih memiliki kuota, serta memperoleh sertifikat kontribusi.

Untuk menjaga kemudahan partisipasi, relawan tidak dibebani pengisian laporan naratif atau penilaian subjektif. Interaksi relawan dengan sistem dibatasi pada tindakan-tindakan sederhana yang bersifat operasional.

Sebagian pengguna memiliki atribut **Verified KSH**. Atribut ini diberikan kepada Kader Surabaya Hebat dan membuka akses tambahan tanpa memisahkan jenis akun. Dengan pendekatan ini, KSH tetap menggunakan alur penggunaan yang sama dengan relawan, namun memiliki kewenangan tambahan.

Akses tambahan bagi Verified KSH meliputi:

* Pembuatan dan pengelolaan kegiatan kampung.
* Pengajuan proposal kegiatan resmi yang mewakili kampung.
* Pengisian output dan ringkasan dampak kegiatan.

Pendekatan ini memastikan bahwa KSH tidak dibebani sistem yang berbeda, sekaligus menjaga kesederhanaan UX.

### 4.2 Moderator (3-Tier Governance)

Moderator dalam SIMRP dipahami sebagai aktor pengawas dan pendamping, bukan sebagai pengguna operasional. Seluruh moderator mengakses dashboard khusus sesuai kewenangannya.

Struktur moderator dibagi ke dalam tiga tingkat utama:

* **Tier 1 – ASN Pendamping**, yang berfokus pada monitoring kondisi kampung dan pemberian rekomendasi kontekstual berbasis data.
* **Tier 2 – Koordinator Kelurahan dan PIC Kecamatan**, yang menjalankan fungsi verifikasi dan supervisi lintas wilayah.
* **Tier 3 – OPD Program / Kota**, yang menggunakan data agregat sebagai dasar perencanaan dan evaluasi kebijakan.

Walaupun beberapa modul dashboard yang digunakan serupa, perbedaan kewenangan dan cakupan wilayah tetap dijaga sesuai struktur birokrasi.

---

## 5. FEATURE SPECIFICATIONS & FLOWS

Bagian ini menjelaskan bagaimana fitur utama SIMRP digunakan oleh masing-masing aktor secara operasional. Penjelasan disusun secara naratif untuk menggambarkan alur penggunaan sistem secara utuh.

### 5.1 Manajemen Pendaftaran dan Profil Relawan

Relawan memulai interaksi dengan sistem melalui pendaftaran akun dan pengisian profil dasar. Sistem secara otomatis menyimpan riwayat partisipasi relawan, termasuk daftar kegiatan yang diikuti dan sertifikat kontribusi yang diperoleh. Relawan tidak diwajibkan mengisi laporan atau narasi tambahan.

### 5.2 Pendaftaran Event Sosial

Kegiatan kampung dibuat oleh KSH sebagai representasi resmi kampung. Pada saat pembuatan kegiatan, KSH menentukan pilar kegiatan, deskripsi singkat, serta kebutuhan relawan melalui pengaturan kuota.

Apabila kuota relawan bernilai nol atau telah terpenuhi, kegiatan ditampilkan dengan status **Full**. Status ini bersifat netral dan tidak menimbulkan persepsi penolakan terhadap relawan.

Relawan dapat mendaftar pada kegiatan yang masih memiliki kuota. Parameter utama perolehan poin kampung adalah **terselenggaranya kegiatan**, bukan jumlah relawan yang terlibat.

### 5.3 Entri Usulan dan Proposal Kegiatan

Relawan diberikan ruang untuk menyampaikan usulan ide kegiatan sebagai bentuk aspirasi. Usulan ini tidak bersifat mengikat dan tidak langsung masuk ke alur verifikasi.

KSH merupakan satu-satunya pihak yang dapat mengajukan proposal kegiatan resmi yang mewakili kampung. Proposal tersebut kemudian masuk ke alur pendampingan dan verifikasi moderator sesuai struktur kewenangan.

### 5.4 Entri Output dan Dampak Kegiatan

Setelah kegiatan selesai, KSH mengisi output dan ringkasan dampak kegiatan secara singkat dan terstruktur.

Relawan yang mengikuti kegiatan hanya diminta mengisi checklist sederhana sebagai indikator kehadiran dan keterlibatan. Checklist ini tidak mengandung penilaian subjektif dan tidak membebani relawan.

### 5.5 Dashboard Pelaporan

Dashboard pelaporan menyajikan ringkasan kondisi kampung dan aktivitasnya. Informasi yang ditampilkan mencakup perkembangan pilar, XP kampung, daftar kegiatan, serta rekomendasi pendamping.

Konten dashboard disesuaikan dengan kewenangan masing-masing moderator, namun bersumber dari data yang sama sehingga menjaga konsistensi informasi.

---

## 6. SYSTEM ARCHITECTURE (VISUAL & LOGICAL)

Bagian ini menjelaskan arsitektur sistem SIMRP secara visual dan logis untuk menunjukkan bahwa sistem siap dikembangkan, terstruktur, dan dapat diintegrasikan di tahap selanjutnya.

### 6.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────┐
│               USER & ACTOR LAYER             │
│  Relawan / Verified KSH / Moderator (ASN,    │
│  Kelurahan, Kecamatan, OPD)                  │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│            PRESENTATION LAYER (WEB)           │
│  - User Dashboard (Relawan & KSH)             │
│  - Moderator Dashboard (3-Tier View)          │
│  - Admin Console                              │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│             APPLICATION / SERVICE LAYER       │
│  - Authentication & Role Service              │
│  - Event & Proposal Service                   │
│  - Participation & Outcome Service            │
│  - Pillar-Balance & XP Engine                 │
│  - Recommendation Service (ASN)               │
│  - Analytics & Reporting Service              │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│                  DATA LAYER                   │
│  - User & Role Database                       │
│  - Kampung & Pilar Data                       │
│  - Event, Participation, Outcome Data         │
│  - Recommendation & Verification Log          │
└──────────────────────────────────────────────┘
```

Arsitektur ini menegaskan pemisahan antara antarmuka pengguna, logika bisnis, dan penyimpanan data. Seluruh logika kebijakan, pilar, dan kontribusi aktor berada pada Service Layer.

---

## 7. USER PERSONA (CONTOH KONKRET)

### 7.1 Persona Relawan

**Nama:** Andi (Mahasiswa Kos di Surabaya)  
**Motivasi:** Pengabdian masyarakat & sertifikat  
**Perilaku Sistem:**

* Mendaftar akun
* Melihat event kampung
* Mendaftar event (jika kuota tersedia)
* Hadir kegiatan
* Mengisi checklist kehadiran
* Mengunduh sertifikat

Relawan tidak dibebani evaluasi subjektif, tidak mengelola kegiatan, dan tidak terlibat dalam proses birokrasi.

### 7.2 Persona KSH (Verified KSH)

**Nama:** Kak Esa (Kader Surabaya Hebat)  
**Motivasi:** Menjalankan program kampung secara efektif  
**Perilaku Sistem:**

* Login sebagai user biasa (atribut Verified KSH)
* Membuat kegiatan kampung
* Menentukan pilar dan kuota relawan
* Menutup kegiatan
* Mengisi output dan ringkasan dampak
* Melihat rekomendasi ASN dan progres pilar kampung

KSH tetap menggunakan alur user yang sama dengan relawan, namun memiliki kewenangan tambahan.

---

## 8. USER FLOW & PROCESS FLOW (LENGKAP UNTUK SELURUH AKTOR)

Bagian ini mendefinisikan alur sistem SIMRP secara menyeluruh, mencakup seluruh aktor utama tanpa pengecualian. Flow disusun untuk memastikan tidak ada celah logika antar peran, fitur, dan output sistem.

### 8.1 Flow Registrasi & Manajemen Akun

```
Pengguna Akses Sistem
        ↓
Registrasi Akun
        ↓
Lengkapi Profil Dasar
        ↓
Status: Relawan Aktif
        ↓
(Atribut Tambahan)
Jika Terverifikasi → Status: Verified KSH
```

Flow ini memastikan seluruh pengguna berasal dari basis akun yang sama, dengan diferensiasi hak akses berbasis atribut, bukan jenis akun.

### 8.2 Flow Pembuatan Kegiatan Kampung (KSH)

```
KSH Login
        ↓
Buat Kegiatan Kampung
        ↓
Tentukan Pilar Kegiatan
        ↓
Tentukan Kebutuhan Relawan
        │
        ├─ Kuota > 0 → Event Dibuka
        └─ Kuota = 0 → Status: Full
        ↓
Kegiatan Terpublikasi
```

Flow ini memastikan bahwa seluruh kegiatan resmi selalu berasal dari KSH sebagai representasi kampung.

### 8.3 Flow Pendaftaran & Partisipasi Relawan

```
Relawan Login
        ↓
Lihat Daftar Kegiatan
        ↓
Pilih Kegiatan
        ↓
Cek Status & Kuota
        │
        ├─ Available → Daftar
        └─ Full → Tidak Dapat Daftar
        ↓
Relawan Hadir Kegiatan
        ↓
Checklist Kehadiran
```

Relawan tidak mengisi narasi atau evaluasi subjektif.

### 8.4 Flow Pelaporan Output & Dampak

```
Kegiatan Selesai
        ↓
Relawan Checklist Tersimpan
        ↓
KSH Mengisi Output Kegiatan
        ↓
KSH Mengisi Ringkasan Dampak
```

Output dan dampak menjadi dasar pembacaan progres kampung.

### 8.5 Flow Rekomendasi ASN Pendamping (Tier 1)

```
ASN Login
        ↓
Akses Dashboard Kampung Binaan
        ↓
Baca Kondisi Pilar & Aktivitas
        ↓
Tulis Rekomendasi Kontekstual
        ↓
Rekomendasi Tercatat di Histori Kampung
```

Rekomendasi ASN tidak mengubah data, namun memengaruhi arah kebijakan dan stabilitas progres.

### 8.6 Flow Verifikasi Kelurahan (Tier 2)

```
Kelurahan Login
        ↓
Lihat Daftar Kegiatan & Laporan
        ↓
Verifikasi / Tolak
        ↓
Status Kegiatan Diperbarui
```

### 8.7 Flow Supervisi Kecamatan (Tier 2)

```
Kecamatan Login
        ↓
Akses Dashboard Lintas Kampung
        ↓
Analisis Ketimpangan Pilar
        ↓
Catatan Supervisi (Opsional)
```

### 8.8 Flow Monitoring OPD / Kota (Tier 3)

```
OPD Login
        ↓
Akses Dashboard Agregat Kota
        ↓
Baca Tren & Performa Kampung
        ↓
Dasar Pengambilan Kebijakan
```

### 8.9 Flow Perhitungan XP & Progres Kampung

```
Kegiatan Terverifikasi
        ↓
Pillar-Balance Engine Aktif
        ↓
Hitung XP Pilar
        ↓
Update Level Pilar Kampung
        ↓
Update XP Total Kampung
        ↓
Update Leaderboard
```

### 8.10 Flow Reward Relawan

```
Relawan Akumulasi Poin
        ↓
Poin Mencapai Ambang
        ↓
Tukar Reward Ringan
```

Reward bersifat opsional dan tidak memengaruhi skor kampung.

---

## 9. XP, POIN USER, DAN REWARD RINGAN

Walaupun fokus utama sistem adalah performa kampung, relawan tetap memiliki poin kontribusi dalam skala ringan sebagai bentuk apresiasi.

Poin relawan tidak digunakan untuk kompetisi, melainkan sebagai **kredit partisipasi** yang dapat ditukarkan dengan reward non-fiskal dan rendah beban anggaran.

Contoh reward yang memungkinkan:

* Tiket Suroboyo Bus gratis
* Akses layanan WiraWiri
* Sertifikat prioritas pengabdian masyarakat

Model ini menjaga motivasi relawan tanpa menggeser fokus sistem dari kampung ke individu.

---

## 10. PENEGASAN GRAND DESIGN

SIMRP adalah sistem informasi manajemen relawan yang lengkap, terstruktur, dan siap dikembangkan. Sistem ini tidak hanya mencatat aktivitas, tetapi juga membangun logika keseimbangan pilar, penghargaan kontribusi aktor, dan data kebijakan yang dapat digunakan lintas level pemerintahan.

Grand design ini disusun untuk memastikan bahwa aspek kebijakan, UX lapangan, dan kesiapan teknis berjalan seimbang.

---

## 11. TECHNOLOGY STACK

- **Frontend:** React + TypeScript + Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Charts & Visualization:** Recharts
- **Build Tool:** Vite
- **Backend:** Supabase (Database + Authentication + Edge Functions)
- **Hosting:** Vercel / Netlify
- **Analytics:** Custom dashboard dengan Recharts

---

## 12. NEXT STEPS

1. **Development Phase:** Implementasi fitur sesuai grand design
2. **Testing Phase:** User acceptance testing dengan stakeholder
3. **Deployment Phase:** Launch production dan monitoring
4. **Iteration Phase:** Perbaikan berdasarkan feedback lapangan

---

**Document Version:** 1.0  
**Last Updated:** 29 Januari 2026  
**Prepared by:** Tim Pengembang SIMRP - Mahasiswa Kerja Praktik PENS
