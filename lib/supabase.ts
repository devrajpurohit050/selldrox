import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseClient() {
  if (!url || !anonKey) {
    return null;
  }

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export async function isOAuthProviderEnabled(provider: 'google' | 'apple') {
  if (!url || !anonKey) {
    throw new Error('Supabase is not connected. Configure the project URL and public API key first.');
  }

  const response = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: anonKey },
  });

  if (!response.ok) {
    throw new Error(`Unable to check Supabase ${provider} sign-in settings (${response.status}).`);
  }

  const settings: { external?: Record<string, boolean | undefined> } = await response.json();
  return settings.external?.[provider] === true;
}

export function getSupabaseAdminClient() {
  if (!url || !serviceKey) {
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
