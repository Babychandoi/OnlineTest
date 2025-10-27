export interface CompetitionResponse{
    id : string;
    title :string;
    description : string;
    duration : number;
    type : boolean;
    startTime : string;
    subjectName : string,
    gradeName : string,
    examId : string,
    examName : string,
}
export interface CompetitionDetailResponse extends CompetitionResponse{
    examName : string;
    registeredUsers : RegisteredUser[];
}
export interface RegisteredUser {
    id :string;
    fullName : string;
    email : string;
    phoneNumber : string;
    score : number;
    totalCorrectAnswers : number;
}
export interface CompetitionRequest {
  title: string;
  description: string;
  examId: string;
  startTime: string;
  type: boolean;
}

export interface CompetitionListResponse {
  content: CompetitionResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CompetitionFilters {
  status?: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'ALL';
  type?: 'FREE' | 'PREMIUM' | 'ALL';
  gradeId?: string;
  subjectId?: string;
  searchTerm?: string;
}

export interface CompetitionWithStatus extends CompetitionResponse {
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  endTime: string;
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

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}