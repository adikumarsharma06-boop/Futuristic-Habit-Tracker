/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, where, getDocFromServer, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Habit, UserProfile, FocusSession, HabitNote } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Firestore Error Types as mandated by Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global references
let firebaseApp;
export let auth: any = null;
export let db: any = null;
export let isOfflineMode = true;

// Initialize Firebase with safety guard
try {
  const containsMock = firebaseConfig.isMock || firebaseConfig.apiKey.includes('MOCK') || firebaseConfig.apiKey === '';
  
  if (!containsMock && getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(firebaseApp);
    isOfflineMode = false;
    console.log("Firebase initialized successfully in online mode.");
  } else if (getApps().length > 0) {
    firebaseApp = getApp();
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(firebaseApp);
    isOfflineMode = false;
  } else {
    console.warn("Firebase config is mock/placeholder. Falling back to Local Sandbox Mode.");
  }
} catch (error) {
  console.error("Firebase initialization failed, operating in Local Sandbox Mode:", error);
  isOfflineMode = true;
}

// Mandatory connection test
async function testConnection() {
  if (isOfflineMode || !db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Client is offline.");
    }
  }
}
testConnection();

// Standard Error Handler conforming precisely to the mandatory Firebase Blueprint schema
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to convert client-side state models (using ISO strings) to firestore documents (using native Firestore Timestamps)
export function toFirestoreData(data: any, isCreate = false) {
  if (!data) return null;
  const result = { ...data };
  
  // Convert timestamps
  if ('createdAt' in result) {
    if (isCreate) {
      result.createdAt = serverTimestamp();
    } else if (result.createdAt) {
      result.createdAt = Timestamp.fromDate(new Date(result.createdAt));
    }
  }
  
  if ('updatedAt' in result) {
    result.updatedAt = serverTimestamp();
  }
  
  if ('completedAt' in result && result.completedAt) {
    result.completedAt = Timestamp.fromDate(new Date(result.completedAt));
  }
  
  return result;
}

// Helper to convert firestore document fields back to clean client-side state models
export function fromFirestoreData(data: any): any {
  if (!data) return null;
  const result = { ...data };
  
  // Convert firebase Timestamps back to ISO strings for application state
  if (result.createdAt instanceof Timestamp) {
    result.createdAt = result.createdAt.toDate().toISOString();
  } else if (result.createdAt && typeof result.createdAt.toDate === 'function') {
    result.createdAt = result.createdAt.toDate().toISOString();
  }
  
  if (result.updatedAt instanceof Timestamp) {
    result.updatedAt = result.updatedAt.toDate().toISOString();
  } else if (result.updatedAt && typeof result.updatedAt.toDate === 'function') {
    result.updatedAt = result.updatedAt.toDate().toISOString();
  }
  
  if (result.completedAt instanceof Timestamp) {
    result.completedAt = result.completedAt.toDate().toISOString();
  } else if (result.completedAt && typeof result.completedAt.toDate === 'function') {
    result.completedAt = result.completedAt.toDate().toISOString();
  }
  
  return result;
}

// Password reset functionality
export async function resetPassword(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (isOfflineMode || !auth) {
    console.log("Mock password reset email sent in Sandbox Mode.");
    const existingUsers = JSON.parse(localStorage.getItem('sandbox_users') || '{}');
    if (!existingUsers[cleanEmail] && cleanEmail !== 'sandbox@example.com') {
      const err = new Error("No account associated with this email in sandbox mode.");
      (err as any).code = 'auth/user-not-found';
      throw err;
    }
    return; // mock success
  }
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw error;
  }
}

// LOCAL STORAGE UTILITIES FOR THE SANDBOX FALLBACK
const LOCAL_KEYS = {
  HABITS: 'habits', // Matches user's exact key
  PROFILE: 'futuristic_profile',
  FOCUS: 'futuristic_focus_sessions',
};

// Conversion Adapters between Simple Habit schema and Premium Habit schema
export function upgradeHabit(h: any): Habit {
  const todayStr = new Date().toISOString().split('T')[0];
  let completedDates: string[] = [];
  if (Array.isArray(h.completedDates)) {
    completedDates = h.completedDates;
  } else if (h.completed) {
    completedDates = [todayStr];
  }
  
  return {
    id: String(h.id),
    userId: h.userId || 'sandbox-user-id',
    name: h.name || 'Unnamed Habit',
    description: h.description || '',
    category: h.category || 'mind',
    icon: h.icon || 'Sparkles',
    completedDates,
    notes: h.notes || [],
    streak: typeof h.streak === 'number' ? h.streak : 0,
    longestStreak: typeof h.longestStreak === 'number' ? h.longestStreak : (typeof h.streak === 'number' ? h.streak : 0),
    createdAt: h.createdAt || new Date().toISOString(),
    updatedAt: h.updatedAt || new Date().toISOString(),
  };
}

