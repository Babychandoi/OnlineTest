package org.example.onlinetest.repository;

import org.example.onlinetest.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, String> {
    List<Exam> findAllBySubjectOfGradeAndTeacher(SubjectOfGrade subjectOfGrade ,User teacher);
    List<Exam> findAllByTeacher(User teacher);
    Page<Exam> findAllBySubjectOfGrade(SubjectOfGrade subjectOfGrade, Pageable pageable);

    @Query("""
    SELECT DISTINCT g.id, g.name, s.id, s.name
    FROM Exam e
    JOIN e.subjectOfGrade sog
    JOIN sog.grade g
    JOIN sog.subject s
    WHERE e.teacher.id = :teacherId
    """)
    List<Object[]> findGradeSubjectsByTeacher(@Param("teacherId") String teacherId);
    Long countBySubjectOfGrade(SubjectOfGrade subjectOfGrade);
    Long countBySubjectOfGradeAndTeacher(SubjectOfGrade subjectOfGrade,User teacher);

}
