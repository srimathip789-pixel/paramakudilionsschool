import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Return a dummy client in case environment variables are missing during initial setup or build
    return {} as any;
  }

  return createBrowserClient(url, anonKey, {
    cookieOptions: {
      maxAge: 3153600000, // 100 years for "unlimited" session
    },
  });
};
