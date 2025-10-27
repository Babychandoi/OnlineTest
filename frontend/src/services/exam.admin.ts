import { ExamDetailResponse, ExamResponse, QuestionResponse, SubjectsOfGradeResponse } from "../types/exam.admin";
import { ApiResponse } from "../types/type";
import axiosClient from "./axioisClient";


// Paginated response type
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

// API để lấy danh sách đề thi theo khối lớp và môn học (với phân trang)
export const listExamsByGradeAndSubject = async (
  gradeId: string,
  subjectId: string,
  page: number = 0,
  size: number = 15
) => {
  const response = await axiosClient.get<PageableResponse<ExamResponse>>(
    `/admin/exams`,
    {
      params: {
        gradeId,
        subjectId,
        page,
        size
      }
    }
  );
  return response.data;
};

// API để toggle trạng thái đề thi
export const toggleExamStatus = async (examId: string) :Promise<ApiResponse<Boolean>> => {
  const response = await axiosClient.put<ApiResponse<Boolean>>(`/admin/changeActiveExam/${examId}`);
  return response.data;
};

// API để lấy chi tiết đề thi
export const getExamDetail = async (examId: string) : Promise<ApiResponse<ExamDetailResponse>> => {
  const response = await axiosClient.get<ApiResponse<ExamDetailResponse>>(
    `/admin/exam`,{
      params : {examId}
    }
  );
  return response.data;
};

// API để tạo đề thi mới
export const createExam = async (data: Object):Promise<ApiResponse<ExamResponse>> => {
  const response = await axiosClient.post<ApiResponse<ExamResponse>>(
    `/admin/create`,
    data
  );
  return response.data;
};

// API để cập nhật đề thi
export const updateExam = async (examId: string, title : string, duration : number) : Promise<ApiResponse<Boolean>> => {
  const response = await axiosClient.put<ApiResponse<Boolean>>(
    `/admin/exam/${examId}`,
    null,{
      params : {title,duration}
    }
  );
  return response.data;
};

// API để xóa đề thi
export const deleteExam = async (examId: string) => {
  const response = await axiosClient.delete(
    `/admin/exams/${examId}`
  );
  return response.data;
};
export const listSubjectsOfGradesForExam = async() : Promise<ApiResponse<SubjectsOfGradeResponse[]>> =>{
    const response =  await axiosClient.get<ApiResponse<SubjectsOfGradeResponse[]>>(`/admin/listSubjectsOfGradesForExam`);
    return response.data;
}
export const toggleExamType = async(id : string,type : string) : Promise<ApiResponse<Boolean>> =>{
  const response = await axiosClient.put<ApiResponse<Boolean>>(`/admin/changeTypeExam/${id}`,null,{
    params : {type}
  })
  return response.data;
}

export const updateQuestion = async (
  questionId: string, 
  data: {
    content: string;
    answers: string[];
    correctAnswer: string;
    score: number;
    image?: string;
  }
): Promise<ApiResponse<Boolean>> => {
  const response = await axiosClient.put<ApiResponse<Boolean>>(`/admin/exam/questions/${questionId}`, data);
  return response.data;
};

export const deleteQuestion = async (questionId: string): Promise<ApiResponse<Boolean>> => {
  const response = await axiosClient.delete<ApiResponse<Boolean>>(`/admin/exam/questions/${questionId}`);
  return response.data;
};

export const createQuestion = async (examId: string, data: {
  content: string;
  answers: string[];
  correctAnswer: string;
  score: number;
  image?: string;
}): Promise<ApiResponse<QuestionResponse>> => {
  const response = await axiosClient.post<ApiResponse<QuestionResponse>>(`/admin/exam/questions/${examId}`, data);
  return response.data;
};
export const uploadFile = async(file : File) :Promise<ApiResponse<String>> => {
  const formData = new FormData();
	formData.append('file', file);
  
	const response = await axiosClient.post<ApiResponse<string>>(
		`/upload`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		}
	);
  
	return response.data;
}