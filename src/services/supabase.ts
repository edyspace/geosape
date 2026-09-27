import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppState } from '../types';

let cachedClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(url: string, key: string): SupabaseClient | null {
  if (!url || !key) return null;
  if (cachedClient && currentUrl === url && currentKey === key) {
    return cachedClient;
  }
  try {
    cachedClient = createClient(url, key);
    currentUrl = url;
    currentKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = getSupabaseClient(url, key);
    if (!client) return { success: false, message: 'URL atau Anon Key tidak valid.' };

    // Test a basic ping or read query
    const { error } = await client.from('classes').select('id').limit(1);
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "classes" does not exist')) {
      // If table doesn't exist yet, that's fine, we will provide the SQL schema
      if (error.message.includes('does not exist')) {
        return { success: true, message: 'Terkoneksi ke Supabase! (Tabel belum dibuat, gunakan skema SQL otomatis di bawah).' };
      }
      return { success: false, message: `Error koneksi: ${error.message}` };
    }
    return { success: true, message: 'Koneksi ke Supabase berhasil & database siap sinkron!' };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Gagal menghubungi server Supabase.';
    return { success: false, message: msg };
  }
}

export async function syncAppStateToSupabase(state: AppState): Promise<{ success: boolean; message: string }> {
  const { url, anonKey, connected } = state.supabase;
  if (!connected || !url || !anonKey) {
    return { success: false, message: 'Koneksi Supabase belum aktif.' };
  }

  const client = getSupabaseClient(url, anonKey);
  if (!client) return { success: false, message: 'Client Supabase gagal dimuat.' };

  try {
    // Upsert app_sync state container
    const payload = {
      id: 'guru_personal_state',
      teacher: state.teacher,
      classes: state.classes,
      students: state.students,
      materials: state.materials,
      assignments: state.assignments,
      submissions: state.submissions,
      appreciations: state.appreciations,
      quizzes: state.quizzes,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('gurukelas_sync')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      // If table does not exist, give helpful notice
      if (error.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Tabel gurukelas_sync belum ada di Supabase Anda. Silakan jalankan script SQL di tab Skema SQL.'
        };
      }
      return { success: false, message: `Gagal sinkron: ${error.message}` };
    }

    return { success: true, message: `Data berhasil disinkronkan ke Supabase Cloud pada ${new Date().toLocaleTimeString('id-ID')}!` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Terjadi kesalahan saat sinkronisasi.';
    return { success: false, message: msg };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- SKEMA DATABASE SUPABASE UNTUK GURUKELAS
-- Salin dan jalankan script ini di menu "SQL Editor" di Dashboard Supabase Anda
-- ==========================================

-- 1. Tabel Utama Sinkronisasi Aplikasi Personal Guru
CREATE TABLE IF NOT EXISTS public.gurukelas_sync (
  id TEXT PRIMARY KEY DEFAULT 'guru_personal_state',
  teacher JSONB,
  classes JSONB,
  students JSONB,
  materials JSONB,
  assignments JSONB,
  submissions JSONB,
  appreciations JSONB,
  quizzes JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS dengan kebijakan akses publik (Anon) untuk aplikasi guru personal
ALTER TABLE public.gurukelas_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for personal app"
  ON public.gurukelas_sync
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 2. (Opsional) Tabel Terpisah Jika Ingin Normalisasi Lanjutan
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  invite_code TEXT,
  color TEXT,
  description TEXT,
  academic_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nisn TEXT,
  gender TEXT,
  points INT DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chapter TEXT,
  type TEXT,
  content TEXT,
  url TEXT,
  target_class_ids JSONB,
  publish_date DATE,
  completed_by JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chapter TEXT,
  category TEXT,
  target_class_ids JSONB,
  due_date TIMESTAMP WITH TIME ZONE,
  max_score INT DEFAULT 100,
  questions JSONB
);

CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT,
  target_class_ids JSONB,
  is_inter_class BOOLEAN DEFAULT false,
  time_per_question INT DEFAULT 20,
  status TEXT DEFAULT 'draft',
  questions JSONB,
  participants JSONB DEFAULT '[]'::jsonb
);
`;
