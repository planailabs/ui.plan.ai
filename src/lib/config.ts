export interface AppConfig {
  authProvider: 'local' | 'supabase';
  dataProvider: 'local' | 'supabase';
  mediaProvider: 'local' | 'cloudflare';
  supabaseUrl: string;
  supabaseAnonKey: string;
  cloudflareAccountId: string;
  cloudflareImagesKey: string;
  cloudflareStreamKey: string;
}

const read = (name: string, fallback = '') => process.env[name] ?? fallback;

export const appConfig: AppConfig = {
  authProvider: (read('AUTH_PROVIDER', 'local') as AppConfig['authProvider']),
  dataProvider: (read('DATA_PROVIDER', 'local') as AppConfig['dataProvider']),
  mediaProvider: (read('MEDIA_PROVIDER', 'local') as AppConfig['mediaProvider']),
  supabaseUrl: read('SUPABASE_URL'),
  supabaseAnonKey: read('SUPABASE_ANON_KEY'),
  cloudflareAccountId: read('CLOUDFLARE_ACCOUNT_ID'),
  cloudflareImagesKey: read('CLOUDFLARE_IMAGES_API_TOKEN'),
  cloudflareStreamKey: read('CLOUDFLARE_STREAM_API_TOKEN'),
};
