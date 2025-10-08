package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Grade;
import org.example.onlinetest.entity.Subject;
import org.example.onlinetest.entity.SubjectOfGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectOfGradeRepository extends JpaRepository<SubjectOfGrade,String> {
    SubjectOfGrade findBySubjectAndGrade(Subject subject, Grade grade);


}
