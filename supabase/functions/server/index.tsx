import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Create Supabase client for auth operations
const getSupabaseAuth = (token?: string) => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    token ? token : (Deno.env.get('SUPABASE_ANON_KEY') ?? ''),
  );
};

// Helper function to verify user authorization
const verifyUser = async (authHeader: string | null) => {
  if (!authHeader) {
    return { error: 'No authorization header', userId: null };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { error: 'Invalid authorization format', userId: null };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { error: 'Unauthorized user', userId: null };
  }

  return { error: null, userId: data.user.id };
};

const getUserProfile = async (userId: string) => {
  if (!userId) return null;
  return await kv.get(`user:${userId}`);
};

const getUserFromAuth = async (authHeader: string | null) => {
  const { error, userId } = await verifyUser(authHeader);
  if (error || !userId) {
    return { error: error || 'Unauthorized', user: null };
  }
  const user = await getUserProfile(userId);
  if (!user) {
    return { error: 'User not found', user: null };
  }
  return { error: null, user };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getKampungId = (kelurahan: string, kecamatan: string) =>
  `kampung-${slugify(kelurahan)}-${slugify(kecamatan)}`;

const ensureKampung = async ({
  kelurahan,
  kecamatan,
  kodepos
}: {
  kelurahan: string;
  kecamatan: string;
  kodepos: string;
}) => {
  const kampungId = getKampungId(kelurahan, kecamatan);
  const existing = await kv.get(`kampung:${kampungId}`);
  const now = new Date().toISOString();
  if (existing) {
    const updated = {
      ...existing,
      kelurahan,
      kecamatan,
      kodepos: existing.kodepos || kodepos,
      updatedAt: now
    };
    await kv.set(`kampung:${kampungId}`, updated);
    return updated;
  }
  const kampung = {
    id: kampungId,
    name: `Kampung Pancasila ${kelurahan}`,
    kelurahan,
    kecamatan,
    kodepos,
    xp: 0,
    volunteers: 0,
    createdAt: now,
    updatedAt: now
  };
  await kv.set(`kampung:${kampungId}`, kampung);
  return kampung;
};

const isModeratorTier = (user: any, tier: number) =>
  user?.role === 'moderator' && Number(user?.moderatorTier) === tier;

// ==================== AUTHENTICATION ROUTES ====================

// Sign up endpoint - Admin creates user with auto-confirm
app.post("/make-server-32aa5c5c/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, nik, kecamatan, kelurahan, kodepos, rw } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = getSupabaseAuth();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          nik: nik || '',
          kecamatan: kecamatan || '',
          kelurahan: kelurahan || '',
          kodepos: kodepos || '',
          rw: rw || '',
          role: 'user',
          level: 1,
          points: 0,
          badges: []
        }
      }
    });

    if (authError) {
      console.log(`Sign up error: ${authError.message}`);
      return c.json({ error: `Failed to create user: ${authError.message}` }, 400);
    }

    const kampung = await ensureKampung({
      kelurahan: kelurahan || '',
      kecamatan: kecamatan || '',
      kodepos: kodepos || ''
    });

    kampung.volunteers = (kampung.volunteers || 0) + 1;
    kampung.updatedAt = new Date().toISOString();
    await kv.set(`kampung:${kampung.id}`, kampung);

    // Store user profile in KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      nik: nik || '',
      kecamatan: kecamatan || '',
      kelurahan: kelurahan || '',
      kodepos: kodepos || '',
      rw: rw || '',
      role: 'user',
      isKsh: false,
      moderatorTier: null,
      hasPendingReport: false,
      pendingReportEventIds: [],
      kampungId: kampung.id,
      kampung,
      level: 1,
      levelName: 'Pendatang Baru',
      points: 0,
      badges: [],
      honoraryRole: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return c.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

// Admin login endpoint (Supabase Auth)
app.post("/make-server-32aa5c5c/auth/admin-login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email dan password wajib diisi' }, 400);
    }

    const supabase = getSupabaseAuth();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session || !authData.user) {
      return c.json({ error: authError?.message || 'Login gagal' }, 401);
    }

    const user = await kv.get(`user:${authData.user.id}`);

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      return c.json({ error: 'Akun tidak memiliki akses admin/moderator' }, 403);
    }

    return c.json({
      success: true,
      token: authData.session.access_token,
      user
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ error: 'Internal server error during admin login' }, 500);
  }
});

