package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Competition;
import org.example.onlinetest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, String> {
    List<Competition> findByStartDateAfter(Date currentDate);
    List<Competition> findByRegisteredUsersContainingAndStartDateAfter(User user , Date currentDate);
}
