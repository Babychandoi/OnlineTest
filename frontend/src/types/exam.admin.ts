
// Interfaces
export interface SubjectResponse {
  id: string;
  name: string;
  totalExams?: number;
}

export interface SubjectsOfGradeResponse {
  id: string;
  name: string;
  subjects: SubjectResponse[];
}

export enum ExamType {
  FREE = 'FREE',        // Miễn phí
  FEE = 'FEE',          // Có phí
}

export interface ExamResponse {
  id: string;
  title: string;
  duration: number;
  type: ExamType;
  teacherName: string;
  teacherId: string;
  subjectId: string;
  subjectName: string;
  gradeName: string;
  gradeId: string;
  active: boolean;
  totalQuestions: number;
  totalScore: number;
}
export interface QuestionResponse {
  id: string;
  content: string;
  answers: string[];
  correctAnswer: string; // Nội dung đáp án đúng (string)
  score: number;
  image?: string;
}

export interface ExamDetailResponse {
  id: string;
  title: string;
  duration: number;
  type: 'FREE' | 'FEE';
  totalQuestions: number;
  questions: QuestionResponse[];
  teacherName?: string;
  subjectName?: string;
  gradeName?: string;
  active?: boolean;
  createdAt?: string;
}