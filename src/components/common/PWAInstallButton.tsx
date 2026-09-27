import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (isInstalled || installedSuccess) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-full">
        <Check className="w-3.5 h-3.5" />
        PWA Terpasang
      </span>
    );
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
    }
  };

  if (isInstallable) {
    return (
      <button
        onClick={handleInstall}
        className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium shadow-md shadow-indigo-900/30 transition-all ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs sm:text-sm'
        }`}
        title="Pasang aplikasi di layar utama HP atau Laptop untuk akses kilat & offline"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Pasang di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Pasang di iPhone / iPad</h3>
                  <p className="text-xs text-slate-400">Akses langsung layaknya aplikasi native</p>
                </div>
              </div>
              <ol className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 mb-5">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Buka di browser <strong>Safari</strong> iPhone Anda.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Tekan tombol <strong>Bagikan (Share)</strong> di bilah bawah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Gulir dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => alert('Untuk memasang di laptop/HP: Klik ikon titik tiga browser Anda lalu pilih "Install GuruKelas" atau "Tambahkan ke Layar Utama".')}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition ${
        compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
      }`}
      title="Informasi Pasang Web App"
    >
      <Download className="w-3.5 h-3.5 text-indigo-400" />
      <span>Install PWA</span>
    </button>
  );
};
