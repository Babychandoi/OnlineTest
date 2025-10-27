package org.example.onlinetest.controller;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.example.onlinetest.dto.ApiResponse;
import org.example.onlinetest.dto.statistical.StatisticsDataDTO;
import org.example.onlinetest.service.StatisticalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true , level = AccessLevel.PRIVATE)
public class StatisticalController {

    private final StatisticalService statisticalService;

    @GetMapping("/statistical")
    public ResponseEntity<ApiResponse<StatisticsDataDTO>> getStatisticsDataWithWrapper(
                                                                @RequestParam(required = false)
                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                                LocalDateTime startDate,

                                                                @RequestParam(required = false)
                                                                @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                                                LocalDateTime endDate
        ) {
                StatisticsDataDTO data = statisticalService.getStatisticsData(startDate, endDate);
                ApiResponse<StatisticsDataDTO> response = new ApiResponse<>(200, "Statistics data retrieved successfully", data);
                return ResponseEntity.ok(response);
    }
}
