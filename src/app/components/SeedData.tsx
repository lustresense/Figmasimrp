import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function useSeedData() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const seedDatabase = async () => {
      // Check if already seeded
      const hasSeeded = localStorage.getItem('simrp_db_seeded');
      if (hasSeeded) {
        setSeeded(true);
        return;
      }

      try {
        // Create sample events
        const sampleEvents = [
          {
            title: 'Kerja Bakti Lingkungan RW 05',
            description: 'Membersihkan selokan dan taman kampung bersama warga',
            pillar: 1, // Lingkungan
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '07:00 - 10:00 WIB',
            location: 'Balai RW 05',
            basePoints: 25,
            participants: [],
            organizer: 'Ketua RW 05',
            status: 'upcoming'
          },
          {
            title: 'Senam Pagi Sehat Bersama',
            description: 'Kegiatan senam rutin bersama PKK dan warga untuk meningkatkan kesehatan',
            pillar: 2, // Gotong Royong
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '06:00 - 07:00 WIB',
            location: 'Lapangan Kampung',
            basePoints: 15,
            participants: [],
            organizer: 'PKK Kelurahan',
            status: 'upcoming'
          },
          {
            title: 'Pelatihan UMKM Digital Marketing',
            description: 'Workshop cara memasarkan produk UMKM melalui media sosial',
            pillar: 3, // Ekonomi Kreatif
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '13:00 - 16:00 WIB',
            location: 'Gedung Serbaguna Kelurahan',
            basePoints: 40,
            participants: [],
            organizer: 'Dinas Koperasi UMKM',
            status: 'upcoming'
          },
          {
            title: 'Ronda Malam Shift 1',
            description: 'Kegiatan siskamling malam untuk menjaga keamanan kampung',
            pillar: 4, // Keamanan
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '22:00 - 02:00 WIB',
            location: 'Pos Kamling RW',
            basePoints: 20,
            participants: [],
            organizer: 'Ketua RT',
            status: 'upcoming'
          },
          {
            title: 'Bazar UMKM Kampung',
            description: 'Pameran dan penjualan produk UMKM warga',
            pillar: 3, // Ekonomi Kreatif
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '08:00 - 15:00 WIB',
            location: 'Lapangan Kampung',
            basePoints: 30,
            participants: [],
            organizer: 'Forum UMKM',
            status: 'upcoming'
          },
          {
            title: 'Penghijauan dan Tanam Pohon',
            description: 'Kegiatan menanam pohon di area taman kampung',
            pillar: 1, // Lingkungan
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '07:00 - 11:00 WIB',
            location: 'Taman Kampung',
            basePoints: 30,
            participants: [],
            organizer: 'Kelompok Sadar Lingkungan',
            status: 'upcoming'
          },
          {
            title: 'Posyandu Balita & Lansia',
            description: 'Pemeriksaan kesehatan rutin untuk balita dan lansia',
            pillar: 2, // Gotong Royong
            date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '08:00 - 12:00 WIB',
            location: 'Balai RW',
            basePoints: 20,
            participants: [],
            organizer: 'Kader Posyandu',
            status: 'upcoming'
          },
          {
            title: 'Sosialisasi Bank Sampah',
            description: 'Edukasi tentang pemilahan sampah dan bank sampah',
            pillar: 1, // Lingkungan
            date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '15:00 - 17:00 WIB',
            location: 'Balai RW',
            basePoints: 25,
            participants: [],
            organizer: 'Tim Bank Sampah',
            status: 'upcoming'
          }
        ];

        // Post events to server
        for (const event of sampleEvents) {
          try {
            await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/events`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify(event)
              }
            );
          } catch (error) {
            console.error('Error creating event:', error);
          }
        }

        // Mark as seeded
        localStorage.setItem('simrp_db_seeded', 'true');
        setSeeded(true);
        console.log('✅ Database seeded with sample events');
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    };

    seedDatabase();
  }, []);

  return seeded;
}
