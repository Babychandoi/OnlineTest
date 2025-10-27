package org.example.onlinetest.repository;

import org.example.onlinetest.entity.ResultDetailDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultDetailDocumentRepository extends MongoRepository<ResultDetailDocument, String> {
    void deleteByResultId(String resultId);
    List<ResultDetailDocument> findByDetailsQuestionId(String questionId);
    List<ResultDetailDocument> findByResultId(String resultId);


}
