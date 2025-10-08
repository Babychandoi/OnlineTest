package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Result;
import org.example.onlinetest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, String> {
    List<Result> findByStudentOrderBySubmittedAtDesc(User student);

}
