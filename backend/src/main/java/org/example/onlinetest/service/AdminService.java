package org.example.onlinetest.service;

import org.example.onlinetest.dto.admin.response.SubjectsOfGradeResponse;

import java.util.List;

public interface AdminService {
    Boolean createGrade(String name);
    Boolean createSubject(String name);
    Boolean assignSubjectToGrade(String gradeId, String subjectId);
    List<SubjectsOfGradeResponse> listSubjectsOfGrades();
    List<SubjectsOfGradeResponse> listSubjectsOfGradesUser();
}
