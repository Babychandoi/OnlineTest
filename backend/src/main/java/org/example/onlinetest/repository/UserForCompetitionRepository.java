package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Competition;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.entity.UserForCompetition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserForCompetitionRepository extends JpaRepository<UserForCompetition, String> {
    UserForCompetition findByUserAndCompetition(User user, Competition competition);
}
