package org.example.onlinetest.repository;

import org.example.onlinetest.entity.Competition;
import org.example.onlinetest.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, String>, JpaSpecificationExecutor<Competition> {
    List<Competition> findByStartDateAfter(Date currentDate);
    @Query(
            value = "SELECT * FROM competitions " +
                    "WHERE DATE_ADD(startDate, INTERVAL durationMinutes MINUTE) < :currentDate " +
                    "ORDER BY startDate DESC",
            nativeQuery = true
    )
    List<Competition> findTopEndedCompetitions(
            @Param("currentDate") Date currentDate,
            Pageable pageable
    );
    List<Competition> findByStartDateBetween(Date startDate, Date endDate);

}
