package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.admin.response.CompetitionResponse;
import org.example.onlinetest.dto.user.response.ResultResponse;
import org.example.onlinetest.service.ResultService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/results")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class ResultController {
    ResultService resultService;
    @GetMapping("/top-competitions")
    ApiResponse<List<CompetitionResponse>> getTop10Competition(){
        return ApiResponse.<List<CompetitionResponse>>builder()
                .data(resultService.getTop10Competition())
                .message("Get top 10 competitions successfully")
                .build();
    }
    @GetMapping("/competition/results/{competitionId}")
    ApiResponse<List<ResultResponse>> getResultsByCompetition(@PathVariable String competitionId){
        return ApiResponse.<List<ResultResponse>>builder()
                .data(resultService.getResultsByCompetition(competitionId))
                .message("Get results by competition successfully")
                .build();
    }
}
