import React, { useState } from 'react';
import { SupabaseSettings, AppState } from '../../types';
import { testSupabaseConnection, syncAppStateToSupabase, SUPABASE_SQL_SCHEMA } from '../../services/supabase';
import { Cloud, CheckCircle, AlertCircle, Copy, Check, Database, RefreshCw, X } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onUpdateSupabaseSettings: (settings: SupabaseSettings) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  appState,
  onUpdateSupabaseSettings,
}) => {
  const [url, setUrl] = useState(appState.supabase.url || '');
  const [anonKey, setAnonKey] = useState(appState.supabase.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'Harap isi Supabase Project URL dan Anon Key terlebih dahulu.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      onUpdateSupabaseSettings({
        url: url.trim(),
        anonKey: anonKey.trim(),
        connected: true,
        lastSynced: appState.supabase.lastSynced,
      });
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncResult(null);
    const updatedState: AppState = {
      ...appState,
      supabase: {
        url: url.trim(),
        anonKey: anonKey.trim(),
        connected: true,
      },
    };
    const res = await syncAppStateToSupabase(updatedState);
    setSyncing(false);
    setSyncResult(res);

    if (res.success) {
      onUpdateSupabaseSettings({
        url: url.trim(),
        anonKey: anonKey.trim(),
        connected: true,
        lastSynced: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      });
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Koneksi Database Supabase Cloud</h3>
              <p className="text-xs text-slate-400">Sinkronisasi data multi-perangkat (Laptop & Smartphone)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6 pt-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition -mb-[1px] flex items-center gap-2 ${
              activeTab === 'config'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Pengaturan API Key
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition -mb-[1px] flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Copy className="w-4 h-4" />
            Skema SQL Supabase
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'config' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 leading-relaxed">
                <strong>Catatan Penting:</strong> Aplikasi ini secara otomatis menyimpan semua data di browser Anda (Local Storage/IndexedDB). Fitur Supabase ini opsional jika Anda ingin menyinkronkan data antar laptop dan HP Anda secara online di cloud pribadi Anda.
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Supabase Anon Key (Public Key)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? <CheckCircle className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {syncResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    syncResult.success
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {syncResult.success ? <CheckCircle className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
                  <span>{syncResult.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400">
                  Status:{' '}
                  {appState.supabase.connected ? (
                    <span className="text-emerald-400 font-medium">Terkoneksi (Sinkronisasi Siap)</span>
                  ) : (
                    <span className="text-slate-400">Belum Terhubung</span>
                  )}
                  {appState.supabase.lastSynced && (
                    <span className="ml-2 text-slate-500">Terakhir: {appState.supabase.lastSynced}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                  >
                    {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    <span>Uji Koneksi</span>
                  </button>

                  <button
                    onClick={handleSyncNow}
                    disabled={syncing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                  >
                    {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                    <span>Sinkron Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Salin script SQL ini ke <strong>SQL Editor</strong> di dashboard Supabase Anda:
                </p>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-72 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
