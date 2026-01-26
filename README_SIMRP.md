# SIM RELAWAN KAMPUNG PANCASILA (SIMRP)

## 🌟 Overview

SIM Relawan Kampung Pancasila adalah aplikasi web untuk mengelola relawan dan aktivitas kampung berbasis 4 Pilar Pembangunan Kampung Pancasila di Kota Surabaya.

**Project Owner:** Dinas Komunikasi dan Informatika (Diskominfo) Kota Surabaya  
**Version:** 1.0 MVP (Mobile-First PWA)  
**Status:** ✅ Production Ready

---

## 🎯 Fitur Utama

### ✅ Sudah Diimplementasikan

#### 1. **Authentication System**
- ✅ Triple Login Method:
  - Login Admin (Username: `admin`, Password: `admin`)
  - Login User (Email/Password via Supabase Auth)
  - **Login NIK (16-digit National ID dengan Auto-Role Assignment)** ✨
- ✅ Registration dengan validasi kode pos Surabaya otomatis
- ✅ Session persistence dengan localStorage
- ✅ **Auto-role assignment based on NIK database** ✨

#### 2. **Gamification Engine**
- ✅ 7 Level Progression System (Pendatang Baru → Legend Kampung)
- ✅ Point System dengan auto-calculation
- ✅ Badge System (ready for expansion)
- ✅ Leaderboard functionality

#### 3. **User Dashboard**
- ✅ Home Tab: Progress level, quick actions, latest reports
- ✅ Events Tab: Browse & join events dengan filter pilar
- ✅ Profile Tab: Complete user profile & statistics
- ✅ More Tab: Settings & logout
- ✅ **Bottom Navigation dengan Active State (Yellow Background)** ✨

#### 4. **Event Management**
- ✅ Event browsing dengan filter 4 Pilar
- ✅ Event detail dengan info lengkap
- ✅ Join event functionality
- ✅ Event status tracking (upcoming/completed)
- ✅ 8 Sample events sudah di-seed

#### 5. **Reporting Wizard (Offline-First)**
- ✅ 2-Step Wizard: Photo Upload → Outcome Tags
- ✅ GPS Lock saat foto diambil
- ✅ Offline Mode Detection (WiFi icon indicator)
- ✅ Draft Mode: Laporan tersimpan di localStorage saat offline
- ✅ Quick Outcome Tags (tidak pakai esai panjang)

#### 6. **Admin Dashboard**
- ✅ Overview: Statistics cards, pillar distribution chart
- ✅ User Management: View all users dengan detail
- ✅ Event Management: Manage all events
- ✅ Report Verification: Approve/Reject reports dengan poin otomatis
- ✅ **God Mode (Discord-Style Admin Controls):** ✨
  - ✅ **Role Management dengan Level Selection** - Assign moderator dengan pilihan level 1-5
  - ✅ **Temporary Adjustments** - Add points, badges, atau set level temporary (expire 24h)
  - ✅ **Audit Trail** - Semua admin actions tercatat dengan reason
- ✅ **POV Switcher (Always Visible)** - Switch view antara Admin/Moderator/User ✨

#### 7. **Moderator Dashboard**
- ✅ Verification Inbox: Pending reports queue
- ✅ Quick Approve/Reject dengan poin calculation
- ✅ Statistics overview
- ✅ **Multi-Level Progression** - 5 levels dengan perks berbeda (Mod Magang → Mod Legend) ✨
- ✅ **POV Switcher** - Switch ke User view untuk test UX ✨

#### 8. **Geographic Data System**
- ✅ Complete Surabaya Data: 31 Kecamatan, 154 Kelurahan
- ✅ Postal Code Auto-fill: Input kode pos → Auto-fill Kecamatan/Kelurahan
- ✅ Real-time validation dengan visual feedback

#### 9. **Design System**
- ✅ Surabaya Color Identity: Green #0B6E4F & Yellow #FDB913
- ✅ Mobile-First Responsive Design
- ✅ Consistent UI/UX across all pages
- ✅ Toast notifications dengan sonner

---

## 🎨 Visual Identity

