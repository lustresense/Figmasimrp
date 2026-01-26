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

// ==================== AUTHENTICATION ROUTES ====================

// Sign up endpoint - Admin creates user with auto-confirm
app.post("/make-server-32aa5c5c/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, nik, kecamatan, kelurahan, kodepos, rw } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = getSupabaseAdmin();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: {
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
    });

    if (authError) {
      console.log(`Sign up error: ${authError.message}`);
      return c.json({ error: `Failed to create user: ${authError.message}` }, 400);
    }

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

// Admin login endpoint (bypass Internet Identity)
app.post("/make-server-32aa5c5c/auth/admin-login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    // Simple admin check (in production, use proper credential verification)
    if (username === 'admin' && password === 'admin') {
      // Generate a simple admin session token
      const adminToken = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store admin session
      await kv.set(`session:admin:${adminToken}`, {
        username: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      return c.json({
        success: true,
        token: adminToken,
        user: {
          username: 'admin',
          role: 'admin',
          name: 'Administrator'
        }
      });
    }

    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ error: 'Internal server error during admin login' }, 500);
  }
});

// Get current user info
app.get("/make-server-32aa5c5c/auth/me", async (c) => {
  const authHeader = c.req.header('Authorization');
  
  // Check if it's admin token
  if (authHeader?.startsWith('Bearer admin-')) {
    const token = authHeader.split(' ')[1];
    const session = await kv.get(`session:admin:${token}`);
    
    if (session) {
      return c.json({
        user: {
          username: 'admin',
          role: 'admin',
          name: 'Administrator'
        }
      });
    }
  }

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
    const users = await kv.getByPrefix('user:');
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
    const { error, userId } = await verifyUser(authHeader);

    // Allow if user is updating their own profile or if admin
    const isAdmin = authHeader?.startsWith('Bearer admin-');
    if (!isAdmin && userId !== id) {
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

// ==================== EVENT MANAGEMENT ROUTES ====================

// Create event
app.post("/make-server-32aa5c5c/events", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error, userId } = await verifyUser(authHeader);

    if (error) {
      return c.json({ error }, 401);
    }

    const body = await c.req.json();
    const { title, description, pillar, date, time, location, basePoints, participants, organizer } = body;

    if (!title || !pillar || !date) {
      return c.json({ error: 'Title, pillar, and date are required' }, 400);
    }

    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      id: eventId,
      title,
      description: description || '',
      pillar,
      date,
      time: time || '',
      location: location || '',
      basePoints: basePoints || 10,
      participants: participants || [],
      organizer: organizer || '',
      createdBy: userId,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

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
    
    let events = await kv.getByPrefix('event:');
    
    // Filter by pillar if specified
    if (pillar) {
      events = events.filter((e: any) => e.pillar === parseInt(pillar));
    }
    
    // Filter by status if specified
    if (status) {
      events = events.filter((e: any) => e.status === status);
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

// Join event (RSVP)
app.post("/make-server-32aa5c5c/events/:id/join", async (c) => {
  try {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    const { error, userId } = await verifyUser(authHeader);

    if (error) {
      return c.json({ error }, 401);
    }

    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // Check if already joined
    if (event.participants && event.participants.includes(userId)) {
      return c.json({ error: 'Already joined this event' }, 400);
    }

    // Add user to participants
    event.participants = event.participants || [];
    event.participants.push(userId);
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
    const { error, userId } = await verifyUser(authHeader);

    if (error) {
      return c.json({ error }, 401);
    }

    const body = await c.req.json();
    const { eventId, photoUrl, participants, outcomeTags, location, isOfflineSubmission } = body;

    if (!photoUrl) {
      return c.json({ error: 'Photo is required' }, 400);
    }

    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const report = {
      id: reportId,
      userId,
      eventId: eventId || '',
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

    // Set auto-verify timer (3 days)
    await kv.set(`report:autoVerify:${reportId}`, {
      reportId,
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    });

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

    // Check admin auth
    const isAdmin = authHeader?.startsWith('Bearer admin-');
    if (!isAdmin) {
      const { error } = await verifyUser(authHeader);
      if (error) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
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
    if (approved && report.userId) {
      const user = await kv.get(`user:${report.userId}`);
      if (user) {
        user.points = (user.points || 0) + report.points;
        
        // Update level based on points
        user.level = calculateLevel(user.points);
        user.levelName = getLevelName(user.level);
        
        await kv.set(`user:${report.userId}`, user);

        // Create points ledger entry
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
    }

    // Remove auto-verify timer
    await kv.del(`report:autoVerify:${id}`);

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
