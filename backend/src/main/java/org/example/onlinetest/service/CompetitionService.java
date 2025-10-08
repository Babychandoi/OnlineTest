package org.example.onlinetest.service;

import org.example.onlinetest.dto.admin.request.CompetitionRequest;
import org.example.onlinetest.dto.admin.response.CompetitionExamResponse;
import org.example.onlinetest.dto.admin.response.CompetitionResponse;
import org.example.onlinetest.dto.user.request.ResultRequest;
import org.example.onlinetest.dto.user.response.CompetitionForMeResponse;
import org.example.onlinetest.dto.user.response.ResultResponse;

import java.util.List;

public interface CompetitionService {
    Boolean createCompetition(CompetitionRequest competitionRequest);
    Boolean addStudentToCompetition(String competitionId);
    List<CompetitionResponse> getAllCompetitions();
    List<CompetitionForMeResponse> getCompetitionsOfMe();
    CompetitionExamResponse getExam(String competitionId);
    ResultResponse saveResult(ResultRequest resultRequest, String competitionId);
}

