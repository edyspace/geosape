import React, { useState } from 'react';
import { MaterialItem, ClassRoom, Student } from '../../types';
import {
  BookOpen,
  Plus,
  Video,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  Copy,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  X,
  Edit2
} from 'lucide-react';

interface MaterialModuleProps {
  materials: MaterialItem[];
  classes: ClassRoom[];
  students: Student[];
  activeClassId: string;
  onAddMaterial: (newMat: Omit<MaterialItem, 'id' | 'completedByStudentIds' | 'createdAt'>) => void;
  onDeleteMaterial: (id: string) => void;
  onDuplicateMaterial: (mat: MaterialItem, targetClassId: string) => void;
}

export const MaterialModule: React.FC<MaterialModuleProps> = ({
  materials,
  classes,
  students,
  activeClassId,
  onAddMaterial,
  onDeleteMaterial,
  onDuplicateMaterial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('Bab 1: Kinematika Gerak');
  const [type, setType] = useState<'document' | 'video' | 'link' | 'pdf'>('document');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10));
  const [targetClassIds, setTargetClassIds] = useState<string[]>(['all']);

  // Duplicate modal
  const [showDupModal, setShowDupModal] = useState(false);
  const [matToDuplicate, setMatToDuplicate] = useState<MaterialItem | null>(null);
  const [dupTargetClass, setDupTargetClass] = useState<string>(classes[0]?.id || '');

  // Extract distinct chapters
  const allChapters = Array.from(new Set(materials.map((m) => m.chapter)));

  // Filter materials based on active class & chapter
  const filteredMaterials = materials.filter((m) => {
    const matchesClass =
      activeClassId === 'all' ||
      m.targetClassIds.includes('all') ||
      m.targetClassIds.includes(activeClassId);

    const matchesChapter =
      selectedChapterFilter === 'all' || m.chapter === selectedChapterFilter;

    return matchesClass && matchesChapter;
  });

  const handleClassSelectionChange = (classId: string) => {
    if (classId === 'all') {
      setTargetClassIds(['all']);
    } else {
      let updated = targetClassIds.filter((c) => c !== 'all');
      if (updated.includes(classId)) {
        updated = updated.filter((c) => c !== classId);
        if (updated.length === 0) updated = ['all'];
      } else {
        updated.push(classId);
      }
      setTargetClassIds(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim()) return;

    onAddMaterial({
      title: title.trim(),
      chapter: chapter.trim(),
      type,
      content,
      url: url.trim() || undefined,
      publishDate,
      targetClassIds: targetClassIds.length > 0 ? targetClassIds : ['all'],
    });

    setTitle('');
    setContent('');
    setUrl('');
    setShowAddModal(false);
  };

  const handleDuplicateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matToDuplicate && dupTargetClass) {
      onDuplicateMaterial(matToDuplicate, dupTargetClass);
      setShowDupModal(false);
      setMatToDuplicate(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Penyusunan Materi Pembelajaran Fisika</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Materi dapat dibagikan serentak ke semua kelas atau disesuaikan per kelas dengan jadwal tayang.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-900/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Materi Baru</span>
        </button>
      </div>

      {/* Chapter Filter Pill */}
      {allChapters.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedChapterFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedChapterFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Semua Bab / Topik ({materials.length})
          </button>
          {allChapters.map((chap) => (
            <button
              key={chap}
              onClick={() => setSelectedChapterFilter(chap)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedChapterFilter === chap
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {chap}
            </button>
          ))}
        </div>
      )}

      {/* Material Grid Cards */}
      {filteredMaterials.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-400">Belum ada materi untuk kelas ini.</p>
          <p className="text-xs">Klik "Buat Materi Baru" untuk membagikan modul, video, atau link simulasi PhET.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => {
            const isAllClasses = mat.targetClassIds.includes('all');
            const targetClasses = classes.filter((c) =>
              isAllClasses ? true : mat.targetClassIds.includes(c.id)
            );
            const totalTargetStudents = students.filter((s) =>
              isAllClasses ? true : mat.targetClassIds.includes(s.classId)
            ).length;
            const completedCount = mat.completedByStudentIds?.length || 0;
            const percentCompleted =
              totalTargetStudents > 0
                ? Math.round((completedCount / totalTargetStudents) * 100)
                : 0;

            return (
              <div
                key={mat.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      {mat.chapter}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {mat.type === 'video' && <Video className="w-3.5 h-3.5 text-rose-400" />}
                      {mat.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-400" />}
                      {mat.type === 'link' && <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />}
                      {mat.type === 'document' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="capitalize">{mat.type}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition">
                    {mat.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {mat.content}
                  </p>

                  {/* Target Classes Badge */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
                      Kelas:
                    </span>
                    {isAllClasses ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        Semua Kelas
                      </span>
                    ) : (
                      targetClasses.map((cls) => (
                        <span
                          key={cls.id}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${cls.color}20`,
                            color: cls.color,
                            border: `1px solid ${cls.color}40`,
                          }}
                        >
                          {cls.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Bottom stats & Actions */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  {/* Progress completion bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Progres Siswa Membaca</span>
                      <span className="font-semibold text-slate-200">
                        {completedCount}/{totalTargetStudents} ({percentCompleted}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${percentCompleted}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>Tayang: {mat.publishDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {mat.url && (
                        <a
                          href={mat.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                          title="Buka Tautan/Simulasi"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setMatToDuplicate(mat);
                          setShowDupModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                        title="Duplikat Materi ke Kelas Lain"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus materi "${mat.title}"?`)) {
                            onDeleteMaterial(mat.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
                        title="Hapus Materi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Material */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Buat Materi / Modul Ajar Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Materi Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dinamika Rotasi & Momen Inersia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bab / Kompetensi Dasar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bab 2: Dinamika Rotasi"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Jenis Materi
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="document">Modul Dokumen / Teks Ringkasan</option>
                    <option value="video">Video Pembelajaran (YouTube / MP4)</option>
                    <option value="link">Simulasi Interaktif / Tautan Luar (PhET)</option>
                    <option value="pdf">File PDF / E-Book</option>
                  </select>
                </div>
              </div>

              {/* Target Classes Selection (Single, Multiple, or All) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Bagikan ke Kelas Mana Saja? (Bisa Satu, Banyak, atau Semua)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleClassSelectionChange('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      targetClassIds.includes('all')
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Semua Kelas Sekaligus
                  </button>
                  {classes.map((cls) => {
                    const isSelected =
                      !targetClassIds.includes('all') && targetClassIds.includes(cls.id);
                    return (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => handleClassSelectionChange(cls.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected
                            ? 'text-white border-indigo-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        style={{
                          backgroundColor: isSelected ? cls.color : undefined,
                        }}
                      >
                        {cls.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  URL / Tautan (Video YouTube / Simulasi PhET / Google Drive PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://phet.colorado.edu/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jadwal Tanggal Tayang
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Isi Materi / Penjelasan Konsep / Catatan Guru
                </label>
                <textarea
                  rows={5}
                  placeholder="Tuliskan poin-poin penting, rumus kunci fisika, atau instruksi belajar bagi siswa..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium"
                >
                  Terbitkan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Duplicate Material to another class */}
      {showDupModal && matToDuplicate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <h3 className="font-semibold text-base mb-1">Salin Materi ke Kelas Lain</h3>
            <p className="text-xs text-slate-400 mb-4">
              Materi "{matToDuplicate.title}" akan diduplikasi dengan mudah tanpa mengetik ulang.
            </p>

            <form onSubmit={handleDuplicateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pilih Kelas Tujuan
                </label>
                <select
                  value={dupTargetClass}
                  onChange={(e) => setDupTargetClass(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDupModal(false)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium"
                >
                  Duplikat Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
