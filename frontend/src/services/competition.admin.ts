import axiosClient from "./axioisClient"
import { CompetitionDetailResponse, CompetitionRequest, CompetitionResponse } from "../types/competition.admin";
import { ApiResponse } from "../types/type";

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
export const listCompetitions = async (
  page: number = 0,
  size: number = 5,
  keyword? : string,
  type? : boolean,
  status? : string
) => {
  const response = await axiosClient.get<PageableResponse<CompetitionResponse>>(
    `/admin/competitions`,
    {
      params: {
        page,
        size,
        keyword,
        type,
        status
      }
    }
  );
  return response.data;
};
export const deleteCompetition = async (id: string): Promise<ApiResponse<Boolean>> => {
  const response = await axiosClient.delete<ApiResponse<Boolean>>(`/admin/competition/${id}`);
  return response.data;
};
export const getCompetitionDetail = async(competitionId: string) : Promise<ApiResponse<CompetitionDetailResponse>> => {
  const response = await axiosClient.get<ApiResponse<CompetitionDetailResponse>>(`/admin/competition/${competitionId}`);
  return response.data
}
export const createCompetition = async(competition : CompetitionRequest) :Promise<ApiResponse<Boolean>> => {
  const response = await axiosClient.post<ApiResponse<Boolean>>(`/competitions/create`,competition);
  return response.data;
}
export const updateCompetition = async (competitionId: string,data: Partial<CompetitionRequest>): Promise<any> => {
    const response = await axiosClient.put(`/admin/competition/${competitionId}`,data);
    return response.data;
};
export const updateCompetitionExam = async (competitionId: string, examId: string): Promise<any> => {
  const response = await axiosClient.put(`/admin/competition/${competitionId}/exam`,null,{
    params: { examId }
  });
    return response.data;
}