export interface Grade {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface GradeSubject {
  gradeId: string;
  subjectId: string;
}

export interface GradeResponse {
  id: string;
  name: string;
}

export interface SubjectResponse {
  id: string;
  name: string;
}

export interface SubjectsOfGradeResponse {
  id: string;
  name: string;
  subjects: SubjectResponse[];
}
export interface Object {
  subjects : SubjectResponse[];
  subjectsOfGrades : SubjectsOfGradeResponse[];
}