export function downgradeHabit(h: Habit): any {
  const todayStr = new Date().toISOString().split('T')[0];
  return {
    ...h,
    completed: h.completedDates.includes(todayStr),
  };
}

// Default User Profile for Sandbox
const DEFAULT_SANDBOX_USER: UserProfile = {
  uid: 'sandbox-user-id',
  email: 'sandbox@example.com',
  displayName: 'Futuristic Explorer',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  xp: 150,
  level: 1,
  achievements: ['first_steps'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_SANDBOX_HABITS: Habit[] = [
  {
    id: 'h1',
    userId: 'sandbox-user-id',
    name: 'Diaphragmatic Deep Breathing',
    description: 'Breathe in for 4s, hold for 4s, exhale for 4s to trigger parasympathetic calm.',
    category: 'mind',
    icon: 'Brain',
    streak: 3,
    longestStreak: 5,
    completedDates: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    notes: [
      { id: 'n1', date: new Date().toISOString().split('T')[0], text: 'Felt highly centered afterward.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'h2',
    userId: 'sandbox-user-id',
    name: 'Cardio Core Training',
    description: 'High-intensity interval training for stamina and endorphin release.',
    category: 'fitness',
    icon: 'Dumbbell',
    streak: 0,
    longestStreak: 2,
    completedDates: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    ],
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'h3',
    userId: 'sandbox-user-id',
    name: 'Technical Node Refactoring',
    description: 'Review system design, refactor core types, and clean file imports.',
    category: 'work',
    icon: 'Code2',
    streak: 1,
    longestStreak: 12,
    completedDates: [
      new Date().toISOString().split('T')[0],
    ],
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// INITIAL DATA INJECTORS
if (!localStorage.getItem(LOCAL_KEYS.PROFILE)) {
  localStorage.setItem(LOCAL_KEYS.PROFILE, JSON.stringify(DEFAULT_SANDBOX_USER));
}
if (!localStorage.getItem(LOCAL_KEYS.HABITS)) {
  localStorage.setItem(LOCAL_KEYS.HABITS, JSON.stringify(DEFAULT_SANDBOX_HABITS));
}
if (!localStorage.getItem(LOCAL_KEYS.FOCUS)) {
  localStorage.setItem(LOCAL_KEYS.FOCUS, JSON.stringify([]));
}

// SIGN-IN WRAPPERS
export async function signInWithGoogle(): Promise<UserProfile | null> {
  if (isOfflineMode || !auth) {
    console.log("Mock sign-in triggered due to Sandbox Mode.");
    const sandboxProfile = JSON.parse(localStorage.getItem(LOCAL_KEYS.PROFILE) || JSON.stringify(DEFAULT_SANDBOX_USER));
    return sandboxProfile;
  }
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if profile exists; if not, create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      return fromFirestoreData(userDocSnap.data()) as UserProfile;
    } else {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Explorer',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop',
        xp: 0,
        level: 1,
        achievements: ['welcome_badge'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, toFirestoreData(newProfile, true));
      return newProfile;
    }
  } catch (error) {
    console.error("Sign in with Google error:", error);
    return null;
  }
}

export async function registerWithEmail(email: string, password: string, displayName: string): Promise<UserProfile | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (isOfflineMode || !auth) {
    console.log("Mock registration triggered due to Sandbox Mode.");
    const mockUid = 'sandbox-' + Math.random().toString(36).substr(2, 9);
    const newProfile: UserProfile = {
      uid: mockUid,
      email: cleanEmail,
      displayName: displayName || email.split('@')[0],
      photoURL: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop`,
      xp: 0,
      level: 1,
      achievements: ['welcome_badge'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to sandbox credentials
    const existingUsers = JSON.parse(localStorage.getItem('sandbox_users') || '{}');
    if (existingUsers[cleanEmail]) {
      throw new Error("auth/email-already-in-use");
    }
    existingUsers[cleanEmail] = { password, profile: newProfile };
    localStorage.setItem('sandbox_users', JSON.stringify(existingUsers));
    
    // Set active profile and trigger reload
    localStorage.setItem(LOCAL_KEYS.PROFILE, JSON.stringify(newProfile));
    
    // Setup initial empty lists for habits and focus sessions for this newly created account
    localStorage.setItem(LOCAL_KEYS.HABITS, JSON.stringify(DEFAULT_SANDBOX_HABITS.map(h => ({ ...h, id: 'h_' + Math.random().toString(36).substr(2, 9), userId: mockUid }))));
    localStorage.setItem(LOCAL_KEYS.FOCUS, JSON.stringify([]));
    
    window.dispatchEvent(new Event('storage_profile_updated'));
    window.dispatchEvent(new Event('storage_habits_updated'));
    window.dispatchEvent(new Event('storage_focus_updated'));
    return newProfile;
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await updateProfile(user, { displayName });
    
    const userDocRef = doc(db, 'users', user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName || user.displayName || email.split('@')[0],
      photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop',
      xp: 0,
      level: 1,
      achievements: ['welcome_badge'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, toFirestoreData(newProfile, true));
    return newProfile;
  } catch (error: any) {
    console.error("Register with email error:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<UserProfile | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (isOfflineMode || !auth) {
    console.log("Mock sign-in with email triggered due to Sandbox Mode.");
    const existingUsers = JSON.parse(localStorage.getItem('sandbox_users') || '{}');
    const record = existingUsers[cleanEmail];
    if (record) {
      if (record.password === password) {
        localStorage.setItem(LOCAL_KEYS.PROFILE, JSON.stringify(record.profile));
        
        // Setup initial default habits if not present for this user
        const storedHabits = localStorage.getItem(LOCAL_KEYS.HABITS);
        if (!storedHabits || JSON.parse(storedHabits).length === 0) {
          localStorage.setItem(LOCAL_KEYS.HABITS, JSON.stringify(DEFAULT_SANDBOX_HABITS.map(h => ({ ...h, userId: record.profile.uid }))));
        }
        
        window.dispatchEvent(new Event('storage_profile_updated'));
        window.dispatchEvent(new Event('storage_habits_updated'));
        window.dispatchEvent(new Event('storage_focus_updated'));
        return record.profile;
      } else {
        const err = new Error("Wrong password entered.");
        (err as any).code = 'auth/wrong-password';
        throw err;
      }
    } else {
      const err = new Error("No account associated with this email.");
      (err as any).code = 'auth/user-not-found';
      throw err;
    }
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return fromFirestoreData(userDocSnap.data()) as UserProfile;
    } else {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop',
        xp: 0,
        level: 1,
        achievements: ['welcome_badge'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, toFirestoreData(newProfile, true));
      return newProfile;
    }
  } catch (error: any) {
    console.error("Sign in with email error:", error);
    throw error;
  }
}

export async function signOutFromApp(): Promise<void> {
  if (isOfflineMode || !auth) {
    console.log("Mock sign-out triggered");
    localStorage.removeItem(LOCAL_KEYS.PROFILE);
    localStorage.removeItem(LOCAL_KEYS.HABITS);
    localStorage.removeItem(LOCAL_KEYS.FOCUS);
    
    window.dispatchEvent(new Event('storage_profile_updated'));
    window.dispatchEvent(new Event('storage_habits_updated'));
    window.dispatchEvent(new Event('storage_focus_updated'));
    return;
  }
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Firebase Signout error:", error);
  }
}

// MAIN DATA BRIDGE SERVICE OBJECT
export const dbService = {
  // USER PROFILES
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (isOfflineMode || userId === 'sandbox-user-id') {
      const stored = localStorage.getItem(LOCAL_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : DEFAULT_SANDBOX_USER;
    }
    const path = `users/${userId}`;
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        return fromFirestoreData(docSnap.data()) as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (isOfflineMode || profile.uid === 'sandbox-user-id') {
      localStorage.setItem(LOCAL_KEYS.PROFILE, JSON.stringify(profile));
      // Dispatch storage event to trigger cross tab / context sync
      window.dispatchEvent(new Event('storage_profile_updated'));
      return;
    }
    const path = `users/${profile.uid}`;
    try {
      const firestoreDoc = toFirestoreData({
        ...profile,
        updatedAt: new Date().toISOString()
      }, false);
      await setDoc(doc(db, 'users', profile.uid), firestoreDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // HABITS CRUD
  async getHabits(userId: string): Promise<Habit[]> {
    if (isOfflineMode || userId === 'sandbox-user-id') {
      const stored = localStorage.getItem(LOCAL_KEYS.HABITS);
      if (!stored) return [];
      try {
        const raw = JSON.parse(stored);
        if (Array.isArray(raw)) {
          return raw.map(upgradeHabit);
        }
      } catch (e) {
        console.error("Failed to parse habits", e);
      }
      return [];
    }
    const path = `users/${userId}/habits`;
    try {
      const q = query(collection(db, 'users', userId, 'habits'));
      const querySnap = await getDocs(q);
      const output: Habit[] = [];
      querySnap.forEach((docSnap) => {
        output.push(upgradeHabit(fromFirestoreData(docSnap.data())));
      });
      return output;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addHabit(userId: string, habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    // Generate valid id that matches standard format
    const freshId = 'habit_' + Date.now() + Math.random().toString(36).substr(2, 4);
    const newHabit: Habit = {
      ...habit,
      id: freshId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isOfflineMode || userId === 'sandbox-user-id') {
      const habits = await this.getHabits(userId);
      habits.push(newHabit);
      const downgraded = habits.map(downgradeHabit);
      localStorage.setItem(LOCAL_KEYS.HABITS, JSON.stringify(downgraded));
      window.dispatchEvent(new Event('storage_habits_updated'));
      return newHabit;
    }

    const path = `users/${userId}/habits/${freshId}`;
    try {
      const firestoreDoc = toFirestoreData(downgradeHabit(newHabit), true);
      await setDoc(doc(db, 'users', userId, 'habits', freshId), firestoreDoc);
      return newHabit;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return newHabit;
    }
  },

  async updateHabit(userId: string, habit: Habit): Promise<void> {
    const updatedHabit = {
      ...habit,
      updatedAt: new Date().toISOString()
    };

    if (isOfflineMode || userId === 'sandbox-user-id') {
      const habits = await this.getHabits(userId);
      const updated = habits.map(h => h.id === habit.id ? updatedHabit : h);
      const downgraded = updated.map(downgradeHabit);
      localStorage.setItem(LOCAL_KEYS.HABITS, JSON.stringify(downgraded));
      window.dispatchEvent(new Event('storage_habits_updated'));
      return;
    }

    const path = `users/${userId}/habits/${habit.id}`;
    try {
      const firestoreDoc = toFirestoreData(downgradeHabit(updatedHabit), false);
      await setDoc(doc(db, 'users', userId, 'habits', habit.id), firestoreDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteHabit(userId: string, habitId: string): Promise<void> {
    if (isOfflineMode || userId === 'sandbox-user-id') {
      const habits = await this.getHabits(userId);
      const filtered = habits.filter(h => h.id !== habitId);
      const downgraded = filtered.map(downgradeHabit);
      localStorage.setItem(LOCAL_KEYS.HABITS, JSON.stringify(downgraded));
      window.dispatchEvent(new Event('storage_habits_updated'));
      return;
    }

    const path = `users/${userId}/habits/${habitId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // FOCUS SESSIONS
  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    if (isOfflineMode || userId === 'sandbox-user-id') {
      const stored = localStorage.getItem(LOCAL_KEYS.FOCUS);
      return stored ? JSON.parse(stored) : [];
    }
    const path = `users/${userId}/focusSessions`;
    try {
      const q = query(collection(db, 'users', userId, 'focusSessions'));
      const querySnap = await getDocs(q);
      const output: FocusSession[] = [];
      querySnap.forEach((docSnap) => {
        output.push(fromFirestoreData(docSnap.data()) as FocusSession);
      });
      return output.filter(Boolean); // Filter undefined
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async addFocusSession(userId: string, duration: number, category: string): Promise<FocusSession> {
    const freshId = 'session_' + Math.random().toString(36).substr(2, 9);
    const session: FocusSession = {
      id: freshId,
      userId,
      duration,
      category,
      completedAt: new Date().toISOString(),
    };

    if (isOfflineMode || userId === 'sandbox-user-id') {
      const sessions = await this.getFocusSessions(userId);
      sessions.push(session);
      localStorage.setItem(LOCAL_KEYS.FOCUS, JSON.stringify(sessions));
      window.dispatchEvent(new Event('storage_focus_updated'));
      return session;
    }

    const path = `users/${userId}/focusSessions/${freshId}`;
    try {
      const firestoreDoc = toFirestoreData(session, true);
      await setDoc(doc(db, 'users', userId, 'focusSessions', freshId), firestoreDoc);
      return session;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return session;
    }
  }
};
