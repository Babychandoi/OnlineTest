package org.example.onlinetest.mapper;

import org.example.onlinetest.dto.*;
import org.example.onlinetest.dto.statistical.*;
import org.example.onlinetest.entity.*;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface StatisticalMapper {

    default UserDTO toUserDTO(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .createAt(user.getCreateAt())
                .isPremium(user.isPremium())
                .build();
    }

    default ExamDTO toExamDTO(Exam exam) {
        if (exam == null) return null;

        return ExamDTO.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .teacherId(exam.getTeacher() != null ? exam.getTeacher().getId() : null)
                .teacherName(exam.getTeacher() != null ? exam.getTeacher().getFullName() : null)
                .type(exam.getType())
                .totalQuestions(exam.getTotalQuestions())
                .totalScore(exam.getTotalScore())
                .durationMinutes(exam.getDurationMinutes())
                .createAt(exam.getCreateAt())
                .build();
    }

    default CompetitionDTO toCompetitionDTO(Competition competition) {
        if (competition == null) return null;

        return CompetitionDTO.builder()
                .id(competition.getId())
                .name(competition.getName())
                .description(competition.getDescription())
                .startDate(competition.getStartDate())
                .durationMinutes(competition.getDurationMinutes())
                .type(competition.getType())
                .examId(competition.getExam() != null ? competition.getExam().getId() : null)
                .examTitle(competition.getExam() != null ? competition.getExam().getTitle() : null)
                .build();
    }

    default ResultDTO toResultDTO(Result result) {
        if (result == null) return null;

        return ResultDTO.builder()
                .id(result.getId())
                .studentId(result.getStudent() != null ? result.getStudent().getId() : null)
                .studentName(result.getStudent() != null ? result.getStudent().getFullName() : null)
                .examId(result.getExam() != null ? result.getExam().getId() : null)
                .examTitle(result.getExam() != null ? result.getExam().getTitle() : null)
                .score(result.getScore())
                .totalScore(result.getExam() != null ? result.getExam().getTotalScore() : 0)
                .totalQuestionsCorrect(result.getTotalQuestionsCorrect())
                .submittedAt(result.getSubmittedAt())
                .build();
    }

    default UserForCompetitionDTO toUserForCompetitionDTO(UserForCompetition userForCompetition) {
        if (userForCompetition == null) return null;

        return UserForCompetitionDTO.builder()
                .id(userForCompetition.getId())
                .competitionId(userForCompetition.getCompetition() != null ?
                        userForCompetition.getCompetition().getId() : null)
                .competitionName(userForCompetition.getCompetition() != null ?
                        userForCompetition.getCompetition().getName() : null)
                .userId(userForCompetition.getUser() != null ?
                        userForCompetition.getUser().getId() : null)
                .userName(userForCompetition.getUser() != null ?
                        userForCompetition.getUser().getFullName() : null)
                .hasParticipated(userForCompetition.getHasParticipated())
                .registeredAt(userForCompetition.getRegisteredAt())
                .result(toResultDTO(userForCompetition.getResult()))
                .build();
    }

    // List mappers
    default List<UserDTO> toUserDTOList(List<User> users) {
        return users.stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    default List<ExamDTO> toExamDTOList(List<Exam> exams) {
        return exams.stream()
                .map(this::toExamDTO)
                .collect(Collectors.toList());
    }

    default List<CompetitionDTO> toCompetitionDTOList(List<Competition> competitions) {
        return competitions.stream()
                .map(this::toCompetitionDTO)
                .collect(Collectors.toList());
    }

    default List<ResultDTO> toResultDTOList(List<Result> results) {
        return results.stream()
                .map(this::toResultDTO)
                .collect(Collectors.toList());
    }

    default List<UserForCompetitionDTO> toUserForCompetitionDTOList(
            List<UserForCompetition> userForCompetitions) {
        return userForCompetitions.stream()
                .map(this::toUserForCompetitionDTO)
                .collect(Collectors.toList());
    }
}
