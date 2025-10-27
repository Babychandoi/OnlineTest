package org.example.onlinetest.service;

import org.example.onlinetest.dto.admin.response.CompetitionResponse;
import org.example.onlinetest.dto.user.response.ResultResponse;

import java.util.List;

public interface ResultService {
    List<CompetitionResponse> getTop10Competition();
    List<ResultResponse> getResultsByCompetition(String competitionId);
}
