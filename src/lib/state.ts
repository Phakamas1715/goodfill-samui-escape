import { useEffect, useState, useCallback, useRef } from "react";
import type { PersonaId } from "./data";

// ============================================================================
// Constants & Types
// ============================================================================

const KEY = "goodfill-care-state-v1";
const BACKUP_KEY = `${KEY}-backup`;
const VERSION = "1.0.0";

export interface AppState {
  version?: string;
  questAnswers: Record<number, number>;
  persona: PersonaId | null;
  secondaryPersona: PersonaId | null;
  credits: number;
  bookedProgramId: string | null;
  bookingDate: string | null;
  checkins: { date: string; mood: number; note?: string }[];
  habits: { name: string; days: string[] }[];
  aiInsight?: {
    summary?: string;
    strengths?: string[];
    focusAreas?: string[];
    dailyRitual?: string[];
    avoid?: string[];
  } | null;
  lastUpdated?: string;
  userPreferences?: {
    language?: "th" | "en";
    notificationsEnabled?: boolean;
    darkMode?: boolean;
  };
}

// Default habits
const DEFAULT_HABITS = [
  { name: "Morning meditation 5'", days: [] },
  { name: "Hydration 2L", days: [] },
  { name: "No screen after 10pm", days: [] },
];

const initial: AppState = {
  version: VERSION,
  questAnswers: {},
  persona: null,
  secondaryPersona: null,
  credits: 0,
  bookedProgramId: null,
  bookingDate: null,
  checkins: [],
  habits: DEFAULT_HABITS,
  aiInsight: null,
  lastUpdated: new Date().toISOString(),
  userPreferences: {
    language: "th",
    notificationsEnabled: true,
    darkMode: false,
  },
};

// ============================================================================
// Storage Helpers
// ============================================================================

function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function createBackup(state: AppState): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(
      BACKUP_KEY,
      JSON.stringify({
        ...state,
        backupCreatedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.warn("[AppState] Failed to create backup:", error);
  }
}

function restoreFromBackup(): AppState | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) return null;
    const parsed = JSON.parse(backup);
    // Check if backup is less than 7 days old
    const backupDate = new Date(parsed.backupCreatedAt);
    const daysOld = (Date.now() - backupDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld > 7) return null;
    return { ...initial, ...parsed };
  } catch {
    return null;
  }
}

function read(): AppState {
  if (!isLocalStorageAvailable()) return initial;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;

    const parsed = JSON.parse(raw) as Partial<AppState>;

    // Validate and merge with initial state
    const restored: AppState = {
      ...initial,
      ...parsed,
      // Ensure habits array exists and has correct structure
      habits: parsed.habits?.length ? parsed.habits : DEFAULT_HABITS,
      // Ensure checkins is an array
      checkins: parsed.checkins || [],
    };

    return restored;
  } catch (error) {
    console.error("[AppState] Failed to read state:", error);

    // Try to restore from backup
    const backup = restoreFromBackup();
    if (backup) {
      console.info("[AppState] Restored from backup");
      return backup;
    }

    return initial;
  }
}

// ============================================================================
// State Management
// ============================================================================

type StateUpdater = (s: AppState) => AppState;
type SetStateFunction = (updater: StateUpdater) => void;

const listeners = new Set<() => void>();
let cached: AppState | null = null;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function getState(): AppState {
  if (cached) return cached;
  cached = read();
  return cached;
}

function persistState(state: AppState): void {
  if (!isLocalStorageAvailable()) return;

  // Debounce saves to avoid excessive writes
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      // Create backup periodically (every 10 saves)
      const saveCount = parseInt(localStorage.getItem(`${KEY}-save-count`) || "0", 10);
      localStorage.setItem(`${KEY}-save-count`, String((saveCount + 1) % 10));
      if (saveCount === 0) {
        createBackup(state);
      }
    } catch (error) {
      console.error("[AppState] Failed to persist state:", error);
    }
    saveTimeout = null;
  }, 100);
}

