import React, { useState } from 'react';
import { ClassRoom } from '../../types';
import { Layers, X, Plus } from 'lucide-react';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: (newClass: Omit<ClassRoom, 'id'>) => void;
  academicYear: string;
}

const PRESET_COLORS = [
  '#4f46e5', // indigo
  '#059669', // emerald
  '#7c3aed', // violet
  '#d97706', // amber
  '#dc2626', // red
  '#0284c7', // sky
  '#db2777', // pink
  '#0d9488', // teal
];

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onAddClass,
  academicYear,
}) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<'X' | 'XI' | 'XII'>('XI');
  const [inviteCode, setInviteCode] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode =
      inviteCode.trim() ||
      `FIS-${name.replace(/\s+/g, '-').toUpperCase()}`;

    onAddClass({
      name: name.trim(),
      grade,
      inviteCode: generatedCode,
      color,
      description: description.trim(),
      academicYear,
    });

    setName('');
    setInviteCode('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Tambah Kelas Baru (Rombel)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nama Kelas *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: XI MIPA 3 atau XII MIPA 3"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!inviteCode) {
                  setInviteCode(`FIS-${e.target.value.replace(/\s+/g, '-').toUpperCase()}`);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tingkat Kelas
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="X">Kelas X (Fase E)</option>
                <option value="XI">Kelas XI (Fase F)</option>
                <option value="XII">Kelas XII (Fase F)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kode Undangan Siswa
              </label>
              <input
                type="text"
                placeholder="FIS-XI-3"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
              />
            </div>
          </div>

          {/* Color theme for class */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Warna Tema Kelas
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Catatan / Jadwal Kelas (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: R.203 - Jadwal: Senin Jam 1-3 & Kamis Jam 4-5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs"
            >
              Simpan Kelas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
