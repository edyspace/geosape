import React from 'react';
import { ClassRoom } from '../../types';
import { Layers, Plus, Users } from 'lucide-react';

interface ClassSelectorProps {
  classes: ClassRoom[];
  activeClassId: string;
  onSelectClass: (classId: string) => void;
  onOpenCreateClassModal: () => void;
  studentCounts: Record<string, number>;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classes,
  activeClassId,
  onSelectClass,
  onOpenCreateClassModal,
  studentCounts,
}) => {
  const totalStudents = Object.values(studentCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
        {/* All classes button */}
        <button
          onClick={() => onSelectClass('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
            activeClassId === 'all'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-950/60 ring-2 ring-indigo-400/40'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Kelas (Gabungan)</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            activeClassId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
          }`}>
            {totalStudents} Siswa
          </span>
        </button>

        {/* Individual class tabs */}
        {classes.map((cls) => {
          const isActive = activeClassId === cls.id;
          const count = studentCounts[cls.id] || 0;
          return (
            <button
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'text-white shadow-md ring-2'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
              style={{
                backgroundColor: isActive ? cls.color : undefined,
                boxShadow: isActive ? `0 4px 12px ${cls.color}40` : undefined,
                borderColor: isActive ? cls.color : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isActive ? '#ffffff' : cls.color }}
              />
              <span>{cls.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-black/20 text-white' : 'bg-slate-700/80 text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Add class button */}
        <button
          onClick={onOpenCreateClassModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 transition whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kelas</span>
        </button>
      </div>
    </div>
  );
};
