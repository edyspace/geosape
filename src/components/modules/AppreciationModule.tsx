import React, { useState } from 'react';
import { Student, ClassRoom, AppreciationRecord } from '../../types';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  Trophy,
  Star,
  Users,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  Clock,
  History,
  X,
  Plus
} from 'lucide-react';

interface AppreciationModuleProps {
  students: Student[];
  classes: ClassRoom[];
  appreciations: AppreciationRecord[];
  activeClassId: string;
  onGiveStar: (studentId: string, classId: string, points: number, reason: string, category: any) => void;
  onAddCustomBadge: (studentId: string, badgeName: string) => void;
}

export const AppreciationModule: React.FC<AppreciationModuleProps> = ({
  students,
  classes,
  appreciations,
  activeClassId,
  onGiveStar,
  onAddCustomBadge,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [pointsAmount, setPointsAmount] = useState<number>(5);
  const [reason, setReason] = useState<string>('Aktif menjawab soal di depan kelas');
  const [category, setCategory] = useState<
    'keaktifan' | 'bertanya' | 'disiplin' | 'kerja_sama' | 'prestasi' | 'kustom'
  >('keaktifan');
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [leaderboardScope, setLeaderboardScope] = useState<'class' | 'all'>(
    activeClassId === 'all' ? 'all' : 'class'
  );

  // Filter students for leaderboard
  const eligibleStudents = students.filter((s) => {
    if (leaderboardScope === 'all') return true;
    return activeClassId === 'all' ? true : s.classId === activeClassId;
  });

  // Sort students descending by points
  const sortedStudents = [...eligibleStudents].sort((a, b) => b.points - a.points);

  // Filter recent appreciation history
  const recentHistory = appreciations.filter((app) => {
    if (activeClassId === 'all') return true;
    return app.classId === activeClassId;
  });

  const handleTriggerAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const std = students.find((s) => s.id === selectedStudentId);
    if (!std) return;

    onGiveStar(std.id, std.classId, pointsAmount, reason, category);

    // Fire joyful confetti!
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    setShowAwardModal(false);
    setReason('Aktif menjawab soal di depan kelas');
  };

  const handleQuickPreset = (pts: number, cat: any, defaultReason: string) => {
    setPointsAmount(pts);
    setCategory(cat);
    setReason(defaultReason);
    setShowAwardModal(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Sistem Apresiasi & Gamifikasi Siswa</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Beri apresiasi bintang/poin instan saat mengajar di kelas untuk memotivasi keaktifan belajar siswa.
          </p>
        </div>

        <button
          onClick={() => {
            if (sortedStudents[0]) setSelectedStudentId(sortedStudents[0].id);
            setShowAwardModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition self-start sm:self-auto"
        >
          <Star className="w-4 h-4 fill-slate-950" />
          <span>Beri Bintang Apresiasi</span>
        </button>
      </div>

      {/* Quick Mobile Action Shortcuts (Ideal for mobile during classroom lecture) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <span className="text-[11px] font-semibold text-slate-400 block mb-2">
          ⚡ Tombol Cepat di Ruang Kelas (Klik untuk Langsung Beri Bintang):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleQuickPreset(5, 'keaktifan', 'Menjawab pertanyaan guru secara lisan')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/20 text-left transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🙋‍♂️</span>
              <span className="text-xs font-bold text-amber-400">+5 ⭐</span>
            </div>
            <p className="text-xs font-semibold text-white">Menjawab Lisan</p>
            <p className="text-[10px] text-slate-400">Keaktifan kelas</p>
          </button>

          <button
            onClick={() => handleQuickPreset(10, 'bertanya', 'Mengajukan pertanyaan kritis & mendalam')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/20 text-left transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">💡</span>
              <span className="text-xs font-bold text-indigo-400">+10 ⭐</span>
            </div>
            <p className="text-xs font-semibold text-white">Tanya Kritis</p>
            <p className="text-[10px] text-slate-400">Rasa ingin tahu</p>
          </button>

          <button
            onClick={() => handleQuickPreset(10, 'turnamen', 'Juara dan keaktifan kompetisi turnamen kuis')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/20 text-left transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🏆</span>
              <span className="text-xs font-bold text-emerald-400">+10 ⭐</span>
            </div>
            <p className="text-xs font-semibold text-white">Turnamen</p>
            <p className="text-[10px] text-slate-400">Prestasi kuis</p>
          </button>

          <button
            onClick={() => handleQuickPreset(15, 'prestasi', 'Mengerjakan soal sulit di papan tulis')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-purple-500/20 text-left transition hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🏆</span>
              <span className="text-xs font-bold text-purple-400">+15 ⭐</span>
            </div>
            <p className="text-xs font-semibold text-white">Tantangan Papan</p>
            <p className="text-[10px] text-slate-400">Soal level HOTS</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Leaderboard (Podium & List), Right = Recent Feed & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Leaderboard (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Papan Peringkat Bintang (Leaderboard)</span>
              </h4>
              <p className="text-xs text-slate-400">
                Peringkat keaktifan siswa yang selalu transparan dan memotivasi.
              </p>
            </div>

            {/* Toggle Class vs All Scope */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center self-start sm:self-auto">
              <button
                onClick={() => setLeaderboardScope('class')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  leaderboardScope === 'class'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Per Kelas
              </button>
              <button
                onClick={() => setLeaderboardScope('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  leaderboardScope === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Se-Angkatan
              </button>
            </div>
          </div>

          {/* Podium Top 3 */}
          {sortedStudents.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 pt-2 pb-4 border-b border-slate-800/80 items-end">
              {/* 2nd place */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-10 h-10 rounded-full bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-xs mb-1 shadow">
                  🥈 2
                </div>
                <span className="font-bold text-white text-xs truncate max-w-[90px]">
                  {sortedStudents[1].name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ⭐ {sortedStudents[1].points} Poin
                </span>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-950 border border-amber-500/40 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base mb-1 shadow-lg shadow-amber-500/30">
                  👑 1
                </div>
                <span className="font-bold text-amber-300 text-xs truncate max-w-[100px]">
                  {sortedStudents[0].name}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  ⭐ {sortedStudents[0].points} Poin
                </span>
                <span className="text-[9px] text-slate-300 mt-0.5">Top Performer</span>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-10 h-10 rounded-full bg-amber-800/60 text-amber-300 font-bold flex items-center justify-center text-xs mb-1 shadow">
                  🥉 3
                </div>
                <span className="font-bold text-white text-xs truncate max-w-[90px]">
                  {sortedStudents[2].name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ⭐ {sortedStudents[2].points} Poin
                </span>
              </div>
            </div>
          )}

          {/* Full ranking list */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {sortedStudents.map((std, idx) => {
              const studentClass = classes.find((c) => c.id === std.classId);
              return (
                <div
                  key={std.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-slate-500 text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">{std.name}</span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-semibold"
                          style={{
                            backgroundColor: studentClass ? `${studentClass.color}20` : '#334155',
                            color: studentClass ? studentClass.color : '#cbd5e1',
                          }}
                        >
                          {studentClass?.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {std.badges.map((b, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      ⭐ {std.points}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedStudentId(std.id);
                        setShowAwardModal(true);
                      }}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition"
                      title="Beri bintang lagi"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Feed (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Aktivitas Apresiasi Terbaru</span>
            </h4>
            <span className="text-[11px] text-slate-400">{recentHistory.length} Riwayat</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {recentHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Belum ada bintang yang diberikan untuk kelas ini.
              </p>
            ) : (
              recentHistory.map((app) => {
                const std = students.find((s) => s.id === app.studentId);
                const cls = classes.find((c) => c.id === app.classId);

                return (
                  <div
                    key={app.id}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{std?.name || 'Siswa'}</span>
                        <span className="text-[10px] text-slate-400">({cls?.name})</span>
                      </div>
                      <span className="font-bold text-amber-400 font-mono">+{app.points} ⭐</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed italic">
                      "{app.reason}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span className="capitalize">{app.category}</span>
                      <span>{new Date(app.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal Give Stars */}
      {showAwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
                Beri Bintang Apresiasi
              </h3>
              <button
                onClick={() => setShowAwardModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriggerAward} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pilih Siswa yang Diberi Apresiasi *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {eligibleStudents.map((s) => {
                    const cls = classes.find((c) => c.id === s.classId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({cls?.name || 'Kelas'}) - Saat ini: {s.points} ⭐
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jumlah Bintang (Poin)
                  </label>
                  <select
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold text-amber-400"
                  >
                    <option value={5}>+5 Bintang (Standar)</option>
                    <option value={10}>+10 Bintang (Luar Biasa)</option>
                    <option value={15}>+15 Bintang (Tantangan Berat)</option>
                    <option value={20}>+20 Bintang (Juara / Sempurna)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kategori Keaktifan
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="keaktifan">Keaktifan Menjawab</option>
                    <option value="bertanya">Pertanyaan Kritis</option>
                    <option value="turnamen">Turnamen (Prestasi Kuis)</option>
                    <option value="disiplin">Kedisiplinan</option>
                    <option value="prestasi">Prestasi Khusus</option>
                    <option value="kustom">Lainnya / Kustom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Alasan / Catatan Apresiasi Guru
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Misal: Menjawab soal vektor di papan tulis dengan rumus terperinci..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAwardModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Kirim Apresiasi ⭐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
