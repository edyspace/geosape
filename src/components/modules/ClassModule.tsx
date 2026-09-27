import React, { useState } from 'react';
import { ClassRoom, Student } from '../../types';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Copy,
  Check,
  Search,
  Trash2,
  Edit2,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  Calendar,
  X,
  TrendingUp,
  BookOpen
} from 'lucide-react';

interface ClassModuleProps {
  classes: ClassRoom[];
  students: Student[];
  activeClassId: string;
  onAddClass: (newClass: Omit<ClassRoom, 'id'>) => void;
  onUpdateClass: (updated: ClassRoom) => void;
  onDeleteClass: (classId: string) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onAddBulkStudents: (classId: string, studentsData: { name: string; nisn?: string; gender?: 'L' | 'P' }[]) => void;
  onDeleteStudent: (studentId: string) => void;
  onQuickStar: (studentId: string, classId: string, points: number, reason: string) => void;
}

export const ClassModule: React.FC<ClassModuleProps> = ({
  classes,
  students,
  activeClassId,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddStudent,
  onAddBulkStudents,
  onDeleteStudent,
  onQuickStar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [selectedClassForBulk, setSelectedClassForBulk] = useState(
    activeClassId === 'all' ? (classes[0]?.id || '') : activeClassId
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Student Single Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNisn, setNewStudentNisn] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');
  const [newStudentClassId, setNewStudentClassId] = useState(
    activeClassId === 'all' ? (classes[0]?.id || '') : activeClassId
  );

  const activeClass = classes.find((c) => c.id === activeClassId);

  // Filter students based on active class & search query
  const filteredStudents = students.filter((s) => {
    const matchesClass = activeClassId === 'all' || s.classId === activeClassId;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSingleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentClassId) return;

    onAddStudent({
      classId: newStudentClassId,
      name: newStudentName.trim(),
      nisn: newStudentNisn.trim() || `007${Math.floor(100000 + Math.random() * 900000)}`,
      gender: newStudentGender,
      points: 0,
      badges: ['Siswa Baru'],
    });

    setNewStudentName('');
    setNewStudentNisn('');
    setShowAddStudentModal(false);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim() || !selectedClassForBulk) return;

    // Parse lines: "Nama Siswa, NISN (optional), L/P (optional)" or simple one name per line
    const lines = bulkText.split('\n');
    const parsedData: { name: string; nisn?: string; gender?: 'L' | 'P' }[] = [];

    lines.forEach((line) => {
      const clean = line.trim();
      if (!clean) return;

      const parts = clean.split(/[,\t]/).map((p) => p.trim());
      const name = parts[0];
      const nisn = parts[1] || undefined;
      const rawGender = parts[2]?.toUpperCase();
      const gender: 'L' | 'P' = rawGender === 'P' ? 'P' : 'L';

      if (name) {
        parsedData.push({ name, nisn, gender });
      }
    });

    if (parsedData.length > 0) {
      onAddBulkStudents(selectedClassForBulk, parsedData);
      setBulkText('');
      setShowBulkModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Kelas Diampu</p>
            <h4 className="text-2xl font-bold text-white mt-1">{classes.length} Kelas</h4>
            <p className="text-[11px] text-indigo-400 mt-1">Multi-Kelas 1 Mapel</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">
              {activeClassId === 'all' ? 'Total Seluruh Siswa' : `Siswa di ${activeClass?.name}`}
            </p>
            <h4 className="text-2xl font-bold text-white mt-1">
              {filteredStudents.length} Siswa
            </h4>
            <p className="text-[11px] text-emerald-400 mt-1">
              {activeClassId === 'all' ? 'Semua Rombel Terdata' : `Aktif di kelas`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Bintang Apresiasi</p>
            <h4 className="text-2xl font-bold text-amber-400 mt-1">
              ⭐ {filteredStudents.reduce((acc, s) => acc + s.points, 0)} Poin
            </h4>
            <p className="text-[11px] text-amber-300/80 mt-1">Apresiasi Keaktifan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Kode Akses Kelas Aktif</p>
            {activeClass ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-mono font-bold text-indigo-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  {activeClass.inviteCode}
                </span>
                <button
                  onClick={() => handleCopyInviteCode(activeClass.inviteCode)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Salin Kode Undangan"
                >
                  {copiedCode === activeClass.inviteCode ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-300 mt-1">Pilih 1 kelas</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">Siswa masuk via kode</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Class Details Banner if single class selected */}
      {activeClass && (
        <div
          className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
          style={{
            backgroundColor: `${activeClass.color}15`,
            borderColor: `${activeClass.color}40`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-12 rounded-full"
              style={{ backgroundColor: activeClass.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{activeClass.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900/60 text-slate-200">
                  Tingkat {activeClass.grade}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 font-mono">
                  Kode: {activeClass.inviteCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{activeClass.description || 'Tidak ada deskripsi khusus'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleCopyInviteCode(activeClass.inviteCode)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700/60 transition"
            >
              {copiedCode === activeClass.inviteCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kode Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode Kelas</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Student Management Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Daftar Siswa {activeClass ? `(${activeClass.name})` : '(Semua Kelas)'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kelola nama, nomor induk, bintang apresiasi langsung dari meja guru atau smartphone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Impor Excel/CSV</span>
            </button>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-900/30 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari siswa berdasarkan nama atau NISN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Student Table / Cards */}
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium">Belum ada siswa yang sesuai.</p>
            <p className="text-xs text-slate-500">
              Klik "Tambah Siswa" atau "Impor Excel" untuk memasukkan data siswa kelas ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">NISN</th>
                  <th className="py-3 px-3 text-center">Bintang Poin</th>
                  <th className="py-3 px-3">Badge Pencapaian</th>
                  <th className="py-3 px-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((std, idx) => {
                  const studentClass = classes.find((c) => c.id === std.classId);
                  return (
                    <tr key={std.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
                            {std.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{std.name}</span>
                            <span className="text-[10px] text-slate-500">
                              {std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: studentClass ? `${studentClass.color}25` : '#334155',
                            color: studentClass ? studentClass.color : '#cbd5e1',
                          }}
                        >
                          {studentClass?.name || 'Tanpa Kelas'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{std.nisn}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30">
                          ⭐ {std.points}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {std.badges.slice(0, 2).map((badge, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-indigo-300 border border-indigo-500/20"
                            >
                              {badge}
                            </span>
                          ))}
                          {std.badges.length > 2 && (
                            <span className="text-[10px] text-slate-500">
                              +{std.badges.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Star +5 */}
                          <button
                            onClick={() =>
                              onQuickStar(std.id, std.classId, 5, 'Keaktifan dan respons cepat di kelas')
                            }
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[11px] font-semibold border border-amber-500/30 transition flex items-center gap-1"
                            title="Beri +5 Bintang Keaktifan saat di kelas"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>+5 ⭐</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus data siswa ${std.name}?`)) {
                                onDeleteStudent(std.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Single Add Student */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                Tambah Siswa Baru
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSingleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Bintang"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kelas Tujuan *
                  </label>
                  <select
                    value={newStudentClassId}
                    onChange={(e) => setNewStudentClassId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as 'L' | 'P')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  NISN / Nomor Induk (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="007123456"
                  value={newStudentNisn}
                  onChange={(e) => setNewStudentNisn(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bulk Import Students */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Impor Banyak Siswa (Paste dari Excel)
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pilih Kelas Tujuan
                </label>
                <select
                  value={selectedClassForBulk}
                  onChange={(e) => setSelectedClassForBulk(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tempel (Paste) Daftar Nama Siswa
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Format per baris bisa berupa nama saja, atau <strong>Nama, NISN, L/P</strong> (dipisah koma atau tab dari copy Excel).
                </p>
                <textarea
                  rows={8}
                  placeholder={`Contoh:\nAhmad Fauzan, 00712301, L\nBunga Lestari, 00712302, P\nCitra Dewi\nDimas Pratama`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium"
                >
                  Impor Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
