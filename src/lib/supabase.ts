/**
 * Supabase Real-Time Sync & Backup Bridge
 * Coordinates with the provided Rest API and publishable keys.
 */

import { UserProfile, Habit, FocusSession } from '../types';

const SUPABASE_BASE_URL = 'https://poikqxvsbohbfgpuiveq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2d2LQYvMFpj3Yxb9ifJSPQ_u1zAhXW7';
const TABLE_PATH = '/rest/v1/Futuristic Habit Tracker';

interface SyncPayload {
  [key: string]: any;
}

// Sniff available columns from OpenAPI or lookups
let cachedColumns: string[] | null = null;

async function fetchTableColumns(): Promise<string[] | null> {
  if (cachedColumns) return cachedColumns;
  try {
    const res = await fetch(`${SUPABASE_BASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
      },
    });
    if (!res.ok) return null;
    const spec = await res.json();
    
    // Sniff specification
    const definitions = spec?.definitions;
    if (definitions) {
      const tableDef = definitions['Futuristic Habit Tracker'] || definitions['Futuristic%20Habit%20Tracker'];
      if (tableDef && tableDef.properties) {
        cachedColumns = Object.keys(tableDef.properties);
        console.log('[Supabase Sync] Sniffed valid columns:', cachedColumns);
        return cachedColumns;
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] Unable to fetch OpenAPI spec, falling back to dynamic self-healing retry block:', err);
  }
  return null;
}

/**
 * Searches for an existing user record in Supabase by uid or email.
 */
export async function findSupabaseRecord(uid: string, email?: string): Promise<{ exists: boolean; rowId?: any; data?: any; tableColumns?: string[] }> {
  const columns = await fetchTableColumns();
  
  // Attempt search
  const filtersOfChoice = [];
  if (uid) {
    filtersOfChoice.push(`uid=eq.${uid}`);
  }
  if (email) {
    filtersOfChoice.push(`email=eq.${email}`);
  }

  for (const filter of filtersOfChoice) {
    try {
      const url = `${SUPABASE_BASE_URL}${TABLE_PATH}?${filter}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const row = rows[0];
          // Sniff columns directly from the active row keys!
          const activeKeys = Object.keys(row);
          if (!cachedColumns) {
            cachedColumns = activeKeys;
          }
          const rowId = row.id || row.uid || row.user_id || row.email;
          return { exists: true, rowId, data: row, tableColumns: activeKeys };
        }
      }
    } catch (e) {
      console.error('[Supabase Sync] Query filter failure:', filter, e);
    }
  }

  return { exists: false, tableColumns: columns || undefined };
}

/**
 * Main Save/Backup command. Handles all sync options and payload generation.
 */
export async function syncToSupabase(
  uid: string,
  profile: UserProfile,
  habits: Habit[],
  focusSessions: FocusSession[]
): Promise<boolean> {
  if (!uid || uid === 'sandbox-user-id') {
    // If guest is offline but has set their google credentials, sync by that!
    const savedEmail = localStorage.getItem('google_sync_email');
    if (!savedEmail) return false;
  }

  const email = profile.email || localStorage.getItem('google_sync_email') || 'sandbox@example.com';
  const name = profile.displayName || localStorage.getItem('google_sync_name') || 'Google User';

  const { exists, rowId, tableColumns } = await findSupabaseRecord(uid, email);

  // Initialize heavy redundancy payload to match any arbitrary column setup safely
  let payload: SyncPayload = {
    // Standard names
    uid: uid,
    id: uid,
    user_id: uid,
    userId: uid,
    email: email,
    display_name: name,
    displayName: name,
    xp: profile.xp,
    level: profile.level,
    achievements: JSON.stringify(profile.achievements),
    
    // Complete data objects
    profile: JSON.stringify(profile),
    habits: JSON.stringify(habits),
    focus_sessions: JSON.stringify(focusSessions),
    focusSessions: JSON.stringify(focusSessions),
    
    // Generic backup payloads
    data: JSON.stringify({ profile, habits, focusSessions }),
    
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If tableColumns were sniffed, proactively prune payload to match only schema definitions to avoid 400 bad requests
  if (tableColumns && tableColumns.length > 0) {
    const cleanedPayload: SyncPayload = {};
    for (const key of Object.keys(payload)) {
      if (tableColumns.includes(key)) {
        cleanedPayload[key] = payload[key];
      }
    }
    // Make sure we have at least schema keys
    if (Object.keys(cleanedPayload).length > 0) {
      payload = cleanedPayload;
    }
  }

  // Determine method & query url
  let url = `${SUPABASE_BASE_URL}${TABLE_PATH}`;
  let method = 'POST';

  if (exists) {
    method = 'PATCH';
    // Use whatever identifier is active
    if (rowId) {
      if (payload.uid) {
        url += `?uid=eq.${uid}`;
      } else if (payload.id) {
        url += `?id=eq.${rowId}`;
      } else if (payload.email) {
        url += `?email=eq.${email}`;
      } else {
        url += `?uid=eq.${uid}`;
      }
    } else {
      url += `?uid=eq.${uid}`;
    }
  }

  let attempts = 0;
  while (attempts < 12) {
    try {
      const headers: HeadersInit = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      };
      
      if (method === 'PATCH') {
        headers['Prefer'] = 'return=representation';
      }

      console.log(`[Supabase Sync] Pushing telemetry. Method: ${method}, Url: ${url}`);
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('[Supabase Sync] TELEMETRY COORDINATES PERFECTLY LOCKED IN SUPABASE DEV ENDPOINT!');
        return true;
      }

      const err = await res.json();
      console.warn('[Supabase Sync] Response failure payload:', err);

      // Handle Postgrest undefined column: "column 'x' does not exist"
      if (err && err.message && (err.message.includes('does not exist') || err.message.includes('column'))) {
        const match = err.message.match(/column "([^"]+)"/);
        const columnNotFound = match ? match[1] : null;

        if (columnNotFound && columnNotFound in payload) {
          console.warn(`[Supabase Sync] Pruning schema field not matching db columns: "${columnNotFound}". Retrying...`);
          delete payload[columnNotFound];
          attempts++;
          continue;
        } else {
          // Scrape other possible parameters in the error
          const genericParts = err.message.split(' ');
          let foundPrune = false;
          for (const word of genericParts) {
            const cleanWord = word.replace(/"/g, '').trim();
            if (cleanWord && cleanWord in payload) {
              delete payload[cleanWord];
              foundPrune = true;
            }
          }
          if (foundPrune) {
            attempts++;
            continue;
          }
        }
      }

      // If PATCH failed because identifier was mismatch, fallback to POST
      if (method === 'PATCH') {
        console.info('[Supabase Sync] PATCH handshake failed, trying fallback to clean POST registration...');
        method = 'POST';
        url = `${SUPABASE_BASE_URL}${TABLE_PATH}`;
        attempts++;
        continue;
      }

      throw new Error(err.message || 'Supabase Server connection rejected');
    } catch (e) {
      console.error('[Supabase Sync] Execution handshake halted:', e);
      break;
    }
  }

  return false;
}

