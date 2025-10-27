package org.example.onlinetest.mapper;

import org.example.onlinetest.common.ExamType;
import org.example.onlinetest.dto.user.request.ExamRequest;
import org.example.onlinetest.dto.user.request.QuestionRequest;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;
import org.example.onlinetest.dto.user.response.ExamResponse;
import org.example.onlinetest.dto.user.response.QuestionResponse;
import org.example.onlinetest.entity.Exam;
import org.example.onlinetest.entity.Question;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExamMapper {
    default Exam toExam(ExamRequest examRequest){
        return Exam.builder()
                .title(examRequest.getTitle())
                .description(examRequest.getDescription())
                .durationMinutes(examRequest.getDuration())
                .type(examRequest.getType())
                .build();
    }
    default Question toQuestion(QuestionRequest questionRequest){
        return Question.builder()
                .content(questionRequest.getContent())
                .score(questionRequest.getScore())
                .correct(questionRequest.getCorrect())
                .answers(questionRequest.getAnswers())
                .build();
    }
    default ExamResponse toExamResponse(Exam exam){
        return ExamResponse.builder()
                .id(exam.getId())
                .duration(exam.getDurationMinutes())
                .title(exam.getTitle())
                .type(exam.getType())
                .totalQuestions(exam.getTotalQuestions())
                .totalScore(exam.getTotalScore())
                .build();
    }
    default ExamDetailResponse toExamDetailResponse(Exam exam , List<Question> questions){
        return ExamDetailResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .duration(exam.getDurationMinutes())
                .type(exam.getType())
                .totalQuestions(exam.getTotalQuestions())
                .totalScore(exam.getTotalScore())
                .questions(toQuestionResponse(questions))
                .build();
    }
    default ExamDetailResponse toExamDetailResponseAdmin(Exam exam , List<Question> questions){
        return ExamDetailResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .duration(exam.getDurationMinutes())
                .type(exam.getType())
                .totalQuestions(exam.getTotalQuestions())
                .totalScore(exam.getTotalScore())
                .questions(toQuestionResponseAdmin(questions))
                .active(exam.isActive())
                .build();
    }
    default List<QuestionResponse> toQuestionResponseAdmin(List<Question> question){
        return question.stream().map(q -> QuestionResponse.builder()
                .id(q.getId())
                .content(q.getContent())
                .answers(q.getAnswers())
                .score(q.getScore())
                .correctAnswer(q.getCorrect())
                .image(q.getImage() == null ? null : q.getImage())
                .build()).toList();
    }
    default List<QuestionResponse> toQuestionResponse(List<Question> question){
        return question.stream().map(q -> QuestionResponse.builder()
                .id(q.getId())
                .content(q.getContent())
                .answers(q.getAnswers())
                .score(q.getScore())
                .image(q.getImage() == null ? null : q.getImage())
                .build()).toList();
    }
}
