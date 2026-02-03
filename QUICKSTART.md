# 🚀 QUICK START GUIDE - SIMRP

## Get the system running in 5 minutes!

---

## ⚡ Quick Setup

### 1. Prerequisites Check
```bash
node --version    # Should be 18+
npm --version     # Should be 8+
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🎯 Quick Test Scenarios

### Scenario 1: Test Admin Access (30 seconds)
1. Click **"Masuk"** button
2. Select **"Admin"** tab
3. Login with:
   - Username: `admin`
   - Password: `admin`
4. ✅ You're in Admin Dashboard!

### Scenario 2: Test User Registration (1 minute)
1. Click **"Daftar"** button
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Kode Pos: `60111`
3. Watch it auto-fill:
   - Kecamatan: `Sukolilo`
   - Kelurahan: `Keputih`
4. Click **"Daftar Sekarang"**
5. ✅ Auto-logged in to User Dashboard!

### Scenario 3: Test Event Browsing (30 seconds)
1. Login as user (from Scenario 2)
2. Click **"Event"** tab in bottom nav
3. See 8 pre-loaded events
4. Click any event
5. Click **"Gabung Event"**
6. ✅ Success toast appears!

### Scenario 4: Test Reporting Wizard (1 minute)
1. Login as user
2. Click **"Buat Laporan"** button
3. Click camera area → Select any image
4. Enter participants: `25`
5. Click **"Lanjut ke Step 2"**
6. Select outcome tags (any)
7. Click **"Kirim Laporan"**
8. ✅ Report submitted!

### Scenario 5: Test Offline Mode (1 minute)
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Try creating a report
5. Notice WiFi icon changes to WifiOff
6. Submit report
7. ✅ Saved as draft in localStorage!

---

## 🔑 Demo Credentials

### Admin Access
```
URL: /login → Admin tab
Username: admin
Password: admin
```

### Test User (Create via Registration)
```
URL: /register
Email: test@example.com
Password: password123
Kode Pos: 60111 (Keputih, Sukolilo)
```

---

## 📱 Testing Bottom Navigation

1. Login as user
2. Look at bottom of screen
3. Click each tab: **Home** → **Event** → **Profile** → **More**
4. ✅ Active tab should have **FULL YELLOW background** (#FDB913)

---

## 🎨 Visual Identity Check

### Primary Colors
- Green: `#0B6E4F` (Headers, buttons, primary actions)
- Yellow: `#FDB913` (Active states, highlights, CTAs)

### 4 Pillar Colors
- 🌱 Lingkungan: Green `#10B981`
- 🤝 Gotong Royong: Blue `#3B82F6`
- 💼 Ekonomi Kreatif: Orange `#F59E0B`
- 🛡️ Keamanan: Red `#EF4444`

---

## 🧪 Quick API Test

### Test Health Endpoint
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-32aa5c5c/health \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected response:
```json
{"status":"ok"}
```

---

## 📦 Pre-Loaded Data

### 8 Sample Events
System automatically seeds 8 events on first load:
1. Kerja Bakti Lingkungan (Pilar 1)
2. Senam Pagi Sehat (Pilar 2)
3. Pelatihan UMKM Digital (Pilar 3)
4. Ronda Malam (Pilar 4)
5. Bazar UMKM (Pilar 3)
6. Penghijauan Pohon (Pilar 1)
7. Posyandu (Pilar 2)
8. Sosialisasi Bank Sampah (Pilar 1)

### Geographic Data
- 31 Kecamatan Surabaya
- 154 Kelurahan
- Full postal code mapping

---

## 🐛 Quick Troubleshooting

### Problem: Page is blank
**Solution:** Check console for errors. Ensure Supabase is connected.

### Problem: Kode pos not working
**Solution:** Only Surabaya postal codes (60xxx) are valid. Try: 60111, 60243, 60175

### Problem: Bottom nav not showing
**Solution:** Make sure you're logged in as user (not admin)

### Problem: Events not loading
**Solution:** Check localStorage for `simrp_db_seeded`. Clear it to re-seed.

### Problem: Can't login as admin
**Solution:** Use exact credentials: `admin` / `admin` (case-sensitive)

---

## 🔍 Quick Code Navigation

### Want to modify...
- **Landing page?** → `/src/app/components/LandingPage.tsx`
- **User dashboard?** → `/src/app/components/UserDashboard.tsx`
- **Admin panel?** → `/src/app/components/AdminDashboard.tsx`
- **Reporting wizard?** → `/src/app/components/ReportingWizard.tsx`
- **Geographic data?** → `/src/data/geographicData.ts`
- **Backend API?** → `/supabase/functions/server/index.tsx`
- **Colors/theme?** → `/src/styles/theme.css`
- **Fonts?** → `/src/styles/fonts.css`

---

## 📱 Mobile Testing

### Test on Mobile Device
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access: `http://YOUR_IP:5173`
3. Test touch interactions
4. Test bottom navigation
5. Test photo upload (use device camera)

### Chrome DevTools Mobile Simulation
1. Press F12
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Test all features

---

## 🎯 Success Checklist

After setup, verify these work:

- [ ] Landing page loads with Surabaya colors
- [ ] Admin login works (admin/admin)
- [ ] User registration works with postal code 60111
- [ ] Bottom navigation shows 4 tabs with yellow active state
- [ ] 8 events visible in Events tab
- [ ] Can join an event
- [ ] Can create a report with photo
- [ ] Admin can verify reports
- [ ] User gets points after verification
- [ ] Profile shows correct level and stats
- [ ] Offline mode shows WifiOff icon
- [ ] Toast notifications appear on actions

---

## 🚀 Next Steps After Quick Start

1. **Read Full Docs**: Check `README_SIMRP.md`
2. **User Manual**: Read `PETUNJUK_PENGGUNAAN.md` (Bahasa Indonesia)
3. **System Overview**: Check `SYSTEM_SUMMARY.md`
4. **Test All Flows**: Use the testing scenarios above
5. **Customize**: Modify colors, text, or add features
6. **Deploy**: Follow deployment guide in README

---

## 📞 Need Help?

### Check Documentation
- Technical: `README_SIMRP.md`
- User Guide: `PETUNJUK_PENGGUNAAN.md`
- System Specs: `SYSTEM_SUMMARY.md`

### Common Resources
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com

---

## 🎉 You're Ready!

The system is fully functional. Start testing and customizing!

**Happy coding! 🚀**

---

**Built for Kota Surabaya** 🇮🇩  
**© 2025 Diskominfo Surabaya**
