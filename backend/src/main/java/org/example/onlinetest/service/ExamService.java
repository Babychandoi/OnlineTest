package org.example.onlinetest.service;

import org.example.onlinetest.dto.user.request.ExamRequest;
import org.example.onlinetest.dto.user.request.ResultRequest;
import org.example.onlinetest.dto.user.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExamService {
    Boolean createExam(ExamRequest examRequest);
    List<ExamResponse> getExamsOfMe(String subjectId, String gradeId);
    Page<ExamResponse> getExams(Pageable pageable, String subjectId, String gradeId);
    List<GradeResponse> getGradesOfMe();
    List<SubjectResponse> getSubjectsOfMe(String gradeId);
    ExamDetailResponse getExamDetail(String examId);
    ResultResponse saveResult(ResultRequest request);
    List<ResultResponse> getResultsOfMe();
}