function setState(updater: StateUpdater): void {
  const newState = updater(getState());
  // Update timestamp
  newState.lastUpdated = new Date().toISOString();
  cached = newState;
  persistState(newState);
  listeners.forEach((l) => l());
}

// ============================================================================
// Selectors
// ============================================================================

export function getTotalCreditsEarned(state: AppState): number {
  const checkinCredits = state.checkins.length * 20;
  const habitCredits = state.habits.reduce((sum, habit) => sum + habit.days.length * 5, 0);
  return state.credits + checkinCredits + habitCredits;
}

export function getCurrentStreak(state: AppState): number {
  return Math.max(...state.habits.map((h) => h.days.length), 0);
}

export function getTodayCheckin(state: AppState): { date: string; mood: number; note?: string } | undefined {
  const today = new Date().toISOString().slice(0, 10);
  return state.checkins.find((c) => c.date.slice(0, 10) === today);
}

export function getHabitCompletionRate(state: AppState, habitName: string): number {
  const habit = state.habits.find((h) => h.name === habitName);
  if (!habit) return 0;
  // Last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
  const completedCount = habit.days.filter((day) => last30Days.includes(day)).length;
  return Math.round((completedCount / 30) * 100);
}

// ============================================================================
// Actions
// ============================================================================

export function addCredits(state: AppState, amount: number): AppState {
  return { ...state, credits: state.credits + amount };
}

export function addCheckin(state: AppState, mood: number, note?: string): AppState {
  const today = new Date().toISOString();
  const existingIndex = state.checkins.findIndex((c) => c.date.slice(0, 10) === today.slice(0, 10));

  let newCheckins;
  if (existingIndex >= 0) {
    newCheckins = [...state.checkins];
    newCheckins[existingIndex] = { date: today, mood, note };
  } else {
    newCheckins = [...state.checkins, { date: today, mood, note }];
  }

  return { ...state, checkins: newCheckins, credits: state.credits + 20 };
}

export function toggleHabit(state: AppState, habitName: string): AppState {
  const today = new Date().toISOString().slice(0, 10);
  const habitIndex = state.habits.findIndex((h) => h.name === habitName);

  if (habitIndex === -1) return state;

  const habit = state.habits[habitIndex];
  const wasDone = habit.days.includes(today);
  const newDays = wasDone ? habit.days.filter((d) => d !== today) : [...habit.days, today];

  const newHabits = [...state.habits];
  newHabits[habitIndex] = { ...habit, days: newDays };

  const creditsChange = wasDone ? 0 : 5;

  return {
    ...state,
    habits: newHabits,
    credits: state.credits + creditsChange,
  };
}

export function resetState(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(`${KEY}-save-count`);
  }
  cached = null;
  setState(() => initial);
}

// ============================================================================
// React Hook
// ============================================================================

export function useAppState(): [AppState, SetStateFunction] {
  const [hydrated, setHydrated] = useState(false);
  const [, forceUpdate] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Initialize state
    cached = read();
    setHydrated(true);

    const listener = () => {
      if (mountedRef.current) {
        forceUpdate((x) => x + 1);
      }
    };

    listeners.add(listener);

    return () => {
      mountedRef.current = false;
      listeners.delete(listener);
    };
  }, []);

  // During SSR and first client render, return deterministic initial state
  const state = hydrated ? getState() : initial;

  const setStateCallback = useCallback((updater: StateUpdater) => {
    setState(updater);
  }, []);

  return [state, setStateCallback];
}

// ============================================================================
// Export utilities
// ============================================================================

export function exportState(): string {
  const state = getState();
  return JSON.stringify(state, null, 2);
}

export function importState(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<AppState>;
    setState(() => ({ ...initial, ...parsed }));
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(BACKUP_KEY);
  localStorage.removeItem(`${KEY}-save-count`);
  cached = null;
  setState(() => initial);
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  useAppState,
  resetState,
  exportState,
  importState,
  clearAllData,
  getTotalCreditsEarned,
  getCurrentStreak,
  getTodayCheckin,
  getHabitCompletionRate,
  addCredits,
  addCheckin,
  toggleHabit,
};
