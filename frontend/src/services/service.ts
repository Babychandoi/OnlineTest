import axios from "axios";
import { ApiResponse, IntrospectResponse } from "../types/type";
import { Login, LoginResponse, LogoutRequest } from "../types/login";
import { UserResponse } from "../types/user";
import axiosClient from "./axioisClient";
import { ExamDetailResponse,  ExamResult, GradeWithSubjects, PaginatedResponse, ResultResponse } from "../types/exam";
import { Competition, CompetitionResponse } from "../types/competition";

const API_URL = "http://localhost:8080";
export const signIn = async (login : Login): Promise<ApiResponse<LoginResponse>> => {
    const response = await axios.post<ApiResponse<LoginResponse>>(`${API_URL}/auth/login`,login);
    return response.data;
}
export const checkToken = async (token: string): Promise<ApiResponse<IntrospectResponse>> => {
	const formData = {
		"token": token
	};	
	const response = await axios.post<ApiResponse<IntrospectResponse>>(`${API_URL}/auth/introspect`, formData,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	return response.data;

}
export const getProfile = async (): Promise<ApiResponse<UserResponse>> => {
    const response =  await axiosClient.get<ApiResponse<UserResponse>>(`/auth/me`);
    return response.data;
}
export const updateProfile = async (user : UserResponse): Promise<ApiResponse<Boolean>> => {
	const response =  await axiosClient.put<ApiResponse<Boolean>>(`/user/update`,user);
	return response.data;
}
export const logoutApi = async (loguot : LogoutRequest) => {
	await axios.post(`${API_URL}/auth/logout`,loguot);
}
export const signUp = async (form : Object) : Promise<ApiResponse<Boolean>> => {
	const response =  await axios.post<ApiResponse<Boolean>>(`${API_URL}/auth/users`,form);
	return response.data;
}
export const listSubjectsOfGrades = async() : Promise<ApiResponse<GradeWithSubjects[]>> => {
	const response = await axios.get<ApiResponse<GradeWithSubjects[]>>(`${API_URL}/admin/listSubjectsOfGrades`)
	return response.data;
}
export const listExams = async(
  subjectId: string, 
  gradeId: string, 
  page: number,
  size: number = 5
): Promise<PaginatedResponse> => {
  const response = await axios.get<PaginatedResponse>(
    `${API_URL}/exams/Exams`,
    { params: { subjectId, gradeId, page, size } }
  );
  return response.data;
}
export const getExamDetail = async(examId : string) :Promise<ApiResponse<ExamDetailResponse>> =>{
	const response = await axiosClient.get<ApiResponse<ExamDetailResponse>>(`/exams/exam`,{
		params : {examId}
	})
	return response.data;
}
export const resultExam = async(payload : Object) : Promise<ApiResponse<ExamResult>> => {
	const response = await axiosClient.post<ApiResponse<ExamResult>>('/exams/saveResult',payload);
	return response.data;
}
export const historyExam = async() : Promise<ApiResponse<ResultResponse[]>> => {
	const response = await axiosClient.get<ApiResponse<ResultResponse[]>>('/exams/results');
	return response.data;
}
export const getCompetition = async() : Promise<ApiResponse<Competition[]>> => {
	const response = await axios.get<ApiResponse<Competition[]>>(`${API_URL}/competitions/all`);
	return response.data;
}
export const addStudentForCompetition = async (competitionId : string) : Promise<ApiResponse<Boolean>> => {
	const response = await axiosClient.post<ApiResponse<Boolean>>(`/competitions/join`, null, {
		params: { competitionId }
	});
	return response.data;
}
export const getCompetitionsOfMe = async() :Promise<ApiResponse<Competition[]>> => {
	const response = await axiosClient.get<ApiResponse<Competition[]>>(`/competitions/me`);
	return response.data;
}
export const getCompetitionExam = async(competitionId : string) :Promise<ApiResponse<CompetitionResponse>> =>{
	const response = await axiosClient.get<ApiResponse<CompetitionResponse>>(`/competitions/exam`,{
		params : {competitionId}
	})
	return response.data;
}
export const resultCompetition = async (payload : Object,competitionId : string) :Promise<ApiResponse<ExamResult>> => {
	const response = await axiosClient.post<ApiResponse<ExamResult>>(`/competitions/saveResult/${competitionId}`,payload);
	return response.data;
}