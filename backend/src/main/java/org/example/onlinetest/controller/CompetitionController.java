package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.admin.request.CompetitionRequest;
import org.example.onlinetest.dto.admin.response.CompetitionExamResponse;
import org.example.onlinetest.dto.admin.response.CompetitionResponse;
import org.example.onlinetest.dto.user.request.ResultRequest;
import org.example.onlinetest.dto.user.response.CompetitionForMeResponse;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;
import org.example.onlinetest.dto.user.response.ResultResponse;
import org.example.onlinetest.service.CompetitionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/competitions")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class CompetitionController {
    CompetitionService competitionService;
    @PostMapping("/create")
    ApiResponse<Boolean> create(@RequestBody CompetitionRequest request){
        return ApiResponse.<Boolean>builder()
                .data(competitionService.createCompetition(request))
                .message("Competition created successfully")
                .build();
    }
    @GetMapping("/me")
    ApiResponse<List<CompetitionForMeResponse>> getCompetitionsOfMe(){
        return ApiResponse.<List<CompetitionForMeResponse>>builder()
                .data(competitionService.getCompetitionsOfMe())
                .message("Competitions of me fetched successfully")
                .build();
    }
    @PostMapping("/join")
    ApiResponse<Boolean> addStudentToCompetition(@RequestParam String competitionId){
        return ApiResponse.<Boolean>builder()
                .data(competitionService.addStudentToCompetition(competitionId))
                .message("Student added to competition successfully")
                .build();
    }
    @GetMapping("/all")
    ApiResponse<List<CompetitionResponse>> getAllCompetitions(){
        return ApiResponse.<List<CompetitionResponse>>builder()
                .data(competitionService.getAllCompetitions())
                .message("Competitions fetched successfully")
                .build();
    }
    @GetMapping("/exam")
    ApiResponse<CompetitionExamResponse> getExamDetail(@RequestParam String competitionId){
        return ApiResponse.<CompetitionExamResponse>builder()
                .data(competitionService.getExam(competitionId))
                .message("Get exam detail successfully")
                .build();
    }
    @PostMapping("/saveResult/{competitionId}")
    ApiResponse<ResultResponse> saveResult(@RequestBody ResultRequest resultRequest,@PathVariable String competitionId){
        return ApiResponse.<ResultResponse>builder()
                .data(competitionService.saveResult(resultRequest, competitionId))
                .message("Save result successfully")
                .build();
    }
}
