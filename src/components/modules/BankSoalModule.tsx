import React, { useState } from 'react';
import { BankQuestion } from '../../types';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  Download,
  Upload,
  BookOpen,
  HelpCircle,
  Sparkles,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';

interface BankSoalModuleProps {
  bankQuestions: BankQuestion[];
  onAddQuestion: (question: Omit<BankQuestion, 'id' | 'createdAt'>) => void;
  onAddBulkQuestions: (questions: Omit<BankQuestion, 'id' | 'createdAt'>[]) => void;
  onDeleteQuestion: (id: string) => void;
}

export const BankSoalModule: React.FC<BankSoalModuleProps> = ({
  bankQuestions,
  onAddQuestion,
  onAddBulkQuestions,
  onDeleteQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ALL' | 'Mudah' | 'Sedang' | 'HOTS'>('ALL');

  // Manual Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [chapter, setChapter] = useState('Bab 1: Dinamika Litosfer');
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'HOTS'>('Sedang');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [explanation, setExplanation] = useState('');

  // Bulk Import Excel Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [importChapter, setImportChapter] = useState('Bab 1: Dinamika Litosfer');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [previewParsed, setPreviewParsed] = useState<Omit<BankQuestion, 'id' | 'createdAt'>[]>([]);

  // Distinct chapters
  const allChapters = Array.from(new Set(bankQuestions.map((q) => q.chapter)));

  // Filtered questions
  const filteredQuestions = bankQuestions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChapter = selectedChapter === 'ALL' || q.chapter === selectedChapter;
    const matchesDifficulty = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesChapter && matchesDifficulty;
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !opt0.trim() || !opt1.trim()) return;

    onAddQuestion({
      question: questionText.trim(),
      chapter: chapter.trim(),
      difficulty,
      options: [opt0.trim(), opt1.trim(), opt2.trim() || 'Pilihan C', opt3.trim() || 'Pilihan D'],
      correctIndex: correctOption,
      explanation: explanation.trim() || 'Penjelasan materi geografi',
      points: 100,
    });

    setQuestionText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
    setShowAddModal(false);
  };

  // Parser for Excel copy-paste (tab-separated or comma-separated)
  // Format per row: Pertanyaan \t Pilihan A \t Pilihan B \t Pilihan C \t Pilihan D \t Kunci (A/B/C/D atau 0..3) \t Pembahasan (opsional) \t Kesulitan (opsional)
  const parseExcelText = (text: string) => {
    const lines = text.split('\n');
    const parsedList: Omit<BankQuestion, 'id' | 'createdAt'>[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Split by tab (Excel copy default) or comma
      let cols = trimmed.split('\t');
      if (cols.length < 5) {
        cols = trimmed.split(';');
      }
      if (cols.length < 5) {
        cols = trimmed.split(',');
      }

      if (cols.length >= 5) {
        const q = cols[0]?.trim();
        const a = cols[1]?.trim() || '';
        const b = cols[2]?.trim() || '';
        const c = cols[3]?.trim() || '';
        const d = cols[4]?.trim() || '';
        const rawKey = cols[5]?.trim().toUpperCase() || 'A';
        const expl = cols[6]?.trim() || 'Pembahasan materi geografi';
        const diffRaw = cols[7]?.trim();

        let correctIdx = 0;
        if (rawKey === 'B' || rawKey === '1') correctIdx = 1;
        else if (rawKey === 'C' || rawKey === '2') correctIdx = 2;
        else if (rawKey === 'D' || rawKey === '3') correctIdx = 3;

        const diff: 'Mudah' | 'Sedang' | 'HOTS' =
          diffRaw === 'HOTS' ? 'HOTS' : diffRaw === 'Mudah' ? 'Mudah' : 'Sedang';

        if (q && a && b) {
          parsedList.push({
            question: q,
            chapter: importChapter,
            difficulty: diff,
            options: [a, b, c || 'Opsi C', d || 'Opsi D'],
            correctIndex: correctIdx,
            explanation: expl,
            points: 100,
          });
        }
      }
    });

    return parsedList;
  };

  const handlePasteChange = (val: string) => {
    setPasteContent(val);
    const parsed = parseExcelText(val);
    setPreviewParsed(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setPasteContent(text);
      const parsed = parseExcelText(text);
      setPreviewParsed(parsed);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (previewParsed.length > 0) {
      onAddBulkQuestions(previewParsed);
      setPasteContent('');
      setPreviewParsed([]);
      setShowImportModal(false);
    }
  };

  const handleCopyTemplate = () => {
    const sample = `Pertemuan lempeng tektonik yang menunjam ke bawah lempeng lain disebut...\tZona Subduksi (Konvergen)\tZona Divergen\tZona Transform\tPatahan San Andreas\tA\tSubduksi terjadi akibat konvergensi lempeng tektonik.\tSedang
Bentuk intrusi magma cembung ke atas dengan alas datar adalah...\tBatolit\tLakolit\tSill\tDiatrema\tB\tLakolit berbentuk lensa cembung di antara lapisan batuan sedimen.\tMudah
Unsur interpretasi citra untuk mengenali pola kelapa sawit berbentuk bintang adalah...\tBentuk dan Pola\tRona dan Bayangan\tUkuran dan Tekstur\tSitus dan Asosiasi\tA\tBentuk tajuk bintang dan pola tanam teratur rapi.\tHOTS`;
    navigator.clipboard.writeText(sample);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleExportBankCSV = () => {
    let csv = `Pertanyaan\tPilihan A\tPilihan B\tPilihan C\tPilihan D\tKunci Jawaban\tBab/Topik\tTingkat Kesulitan\tPembahasan\n`;
    bankQuestions.forEach((q) => {
      const keyLetter = String.fromCharCode(65 + q.correctIndex);
      csv += `"${q.question.replace(/"/g, '""')}"\t"${q.options[0].replace(/"/g, '""')}"\t"${q.options[1].replace(/"/g, '""')}"\t"${q.options[2].replace(/"/g, '""')}"\t"${q.options[3].replace(/"/g, '""')}"\t${keyLetter}\t"${q.chapter}"\t${q.difficulty || 'Sedang'}\t"${q.explanation.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bank_Soal_Geografi_${new Date().toISOString().slice(0, 10)}.tsv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Bank Soal Terpusat Geografi SMA</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola dan impor soal pilihan ganda dari Excel. Soal di sini dapat dipanggil langsung ke Penilaian (Tugas, UH, PTS, PAS) maupun Turnamen Kuis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportBankCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            title="Ekspor bank soal ke file Excel/TSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            <span>Ekspor Soal</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Impor dari Excel / CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Soal Manual</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400">Total Soal di Bank</span>
          <h4 className="text-xl font-bold text-white mt-0.5">{bankQuestions.length} Butir</h4>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-emerald-400">Kategori Mudah</span>
          <h4 className="text-xl font-bold text-emerald-300 mt-0.5">
            {bankQuestions.filter((q) => q.difficulty === 'Mudah').length} Butir
          </h4>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-indigo-400">Kategori Sedang</span>
          <h4 className="text-xl font-bold text-indigo-300 mt-0.5">
            {bankQuestions.filter((q) => !q.difficulty || q.difficulty === 'Sedang').length} Butir
          </h4>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-amber-400">Tingkat HOTS</span>
          <h4 className="text-xl font-bold text-amber-300 mt-0.5">
            {bankQuestions.filter((q) => q.difficulty === 'HOTS').length} Butir
          </h4>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* Chapter Filter */}
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Semua Bab Materi ({bankQuestions.length})</option>
            {allChapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Semua Tingkat Kesulitan</option>
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="HOTS">Level HOTS</option>
          </select>
        </div>

        <div className="relative flex-1 md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pertanyaan, opsi, konsep geografi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-3.5">
        {filteredQuestions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">Tidak ada butir soal yang sesuai filter.</p>
            <p className="text-xs">
              Gunakan tombol "Impor dari Excel" untuk memasukkan puluhan soal sekaligus dalam hitungan detik.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-3 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                    {q.chapter}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.difficulty === 'HOTS'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : q.difficulty === 'Mudah'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {q.difficulty || 'Sedang'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Hapus soal ini dari Bank Soal?')) {
                      onDeleteQuestion(q.id);
                    }
                  }}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Question Text */}
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed pl-8">
                {q.question}
              </p>

              {/* Options ABCD Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === q.correctIndex;
                  return (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                        isCorrect
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-semibold'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="pl-8 pt-1 text-[11px] text-slate-400 italic flex items-center gap-1.5">
                  <span className="text-indigo-400 font-bold not-italic">💡 Pembahasan:</span>
                  <span>{q.explanation}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Import Excel / CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-base flex items-center gap-2 text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
                Impor Soal dari Excel / CSV (Pilihan Ganda)
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 space-y-1">
              <p className="font-semibold">Format Kolom Excel (Copy langsung dari Spreadsheet):</p>
              <p className="text-[11px] text-slate-300">
                Kolom 1: <strong>Pertanyaan</strong> | Kolom 2: <strong>Pilihan A</strong> | Kolom 3: <strong>Pilihan B</strong> | Kolom 4: <strong>Pilihan C</strong> | Kolom 5: <strong>Pilihan D</strong> | Kolom 6: <strong>Kunci (A/B/C/D)</strong> | Kolom 7: <strong>Pembahasan</strong> | Kolom 8: <strong>Kesulitan (Mudah/Sedang/HOTS)</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-300">Bab Materi:</label>
                <input
                  type="text"
                  value={importChapter}
                  onChange={(e) => setImportChapter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Format Disalin!' : 'Salin Contoh Format'}</span>
                </button>

                <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pilih File CSV</span>
                  <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tempel (Paste) Baris Tabel dari Excel / Google Sheets di Sini:
              </label>
              <textarea
                rows={6}
                value={pasteContent}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder="Salin beberapa baris soal dari Excel dan paste langsung di sini..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Preview Parsed Count */}
            {previewParsed.length > 0 && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {previewParsed.length} butir soal terdeteksi dan siap dimasukkan ke Bank Soal!
                </span>
                <span className="text-slate-400 text-[11px]">
                  Contoh: "{previewParsed[0].question.slice(0, 35)}..."
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={previewParsed.length === 0}
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition"
              >
                Simpan {previewParsed.length} Soal ke Bank Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Manual Add Question */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-base flex items-center gap-2 text-indigo-400">
                <Plus className="w-5 h-5" />
                Tambah Butir Soal Baru ke Bank Soal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bab / Topik *</label>
                  <input
                    type="text"
                    required
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="HOTS">Level HOTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pertanyaan Soal *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan pertanyaan atau narasi kasus geografi..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">Pilihan Jawaban (A, B, C, D):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-400">A</span>
                    <input
                      type="text"
                      required
                      placeholder="Opsi A"
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-400">B</span>
                    <input
                      type="text"
                      required
                      placeholder="Opsi B"
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-400">C</span>
                    <input
                      type="text"
                      placeholder="Opsi C"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-400">D</span>
                    <input
                      type="text"
                      placeholder="Opsi D"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      className="w-full bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kunci Jawaban Benar</label>
                  <select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    <option value={2}>Pilihan C</option>
                    <option value={3}>Pilihan D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pembahasan Singkat</label>
                  <input
                    type="text"
                    placeholder="Ulasan konsep geografi..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs"
                >
                  Simpan ke Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
