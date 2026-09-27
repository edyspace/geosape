import React, { useState, useEffect } from 'react';
import {
  Role,
  AppState,
  ClassRoom,
  Student,
  MaterialItem,
  Assignment,
  Submission,
  AppreciationRecord,
  QuizTournament,
  TeacherProfile,
  SupabaseSettings,
  BankQuestion
} from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/common/Navbar';
import { ClassSelector } from './components/common/ClassSelector';
import { SupabaseModal } from './components/common/SupabaseModal';
import { CreateClassModal } from './components/common/CreateClassModal';
import { DeleteDatabaseModal } from './components/common/DeleteDatabaseModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Stage Modules
import { ClassModule } from './components/modules/ClassModule';
import { MaterialModule } from './components/modules/MaterialModule';
import { BankSoalModule } from './components/modules/BankSoalModule';
import { AssignmentModule } from './components/modules/AssignmentModule';
import { GradebookModule } from './components/modules/GradebookModule';
import { AppreciationModule } from './components/modules/AppreciationModule';
import { QuizModule } from './components/modules/QuizModule';
import { StudentPortal } from './components/student/StudentPortal';

import {
  Users,
  BookOpen,
  FileSpreadsheet,
  ClipboardList,
  BarChart3,
  Sparkles,
  Flame
} from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => StorageService.loadState());
  const [currentRole, setCurrentRole] = useState<Role>('guru');
  const [activeTab, setActiveTab] = useState<
    'kelas' | 'materi' | 'bank-soal' | 'tugas' | 'nilai' | 'apresiasi' | 'kuis'
  >('kelas');
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showDeleteDbModal, setShowDeleteDbModal] = useState(false);

  // Auto-save state to localStorage whenever state changes
  useEffect(() => {
    StorageService.saveState(appState);
  }, [appState]);

  // Student counts map
  const studentCounts = appState.classes.reduce((acc, cls) => {
    acc[cls.id] = appState.students.filter((s) => s.classId === cls.id).length;
    return acc;
  }, {} as Record<string, number>);

  // Handlers for App State
  const handleSelectClass = (classId: string) => {
    setAppState((prev) => ({ ...prev, activeClassId: classId }));
  };

  const handleUpdateTeacher = (teacher: TeacherProfile) => {
    setAppState((prev) => ({ ...prev, teacher }));
  };

  const handleUpdateSupabaseSettings = (supabase: SupabaseSettings) => {
    setAppState((prev) => ({ ...prev, supabase }));
  };

  const handleAddClass = (newClass: Omit<ClassRoom, 'id'>) => {
    const id = `cls-${Date.now()}`;
    const created: ClassRoom = { id, ...newClass };
    setAppState((prev) => ({
      ...prev,
      classes: [...prev.classes, created],
      activeClassId: id,
    }));
  };

  const handleUpdateClass = (updated: ClassRoom) => {
    setAppState((prev) => ({
      ...prev,
      classes: prev.classes.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const handleDeleteClass = (classId: string) => {
    setAppState((prev) => ({
      ...prev,
      classes: prev.classes.filter((c) => c.id !== classId),
      students: prev.students.filter((s) => s.classId !== classId),
      activeClassId: prev.activeClassId === classId ? 'all' : prev.activeClassId,
    }));
  };

  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    const id = `std-${Date.now()}`;
    const newStudent: Student = { id, ...student };
    setAppState((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));
  };

  const handleAddBulkStudents = (
    classId: string,
    studentsData: { name: string; nisn?: string; gender?: 'L' | 'P' }[]
  ) => {
    const newStudents: Student[] = studentsData.map((d, i) => ({
      id: `std-${Date.now()}-${i}`,
      classId,
      name: d.name,
      nisn: d.nisn || `007${Math.floor(100000 + Math.random() * 900000)}`,
      gender: d.gender || 'L',
      points: 0,
      badges: ['Geograf Baru'],
    }));

    setAppState((prev) => ({
      ...prev,
      students: [...prev.students, ...newStudents],
    }));
  };

  const handleDeleteStudent = (studentId: string) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
      submissions: prev.submissions.filter((s) => s.studentId !== studentId),
      appreciations: prev.appreciations.filter((a) => a.studentId !== studentId),
    }));
  };

  const handleQuickStar = (
    studentId: string,
    classId: string,
    points: number,
    reason: string,
    category: any = 'keaktifan'
  ) => {
    const newRecord: AppreciationRecord = {
      id: `app-${Date.now()}`,
      studentId,
      classId,
      points,
      reason,
      category,
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      appreciations: [newRecord, ...prev.appreciations],
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, points: s.points + points } : s
      ),
    }));
  };

  const handleAddCustomBadge = (studentId: string, badgeName: string) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId && !s.badges.includes(badgeName)
          ? { ...s, badges: [...s.badges, badgeName] }
          : s
      ),
    }));
  };

  // Materials
  const handleAddMaterial = (
    newMat: Omit<MaterialItem, 'id' | 'completedByStudentIds' | 'createdAt'>
  ) => {
    const id = `mat-${Date.now()}`;
    const material: MaterialItem = {
      id,
      ...newMat,
      completedByStudentIds: [],
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      materials: [material, ...prev.materials],
    }));
  };

  const handleDeleteMaterial = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const handleDuplicateMaterial = (mat: MaterialItem, targetClassId: string) => {
    const id = `mat-${Date.now()}`;
    const duplicated: MaterialItem = {
      ...mat,
      id,
      title: `${mat.title} (Salinan)`,
      targetClassIds: [targetClassId],
      completedByStudentIds: [],
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      materials: [duplicated, ...prev.materials],
    }));
  };

  const handleMarkMaterialRead = (materialId: string, studentId: string) => {
    setAppState((prev) => ({
      ...prev,
      materials: prev.materials.map((m) => {
        if (m.id === materialId) {
          const already = m.completedByStudentIds.includes(studentId);
          return {
            ...m,
            completedByStudentIds: already
              ? m.completedByStudentIds.filter((id) => id !== studentId)
              : [...m.completedByStudentIds, studentId],
          };
        }
        return m;
      }),
    }));
  };

  // Bank Soal Handlers
  const handleAddBankQuestion = (newQ: Omit<BankQuestion, 'id' | 'createdAt'>) => {
    const id = `bq-${Date.now()}`;
    const question: BankQuestion = {
      id,
      ...newQ,
      createdAt: new Date().toISOString(),
    };
    setAppState((prev) => ({
      ...prev,
      bankQuestions: [question, ...prev.bankQuestions],
    }));
  };

  const handleAddBulkBankQuestions = (questions: Omit<BankQuestion, 'id' | 'createdAt'>[]) => {
    const newItems: BankQuestion[] = questions.map((q, i) => ({
      id: `bq-${Date.now()}-${i}`,
      ...q,
      createdAt: new Date().toISOString(),
    }));
    setAppState((prev) => ({
      ...prev,
      bankQuestions: [...newItems, ...prev.bankQuestions],
    }));
  };

  const handleDeleteBankQuestion = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      bankQuestions: prev.bankQuestions.filter((q) => q.id !== id),
    }));
  };

  // Assignments
  const handleAddAssignment = (asg: Omit<Assignment, 'id' | 'createdAt'>) => {
    const id = `asg-${Date.now()}`;
    const newAsg: Assignment = {
      id,
      ...asg,
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      assignments: [newAsg, ...prev.assignments],
    }));
  };

  const handleDeleteAssignment = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
      submissions: prev.submissions.filter((s) => s.assignmentId !== id),
    }));
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setAppState((prev) => ({
      ...prev,
      submissions: prev.submissions.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              score,
              feedback,
              gradedAt: new Date().toISOString(),
              gradedBy: prev.teacher.name,
            }
          : s
      ),
    }));
  };

  const handleSubmitAssignment = (sub: Omit<Submission, 'id' | 'submittedAt'>) => {
    const id = `sub-${Date.now()}`;
    const newSub: Submission = {
      id,
      ...sub,
      submittedAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      submissions: [newSub, ...prev.submissions],
    }));
  };

  // Quizzes
  const handleAddQuiz = (quiz: Omit<QuizTournament, 'id' | 'createdAt' | 'participants'>) => {
    const id = `quiz-${Date.now()}`;
    const newQuiz: QuizTournament = {
      id,
      ...quiz,
      participants: [],
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      quizzes: [newQuiz, ...prev.quizzes],
    }));
  };

  const handleDeleteQuiz = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      quizzes: prev.quizzes.filter((q) => q.id !== id),
    }));
  };

  const handleSubmitQuizAnswers = (
    quizId: string,
    studentId: string,
    studentName: string,
    classId: string,
    answers: { questionId: string; selected: number; isCorrect: boolean; timeSpent: number }[]
  ) => {
    const quiz = appState.quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    let totalScore = 0;
    let correctCount = 0;
    let totalTime = 0;

    answers.forEach((ans) => {
      totalTime += ans.timeSpent;
      if (ans.isCorrect) {
        correctCount += 1;
        const qItem = quiz.questions.find((q) => q.id === ans.questionId);
        const basePts = qItem?.points || 100;
        const speedBonus = Math.max(0, (quiz.timePerQuestion - ans.timeSpent) * 2);
        totalScore += basePts + speedBonus;
      }
    });

    const participant = {
      studentId,
      studentName,
      classId,
      score: totalScore,
      correctCount,
      timeTakenTotal: totalTime,
      completedAt: new Date().toISOString(),
      answers,
    };

    setAppState((prev) => ({
      ...prev,
      quizzes: prev.quizzes.map((q) => {
        if (q.id === quizId) {
          const filtered = q.participants.filter((p) => p.studentId !== studentId);
          return { ...q, participants: [...filtered, participant] };
        }
        return q;
      }),
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, points: s.points + Math.round(totalScore / 20) } : s
      ),
    }));
  };

  // Backup / Restore JSON
  const handleExportBackup = () => {
    StorageService.exportBackup(appState);
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.teacher && parsed.classes && parsed.students) {
          setAppState({
            ...parsed,
            bankQuestions: parsed.bankQuestions || [],
          });
          alert('Data berhasil dipulihkan dari file cadangan!');
        } else {
          alert('Format file cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    const res = StorageService.resetToDefault();
    setAppState(res);
  };

  const handleConfirmClearDatabase = () => {
    const emptyState = StorageService.clearDatabase();
    setAppState(emptyState);
    alert('Database telah dikosongkan!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onSwitchRole={setCurrentRole}
        teacher={appState.teacher}
        onUpdateTeacher={handleUpdateTeacher}
        supabase={appState.supabase}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onResetData={handleResetData}
        onOpenDeleteDbModal={() => setShowDeleteDbModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {currentRole === 'guru' ? (
          <>
            {/* Quick multi-class selector bar */}
            <ClassSelector
              classes={appState.classes}
              activeClassId={appState.activeClassId}
              onSelectClass={handleSelectClass}
              onOpenCreateClassModal={() => setShowCreateClassModal(true)}
              studentCounts={studentCounts}
            />

            {/* Stage Tabs Navigation */}
            <div className="flex border-b border-slate-800 gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setActiveTab('kelas')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'kelas'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>1. Kelas & Siswa</span>
              </button>

              <button
                onClick={() => setActiveTab('materi')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'materi'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>2. Materi</span>
              </button>

              <button
                onClick={() => setActiveTab('bank-soal')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'bank-soal'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>3. Bank Soal ({appState.bankQuestions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('tugas')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'tugas'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>4. Penilaian</span>
              </button>

              <button
                onClick={() => setActiveTab('nilai')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'nilai'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>5. Rekap Nilai</span>
              </button>

              <button
                onClick={() => setActiveTab('apresiasi')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'apresiasi'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>6. Bintang & Poin</span>
              </button>

              <button
                onClick={() => setActiveTab('kuis')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === 'kuis'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>7. Turnamen Kuis</span>
              </button>
            </div>

            {/* Active Module Content */}
            {activeTab === 'kelas' && (
              <ClassModule
                classes={appState.classes}
                students={appState.students}
                activeClassId={appState.activeClassId}
                onAddClass={handleAddClass}
                onUpdateClass={handleUpdateClass}
                onDeleteClass={handleDeleteClass}
                onAddStudent={handleAddStudent}
                onAddBulkStudents={handleAddBulkStudents}
                onDeleteStudent={handleDeleteStudent}
                onQuickStar={handleQuickStar}
              />
            )}

            {activeTab === 'materi' && (
              <MaterialModule
                materials={appState.materials}
                classes={appState.classes}
                students={appState.students}
                activeClassId={appState.activeClassId}
                onAddMaterial={handleAddMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onDuplicateMaterial={handleDuplicateMaterial}
              />
            )}

            {activeTab === 'bank-soal' && (
              <BankSoalModule
                bankQuestions={appState.bankQuestions}
                onAddQuestion={handleAddBankQuestion}
                onAddBulkQuestions={handleAddBulkBankQuestions}
                onDeleteQuestion={handleDeleteBankQuestion}
              />
            )}

            {activeTab === 'tugas' && (
              <AssignmentModule
                assignments={appState.assignments}
                submissions={appState.submissions}
                classes={appState.classes}
                students={appState.students}
                activeClassId={appState.activeClassId}
                bankQuestions={appState.bankQuestions}
                onAddAssignment={handleAddAssignment}
                onDeleteAssignment={handleDeleteAssignment}
                onGradeSubmission={handleGradeSubmission}
              />
            )}

            {activeTab === 'nilai' && (
              <GradebookModule
                students={appState.students}
                classes={appState.classes}
                assignments={appState.assignments}
                submissions={appState.submissions}
                activeClassId={appState.activeClassId}
              />
            )}

            {activeTab === 'apresiasi' && (
              <AppreciationModule
                students={appState.students}
                classes={appState.classes}
                appreciations={appState.appreciations}
                activeClassId={appState.activeClassId}
                onGiveStar={handleQuickStar}
                onAddCustomBadge={handleAddCustomBadge}
              />
            )}

            {activeTab === 'kuis' && (
              <QuizModule
                quizzes={appState.quizzes}
                classes={appState.classes}
                students={appState.students}
                activeClassId={appState.activeClassId}
                bankQuestions={appState.bankQuestions}
                onAddQuiz={handleAddQuiz}
                onDeleteQuiz={handleDeleteQuiz}
                onSimulateStudentParticipation={(quizId, studentId, answers) => {
                  const std = appState.students.find((s) => s.id === studentId);
                  if (std) handleSubmitQuizAnswers(quizId, std.id, std.name, std.classId, answers);
                }}
              />
            )}
          </>
        ) : (
          /* Student Portal */
          <StudentPortal
            classes={appState.classes}
            students={appState.students}
            materials={appState.materials}
            assignments={appState.assignments}
            submissions={appState.submissions}
            quizzes={appState.quizzes}
            onMarkMaterialRead={handleMarkMaterialRead}
            onSubmitAssignment={handleSubmitAssignment}
            onSubmitQuizAnswers={handleSubmitQuizAnswers}
          />
        )}
      </main>

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        appState={appState}
        onUpdateSupabaseSettings={handleUpdateSupabaseSettings}
      />

      {/* Add Class Modal */}
      <CreateClassModal
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        onAddClass={handleAddClass}
        academicYear={appState.teacher.academicYear}
      />

      {/* Delete Database Confirmation Modal */}
      <DeleteDatabaseModal
        isOpen={showDeleteDbModal}
        onClose={() => setShowDeleteDbModal(false)}
        onConfirmClearDatabase={handleConfirmClearDatabase}
        onResetToGeographySeed={handleResetData}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
