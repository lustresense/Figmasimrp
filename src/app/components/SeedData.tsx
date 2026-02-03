import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function useSeedData() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const seedDatabase = async () => {
      // Check if already seeded in this session/browser
      const hasSeeded = localStorage.getItem('simrp_db_seeded_v2');
      if (hasSeeded) {
        setSeeded(true);
        return;
      }

      console.log('🌱 Starting database seeding...');

      try {
        // 1. Create Sample User (Budi Santoso)
        // We use the auth endpoint which creates Supabase Auth user AND KV store entry
        try {
          const userPayload = {
            email: 'budi@example.com',
            password: 'password123',
            name: 'Budi Santoso',
            nik: '3578010101010001',
            kecamatan: 'Sukolilo',
            kelurahan: 'Keputih',
            kodepos: '60111',
            rw: '05'
          };

          const userRes = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-32aa5c5c/auth/signup`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userPayload)
            }
          );
          
          if (userRes.ok) {
            console.log('✅ Created user: Budi Santoso');
          } else {
            console.log('ℹ️ User Budi Santoso likely already exists or error:', await userRes.text());
          }
        } catch (e) {
          console.error('Error creating user:', e);
        }

        // 2. Create Sample Events
        // Pillar mapping: 1=Lingkungan, 2=Ekonomi, 3=Kemasyarakatan, 4=Sosial Budaya
        const sampleEvents = [
          {
            title: 'Kerja Bakti Lingkungan RW 05',
            description: 'Membersihkan selokan dan taman kampung bersama warga. Wajib membawa alat kebersihan sendiri.',
            pillar: 1, // Lingkungan
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '07:00 - 10:00 WIB',
            location: 'Balai RW 05, Keputih',
            basePoints: 50,
            participants: [],
            organizer: 'Ketua RW 05',
            status: 'upcoming'
          },
          {
            title: 'Pelatihan Digital Marketing UMKM',
            description: 'Workshop cara memasarkan produk UMKM melalui media sosial (TikTok & Instagram).',
            pillar: 2, // Ekonomi
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '13:00 - 16:00 WIB',
            location: 'Aula Kelurahan Keputih',
            basePoints: 75,
            participants: [],
            organizer: 'Diskopdag Surabaya',
            status: 'upcoming'
          },
          {
            title: 'Ronda Malam Siskamling',
            description: 'Jaga malam bergilir untuk keamanan lingkungan RT 02/RW 05.',
            pillar: 3, // Kemasyarakatan (Keamanan is part of this or separate? Prompt says 4 pillars: Lingkungan, Ekonomi, Kemasyarakatan, Sosial Budaya. Usually Security is under Kemasyarakatan or separate. Let's assume pillar 3 covers general social issues including security if not specified otherwise, but previously 4 was Keamanan. Prompt says: "Lingkungan, Gotong Royong, Ekonomi Kreatif, Keamanan" in one place, but "Lingkungan, Ekonomi, Kemasyarakatan, Sosial Budaya" in another.
            // Let's stick to the prompt's explicit list: "Lingkungan, Ekonomi, Kemasyarakatan, Sosial Budaya".
            // So Ronda Malam -> Kemasyarakatan (3)
            pillar: 3, 
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '22:00 - 02:00 WIB',
            location: 'Pos Kamling RT 02',
            basePoints: 100,
            participants: [],
            organizer: 'Sie Keamanan',
            status: 'upcoming'
          },
          {
            title: 'Latihan Gamelan & Tari',
            description: 'Pelestarian budaya lokal untuk persiapan pentas seni kampung.',
            pillar: 4, // Sosial Budaya
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '19:00 - 21:00 WIB',
            location: 'Pendopo Kecamatan',
            basePoints: 40,
            participants: [],
            organizer: 'Karang Taruna',
            status: 'upcoming'
          },
          {
            title: 'Bank Sampah: Penimbangan Rutin',
            description: 'Bawa sampah terpilah anda untuk ditimbang dan ditabung.',
            pillar: 1, // Lingkungan
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '08:00 - 11:00 WIB',
            location: 'Bank Sampah Maju Jaya',
            basePoints: 30,
            participants: [],
            organizer: 'Ibu PKK',
            status: 'upcoming'
          }
        ];

        // Post events to server (create if not exist logic is hard on client, so we just post and server creates new IDs)
        // To avoid spamming duplicates on every reload, we rely on the localStorage check at the top.
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
        
        console.log('✅ Created sample events');

        // Mark as seeded
        localStorage.setItem('simrp_db_seeded_v2', 'true');
        setSeeded(true);
        console.log('✅ Database seeding complete');
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    };

    seedDatabase();
  }, []);

  return seeded;
}