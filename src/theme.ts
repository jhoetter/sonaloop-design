/**
 * sonaloop-design — the shared theme hook.
 *
 * One `useTheme()` for every React surface, replacing the per-app copies. The localStorage
 * key 'persona-theme' stores the user's PREFERENCE ('light' | 'dark' | 'system'); the hook
 * resolves 'system' against the OS (`prefers-color-scheme`, live via matchMedia) and writes
 * the RESOLVED theme to `<html data-theme>` — which the --sl-* tokens key off. SSR-safe:
 * window/document access is guarded, so the server renders the defaults.
 *
 * Pairs with <ThemeToggle> (components.tsx), which is presentational:
 *   const { preference, setPreference } = useTheme();
 *   <ThemeToggle value={preference} onChange={setPreference} />
 */
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

// Same storage key across the Sonaloop ecosystem, so the theme follows the user between apps.
const KEY = 'persona-theme';
const QUERY = '(prefers-color-scheme: dark)';

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

function initialPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export interface UseTheme {
  /** The resolved color scheme — 'system' collapsed against the OS. */
  theme: Theme;
  /** What the user chose — may be 'system'. Plug into <ThemeToggle value={…}>. */
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  /** Sugar for `setPreference` with an explicit theme. */
  setTheme: (t: Theme) => void;
  /** Flip the resolved theme to its opposite EXPLICIT preference (leaves 'system'). */
  toggle: () => void;
}

export function useTheme(): UseTheme {
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const [system, setSystem] = useState<Theme>(systemTheme);

  // Track the OS scheme while the preference is 'system'.
  useEffect(() => {
    if (typeof window === 'undefined' || preference !== 'system') return;
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? 'dark' : 'light');
    setSystem(mq.matches ? 'dark' : 'light'); // re-sync: the OS may have flipped while unsubscribed
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const theme: Theme = preference === 'system' ? system : preference;

  // Apply the resolved theme; persist the preference.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, preference); } catch { /* storage unavailable */ }
  }, [theme, preference]);

  const setTheme = useCallback((t: Theme) => setPreference(t), []);
  const toggle = useCallback(() => setPreference(theme === 'dark' ? 'light' : 'dark'), [theme]);

  return { theme, preference, setPreference, setTheme, toggle };
}
