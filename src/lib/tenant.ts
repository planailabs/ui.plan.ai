import { getBrowserClient } from './supabase';

const STORAGE_KEY = 'ui.plan.ai:active_tenant_id';

export interface TenantSummary {
  tenant_id: string;
  role: 'owner' | 'admin' | 'member';
}

export async function listMyTenants(): Promise<TenantSummary[]> {
  const supabase = getBrowserClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tenant_members')
    .select('tenant_id, role');
  if (error || !data) return [];
  return data as TenantSummary[];
}

export async function getActiveTenantId(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    const cached = window.sessionStorage.getItem(STORAGE_KEY);
    if (cached) return cached;
  }
  const tenants = await listMyTenants();
  if (tenants.length === 0) return null;
  const active = tenants[0].tenant_id;
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(STORAGE_KEY, active);
  }
  return active;
}

export function setActiveTenantId(id: string): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, id);
}

export function clearActiveTenantId(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
