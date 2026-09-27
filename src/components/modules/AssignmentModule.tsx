import React, { useState } from 'react';
import { Assignment, Submission, ClassRoom, Student, QuestionItem, GradeCategory, BankQuestion } from '../../types';
import { SelectFromBankModal } from '../common/SelectFromBankModal';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck,
  User,
  Award,
  Send,
  Trash2,
  X,
  Layers,
  ChevronRight,
  Filter,
  BookOpen
} from 'lucide-react';

interface AssignmentModuleProps {
  assignments: Assignment[];
  submissions: Submission[];
  classes: ClassRoom[];
  students: Student[];
  activeClassId: string;
  bankQuestions: BankQuestion[];
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onDeleteAssignment: (id: string) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
}

export const AssignmentModule: React.FC<AssignmentModuleProps> = ({
  assignments,
  submissions,
  classes,
  students,
  activeClassId,
  bankQuestions,
  onAddAssignment,
  onDeleteAssignment,
  onGradeSubmission,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBankPickerModal, setShowBankPickerModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | GradeCategory>('ALL');

  // Form states for new assignment
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('Bab 1: Dinamika Litosfer');
  const [category, setCategory] = useState<GradeCategory>('TUGAS');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [allowFileUpload, setAllowFileUpload] = useState(true);
  const [targetClassIds, setTargetClassIds] = useState<string[]>(['all']);

  // Questions in assignment
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q-demo-geo-1',
      question: 'Pertemuan lempeng tektonik di mana salah satu lempeng menunjam ke bawah lempeng lainnya membentuk palung laut dan deretan gunung api disebut zona...',
      type: 'pg',
      options: ['Subduksi (Konvergen)', 'Divergen (Pemekaran)', 'Transform (Sesar Mendatar)', 'Rift Valley'],
      correctOption: 0,
      points: 50,
    },
    {
      id: 'q-demo-geo-2',
      question: 'Jelaskan mengapa Indonesia menjadi salah satu negara paling rawan gempa dan erupsi gunung api di dunia!',
      type: 'essay',
      points: 50,
    }
  ]);

  // Filter assignments based on active class & category
  const filteredAssignments = assignments.filter((a) => {
    const matchesClass =
      activeClassId === 'all' ||
      a.targetClassIds.includes('all') ||
      a.targetClassIds.includes(activeClassId);

    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;

    return matchesClass && matchesCategory;
  });

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  // Submissions for currently selected assignment
  const assignmentSubmissions = submissions.filter((s) => {
    const matchesAssignment = s.assignmentId === selectedAssignmentId;
    const matchesClass = activeClassId === 'all' || s.classId === activeClassId;
    return matchesAssignment && matchesClass;
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

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddAssignment({
      title: title.trim(),
      chapter: chapter.trim(),
      category,
      instructions: instructions.trim(),
      dueDate,
      maxScore: 100,
      allowFileUpload,
      questions,
      targetClassIds: targetClassIds.length > 0 ? targetClassIds : ['all'],
    });

    setTitle('');
    setInstructions('');
    setShowCreateModal(false);
  };

  const handleOpenGradeModal = (sub: Submission) => {
    setGradingSubmission(sub);
    setScoreInput(sub.score !== undefined ? sub.score : 85);
    setFeedbackInput(sub.feedback || 'Kerja bagus! Pemahaman konsep sudah sangat baik.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingSubmission) {
      onGradeSubmission(gradingSubmission.id, Number(scoreInput), feedbackInput.trim());
      setGradingSubmission(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            <span>Penilaian Pembelajaran</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Buat tugas serentak atau per kelas (Tugas Harian, UH, PTS, PAS) dengan koreksi dan umpan balik.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-900/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(['ALL', 'TUGAS', 'UH', 'PTS', 'PAS'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'ALL'
              ? 'Semua Kategori'
              : cat === 'TUGAS'
              ? 'Tugas Harian'
              : cat === 'UH'
              ? 'Ulangan Harian (UH)'
              : cat === 'PTS'
              ? 'PTS'
              : 'PAS'}
          </button>
        ))}
      </div>

      {/* Content Layout: Left = Assignments List, Right = Submissions & Grading */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assignment Cards */}
        <div className={`${selectedAssignmentId ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          {filteredAssignments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
              <ClipboardList className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">Belum ada tugas pada kategori ini.</p>
              <p className="text-xs">Klik tombol "Buat Tugas Baru" di atas.</p>
            </div>
          ) : (
            filteredAssignments.map((asg) => {
              const isSelected = selectedAssignmentId === asg.id;
              const isAllClasses = asg.targetClassIds.includes('all');
              const targetClasses = classes.filter((c) =>
                isAllClasses ? true : asg.targetClassIds.includes(c.id)
              );
              const subCount = submissions.filter((s) => s.assignmentId === asg.id).length;
              const gradedCount = submissions.filter(
                (s) => s.assignmentId === asg.id && s.score !== undefined
              ).length;

              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAssignmentId(isSelected ? null : asg.id)}
                  className={`bg-slate-900/90 border rounded-2xl p-4.5 cursor-pointer transition shadow-md ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-800/80'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        asg.category === 'UH'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : asg.category === 'PTS' || asg.category === 'PAS'
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {asg.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deadline: {new Date(asg.dueDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5">{asg.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">{asg.instructions}</p>

                  <div className="flex flex-wrap items-center gap-1 mb-3">
                    <span className="text-[10px] text-slate-500 mr-1">Kelas:</span>
                    {isAllClasses ? (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                        Semua Kelas
                      </span>
                    ) : (
                      targetClasses.map((cls) => (
                        <span
                          key={cls.id}
                          className="text-[10px] px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: `${cls.color}20`,
                            color: cls.color,
                          }}
                        >
                          {cls.name}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/70 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-semibold">{subCount} Mengumpulkan</span>
                      <span>•</span>
                      <span className="text-indigo-400">{gradedCount} Sudah Dinilai</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus tugas "${asg.title}"?`)) {
                            onDeleteAssignment(asg.id);
                            if (selectedAssignmentId === asg.id) setSelectedAssignmentId(null);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Hapus Tugas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-indigo-400 flex items-center font-semibold text-xs">
                        {isSelected ? 'Tutup' : 'Periksa'} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Submissions & Grading Drawer */}
        {selectedAssignment && (
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Koreksi & Rekap Pengumpulan
                </span>
                <h4 className="text-base font-bold text-white">{selectedAssignment.title}</h4>
                <p className="text-xs text-slate-400">
                  {assignmentSubmissions.length} siswa telah mengumpulkan
                </p>
              </div>

              <button
                onClick={() => setSelectedAssignmentId(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions preview in this assignment */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Soal pada Tugas Ini ({selectedAssignment.questions.length} Butir):
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {selectedAssignment.questions.map((q, idx) => (
                  <li key={q.id} className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400">{idx + 1}.</span>
                    <span>
                      {q.question} ({q.points} poin - {q.type.toUpperCase()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submissions list */}
            <div className="space-y-2.5">
              <h5 className="text-xs font-semibold text-slate-300">Jawaban Siswa yang Masuk</h5>
              {assignmentSubmissions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 bg-slate-950/40 rounded-xl">
                  <p className="text-xs">Belum ada siswa yang mengumpulkan jawaban tugas ini.</p>
                </div>
              ) : (
                assignmentSubmissions.map((sub) => {
                  const student = students.find((s) => s.id === sub.studentId);
                  const studentClass = classes.find((c) => c.id === sub.classId);
                  const isGraded = sub.score !== undefined;

                  return (
                    <div
                      key={sub.id}
                      className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">
                            {student?.name || 'Siswa'}
                          </span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded font-semibold"
                            style={{
                              backgroundColor: studentClass ? `${studentClass.color}20` : '#334155',
                              color: studentClass ? studentClass.color : '#cbd5e1',
                            }}
                          >
                            {studentClass?.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Dikumpulkan: {new Date(sub.submittedAt).toLocaleString('id-ID')}
                        </p>
                        {sub.feedback && (
                          <p className="text-[11px] text-indigo-300 italic">
                            Catatan: "{sub.feedback}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          {isGraded ? (
                            <span className="text-base font-bold text-emerald-400">
                              {sub.score} / 100
                            </span>
                          ) : (
                            <span className="text-xs text-amber-400 font-medium">Belum Dinilai</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                        >
                          {isGraded ? 'Edit Nilai' : 'Beri Nilai'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Create Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-400" />
                Buat Tugas / Ulangan Harian Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Tugas / Penilaian *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Latihan 2 - Analisis Gerak Parabola"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kategori Penilaian
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GradeCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="TUGAS">Tugas Harian</option>
                    <option value="UH">Ulangan Harian (UH)</option>
                    <option value="PTS">Penilaian Tengah Semester (PTS)</option>
                    <option value="PAS">Penilaian Akhir Semester (PAS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bab / Topik Bahasan
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Class target selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tugaskan ke Kelas Mana Saja? (Bisa Serentak atau Tertentu)
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
                  Batas Waktu Pengumpulan (Tenggat / Due Date)
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Daftar Butir Soal ({questions.length} Butir)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowBankPickerModal(true)}
                    className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>+ Ambil dari Bank Soal</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-start justify-between gap-2"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-indigo-400 mr-1.5">{idx + 1}.</span>
                        <span className="text-slate-200">{q.question}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span className="bg-slate-900 px-1.5 py-0.5 rounded font-bold uppercase">{q.type}</span>
                          <span>{q.points} Poin</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Hapus Soal ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Petunjuk & Instruksi Tugas
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan petunjuk pengerjaan langkah perhitungan atau format pengumpulan..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium"
                >
                  Terbitkan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select Questions from Bank Soal Modal */}
      <SelectFromBankModal
        isOpen={showBankPickerModal}
        onClose={() => setShowBankPickerModal(false)}
        bankQuestions={bankQuestions}
        title="Ambil Soal dari Bank Soal ke Tugas Penilaian"
        onSelectQuestions={(selected) => {
          const newItems: QuestionItem[] = selected.map((bq, i) => ({
            id: `q-asg-${Date.now()}-${i}`,
            question: bq.question,
            type: 'pg',
            options: bq.options,
            correctOption: bq.correctIndex,
            points: 50,
          }));
          setQuestions([...questions, ...newItems]);
        }}
      />

      {/* Modal Grading Submission */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Penilaian & Umpan Balik Guru
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              {/* Submission answer detail */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="font-semibold text-slate-300">Jawaban yang Dikirimkan:</p>
                {Object.entries(gradingSubmission.answers || {}).map(([qId, ans]) => (
                  <div key={qId} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 font-mono text-[10px] block mb-1">ID Soal: {qId}</span>
                    <p className="text-slate-200">{ans}</p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Skor Nilai (0 - 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Feedback & Umpan Balik Guru ke Siswa
                </label>
                <textarea
                  rows={3}
                  placeholder="Beri catatan apresiasi atau langkah koreksi rumus..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
