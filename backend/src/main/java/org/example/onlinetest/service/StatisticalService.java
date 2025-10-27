package org.example.onlinetest.service;

import org.example.onlinetest.dto.statistical.StatisticsDataDTO;

import java.time.LocalDateTime;

public interface StatisticalService {
    StatisticsDataDTO getStatisticsData(LocalDateTime startDate, LocalDateTime endDate);
}
