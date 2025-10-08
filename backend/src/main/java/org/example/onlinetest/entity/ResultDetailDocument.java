package org.example.onlinetest.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "result_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultDetailDocument {

    @Id
    private String id;

    private String resultId; // ID của Result trong MySQL

    private List<ResultDetail> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultDetail {
        private String questionId;
        private String selectedOption;
        private String correctOption;
        private boolean isCorrect;
    }
}
