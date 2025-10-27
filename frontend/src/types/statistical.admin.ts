export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createAt: string;
  isPremium: boolean;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  type: 'FREE' | 'FEE';
  totalQuestions: number;
  totalScore: number;
  durationMinutes: number;
  createAt: string;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  startDate: string;
  durationMinutes: number;
  type: boolean; // true: Premium, false: Free
  examId: string;
  examTitle: string;
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  score: number;
  totalScore: number;
  totalQuestionsCorrect: number;
  submittedAt: string;
}

export interface UserForCompetition {
  id: string;
  competitionId: string;
  competitionName: string;
  userId: string;
  userName: string;
  hasParticipated: boolean;
  registeredAt: string;
  result?: Result;
}

export interface MockData {
  users: User[];
  exams: Exam[];
  competitions: Competition[];
  results: Result[];
  userCompetitions: UserForCompetition[];
}

export interface DateRange {
  start: string;
  end: string;
}

export type ViewMode = 'day' | 'month' | 'year';

export interface PeriodData {
  period: string;
  count: number;
}

export interface Stats {
  totalExams: number;
  totalCompetitions: number;
  totalUsers: number;
  newStudents: number;
  newTeachers: number;
  examTakers: number;
  competitionStats: {
    participated: number;
    registered: number;
    passedCount: number;
    failedCount: number;
  };
  examsByPeriod: PeriodData[];
  competitionsByPeriod: PeriodData[];
  usersByPeriod: PeriodData[];
  resultsByPeriod: PeriodData[];
}