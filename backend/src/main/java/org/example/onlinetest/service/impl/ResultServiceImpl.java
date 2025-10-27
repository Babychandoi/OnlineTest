package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.admin.response.CompetitionResponse;
import org.example.onlinetest.dto.user.response.ResultResponse;
import org.example.onlinetest.entity.Competition;
import org.example.onlinetest.repository.CompetitionRepository;
import org.example.onlinetest.service.ResultService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class ResultServiceImpl implements ResultService {
    CompetitionRepository competitionRepository;
    @Override
    @Transactional(readOnly = true)
    public List<CompetitionResponse> getTop10Competition() {
        List<Competition> competitions = competitionRepository.findTopEndedCompetitions(new Date(), PageRequest.of(0, 10));
        return competitions.stream()
                .map(competition -> CompetitionResponse.builder()
                        .id(competition.getId())
                        .title(competition.getName())
                        .description(competition.getDescription())
                        .startTime(String.valueOf(competition.getStartDate()))
                        .duration(competition.getDurationMinutes())
                        .type(competition.getType())
                        .subjectName(competition.getExam().getSubjectOfGrade().getSubject().getName())
                        .gradeName(competition.getExam().getSubjectOfGrade().getGrade().getName())
                        .registerStudent(competition.getRegisteredUsers().size())
                        .build()


                ).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResultResponse> getResultsByCompetition(String competitionId) {
        Competition competition = competitionRepository.findById(competitionId).orElse(null);
        assert competition != null;
        return competition.getRegisteredUsers().stream()
                .filter(registration -> registration.getResult() != null)
                .map(registration -> ResultResponse.builder()
                        .studentName(registration.getUser().getFullName())
                        .score(registration.getResult().getScore())
                        .totalQuestions(competition.getExam().getTotalQuestions())
                        .totalQuestionsCorrect(registration.getResult().getTotalQuestionsCorrect())
                        .totalScore(competition.getExam().getTotalScore())
                        .build()
                ).collect(Collectors.toList());
    }
}
