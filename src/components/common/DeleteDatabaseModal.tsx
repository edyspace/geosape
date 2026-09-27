import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, ShieldAlert, RefreshCw } from 'lucide-react';

interface DeleteDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClearDatabase: () => void;
  onResetToGeographySeed: () => void;
}

export const DeleteDatabaseModal: React.FC<DeleteDatabaseModalProps> = ({
  isOpen,
  onClose,
  onConfirmClearDatabase,
  onResetToGeographySeed,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const isMatch = confirmText.trim() === 'HAPUS';

  if (!isOpen) return null;

  const handleExecuteClear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch) return;

    onConfirmClearDatabase();
    setConfirmText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-rose-400">Kosongkan Database GuruKelas</h3>
            <p className="text-xs text-slate-400">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-200 leading-relaxed space-y-2 mb-4">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            Peringatan Penghapusan Data Total:
          </p>
          <p className="text-[11px] text-slate-300">
            Semua data kelas, daftar siswa, materi ajar, riwayat nilai, rekaman tugas, bintang apresiasi, turnamen kuis, dan bank soal akan <strong>dikosongkan secara permanen</strong> dari penyimpanan browser Anda.
          </p>
        </div>

        <form onSubmit={handleExecuteClear} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ketik kata <span className="text-rose-400 font-mono font-bold tracking-wider">HAPUS</span> untuk konfirmasi:
            </label>
            <input
              type="text"
              placeholder="Ketik HAPUS di sini..."
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full text-center text-sm font-mono font-bold tracking-widest bg-slate-950 border border-rose-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={!isMatch}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-950 transition flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus & Kosongkan Database Sekarang</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Kembalikan ke data bawaan simulasi Geografi SMA?')) {
                  onResetToGeographySeed();
                  setConfirmText('');
                  onClose();
                }
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl text-xs font-medium border border-indigo-500/30 transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset ke Contoh Geografi SMA Saja</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-transparent text-slate-400 hover:text-slate-200 text-xs font-medium"
            >
              Batalkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
