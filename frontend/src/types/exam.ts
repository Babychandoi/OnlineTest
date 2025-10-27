export interface GradeResponse {
  id: string;
  name: string;
}

export interface SubjectResponse {
  id: string;
  name: string;
  totalExams: number;
}
export interface SubjectRes{
  id: string;
  name: string;
}
export interface GradeWithSubjects extends GradeResponse {
  subjects: SubjectResponse[];
}


export interface QuestionResponse {
  id: string;
  content: string;
  answers: string[];
  score: number;
  image?: string;
}

export interface ExamDetailResponse {
  id: string;
  title: string;
  duration: number;
  type: 'FREE' | 'FEE';
  totalQuestions: number;
  totalScore: number;
  questions: QuestionResponse[];
}
export interface ExamResult {
  examTitle: string;
  score: number;
  submittedAt: string;
  totalQuestionsCorrect: number;
}
export interface ResultResponse {
    id: string;
    examTitle: string;
    score: number;
    totalQuestionsCorrect: number;
    submittedAt: string;
    totalQuestions: number;
    totalScore: number;
    grade: string;
    subject: string;
}
export interface ExamListProps {
  gradeId: string;
  gradeName: string;
  subjectId: string;
  subjectName: string;
  onBack: () => void;
  onExamClick: (examId: string) => void;
}

export interface ExamResponse {
  id: string;
  title: string;
  duration: number;
  type: 'FREE' | 'FEE';
  totalQuestions: number;
  totalScore: number;
}

export interface PaginatedResponse {
  content: ExamResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}
export type ExamType = 'FREE' | 'FEE';

export interface QuestionRequest {
  content: string;
  answers: string[];
  correct: string;
  score: number;
  image?: string;
}

export interface ExamRequest {
  title: string;
  duration: number;
  description: string;
  subjectId: string;
  gradeId: string;
  type: ExamType;
  questions: QuestionRequest[];
}