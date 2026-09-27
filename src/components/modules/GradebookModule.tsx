import React, { useState } from 'react';
import { Student, ClassRoom, Assignment, Submission, GradeCategory } from '../../types';
import {
  Award,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Search,
  Printer
} from 'lucide-react';

interface GradebookModuleProps {
  students: Student[];
  classes: ClassRoom[];
  assignments: Assignment[];
  submissions: Submission[];
  activeClassId: string;
}

export const GradebookModule: React.FC<GradebookModuleProps> = ({
  students,
  classes,
  assignments,
  submissions,
  activeClassId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | GradeCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [passingGrade, setPassingGrade] = useState<number>(75); // KKM Fisika

  // Filter students based on active class & search query
  const filteredStudents = students.filter((s) => {
    const matchesClass = activeClassId === 'all' || s.classId === activeClassId;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  // Filter assignments based on category & active class
  const filteredAssignments = assignments.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesClass =
      activeClassId === 'all' ||
      a.targetClassIds.includes('all') ||
      a.targetClassIds.includes(activeClassId);
    return matchesCategory && matchesClass;
  });

  // Calculate student averages
  const studentRows = filteredStudents.map((std) => {
    const stdSubmissions = submissions.filter((s) => s.studentId === std.id);
    const scores: Record<string, number | null> = {};

    let totalScore = 0;
    let gradedCount = 0;

    filteredAssignments.forEach((asg) => {
      const sub = stdSubmissions.find((s) => s.assignmentId === asg.id);
      if (sub && sub.score !== undefined) {
        scores[asg.id] = sub.score;
        totalScore += sub.score;
        gradedCount += 1;
      } else {
        scores[asg.id] = null;
      }
    });

    const average = gradedCount > 0 ? Math.round(totalScore / gradedCount) : null;
    const isPassing = average !== null ? average >= passingGrade : null;

    return {
      student: std,
      scores,
      average,
      isPassing,
      gradedCount,
    };
  });

  // Class / Overall Summary Stats
  const validAverages = studentRows
    .map((r) => r.average)
    .filter((a): a is number => a !== null);

  const overallAvg =
    validAverages.length > 0
      ? Math.round(validAverages.reduce((a, b) => a + b, 0) / validAverages.length)
      : 0;

  const highestScore = validAverages.length > 0 ? Math.max(...validAverages) : 0;
  const lowestScore = validAverages.length > 0 ? Math.min(...validAverages) : 0;
  const passingCount = studentRows.filter((r) => r.isPassing === true).length;
  const passingRate =
    validAverages.length > 0 ? Math.round((passingCount / validAverages.length) * 100) : 0;

  // Export CSV handler
  const handleExportCSV = () => {
    let csv = `No,Nama Siswa,Kelas,NISN,`;
    filteredAssignments.forEach((a) => {
      csv += `"${a.title} (${a.category})",`;
    });
    csv += `Rata-Rata,Status KKM (${passingGrade})\n`;

    studentRows.forEach((row, idx) => {
      const clsName = classes.find((c) => c.id === row.student.classId)?.name || '';
      csv += `${idx + 1},"${row.student.name}","${clsName}","${row.student.nisn}",`;

      filteredAssignments.forEach((a) => {
        const sc = row.scores[a.id];
        csv += `${sc !== null ? sc : '-'},`;
      });

      csv += `${row.average !== null ? row.average : '-'},`;
      csv += `${row.isPassing === null ? 'Belum Ada Nilai' : row.isPassing ? 'Tuntas' : 'Remedial'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekap_Nilai_Fisika_${activeClassId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Gradebook & Rekap Nilai Pembelajaran</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Otomatisasi rekap nilai per kelas maupun gabungan angkatan dengan filter KKM dan ekspor CSV/Excel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel/CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            title="Cetak format cetak lembar nilai"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-300" />
            <span>Cetak Rapor</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Rata-rata Nilai</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-bold text-white">{overallAvg || 0}</h4>
            <span className="text-[11px] text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">Dari {validAverages.length} siswa dinilai</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Ketuntasan KKM ({passingGrade})</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-bold text-emerald-400">{passingRate}%</h4>
            <span className="text-[11px] text-slate-400">({passingCount} siswa tuntas)</span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">Mencapai target minimum</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Nilai Tertinggi</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-bold text-amber-400">{highestScore || 0}</h4>
            <span className="text-[11px] text-slate-400">Poin</span>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-1">Pencapaian terbaik</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Nilai Terendah</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-bold text-rose-400">{lowestScore || 0}</h4>
            <span className="text-[11px] text-slate-400">Poin</span>
          </div>
          <p className="text-[11px] text-rose-300/80 mt-1">Perlu remedial pendampingan</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'TUGAS', 'UH', 'PTS', 'PAS'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL'
                ? 'Semua Penilaian'
                : cat === 'TUGAS'
                ? 'Tugas Harian'
                : cat === 'UH'
                ? 'Ulangan Harian'
                : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>Standar KKM:</span>
            <input
              type="number"
              min="50"
              max="95"
              value={passingGrade}
              onChange={(e) => setPassingGrade(Number(e.target.value))}
              className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-emerald-400 focus:outline-none"
            />
          </div>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa / NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3">Kelas</th>
                {filteredAssignments.map((a) => (
                  <th key={a.id} className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="font-bold text-slate-300 block">{a.title}</span>
                    <span className="text-[9px] text-indigo-400 lowercase">({a.category})</span>
                  </th>
                ))}
                <th className="py-3 px-3 text-center bg-indigo-950/30 text-indigo-300 font-bold">
                  Rata-rata
                </th>
                <th className="py-3 px-3 text-center">Status KKM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {studentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5 + filteredAssignments.length}
                    className="py-10 text-center text-slate-500"
                  >
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              ) : (
                studentRows.map((row, idx) => {
                  const studentClass = classes.find((c) => c.id === row.student.classId);

                  return (
                    <tr key={row.student.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                        {row.student.name}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            backgroundColor: studentClass ? `${studentClass.color}20` : '#334155',
                            color: studentClass ? studentClass.color : '#cbd5e1',
                          }}
                        >
                          {studentClass?.name}
                        </span>
                      </td>

                      {/* Assignment scores */}
                      {filteredAssignments.map((a) => {
                        const sc = row.scores[a.id];
                        return (
                          <td key={a.id} className="py-3 px-3 text-center whitespace-nowrap font-mono">
                            {sc !== null ? (
                              <span
                                className={`font-semibold ${
                                  sc >= passingGrade ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {sc}
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Average */}
                      <td className="py-3 px-3 text-center bg-indigo-950/30 font-bold font-mono text-sm whitespace-nowrap">
                        {row.average !== null ? (
                          <span
                            className={
                              row.average >= passingGrade ? 'text-emerald-400' : 'text-amber-400'
                            }
                          >
                            {row.average}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.isPassing === null ? (
                          <span className="text-[10px] text-slate-500">Belum Ada Nilai</span>
                        ) : row.isPassing ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Tuntas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3" />
                            Remedial
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
