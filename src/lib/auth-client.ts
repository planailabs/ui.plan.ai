import { getBrowserClient } from './supabase';

export async function sendEmailOtp(email: string, turnstileToken: string): Promise<void> {
  const supabase = getBrowserClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { captchaToken: turnstileToken, shouldCreateUser: false },
  });
  if (error) throw error;
}

export async function verifyEmailOtp(email: string, token: string): Promise<void> {
  const supabase = getBrowserClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw error;
}

export async function challengeMfa(): Promise<{ factorId: string; challengeId: string } | null> {
  const supabase = getBrowserClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { data: factors, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  const totp = factors.totp?.find((f) => f.status === 'verified');
  if (!totp) return null;
  const { data, error: chErr } = await supabase.auth.mfa.challenge({ factorId: totp.id });
  if (chErr) throw chErr;
  return { factorId: totp.id, challengeId: data.id };
}

export async function verifyMfa(factorId: string, challengeId: string, code: string): Promise<void> {
  const supabase = getBrowserClient();
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const supabase = getBrowserClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function requireSession(redirectTo = '/workbench/login/'): Promise<void> {
  const supabase = getBrowserClient();
  if (!supabase) {
    window.location.replace('/');
    return;
  }
  const { data } = await supabase.auth.getSession();
  if (!data.session) window.location.replace(redirectTo);
}
