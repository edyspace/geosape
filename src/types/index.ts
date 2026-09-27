export type Role = 'guru' | 'siswa';

export interface TeacherProfile {
  name: string;
  subject: string; // e.g. "Fisika"
  schoolName: string;
  academicYear: string; // e.g. "2024/2025"
  semester: 'Ganjil' | 'Genap';
  pin: string; // PIN akses guru
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "XI MIPA 1"
  grade: 'X' | 'XI' | 'XII';
  inviteCode: string;
  color: string;
  description?: string;
  academicYear: string;
  archived?: boolean;
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  nisn: string;
  gender: 'L' | 'P';
  points: number;
  badges: string[];
  avatarSeed?: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  chapter: string; // Bab / KD / Topik
  targetClassIds: string[]; // ['all'] or list of class IDs
  type: 'document' | 'video' | 'link' | 'pdf';
  content: string; // text explanation or markdown
  url?: string;
  publishDate: string;
  completedByStudentIds: string[]; // studentIds who marked "selesai dipelajari"
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  type: 'pg' | 'essay' | 'short';
  options?: string[]; // for PG
  correctOption?: number; // 0..3
  points: number;
}

export type GradeCategory = 'TUGAS' | 'UH' | 'PTS' | 'PAS';

export interface Assignment {
  id: string;
  title: string;
  chapter: string;
  category: GradeCategory;
  targetClassIds: string[]; // ['all'] or class IDs
  instructions: string;
  dueDate: string;
  maxScore: number;
  questions: QuestionItem[];
  allowFileUpload: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  classId: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> answer string
  fileUrl?: string;
  fileName?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface AppreciationRecord {
  id: string;
  studentId: string;
  classId: string;
  points: number;
  reason: string;
  category: 'keaktifan' | 'bertanya' | 'disiplin' | 'kerja_sama' | 'prestasi' | 'turnamen' | 'kustom';
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  timeLimitSeconds?: number;
  points: number;
}

export interface QuizParticipant {
  studentId: string;
  studentName: string;
  classId: string;
  score: number;
  correctCount: number;
  timeTakenTotal: number; // in seconds
  completedAt: string;
  answers: {
    questionId: string;
    selected: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

export interface QuizTournament {
  id: string;
  title: string;
  topic: string;
  targetClassIds: string[]; // bisa 1 kelas atau multi-kelas (XI MIPA 1 vs XI MIPA 2)
  isInterClass: boolean; // turnamen antar kelas
  timePerQuestion: number; // e.g. 20 seconds
  status: 'draft' | 'active' | 'completed';
  questions: QuizQuestion[];
  participants: QuizParticipant[];
  createdAt: string;
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  connected: boolean;
  lastSynced?: string;
}

export interface BankQuestion {
  id: string;
  question: string;
  chapter: string; // e.g. "Dinamika Litosfer", "Atmosfer & Iklim", "SIG & Penginderaan Jauh"
  difficulty?: 'Mudah' | 'Sedang' | 'HOTS';
  options: [string, string, string, string];
  correctIndex: number; // 0..3 (A, B, C, D)
  explanation: string;
  points: number;
  createdAt: string;
}

export interface AppState {
  teacher: TeacherProfile;
  classes: ClassRoom[];
  students: Student[];
  materials: MaterialItem[];
  assignments: Assignment[];
  submissions: Submission[];
  appreciations: AppreciationRecord[];
  quizzes: QuizTournament[];
  bankQuestions: BankQuestion[];
  activeClassId: string; // 'all' or specific class ID
  supabase: SupabaseSettings;
}