// Get current user info
app.get("/make-server-32aa5c5c/auth/me", async (c) => {
  const authHeader = c.req.header('Authorization');
  
  // Regular user auth
  const { error, userId } = await verifyUser(authHeader);
  
  if (error) {
    return c.json({ error }, 401);
  }

  const userData = await kv.get(`user:${userId}`);
  
  if (!userData) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ user: userData });
});

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users (Admin only)
app.get("/make-server-32aa5c5c/users", async (c) => {
  try {
    const kampungId = c.req.query('kampungId');
    const role = c.req.query('role');
    let users = await kv.getByPrefix('user:');

    if (kampungId) {
      users = users.filter((u: any) => u.kampungId === kampungId);
    }

    if (role) {
      users = users.filter((u: any) => u.role === role);
    }

    return c.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get user by ID
app.get("/make-server-32aa5c5c/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const user = await kv.get(`user:${id}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Update user profile
app.put("/make-server-32aa5c5c/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    const { error, user } = await getUserFromAuth(authHeader);

    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    // Allow if user is updating their own profile or if admin
    const isAdmin = user.role === 'admin';
    if (!isAdmin && user.id !== id) {
      return c.json({ error: 'Unauthorized to update this user' }, 403);
    }

    const body = await c.req.json();
    const existingUser = await kv.get(`user:${id}`);

    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = {
      ...existingUser,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${id}`, updatedUser);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// ==================== KODEPOS ROUTES ====================

// Get kelurahan by kodepos (public)
app.get("/make-server-32aa5c5c/kodepos/:kode", async (c) => {
  try {
    const kode = c.req.param('kode');
    if (!kode || kode.length !== 5) {
      return c.json({ error: 'Kodepos tidak valid' }, 400);
    }

    const data = await kv.get(`kodepos:${kode}`);
    if (!data) {
      return c.json({ error: 'Kodepos tidak ditemukan' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('Get kodepos error:', error);
    return c.json({ error: 'Gagal memuat kodepos' }, 500);
  }
});

// Get all kampung entries
app.get("/make-server-32aa5c5c/kampung", async (c) => {
  try {
    const kampung = await kv.getByPrefix('kampung:');
    kampung.sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));
    return c.json({ kampung });
  } catch (error) {
    console.error('Get kampung error:', error);
    return c.json({ error: 'Failed to fetch kampung' }, 500);
  }
});

// ==================== EVENT MANAGEMENT ROUTES ====================

// Create event
app.post("/make-server-32aa5c5c/events", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error, user } = await getUserFromAuth(authHeader);

    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    if (!user.isKsh) {
      return c.json({ error: 'Hanya KSH yang dapat membuat event' }, 403);
    }

    const body = await c.req.json();
    const { title, description, pillar, date, time, location, basePoints, organizer, quota, recommendationId } = body;

    if (!title || !pillar || !date) {
      return c.json({ error: 'Title, pillar, and date are required' }, 400);
    }

    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const kampung = await ensureKampung({
      kelurahan: user.kelurahan || '',
      kecamatan: user.kecamatan || '',
      kodepos: user.kodepos || ''
    });

    const event = {
      id: eventId,
      title,
      description: description || '',
      pillar,
      date,
      time: time || '',
      location: location || '',
      basePoints: basePoints || 10,
      participants: [],
      organizer: organizer || user.name || '',
      createdBy: user.id,
      kampungId: kampung.id,
      kelurahan: user.kelurahan || '',
      kecamatan: user.kecamatan || '',
      kodepos: user.kodepos || '',
      quota: typeof quota === 'number' ? quota : parseInt(quota || '0', 10) || 0,
      recommendationId: recommendationId || null,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (recommendationId) {
      const bonusXp = 25;
      kampung.xp = (kampung.xp || 0) + bonusXp;
      kampung.updatedAt = new Date().toISOString();
      await kv.set(`kampung:${kampung.id}`, kampung);
      event.bonusXp = bonusXp;
    }

    await kv.set(`event:${eventId}`, event);

    return c.json({ success: true, event });
  } catch (error) {
    console.error('Create event error:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

// Get all events
app.get("/make-server-32aa5c5c/events", async (c) => {
  try {
    const pillar = c.req.query('pillar');
    const status = c.req.query('status');
    const kampungId = c.req.query('kampungId');
    const createdBy = c.req.query('createdBy');
    const participantId = c.req.query('participantId');
    
    let events = await kv.getByPrefix('event:');
    
    // Filter by pillar if specified
    if (pillar) {
      events = events.filter((e: any) => e.pillar === parseInt(pillar));
    }
    
    // Filter by status if specified
    if (status) {
      events = events.filter((e: any) => e.status === status);
    }

    if (kampungId) {
      events = events.filter((e: any) => e.kampungId === kampungId);
    }

    if (createdBy) {
      events = events.filter((e: any) => e.createdBy === createdBy);
    }

    if (participantId) {
      events = events.filter((e: any) => Array.isArray(e.participants) && e.participants.includes(participantId));
    }
    
    // Sort by date
    events.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// Get event by ID
app.get("/make-server-32aa5c5c/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    return c.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
});

// Update event status (Moderator Tier 2 approval)
app.post("/make-server-32aa5c5c/events/:id/approval", async (c) => {
  try {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    const body = await c.req.json();
    const { approved, notes } = body;

    const { error, user } = await getUserFromAuth(authHeader);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!(user.role === 'admin' || isModeratorTier(user, 2))) {
      return c.json({ error: 'Hanya moderator tier 2 yang dapat approve event' }, 403);
    }

    const event = await kv.get(`event:${id}`);
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    event.status = approved ? 'published' : 'rejected';
    event.approvedAt = approved ? new Date().toISOString() : null;
    event.approvedBy = user.id;
    event.approvalNotes = notes || '';
    event.updatedAt = new Date().toISOString();

    await kv.set(`event:${id}`, event);

    const approvalId = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`approval:${approvalId}`, {
      id: approvalId,
      eventId: id,
      approved,
      notes: notes || '',
      moderatorId: user.id,
      moderatorName: user.name || '',
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, event });
  } catch (error) {
    console.error('Approve event error:', error);
    return c.json({ error: 'Failed to update event approval' }, 500);
  }
});

// Mark event completion (KSH)
app.post("/make-server-32aa5c5c/events/:id/complete", async (c) => {
  try {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');

    const { error, user } = await getUserFromAuth(authHeader);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const event = await kv.get(`event:${id}`);
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    if (event.createdBy !== user.id) {
      return c.json({ error: 'Hanya KSH pembuat event yang dapat menandai selesai' }, 403);
    }

    event.status = 'completed';
    event.completedAt = new Date().toISOString();
    event.updatedAt = new Date().toISOString();

    await kv.set(`event:${id}`, event);

    return c.json({ success: true, event });
  } catch (error) {
    console.error('Complete event error:', error);
    return c.json({ error: 'Failed to mark event complete' }, 500);
  }
});

// Submit recommendation (ASN tier 1)
app.post("/make-server-32aa5c5c/recommendations", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error, user } = await getUserFromAuth(authHeader);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!(user.role === 'admin' || isModeratorTier(user, 1))) {
      return c.json({ error: 'Hanya ASN pendamping yang dapat menulis rekomendasi' }, 403);
    }

    const body = await c.req.json();
    const { title, summary, suggestedActions, kampungId } = body;

    if (!title) {
      return c.json({ error: 'Judul rekomendasi wajib diisi' }, 400);
    }

    const recId = `rekom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const recommendation = {
      id: recId,
      title,
      summary: summary || '',
      suggestedActions: suggestedActions || '',
      kampungId: kampungId || user.kampungId || null,
      kecamatan: user.kecamatan || '',
      kelurahan: user.kelurahan || '',
      createdBy: user.id,
      createdByName: user.name || '',
      createdAt: new Date().toISOString()
    };

    await kv.set(`rekomendasi:${recId}`, recommendation);

    return c.json({ success: true, recommendation });
  } catch (error) {
    console.error('Create recommendation error:', error);
    return c.json({ error: 'Failed to create recommendation' }, 500);
  }
});

// Get recommendations
app.get("/make-server-32aa5c5c/recommendations", async (c) => {
  try {
    const kampungId = c.req.query('kampungId');
    const createdBy = c.req.query('createdBy');

    let recommendations = await kv.getByPrefix('rekomendasi:');

    if (kampungId) {
      recommendations = recommendations.filter((r: any) => r.kampungId === kampungId);
    }

    if (createdBy) {
      recommendations = recommendations.filter((r: any) => r.createdBy === createdBy);
    }

    recommendations.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return c.json({ error: 'Failed to fetch recommendations' }, 500);
  }
});

// Join event (RSVP)
app.post("/make-server-32aa5c5c/events/:id/join", async (c) => {
  try {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    const { error, user } = await getUserFromAuth(authHeader);

    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    if (event.status !== 'published') {
      return c.json({ error: 'Event belum dipublish' }, 400);
    }

    if (user.isKsh) {
      return c.json({ error: 'KSH tidak bisa mendaftar event' }, 403);
    }

    if (user.hasPendingReport || (user.pendingReportEventIds && user.pendingReportEventIds.length > 0)) {
      return c.json({ error: 'Selesaikan laporan kegiatan sebelumnya dulu' }, 400);
    }

    // Check if already joined
    if (event.participants && event.participants.includes(user.id)) {
      return c.json({ error: 'Already joined this event' }, 400);
    }

    const quota = event.quota || 0;
    if (quota > 0 && event.participants?.length >= quota) {
      return c.json({ error: 'Kuota event sudah penuh' }, 400);
    }

    // Add user to participants
    event.participants = event.participants || [];
    event.participants.push(user.id);
    event.updatedAt = new Date().toISOString();

    await kv.set(`event:${id}`, event);

    return c.json({ success: true, event });
  } catch (error) {
    console.error('Join event error:', error);
    return c.json({ error: 'Failed to join event' }, 500);
  }
});

// ==================== REPORTING ROUTES ====================

// Submit report
app.post("/make-server-32aa5c5c/reports", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error, user } = await getUserFromAuth(authHeader);

    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { eventId, photoUrl, participants, outcomeTags, location, isOfflineSubmission } = body;

    if (!eventId) {
      return c.json({ error: 'Event wajib dipilih' }, 400);
    }

    if (!photoUrl) {
      return c.json({ error: 'Photo is required' }, 400);
    }

    const event = await kv.get(`event:${eventId}`);
    if (!event) {
      return c.json({ error: 'Event tidak ditemukan' }, 404);
    }

    if (!Array.isArray(event.participants) || !event.participants.includes(user.id)) {
      return c.json({ error: 'Anda belum terdaftar di event ini' }, 403);
    }

    if (event.status !== 'completed') {
      return c.json({ error: 'Laporan hanya bisa dibuat setelah event selesai' }, 400);
    }

    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const report = {
      id: reportId,
      userId: user.id,
      eventId,
      photoUrl,
      participants: participants || 0,
      outcomeTags: outcomeTags || [],
      location: location || null,
      isOfflineSubmission: isOfflineSubmission || false,
      status: 'pending',
      points: 0,
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null
    };

    await kv.set(`report:${reportId}`, report);

    const pendingEvents = (user.pendingReportEventIds || []).filter(
      (pendingId: string) => pendingId !== eventId
    );
    user.pendingReportEventIds = pendingEvents;
    user.hasPendingReport = pendingEvents.length > 0;
    user.updatedAt = new Date().toISOString();
    await kv.set(`user:${user.id}`, user);

    return c.json({ success: true, report });
  } catch (error) {
    console.error('Submit report error:', error);
    return c.json({ error: 'Failed to submit report' }, 500);
  }
});

