package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.admin.request.CompetitionRequest;
import org.example.onlinetest.dto.admin.request.EmployeesRequest;
import org.example.onlinetest.dto.admin.request.UserRequest;
import org.example.onlinetest.dto.admin.response.*;
import org.example.onlinetest.dto.admin.request.QuestionRequest;
import org.example.onlinetest.dto.user.request.ExamRequest;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;
import org.example.onlinetest.dto.user.response.QuestionResponse;
import org.example.onlinetest.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class AdminController {
    AdminService adminService;
    @PostMapping("/createGrade")
    ApiResponse<GradeResponse> createGrade(@RequestParam String name){
        return ApiResponse.<GradeResponse>builder()
                .data(adminService.createGrade(name))
                .message("Create grade successfully")
                .build();
    }
    @DeleteMapping("/deleteGrade/{id}")
    ApiResponse<Boolean> deleteGrade(@PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deleteGrade(id))
                .message("Delete grade successfully")
                .build();
    }
    @PutMapping("/updateGrade/{id}")
    ApiResponse<Boolean> updateGrade(@RequestParam String name, @PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.updateGrade(id,name))
                .message("Update grade successfully")
                .build();
    }
    @PostMapping("/createSubject")
    ApiResponse<SubjectResponse> createSubject(@RequestParam String name){
        return ApiResponse.<SubjectResponse>builder()
                .data(adminService.createSubject(name))
                .message("Create subject successfully")
                .build();
    }
    @DeleteMapping("/deleteSubject/{id}")
    ApiResponse<Boolean> deleteSubject(@PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deleteSubject(id))
                .message("Delete subject successfully")
                .build();
    }
    @PutMapping("/updateSubject/{id}")
    ApiResponse<Boolean> updateSubject(@RequestParam String name, @PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.updateSubject(id,name))
                .message("Update subject successfully")
                .build();
    }
    @PostMapping("/assignSubjectToGrade")
    ApiResponse<Boolean> assignSubjectToGrade(@RequestParam String subjectId, @RequestParam String gradeId){
        return ApiResponse.<Boolean>builder()
                .data(adminService.assignSubjectToGrade(gradeId, subjectId))
                .message("Assign subject to grade successfully")
                .build();
    }
    @DeleteMapping("/removeSubjectFromGrade")
    ApiResponse<Boolean> removeSubjectFromGrade(@RequestParam String subjectId, @RequestParam String gradeId){
        return ApiResponse.<Boolean>builder()
                .data(adminService.removeSubjectFromGrade(gradeId, subjectId))
                .message("Remove subject from grade successfully")
                .build();
    }
    @GetMapping("/listSubjectsOfGrades")
    ApiResponse<List<SubjectsOfGradeResponse>> listSubjectsOfGrades(){
        return ApiResponse.<List<SubjectsOfGradeResponse>>builder()
                .data(adminService.listSubjectsOfGrades())
                .message("List subjects of grades successfully")
                .build();
    }
    @GetMapping("/listSubjectsOfGradesOfUser")
    ApiResponse<List<SubjectsOfGradeResponse>> listSubjectsOfGradesOfUser(){
        return ApiResponse.<List<SubjectsOfGradeResponse>>builder()
                .data(adminService.listSubjectsOfGradesUser())
                .message("List subjects of grades successfully")
                .build();
    }
    @GetMapping("/getProfile")
    ApiResponse<UserResponse> getProfile(){
        return ApiResponse.<UserResponse>builder()
                .data(adminService.getProfile())
                .message("Get profile successfully")
                .build();
    }
    @GetMapping("/employees" )
    ResponseEntity<Page<UserResponse>> getEmployees(@RequestParam(required = false) String name,
                                                    @RequestParam(required = false) String email,
                                                    @RequestParam(required = false) String phone,
                                                    @RequestParam(defaultValue = "0", required = false) int page,
                                                    @RequestParam(defaultValue = "5", required = false) int size

    ){
        PageRequest pageable = PageRequest.of(page,size);
        Page<UserResponse> users = adminService.getEmployees(pageable, name, email, phone);
        return ResponseEntity.ok(users);
    }
    @GetMapping("/users" )
    ResponseEntity<Page<UserResponse>> getUsers(@RequestParam(required = false) String name,
                                                    @RequestParam(required = false) String email,
                                                    @RequestParam(required = false) String phone,
                                                    @RequestParam(required = false) String role,
                                                    @RequestParam(required = false) Boolean isPremium,
                                                    @RequestParam(defaultValue = "0", required = false) int page,
                                                    @RequestParam(defaultValue = "5", required = false) int size

    ){
        PageRequest pageable = PageRequest.of(page,size);
        Page<UserResponse> users = adminService.getUsers(pageable, name, email, phone,role,isPremium);
        return ResponseEntity.ok(users);
    }
    @PostMapping("/employee")
    ApiResponse<UserResponse> createEmployee(@RequestBody EmployeesRequest request){
        return ApiResponse.<UserResponse>builder()
                .data(adminService.createEmployee(request))
                .message("Create employee successfully")
                .build();
    }
    @DeleteMapping("/employee/{id}")
    ApiResponse<Boolean> deleteEmployee(@PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deleteEmployee(id))
                .message("Delete employee successfully")
                .build();
    }
    @PutMapping("/updateEmployee/{id}")
    ApiResponse<UserResponse> updateEmployee(@RequestBody EmployeesRequest userRequest , @PathVariable String id){
        return ApiResponse.<UserResponse>builder()
                .data(adminService.updateEmployee(userRequest,id))
                .message("Update employee successfully")
                .build();
    }
    @DeleteMapping("/user/{id}")
    ApiResponse<Boolean> deleteUser(@PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deleteUser(id))
                .message("Delete user successfully")
                .build();
    }
    @PutMapping("/updateUser/{id}")
    ApiResponse<UserResponse> updateUser(@RequestBody UserRequest userRequest , @PathVariable String id){
        return ApiResponse.<UserResponse>builder()
                .data(adminService.updateUser(userRequest,id))
                .message("Update user successfully")
                .build();
    }
    @GetMapping("/gradesSubjects" )
    ApiResponse<Object> getGradesSubjects(){
        return ApiResponse.<Object>builder()
                .data(adminService.subjectsGrades())
                .message("Get grades and subjects successfully")
                .build();
    }
    @GetMapping("/listSubjectsOfGradesForExam" )
    ApiResponse<List<SubjectsOfGradeResponse>> listSubjectsOfGradesForExam(){
        return ApiResponse.<List<SubjectsOfGradeResponse>>builder()
                .data(adminService.listSubjectsOfGradesForExam())
                .message("List subjects of grades successfully")
                .build();
    }
    @GetMapping("/exams")
    ResponseEntity<Page<ExamResponse>> getExam(@RequestParam String subjectId,
                                               @RequestParam String gradeId,
                                               @RequestParam(defaultValue = "0", required = false) int page,
                                               @RequestParam(defaultValue = "5", required = false) int size

    ){
        PageRequest pageable = PageRequest.of(page,size);
        Page<ExamResponse> exams = adminService.getExams(pageable, subjectId, gradeId);
        return ResponseEntity.ok(exams);
    }

    @PutMapping("/changeActiveExam/{id}")
    ApiResponse<Boolean> changeActiveExam(@PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.changeActive(id))
                .message("Change active exam successfully")
                .build();
    }@PutMapping("/changeTypeExam/{id}")
    ApiResponse<Boolean> changeType(@PathVariable String id,@RequestParam String type){
        return ApiResponse.<Boolean>builder()
                .data(adminService.changeType(id,type))
                .message("Change active exam successfully")
                .build();
    }
    @GetMapping("/exam")
    ApiResponse<ExamDetailResponse> getExamDetail(@RequestParam String examId){
        return ApiResponse.<ExamDetailResponse>builder()
                .data(adminService.getExamDetail(examId))
                .message("Get exam detail successfully")
                .build();
    }
    @PutMapping("/exam/questions/{questionId}")
    ApiResponse<Boolean> updateQuestion(@PathVariable String questionId, @RequestBody QuestionRequest questionRequest){
        return ApiResponse.<Boolean>builder()
                .data(adminService.updateQuestion(questionId,questionRequest))
                .build();

    }
    @DeleteMapping("/exam/questions/{questionId}")
    ApiResponse<Boolean> deleteQuestion(@PathVariable String questionId){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deleteQuestion(questionId))
                .build();

    }
    @PostMapping("/exam/questions/{examId}")
    ApiResponse<QuestionResponse> addQuestion(@PathVariable String examId, @RequestBody QuestionRequest questionRequest){
        return ApiResponse.<QuestionResponse>builder()
                .data(adminService.addQuestion(examId,questionRequest))
                .build();

    }
    @PutMapping("/exam/{examId}")
    ApiResponse<Boolean> updateExam(@PathVariable String examId, @RequestParam String title,
                                    @RequestParam int duration){
        return ApiResponse.<Boolean>builder()
                .data(adminService.updateExam(examId,title,duration))
                .message("Update exam successfully")
                .build();
    }
    @PostMapping("/create")
    ApiResponse<ExamResponse> createExam(@RequestBody ExamRequest examRequest){
        return ApiResponse.<ExamResponse>builder()
                .data(adminService.createExam(examRequest))
                .message("Create exam successfully")
                .build();
    }
    @GetMapping("/competitions")
    ResponseEntity<Page<CompetitionResponse>> getAllCompetitions( @RequestParam(defaultValue = "0", required = false) int page,
                                                                       @RequestParam(defaultValue = "5", required = false) int size,
                                                                       @RequestParam(required = false) String keyword,
                                                                          @RequestParam(required = false) Boolean type,
                                                                          @RequestParam(required = false) String status)
            {
        PageRequest pageable = PageRequest.of(page,size, Sort.by(Sort.Direction.DESC, "startDate"));
        Page<CompetitionResponse> competitions = adminService.getAllCompetitions(pageable, keyword,type,status);
        return ResponseEntity.ok(competitions);

    }
    @GetMapping("/competition/{id}")
    ApiResponse<CompetitionDetailResponse> getCompetitionDetail(@PathVariable String id){
        return ApiResponse.<CompetitionDetailResponse>builder()
                .data(adminService.getCompetitionDetail(id))
                .message("Get competition detail successfully")
                .build();
    }
    @DeleteMapping("/competition/{id}")
    ApiResponse<Boolean> deleteCompetition(@PathVariable String id){
        return ApiResponse.<Boolean>builder()
                .data(adminService.deleteCompetition(id))
                .message("Delete competition successfully")
                .build();
    }
    @PutMapping("/competition/{id}")
    ApiResponse<Boolean> updateCompetition(@PathVariable String id, @RequestBody CompetitionRequest request){
        return ApiResponse.<Boolean>builder()
                .data(adminService.updateCompetition(id,request))
                .message("Delete competition successfully")
                .build();
    }
    @PutMapping("/competition/{competitionId}/exam")
    ApiResponse<Boolean> updateExamOfCompetition(@PathVariable String competitionId, @RequestParam String examId){
        return ApiResponse.<Boolean>builder()
                .data(adminService.updateExamOfCompetition(competitionId,examId))
                .message("Update exam of competition successfully")
                .build();
    }
}
