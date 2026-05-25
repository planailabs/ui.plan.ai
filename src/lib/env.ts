export const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
export const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
export const PUBLIC_TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

export function isPlatformWired(): boolean {
  return Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY && PUBLIC_TURNSTILE_SITE_KEY);
}
