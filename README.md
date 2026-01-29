# SIMRP - Sistem Informasi Manajemen Relawan Kampung Pancasila

**The Pillar-Balance & Maturity Engine**

SIMRP adalah sistem informasi kampung-centric untuk mengelola data relawan, kegiatan, dan capaian Kampung Pancasila secara terstruktur dan terukur.

## 🎯 Key Features

- **Kampung-Centric System**: Focus on village (kampung) performance, not individual competition
- **Pillar-Balance Engine**: Automatic balancing mechanism across 4 Pancasila pillars
- **3-Tier Governance**: ASN Pendamping, Kelurahan/Kecamatan, OPD monitoring
- **Simple Volunteer Flow**: Easy registration and participation without bureaucracy
- **Verified KSH System**: Village cadres with additional permissions
- **XP & Leaderboard**: Village-based performance tracking

## 📚 Documentation

For complete system design, architecture, and specifications, see [GRAND_DESIGN.md](./GRAND_DESIGN.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🏗️ System Architecture

```
User Layer (Relawan, KSH, Moderator)
        ↓
Presentation Layer (Web Dashboard)
        ↓
Application Layer (Services & Engines)
        ↓
Data Layer (Database)
```

## 👥 User Roles

- **Relawan (Volunteer)**: Basic user - can view and join events
- **Verified KSH**: Village cadre - can create events and proposals
- **Moderator Tier 1**: ASN Pendamping - monitoring and recommendations
- **Moderator Tier 2**: Kelurahan/Kecamatan - verification and supervision
- **Moderator Tier 3**: OPD - city-level analytics and policy

## 🎮 Gamification (Kampung-Centric)

- XP Kampung (Village XP) - aggregate performance indicator
- 4 Pillar Progress - balance tracking for village development
- Leaderboard Kampung - village comparison, not individual
- Simple volunteer points - for optional, low-burden rewards

## 📊 4 Pillars of Kampung Pancasila

1. **Ketuhanan** (Divinity)
2. **Kemanusiaan** (Humanity)
3. **Persatuan** (Unity)
4. **Kerakyatan** (Democracy)

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS v4 + Radix UI
- **State Management**: React Hooks
- **Charts**: Recharts
- **Build Tool**: Vite
- **Backend**: Supabase (planned)

## 📖 Project Status

✅ Grand Design Complete  
🚧 Implementation In Progress

## 📄 License

Developed by Mahasiswa Kerja Praktik PENS for Dinas Komunikasi dan Informatika Kota Surabaya

## 🤝 Contributing

This is a government project under active development. For questions or contributions, please contact the development team.
