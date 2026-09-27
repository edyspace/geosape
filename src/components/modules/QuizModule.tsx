import React, { useState } from 'react';
import { QuizTournament, QuizQuestion, ClassRoom, Student, BankQuestion } from '../../types';
import { SelectFromBankModal } from '../common/SelectFromBankModal';
import confetti from 'canvas-confetti';
import {
  Flame,
  Plus,
  Trophy,
  Users,
  Timer,
  Play,
  CheckCircle,
  XCircle,
  HelpCircle,
  Layers,
  BarChart,
  Trash2,
  X,
  Swords,
  ChevronRight,
  TrendingDown,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface QuizModuleProps {
  quizzes: QuizTournament[];
  classes: ClassRoom[];
  students: Student[];
  activeClassId: string;
  bankQuestions: BankQuestion[];
  onAddQuiz: (quiz: Omit<QuizTournament, 'id' | 'createdAt' | 'participants'>) => void;
  onDeleteQuiz: (id: string) => void;
  onSimulateStudentParticipation: (quizId: string, studentId: string, answers: any[]) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  quizzes,
  classes,
  students,
  activeClassId,
  bankQuestions,
  onAddQuiz,
  onDeleteQuiz,
  onSimulateStudentParticipation,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBankPickerModal, setShowBankPickerModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(quizzes[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analysis' | 'questions'>('leaderboard');

  // Form states for new tournament
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Dinamika Litosfer & Atmosfer');
  const [timePerQuestion, setTimePerQuestion] = useState<number>(20);
  const [isInterClass, setIsInterClass] = useState<boolean>(true);
  const [targetClassIds, setTargetClassIds] = useState<string[]>(['all']);

  // Questions for new tournament
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'qz-geo-1',
      question: 'Pertemuan lempeng tektonik di mana salah satu lempeng menunjam ke bawah lempeng lainnya membentuk palung laut dan deretan gunung api disebut zona...',
      options: ['Subduksi (Konvergen)', 'Divergen (Pemekaran)', 'Transform (Sesar Mendatar)', 'Rift Valley'],
      correctIndex: 0,
      explanation: 'Zona subduksi merupakan pergerakan konvergen lempeng samudra menunjam ke lempeng benua.',
      points: 100,
    },
    {
      id: 'qz-geo-2',
      question: 'Menurut klasifikasi iklim Junghuhn, wilayah dengan ketinggian 700 - 1.200 meter dpl paling cocok untuk budidaya...',
      options: ['Padi dan Kelapa', 'Teh, Kopi, dan Kina', 'Lumut dan Hutan Tundra', 'Karet dan Tembakau Dataran Rendah'],
      correctIndex: 1,
      explanation: 'Zona sedang (600 - 1500m) ideal untuk teh, kopi, dan kina dengan suhu sejuk 17,1°C - 22°C.',
      points: 100,
    }
  ]);

  // Temporary question add form
  const [qText, setQText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  // Selected tournament
  const currentQuiz = quizzes.find((q) => q.id === selectedQuizId);

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

  const handleAddQuestionToDraft = () => {
    if (!qText.trim() || !opt0.trim() || !opt1.trim()) return;

    const newQ: QuizQuestion = {
      id: `qz-draft-${Date.now()}`,
      question: qText.trim(),
      options: [opt0.trim(), opt1.trim(), opt2.trim() || 'Pilihan C', opt3.trim() || 'Pilihan D'],
      correctIndex: correctIdx,
      explanation: explanation.trim() || 'Penjelasan konsep standar',
      points: 100,
    };

    setQuestions([...questions, newQ]);
    setQText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    onAddQuiz({
      title: title.trim(),
      topic: topic.trim(),
      timePerQuestion,
      isInterClass,
      status: 'active',
      questions,
      targetClassIds: targetClassIds.length > 0 ? targetClassIds : ['all'],
    });

    setTitle('');
    setShowCreateModal(false);
  };

  // Turnamen Inter-Class Stats: Calculate Average Score per participating class
  const classScoresSummary: Record<string, { totalScore: number; count: number; avg: number }> = {};

  if (currentQuiz) {
    currentQuiz.participants.forEach((p) => {
      if (!classScoresSummary[p.classId]) {
        classScoresSummary[p.classId] = { totalScore: 0, count: 0, avg: 0 };
      }
      classScoresSummary[p.classId].totalScore += p.score;
      classScoresSummary[p.classId].count += 1;
    });

    Object.keys(classScoresSummary).forEach((cId) => {
      const item = classScoresSummary[cId];
      item.avg = Math.round(item.totalScore / item.count);
    });
  }

  // Question Analytics: Find which questions were most frequently answered incorrectly
  const questionAnalytics = currentQuiz?.questions.map((q) => {
    let wrongCount = 0;
    let totalAttempts = 0;

    currentQuiz.participants.forEach((p) => {
      const ans = p.answers.find((a) => a.questionId === q.id);
      if (ans) {
        totalAttempts += 1;
        if (!ans.isCorrect) wrongCount += 1;
      }
    });

    const errorRate = totalAttempts > 0 ? Math.round((wrongCount / totalAttempts) * 100) : 0;

    return {
      question: q,
      totalAttempts,
      wrongCount,
      errorRate,
    };
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <span>Turnamen Kuis & Bank Soal Fisika</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kompetisi kuis seru interaktif: bisa 1 kelas atau duel turnamen antar-kelas dengan bonus kecepatan dan analisis kesulitan soal.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Turnamen Kuis Baru</span>
        </button>
      </div>

      {/* Tournament Selector Pill Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {quizzes.map((qz) => {
          const isSelected = selectedQuizId === qz.id;
          return (
            <button
              key={qz.id}
              onClick={() => setSelectedQuizId(qz.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {qz.isInterClass ? <Swords className="w-3.5 h-3.5 text-amber-300" /> : <Trophy className="w-3.5 h-3.5" />}
              <span>{qz.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">
                {qz.participants.length} Peserta
              </span>
            </button>
          );
        })}
      </div>

      {/* Tournament Details Area */}
      {currentQuiz ? (
        <div className="space-y-6">
          {/* Tournament Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {currentQuiz.isInterClass ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Swords className="w-3.5 h-3.5" />
                      Duel Antar Kelas (Inter-Class)
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      Turnamen Kelas
                    </span>
                  )}
                  <span className="text-xs text-slate-400">Topik: {currentQuiz.topic}</span>
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight">{currentQuiz.title}</h2>
                <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-indigo-400" />
                    {currentQuiz.timePerQuestion} detik / soal
                  </span>
                  <span>•</span>
                  <span>{currentQuiz.questions.length} Butir Soal</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    {currentQuiz.participants.length} Siswa Telah Bertanding
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
                  }}
                  className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Selebrasi Confetti</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Hapus turnamen "${currentQuiz.title}"?`)) {
                      onDeleteQuiz(currentQuiz.id);
                      setSelectedQuizId(quizzes.find((q) => q.id !== currentQuiz.id)?.id || null);
                    }
                  }}
                  className="p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-xl transition"
                  title="Hapus Turnamen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Inter-Class Clash Scoreboard (If it is a multi-class tournament) */}
          {currentQuiz.isInterClass && Object.keys(classScoresSummary).length > 0 && (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Swords className="w-4 h-4" />
                <span>Papan Skor Pertarungan Antar-Kelas</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(classScoresSummary).map(([cId, stats]) => {
                  const cls = classes.find((c) => c.id === cId);
                  return (
                    <div
                      key={cId}
                      className="p-4 rounded-xl border flex flex-col justify-between"
                      style={{
                        backgroundColor: cls ? `${cls.color}15` : '#1e293b',
                        borderColor: cls ? `${cls.color}40` : '#334155',
                      }}
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {cls?.name || 'Kelas'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {stats.count} siswa ikut serta
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-2xl font-black text-white font-mono">
                          {stats.avg}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">Rata-rata Poin</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtabs: Leaderboard vs Question Difficulty Analysis vs Question Bank */}
          <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard Peserta
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'analysis'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <BarChart className="w-4 h-4" />
              Evaluasi & Analisis Soal Sulit
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'questions'
                  ? 'border-rose-500 text-rose-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Bank Soal ({currentQuiz.questions.length})
            </button>
          </div>

          {/* Tab 1: Leaderboard */}
          {activeTab === 'leaderboard' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  Peringkat Skor Turnamen (Poin Benar + Bonus Kecepatan Waktu)
                </span>
                <span className="text-xs text-slate-400">
                  {currentQuiz.participants.length} Siswa
                </span>
              </div>

              {currentQuiz.participants.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  Belum ada siswa yang menyelesaikan kuis ini. Siswa dapat bermain langsung lewat Portal Siswa!
                </p>
              ) : (
                <div className="space-y-2">
                  {[...currentQuiz.participants]
                    .sort((a, b) => b.score - a.score)
                    .map((p, idx) => {
                      const cls = classes.find((c) => c.id === p.classId);
                      return (
                        <div
                          key={p.studentId}
                          className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                                  : idx === 1
                                  ? 'bg-slate-400 text-slate-950'
                                  : idx === 2
                                  ? 'bg-amber-700 text-amber-200'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs">{p.studentName}</span>
                                <span
                                  className="text-[10px] px-2 py-0.5 rounded font-semibold"
                                  style={{
                                    backgroundColor: cls ? `${cls.color}20` : '#334155',
                                    color: cls ? cls.color : '#cbd5e1',
                                  }}
                                >
                                  {cls?.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {p.correctCount}/{currentQuiz.questions.length} Benar • Waktu:{' '}
                                {p.timeTakenTotal} detik
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-black text-amber-400 font-mono">
                              {p.score} Pts
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Question Error Analytics */}
          {activeTab === 'analysis' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Analisis Kesalahan Siswa per Soal (Evaluasi Guru)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Ketahui topik atau butir soal mana yang paling banyak salah dijawab siswa untuk bahan pengulangan di kelas.
                </p>
              </div>

              <div className="space-y-3">
                {questionAnalytics.map((item, idx) => (
                  <div
                    key={item.question.id}
                    className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-rose-400">No {idx + 1}.</span>
                        <span className="text-slate-200 font-medium">{item.question.question}</span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          item.errorRate >= 50
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {item.errorRate}% Salah
                      </span>
                    </div>

                    <div className="pl-6 space-y-1">
                      <p className="text-[11px] text-emerald-400">
                        Kunci Jawaban: <strong>{item.question.options[item.question.correctIndex]}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        Pembahasan Guru: {item.question.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Question Bank List */}
          {activeTab === 'questions' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  Daftar Soal Pilihan Ganda ({currentQuiz.questions.length} Butir)
                </span>
              </div>

              <div className="space-y-4">
                {currentQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2.5 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-indigo-400">{idx + 1}.</span>
                      <p className="font-medium text-white">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg border text-xs ${
                            optIdx === q.correctIndex
                              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="mr-1.5 font-bold">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-400 italic pl-5 pt-1">
                      💡 Pembahasan: {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Trophy className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-400">Belum ada turnamen kuis.</p>
          <p className="text-xs">Klik "Buat Turnamen Kuis Baru" di atas untuk memulai duel kuis.</p>
        </div>
      )}

      {/* Modal Create Tournament */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2 text-rose-400">
                <Flame className="w-5 h-5 text-rose-400" />
                Buat Turnamen Kuis Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Judul Turnamen Kuis *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Duel Cerdas Fisika: Newton & Energi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Topik Bahasan
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Waktu per Soal (Detik)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mode Pertandingan
                  </label>
                  <select
                    value={isInterClass ? 'inter' : 'single'}
                    onChange={(e) => setIsInterClass(e.target.value === 'inter')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="inter">Turnamen Lintas Kelas (Adu Antar-Kelas)</option>
                    <option value="single">Kuis Khusus Per Kelas</option>
                  </select>
                </div>
              </div>

              {/* Class selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kelas yang Berpartisipasi
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleClassSelectionChange('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      targetClassIds.includes('all')
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Semua Kelas
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
                            ? 'text-white border-rose-400'
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

              {/* Bank Soal Builder */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Soal Turnamen ({questions.length} Butir)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBankPickerModal(true)}
                    className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>+ Ambil dari Bank Soal</span>
                  </button>
                </div>

                {/* Draft questions list */}
                {questions.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {questions.map((q, qIdx) => (
                      <div
                        key={q.id || qIdx}
                        className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="truncate flex-1">
                          <span className="font-bold text-rose-400 mr-1.5">{qIdx + 1}.</span>
                          <span className="text-slate-300">{q.question}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-[11px] font-medium text-slate-400">
                    Atau Ketik Butir Soal Baru Secara Manual:
                  </label>
                  <input
                    type="text"
                    placeholder="Tuliskan pertanyaan soal di sini..."
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Opsi A"
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opsi B"
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opsi C"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opsi D"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">
                        Kunci Jawaban Benar
                      </label>
                      <select
                        value={correctIdx}
                        onChange={(e) => setCorrectIdx(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold"
                      >
                        <option value={0}>Pilihan A</option>
                        <option value={1}>Pilihan B</option>
                        <option value={2}>Pilihan C</option>
                        <option value={3}>Pilihan D</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">
                        Pembahasan Singkat
                      </label>
                      <input
                        type="text"
                        placeholder="Penjelasan konsep..."
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestionToDraft}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-lg transition"
                  >
                    + Masukkan Soal ke Turnamen
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
                >
                  Terbitkan Turnamen
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
        title="Ambil Soal dari Bank Soal ke Turnamen Kuis"
        onSelectQuestions={(selected) => {
          const newQuizItems: QuizQuestion[] = selected.map((bq, i) => ({
            id: `qz-bank-${Date.now()}-${i}`,
            question: bq.question,
            options: bq.options,
            correctIndex: bq.correctIndex,
            explanation: bq.explanation,
            points: 100,
          }));
          setQuestions([...questions, ...newQuizItems]);
        }}
      />
    </div>
  );
};
