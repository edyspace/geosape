import React, { useState } from 'react';
import { Role, TeacherProfile, SupabaseSettings } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  GraduationCap,
  Sparkles,
  UserCheck,
  Users,
  Database,
  Download,
  Upload,
  Settings,
  Shield,
  Key,
  HelpCircle,
  Menu,
  X,
  Trash2
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
  teacher: TeacherProfile;
  onUpdateTeacher: (teacher: TeacherProfile) => void;
  supabase: SupabaseSettings;
  onOpenSupabaseModal: () => void;
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  onOpenDeleteDbModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSwitchRole,
  teacher,
  onUpdateTeacher,
  supabase,
  onOpenSupabaseModal,
  onExportBackup,
  onImportBackup,
  onResetData,
  onOpenDeleteDbModal,
}) => {
  const [showTeacherSettings, setShowTeacherSettings] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states for teacher profile
  const [tempName, setTempName] = useState(teacher.name);
  const [tempSubject, setTempSubject] = useState(teacher.subject);
  const [tempSchool, setTempSchool] = useState(teacher.schoolName);
  const [tempAcademicYear, setTempAcademicYear] = useState(teacher.academicYear);
  const [tempSemester, setTempSemester] = useState(teacher.semester);
  const [tempPin, setTempPin] = useState(teacher.pin);

  const handleAttemptSwitchToGuru = () => {
    if (teacher.pin && teacher.pin !== '0000' && teacher.pin.trim() !== '') {
      setShowPinModal(true);
      setInputPin('');
      setPinError('');
    } else {
      onSwitchRole('guru');
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === teacher.pin) {
      setShowPinModal(false);
      onSwitchRole('guru');
    } else {
      setPinError('PIN salah! Silakan coba lagi (Default: 1234).');
    }
  };

  const handleSaveTeacherProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacher({
      name: tempName,
      subject: tempSubject,
      schoolName: tempSchool,
      academicYear: tempAcademicYear,
      semester: tempSemester as 'Ganjil' | 'Genap',
      pin: tempPin,
    });
    setShowTeacherSettings(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Mapel badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-white text-base tracking-tight leading-none">
                    GuruKelas
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {teacher.subject}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5 hidden sm:block">
                  {teacher.name} • {teacher.schoolName} ({teacher.academicYear})
                </p>
              </div>
            </div>

            {/* Middle/Right: Role Switcher & Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Role switcher pill */}
              <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center">
                <button
                  onClick={() => {
                    if (currentRole !== 'guru') handleAttemptSwitchToGuru();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    currentRole === 'guru'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Mode Guru</span>
                </button>
                <button
                  onClick={() => onSwitchRole('siswa')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    currentRole === 'siswa'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Portal Siswa</span>
                </button>
              </div>

              {/* PWA Install */}
              <PWAInstallButton compact />

              {/* Supabase cloud status */}
              <button
                onClick={onOpenSupabaseModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                  supabase.connected
                    ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title={supabase.connected ? 'Supabase Terhubung' : 'Hubungkan Supabase Cloud'}
              >
                <Database className={`w-3.5 h-3.5 ${supabase.connected ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="hidden lg:inline">{supabase.connected ? 'Cloud Aktif' : 'Koneksi Cloud'}</span>
              </button>

              {/* Quick Clear Database button */}
              {currentRole === 'guru' && (
                <button
                  onClick={onOpenDeleteDbModal}
                  className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition"
                  title="Hapus / Kosongkan Database (Konfirmasi HAPUS)"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>
              )}

              {/* Settings */}
              {currentRole === 'guru' && (
                <button
                  onClick={() => {
                    setTempName(teacher.name);
                    setTempSubject(teacher.subject);
                    setTempSchool(teacher.schoolName);
                    setTempAcademicYear(teacher.academicYear);
                    setTempSemester(teacher.semester);
                    setTempPin(teacher.pin);
                    setShowTeacherSettings(true);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Pengaturan Guru & Mapel"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center gap-2">
              <PWAInstallButton compact />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    if (currentRole !== 'guru') handleAttemptSwitchToGuru();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
                    currentRole === 'guru' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Mode Guru
                </button>
                <button
                  onClick={() => {
                    onSwitchRole('siswa');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
                    currentRole === 'siswa' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Portal Siswa
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => {
                    onOpenSupabaseModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-800 rounded-xl text-slate-200"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">Supabase</span>
                </button>

                {currentRole === 'guru' && (
                  <button
                    onClick={() => {
                      setShowTeacherSettings(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 bg-slate-800 rounded-xl text-slate-200"
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">Profil</span>
                  </button>
                )}

                {currentRole === 'guru' && (
                  <button
                    onClick={() => {
                      onOpenDeleteDbModal();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 bg-rose-950/60 text-rose-300 border border-rose-500/30 rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span className="truncate">Hapus DB</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-center font-bold text-base mb-1">Akses Mode Guru</h3>
            <p className="text-center text-xs text-slate-400 mb-4">
              Masukkan PIN guru untuk mengakses kontrol pengajaran
            </p>
            <form onSubmit={handleVerifyPin} className="space-y-3">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN Guru (Default: 1234)"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold bg-slate-950 border border-slate-700 rounded-xl py-2 text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                {pinError && <p className="text-[11px] text-rose-400 text-center mt-1.5">{pinError}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Profile & Backup Settings Modal */}
      {showTeacherSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-base">Pengaturan Guru & Backup Data</h3>
              </div>
              <button
                onClick={() => setShowTeacherSettings(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nama Guru</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mata Pelajaran (Tunggal)</label>
                  <input
                    type="text"
                    value={tempSubject}
                    onChange={(e) => setTempSubject(e.target.value)}
                    required
                    placeholder="misal: Fisika / Matematika"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nama Sekolah</label>
                  <input
                    type="text"
                    value={tempSchool}
                    onChange={(e) => setTempSchool(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={tempAcademicYear}
                    onChange={(e) => setTempAcademicYear(e.target.value)}
                    placeholder="2024/2025"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                  <select
                    value={tempSemester}
                    onChange={(e) => setTempSemester(e.target.value as 'Ganjil' | 'Genap')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PIN Akses Guru</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={tempPin}
                    onChange={(e) => setTempPin(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Backup & Restore Section */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">Cadangan & Pemulihan Data (Offline Backup)</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onExportBackup}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-medium transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Cadangan (JSON)</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Impor Pulihkan Data</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportBackup}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setShowTeacherSettings(false);
                      onOpenDeleteDbModal();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold transition ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Kosongkan Database (HAPUS)</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTeacherSettings(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
