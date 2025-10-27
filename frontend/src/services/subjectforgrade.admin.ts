import { SubjectResponse } from "../types/exam";
import { GradeResponse, Object } from "../types/subjectforgrade.admin";
import { ApiResponse } from "../types/type";
import axiosClient from "./axioisClient";

export const getSubjectForGrades = async() : Promise<ApiResponse<Object>>  => {
    const response = await axiosClient.get<ApiResponse<Object>>(`/admin/gradesSubjects`)
    return response.data;
}
export const deleteGrade = async (id : string) :Promise<ApiResponse<Boolean>> => {
    const response = await axiosClient.delete<ApiResponse<Boolean>>(`/admin/deleteGrade/${id}`);
    return response.data
}
export const deleteSubject = async (id : string) :Promise<ApiResponse<Boolean>> => {
    const response = await axiosClient.delete<ApiResponse<Boolean>>(`/admin/deleteSubject/${id}`);
    return response.data;
}
export const assignSubjectToGrade = async (subjectId : string, gradeId : string) :Promise<ApiResponse<Boolean>> =>{
    const response = await axiosClient.post<ApiResponse<Boolean>>(`/admin/assignSubjectToGrade`,null,{
        params :{subjectId, gradeId}
    });
    return response.data;
}
export const removeSubjectFromGrade = async (subjectId : string, gradeId : string) :Promise<ApiResponse<Boolean>> =>{
    const response = await axiosClient.delete<ApiResponse<Boolean>>(`/admin/removeSubjectFromGrade`, {
        params: { subjectId, gradeId }
    });
    return response.data;
}
export const createGrade = async (name : string) :Promise<ApiResponse<GradeResponse>> =>{
    const response = await axiosClient.post<ApiResponse<GradeResponse>>(`/admin/createGrade`,null, {
        params : {name}
    });
    return response.data;
}
export const createSubject = async (name : string) :Promise<ApiResponse<SubjectResponse>> =>{
    const response = await axiosClient.post<ApiResponse<SubjectResponse>>(`/admin/createSubject`,null, {
        params : {name}
    });
    return response.data;
}
export const updateGrade = async(id : string, name : string) :Promise<ApiResponse<Boolean>> =>{
    const response = await axiosClient.put<ApiResponse<Boolean>>(`/admin/updateGrade/${id}`,null,{
            params :{name}
        });
        return response.data;
}
export const updateSubject = async(id : string, name : string) :Promise<ApiResponse<Boolean>> =>{
    const response = await axiosClient.put<ApiResponse<Boolean>>(`/admin/updateSubject/${id}`,null,{
            params :{name}
        });
        return response.data;
}