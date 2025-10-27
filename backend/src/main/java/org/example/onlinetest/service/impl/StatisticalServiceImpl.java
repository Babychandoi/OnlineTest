package org.example.onlinetest.service.impl;

import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.common.Role;
import org.example.onlinetest.dto.statistical.StatisticsDataDTO;
import org.example.onlinetest.entity.*;
import org.example.onlinetest.mapper.StatisticalMapper;
import org.example.onlinetest.repository.*;
import org.example.onlinetest.service.StatisticalService;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class StatisticalServiceImpl implements StatisticalService {

    UserRepository userRepository;
    ExamRepository examRepository;
    CompetitionRepository competitionRepository;
    ResultRepository resultRepository;
    UserForCompetitionRepository userForCompetitionRepository;
    StatisticalMapper statisticsMapper;
    @Override
    @Transactional
    public StatisticsDataDTO getStatisticsData(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null) {
            startDate = LocalDateTime.of(2000, 1, 1, 0, 0);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        // Chuyển đổi LocalDateTime sang Date cho các entity sử dụng Date
        Date startDateAsDate = Date.from(startDate.atZone(ZoneId.systemDefault()).toInstant());
        Date endDateAsDate = Date.from(endDate.atZone(ZoneId.systemDefault()).toInstant());

        List<Role> roles = List.of(Role.STUDENT, Role.TEACHER);
        // Lấy entities từ database
        List<User> users = userRepository.findByCreateAtBetweenAndRoleIn(startDate, endDate, roles);
        List<Exam> exams = examRepository.findByCreateAtBetween(startDate, endDate);
        List<Competition> competitions = competitionRepository
                .findByStartDateBetween(startDateAsDate, endDateAsDate);
        List<Result> results = resultRepository
                .findBySubmittedAtBetween(startDateAsDate, endDateAsDate);
        List<UserForCompetition> userCompetitions = userForCompetitionRepository
                .findByRegisteredAtBetween(startDateAsDate, endDateAsDate);

        // Chuyển đổi entities sang DTOs
        return StatisticsDataDTO.builder()
                .users(statisticsMapper.toUserDTOList(users))
                .exams(statisticsMapper.toExamDTOList(exams))
                .competitions(statisticsMapper.toCompetitionDTOList(competitions))
                .results(statisticsMapper.toResultDTOList(results))
                .userCompetitions(statisticsMapper.toUserForCompetitionDTOList(userCompetitions))
                .build();
    }
}
