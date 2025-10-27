package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.user.request.ExamRequest;
import org.example.onlinetest.dto.user.request.ResultRequest;
import org.example.onlinetest.dto.user.response.*;
import org.example.onlinetest.service.ExamService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class ExamController {
    ExamService examService;
    @PostMapping("/create")
    ApiResponse<Boolean> createExam(@RequestBody ExamRequest examRequest){
        return ApiResponse.<Boolean>builder()
                .data(examService.createExam(examRequest))
                .message("Create exam successfully")
                .build();
    }
    @GetMapping("/ExamsOfMe")
    ApiResponse<List<ExamResponse>> getExamOfMe(@RequestParam String subjectId, @RequestParam String gradeId){
        return ApiResponse.<List<ExamResponse>>builder()
                .data(null)
                .message("Get exam of me successfully")
                .build();
    }
    @GetMapping("/Exams")
    ResponseEntity<Page<ExamResponse>> getExam(@RequestParam String subjectId,
                                               @RequestParam String gradeId,
                                               @RequestParam(defaultValue = "0", required = false) int page,
                                               @RequestParam(defaultValue = "15", required = false) int size

    ){
        PageRequest pageable = PageRequest.of(page,size);
        Page<ExamResponse> exams = examService.getExams(pageable, subjectId, gradeId);
        return ResponseEntity.ok(exams);
    }
    @GetMapping("/GradesOfMe")
    ApiResponse<List<GradeResponse>> getGradesOfMe(){
        return ApiResponse.<List<GradeResponse>>builder()
                .data(examService.getGradesOfMe())
                .message("Get grades of me successfully")
                .build();
    }
    @GetMapping("/SubjectsOfMe")
    ApiResponse<List<GradeResponse>> getSubjectsOfMe(@RequestParam String gradeId){
        return ApiResponse.<List<GradeResponse>>builder()
                .data(null)
                .message("Get subjects of me successfully")
                .build();
    }
    @GetMapping("/exam")
    ApiResponse<ExamDetailResponse> getExamDetail(@RequestParam String examId){
        return ApiResponse.<ExamDetailResponse>builder()
                .data(examService.getExamDetail(examId))
                .message("Get exam detail successfully")
                .build();
    }
    @PostMapping("/saveResult")
    ApiResponse<ResultResponse> saveResult(@RequestBody ResultRequest resultRequest){
        return ApiResponse.<ResultResponse>builder()
                .data(examService.saveResult(resultRequest))
                .message("Save result successfully")
                .build();
    }
    @GetMapping("/results")
    ApiResponse<List<ResultResponse>> getResultsOfMe(){
        return ApiResponse.<List<ResultResponse>>builder()
                .data(examService.getResultsOfMe())
                .message("Get results of me successfully")
                .build();
    }
    @GetMapping("/getGrades")
    ApiResponse<List<GradeResponse>> getGrades(){
        return ApiResponse.<List<GradeResponse>>builder()
                .data(examService.getGrades())
                .message("Get grades successfully")
                .build();
    }
    @GetMapping("/getSubjects")
    ApiResponse<List<SubjectRes>> getSubjects(@RequestParam String gradeId){
        return ApiResponse.<List<SubjectRes>>builder()
                .data(examService.getSubjects(gradeId))
                .message("Get subjects successfully")
                .build();
    }

}
