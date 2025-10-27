package org.example.onlinetest.service;

import org.example.onlinetest.dto.admin.request.CompetitionRequest;
import org.example.onlinetest.dto.admin.request.EmployeesRequest;
import org.example.onlinetest.dto.admin.request.QuestionRequest;
import org.example.onlinetest.dto.admin.request.UserRequest;
import org.example.onlinetest.dto.admin.response.*;
import org.example.onlinetest.dto.user.request.ExamRequest;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;
import org.example.onlinetest.dto.user.response.QuestionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {
    GradeResponse createGrade(String name);
    SubjectResponse createSubject(String name);
    Boolean assignSubjectToGrade(String gradeId, String subjectId);
    List<SubjectsOfGradeResponse> listSubjectsOfGrades();
    List<SubjectsOfGradeResponse> listSubjectsOfGradesUser();
    UserResponse getProfile();
    Page<UserResponse> getEmployees(Pageable pageable, String fullName, String email, String phone);
    UserResponse createEmployee(EmployeesRequest request);
    Boolean deleteEmployee(String id);
    UserResponse updateEmployee( EmployeesRequest request, String id);
    Page<UserResponse> getUsers(Pageable pageable, String fullName, String email, String phone, String role, Boolean isPremium);
    Boolean deleteUser(String id);
    UserResponse updateUser(UserRequest request, String id);
    Object subjectsGrades();
    Boolean deleteSubject(String id);
    Boolean deleteGrade(String id);
    Boolean removeSubjectFromGrade(String gradeId, String subjectId);
    Boolean updateGrade(String id, String name);
    Boolean updateSubject(String id, String name);
    List<SubjectsOfGradeResponse> listSubjectsOfGradesForExam();
    Page<ExamResponse> getExams(Pageable pageable, String subjectId, String gradeId);
    Boolean changeActive(String examId);
    Boolean changeType(String examId, String type);
    ExamDetailResponse getExamDetail(String examId);
    Boolean updateQuestion(String id, QuestionRequest questionRequest);
    Boolean deleteQuestion(String id);
    QuestionResponse addQuestion(String examId, QuestionRequest questionRequest);
    Boolean updateExam(String examId, String title, Integer duration);
    ExamResponse createExam(ExamRequest examRequest);
    Page<CompetitionResponse> getAllCompetitions(Pageable pageable, String keyword, Boolean type, String status);
    CompetitionDetailResponse getCompetitionDetail(String competitionId);
    Boolean deleteCompetition(String competitionId);
    Boolean updateCompetition(String id, CompetitionRequest request);
    Boolean updateExamOfCompetition(String competitionId, String examId);
}
