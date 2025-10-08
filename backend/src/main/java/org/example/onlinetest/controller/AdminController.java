package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.admin.response.SubjectsOfGradeResponse;
import org.example.onlinetest.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class AdminController {
    AdminService adminService;
    @PostMapping("/createGrade")
    ApiResponse<Boolean> createGrade(@RequestParam String name){
        return ApiResponse.<Boolean>builder()
                .data(adminService.createGrade(name))
                .message("Create grade successfully")
                .build();
    }
    @PostMapping("/createSubject")
    ApiResponse<Boolean> createSubject(@RequestParam String name){
        return ApiResponse.<Boolean>builder()
                .data(adminService.createSubject(name))
                .message("Create subject successfully")
                .build();
    }
    @PostMapping("/assignSubjectToGrade")
    ApiResponse<Boolean> assignSubjectToGrade(@RequestParam String subjectId, @RequestParam String gradeId){
        return ApiResponse.<Boolean>builder()
                .data(adminService.assignSubjectToGrade(subjectId, gradeId))
                .message("Assign subject to grade successfully")
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


}