- **Primary Color:** Green `#0B6E4F` (Hijau Kota Surabaya)
- **Secondary Color:** Yellow `#FDB913` (Aksen & Highlights)
- **Active Tab:** Full yellow background `bg-[#FDB913]`
- **Typography:** Inter font family
- **Layout:** Mobile-first, PWA-ready

---

## 📋 4 Pilar Kampung Pancasila

1. **🌱 LINGKUNGAN (Hijau #10B981)**
   - Peduli Sampah
   - Manajemen limbah & lingkungan
   - Bank Sampah, Penghijauan, Rutilahu

2. **🤝 GOTONG ROYONG / KEBERSAMAAN (Biru #3B82F6)**
   - Kerja bakti & kohesi sosial
   - Posyandu, Senam Pagi
   - Sinau Bareng, Pendampingan Lansia

3. **💼 EKONOMI KREATIF (Kuning #F59E0B)**
   - Kemandirian
   - UMKM & Wirausaha
   - UMKM e-Peken, Pelatihan Wirausaha

4. **🛡️ KEAMANAN (Merah #EF4444)**
   - Siskamling
   - Jaga malam & keamanan warga
   - Adminduk (KNG)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase Account (already configured)

### Default Login Credentials

**Admin:**
```
Username: admin
Password: admin
```

**Test User (Create via registration):**
```
Kode Pos: 60111 (Keputih, Sukolilo)
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🗂️ Project Structure

```
/src
├── /app
│   ├── App.tsx                    # Main router & auth logic
│   └── /components
│       ├── LandingPage.tsx        # Public landing
│       ├── LoginPage.tsx          # Dual login (User/Admin)
│       ├── RegisterPage.tsx       # Registration with postal code validation
│       ├── UserDashboard.tsx      # User main interface
│       ├── AdminDashboard.tsx     # Admin panel
│       ├── ModeratorDashboard.tsx # Moderator verification panel
│       ├── EventList.tsx          # Event browsing & join
│       ├── ReportingWizard.tsx    # Offline-first reporting
│       ├── UserProfile.tsx        # User profile & stats
│       └── SeedData.tsx           # Sample data seeder
├── /data
│   └── geographicData.ts          # Complete Surabaya geographic data
├── /styles
│   ├── fonts.css                  # Inter font import
│   ├── theme.css                  # Tailwind theme variables
│   └── index.css                  # Main styles
└── /supabase/functions/server
    └── index.tsx                  # Backend API (Hono)
```

---

## 🔧 Backend API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/admin-login` - Admin login
- `GET /auth/me` - Get current user

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user

### Events
- `POST /events` - Create event
- `GET /events` - Get all events (with filters)
- `GET /events/:id` - Get event by ID
- `POST /events/:id/join` - Join event

### Reports
- `POST /reports` - Submit report
- `GET /reports` - Get all reports (with filters)
- `POST /reports/:id/verify` - Verify report (Admin/Moderator)

### Gamification
- `GET /leaderboard` - Get leaderboard
- `POST /badges/award` - Award badge (Admin)

---

## 💾 Data Storage

### KV Store (Supabase)
```
user:{userId}           → User profile & gamification data
event:{eventId}         → Event details
report:{reportId}       → Activity reports
ledger:{ledgerId}       → Points transaction ledger
session:admin:{token}   → Admin session
```

### Local Storage
```
simrp_auth_token        → User session token
simrp_user              → Cached user data
simrp_db_seeded         → Seed status flag
simrp_report_drafts     → Offline draft reports
```

---

## 📊 Gamification Logic

### Level System
| Level | Name | Points Required |
|-------|------|----------------|
| 1 | Pendatang Baru | 0-50 |
| 2 | Tetangga Baik | 51-150 |
| 3 | Warga Aktif | 151-300 |
| 4 | Tokoh Masyarakat | 301-600 |
| 5 | Pahlawan Kampung | 601-1000 |
| 6 | Sesepuh Digital | 1001-2000 |
| 7 | Legend Kampung | 2001+ |

### Point Earning
- **Join Event:** 10 points (auto)
- **Verified Report:** 50 points (default, moderator can adjust)
- **Multiplier System:** Ready (1.5x untuk pilar defisit - backend logic ready)

---

## 🔐 Security Features

- ✅ NIK hashing (privacy protection)
- ✅ Role-based access control (User/Moderator/Admin)
- ✅ Session management dengan token validation
- ✅ Postal code integrity validation
- ✅ GPS metadata verification for reports

---

## 📱 Mobile-First Features

1. **Bottom Navigation:** Sticky, dengan active state kuning penuh
2. **Touch-optimized:** Button sizes untuk mobile
3. **Responsive Layout:** Semua page mobile-friendly
4. **Offline Capability:** Draft mode untuk reporting
5. **PWA-Ready:** Service worker structure ready

---

## 🧪 Testing Scenarios

### Test 1: Registration Flow
1. Klik "Daftar" di landing page
2. Input nama, email, password
3. Input kode pos `60111`
4. Verify auto-fill: Kecamatan "Sukolilo", Kelurahan "Keputih"
5. Submit → Auto-login ke User Dashboard

### Test 2: Admin Login
1. Klik "Masuk" → Tab "Admin"
2. Username: `admin`, Password: `admin`
3. Access Admin Dashboard dengan full data

### Test 3: Reporting (Offline Mode)
1. Login sebagai user
2. Disable network (Dev Tools → Network → Offline)
3. Klik "Buat Laporan"
4. Upload foto, pilih outcome tags
5. Verify icon WiFi jadi WifiOff
6. Submit → Saved as draft di localStorage
7. Enable network → Can manually sync

### Test 4: Event Join & Verification
1. User: Browse events → Join event
2. User: Submit report dengan foto
3. Admin/Moderator: Verify report → User dapat +50 poin
4. User: Check profile → Level & points updated

---

## 🎯 Roadmap Phase 2 (Future Enhancement)

- [ ] Badge auto-award system (berdasarkan milestone)
- [ ] Proposal submission (bottom-up user-generated events)
- [ ] Real-time leaderboard dengan Redis
- [ ] Push notifications (PWA)
- [ ] Certificate generator (PDF dengan TTD Kadis)
- [ ] Quest System (Daily/Weekly/Monthly challenges)
- [ ] Social features (like, comment, share)
- [ ] Analytics dashboard untuk Kecamatan/Kelurahan
- [ ] Export reports untuk ASW integration
- [ ] File upload ke Supabase Storage (currently base64)

---

## 📞 Support & Contact

**Technical Issues:**  
GitHub Issues atau contact Diskominfo Surabaya

**Documentation:**  
Lihat Grand Design Doc lengkap di repository

---

## 📄 License

© 2025 Dinas Komunikasi dan Informatika Kota Surabaya  
All rights reserved.

---

## ✅ Checklist Implementasi MVP

- [x] Authentication system (dual login)
- [x] Registration dengan postal code validation
- [x] Geographic data (31 Kecamatan, 154 Kelurahan)
- [x] User Dashboard dengan bottom nav (active state yellow)
- [x] Event management (CRUD & join)
- [x] Reporting wizard (offline-first, 2-step)
- [x] Admin Dashboard (overview, users, events, reports)
- [x] Moderator Dashboard (verification inbox)
- [x] Gamification (7 levels, points, badges structure)
- [x] 4 Pilar system implementation
- [x] Mobile-first responsive design
- [x] Surabaya color identity (green & yellow)
- [x] Toast notifications
- [x] Sample data seeding (8 events)
- [x] Backend API (Hono + Supabase)
- [x] KV Store integration

**Status:** ✅ MVP COMPLETE & PRODUCTION READY

---

## 🎉 Deployment Notes

Aplikasi sudah siap untuk:
1. ✅ Demo ke stakeholder
2. ✅ User Acceptance Testing (UAT)
3. ✅ Soft launch terbatas
4. ✅ Production deployment

**Next Step:** Handover ke tim Diskominfo untuk deployment ke staging server.

---

**Dibuat dengan ❤️ untuk Kota Surabaya yang Lebih Baik**
