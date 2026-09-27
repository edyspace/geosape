import React, { useState } from 'react';
import { BankQuestion } from '../../types';
import { BookOpen, Search, CheckSquare, Square, X, Check } from 'lucide-react';

interface SelectFromBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankQuestions: BankQuestion[];
  onSelectQuestions: (selected: BankQuestion[]) => void;
  title?: string;
}

export const SelectFromBankModal: React.FC<SelectFromBankModalProps> = ({
  isOpen,
  onClose,
  bankQuestions,
  onSelectQuestions,
  title = 'Pilih Soal dari Bank Soal Geografi',
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');

  if (!isOpen) return null;

  const allChapters = Array.from(new Set(bankQuestions.map((q) => q.chapter)));

  const filtered = bankQuestions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesChapter = selectedChapter === 'ALL' || q.chapter === selectedChapter;
    return matchesSearch && matchesChapter;
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const currentFilteredIds = filtered.map((q) => q.id);
    const allAlreadySelected = currentFilteredIds.every((id) => selectedIds.includes(id));
    if (allAlreadySelected) {
      setSelectedIds(selectedIds.filter((id) => !currentFilteredIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentFilteredIds])));
    }
  };

  const handleConfirm = () => {
    const chosen = bankQuestions.filter((q) => selectedIds.includes(q.id));
    onSelectQuestions(chosen);
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 my-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base">{title}</h3>
              <p className="text-xs text-slate-400">Pilih soal pilihan ganda yang sudah tersimpan di Bank Soal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
          >
            <option value="ALL">Semua Bab ({bankQuestions.length})</option>
            {allChapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pertanyaan geografi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Action bar select all */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Pilih Semua ({filtered.length} soal tampil)
          </button>
          <span>{selectedIds.length} soal dipilih</span>
        </div>

        {/* List of questions */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              Tidak ada soal ditemukan pada filter ini.
            </p>
          ) : (
            filtered.map((q) => {
              const isChecked = selectedIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs flex items-start gap-3 ${
                    isChecked
                      ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="mt-0.5 text-indigo-400 flex-shrink-0">
                    {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-300 bg-indigo-950/80 px-2 py-0.2 rounded font-semibold">
                        {q.chapter}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{q.difficulty || 'Sedang'}</span>
                    </div>
                    <p className="font-medium text-slate-100">{q.question}</p>
                    <p className="text-[11px] text-emerald-400">
                      Kunci: {q.options[q.correctIndex]}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Masukkan ({selectedIds.length}) Soal Terpilih</span>
          </button>
        </div>
      </div>
    </div>
  );
};
