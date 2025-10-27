package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Competition;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.entity.UserForCompetition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface UserForCompetitionRepository extends JpaRepository<UserForCompetition, String> {
    UserForCompetition findByUserAndCompetition(User user, Competition competition);
    void deleteAllByUser(User user);
    List<UserForCompetition> findAllByCompetition(Competition competition);
    List<UserForCompetition> findByRegisteredAtBetween(Date startDate, Date endDate);
}