// Get all reports
app.get("/make-server-32aa5c5c/reports", async (c) => {
  try {
    const status = c.req.query('status');
    const userId = c.req.query('userId');
    
    let reports = await kv.getByPrefix('report:');
    
    // Filter out autoVerify entries
    reports = reports.filter((r: any) => !r.reportId);
    
    // Filter by status
    if (status) {
      reports = reports.filter((r: any) => r.status === status);
    }
    
    // Filter by userId
    if (userId) {
      reports = reports.filter((r: any) => r.userId === userId);
    }
    
    // Sort by created date
    reports.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

// Verify report (Moderator/Admin)
app.post("/make-server-32aa5c5c/reports/:id/verify", async (c) => {
  try {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    const body = await c.req.json();
    const { approved, points } = body;

    const { error, user } = await getUserFromAuth(authHeader);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!(user.role === 'admin' || isModeratorTier(user, 2))) {
      return c.json({ error: 'Hanya moderator tier 2 yang dapat verifikasi laporan' }, 403);
    }

    const report = await kv.get(`report:${id}`);
    
    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    // Update report status
    report.status = approved ? 'verified' : 'rejected';
    report.verifiedAt = new Date().toISOString();
    report.verifiedBy = 'moderator';
    report.points = approved ? (points || 50) : 0;

    await kv.set(`report:${id}`, report);

    // If approved, add points to user
    if (report.userId) {
      const reportUser = await kv.get(`user:${report.userId}`);
      if (reportUser) {
        reportUser.pendingReportEventIds = (reportUser.pendingReportEventIds || []).filter(
          (eventId: string) => eventId !== report.eventId
        );
        reportUser.hasPendingReport = reportUser.pendingReportEventIds.length > 0;
        if (approved) {
          reportUser.points = (reportUser.points || 0) + report.points;
          reportUser.level = calculateLevel(reportUser.points);
          reportUser.levelName = getLevelName(reportUser.level);

          const ledgerId = `ledger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          await kv.set(`ledger:${ledgerId}`, {
            id: ledgerId,
            userId: report.userId,
            amount: report.points,
            source: `report:${id}`,
            type: 'report_verified',
            timestamp: new Date().toISOString()
          });
        }
        reportUser.updatedAt = new Date().toISOString();
        await kv.set(`user:${report.userId}`, reportUser);
      }
    }

    return c.json({ success: true, report });
  } catch (error) {
    console.error('Verify report error:', error);
    return c.json({ error: 'Failed to verify report' }, 500);
  }
});

// ==================== GAMIFICATION ROUTES ====================

// Get leaderboard
app.get("/make-server-32aa5c5c/leaderboard", async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const kecamatan = c.req.query('kecamatan');
    
    let users = await kv.getByPrefix('user:');
    
    // Filter by kecamatan if specified
    if (kecamatan) {
      users = users.filter((u: any) => u.kecamatan === kecamatan);
    }
    
    // Sort by points descending
    users.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));
    
    // Take top N
    users = users.slice(0, limit);
    
    return c.json({ leaderboard: users });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return c.json({ error: 'Failed to fetch leaderboard' }, 500);
  }
});

// Award badge
app.post("/make-server-32aa5c5c/badges/award", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const isAdmin = authHeader?.startsWith('Bearer admin-');
    
    if (!isAdmin) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const body = await c.req.json();
    const { userId, badgeId, badgeName, badgeDescription } = body;

    if (!userId || !badgeId) {
      return c.json({ error: 'userId and badgeId are required' }, 400);
    }

    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if badge already awarded
    user.badges = user.badges || [];
    if (user.badges.some((b: any) => b.id === badgeId)) {
      return c.json({ error: 'Badge already awarded' }, 400);
    }

    // Add badge
    user.badges.push({
      id: badgeId,
      name: badgeName,
      description: badgeDescription,
      awardedAt: new Date().toISOString()
    });

    await kv.set(`user:${userId}`, user);

    return c.json({ success: true, user });
  } catch (error) {
    console.error('Award badge error:', error);
    return c.json({ error: 'Failed to award badge' }, 500);
  }
});

// ==================== HELPER FUNCTIONS ====================

function calculateLevel(points: number): number {
  if (points >= 2001) return 7;
  if (points >= 1001) return 6;
  if (points >= 601) return 5;
  if (points >= 301) return 4;
  if (points >= 151) return 3;
  if (points >= 51) return 2;
  return 1;
}

function getLevelName(level: number): string {
  const levels = [
    'Pendatang Baru',
    'Tetangga Baik',
    'Warga Aktif',
    'Tokoh Masyarakat',
    'Pahlawan Kampung',
    'Sesepuh Digital',
    'Legend Kampung'
  ];
  return levels[level - 1] || 'Pendatang Baru';
}

// Health check endpoint
app.get("/make-server-32aa5c5c/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