/**
 * Downloads profile, habits, and focus history from Supabase if they exist.
 */
export async function downloadFromSupabase(uid: string, email?: string): Promise<{
  profile?: UserProfile;
  habits?: Habit[];
  focusSessions?: FocusSession[];
} | null> {
  const { exists, data } = await findSupabaseRecord(uid, email);
  if (!exists || !data) return null;

  try {
    let profile: UserProfile | undefined;
    let habits: Habit[] | undefined;
    let focusSessions: FocusSession[] | undefined;

    // 1. Try generic heavy container object "data"
    if (data.data) {
      try {
        const parsed = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        if (parsed.profile) profile = parsed.profile;
        if (parsed.habits) habits = parsed.habits;
        if (parsed.focusSessions) focusSessions = parsed.focusSessions;
      } catch (e) {
        console.warn('[Supabase Sync] Skip data block parsing.');
      }
    }

    // 2. Try discrete columns
    if (!profile && data.profile) {
      try {
        profile = typeof data.profile === 'string' ? JSON.parse(data.profile) : data.profile;
      } catch (e) {}
    }
    
    if (!habits && data.habits) {
      try {
        habits = typeof data.habits === 'string' ? JSON.parse(data.habits) : data.habits;
      } catch (e) {}
    }

    if (!focusSessions && (data.focus_sessions || data.focusSessions)) {
      try {
        const focusField = data.focus_sessions || data.focusSessions;
        focusSessions = typeof focusField === 'string' ? JSON.parse(focusField) : focusField;
      } catch (e) {}
    }

    // 3. Fallback to assembling individual properties if profile column isn't found but standard ones exist
    if (!profile && (data.xp !== undefined || data.level !== undefined)) {
      profile = {
        uid: uid || data.uid || data.id || 'sandbox-user-id',
        email: email || data.email || 'sandbox@example.com',
        displayName: data.display_name || data.displayName || 'Google User',
        photoURL: data.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
        xp: typeof data.xp === 'number' ? data.xp : (data.xp ? parseInt(data.xp) : 150),
        level: typeof data.level === 'number' ? data.level : (data.level ? parseInt(data.level) : 1),
        achievements: data.achievements ? (typeof data.achievements === 'string' ? JSON.parse(data.achievements) : data.achievements) : ['first_steps'],
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        updatedAt: data.updated_at || data.updatedAt || new Date().toISOString(),
      };
    }

    if (profile || habits || focusSessions) {
      console.log('[Supabase Sync] SUCCESSFULLY RETRIEVED TRACKER STATE FROM SUPABASE:', {
        profile: !!profile,
        habitsCount: habits?.length,
        sessionsCount: focusSessions?.length
      });
      return { profile, habits, focusSessions };
    }
  } catch (err) {
    console.error('[Supabase Sync] Recovery unpacking error:', err);
  }

  return null;
}
