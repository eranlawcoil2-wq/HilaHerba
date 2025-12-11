import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in various environments
const getEnvVar = (key: string): string => {
  // Check for Vite's import.meta.env
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  // Check for standard process.env (if polyfilled)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key] || '';
    }
  } catch (e) {
    // ignore error
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Key is missing. Check your .env file or environment configuration.");
}

// Initialize with values or dummy strings to prevent immediate crash during initialization.
// API calls will fail if keys are invalid, but the app will render.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);