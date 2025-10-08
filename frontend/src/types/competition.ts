export interface Competition {
  id: string;
  title: string;
  description: string;
  duration: number;
  startTime: string;
  type: boolean;
  subjectName: string;
  gradeName: string;
  isRegistered? : boolean;
}

interface QuestionResponse {
  id: string;
  content: string;
  answers: string[];
  score: number;
  image?: string;
}

export interface CompetitionExamDetail {
  id: string;
  title: string;
  duration: number;
  type: 'FREE' | 'FEE';
  totalQuestions: number;
  totalScore: number;
  questions: QuestionResponse[];
}

export interface CompetitionResponse {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: boolean;
  startTime: string;
  subjectName: string;
  gradeName: string;
  competitionExam: CompetitionExamDetail;
}