package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, String> {
    @Query("SELECT g FROM Grade g LEFT JOIN FETCH g.gradeSubjects gs LEFT JOIN FETCH gs.subject")
    List<Grade> findAllWithSubjects();
}
