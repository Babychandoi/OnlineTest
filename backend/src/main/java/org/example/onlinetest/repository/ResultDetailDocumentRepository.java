package org.example.onlinetest.repository;

import org.example.onlinetest.entity.ResultDetailDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultDetailDocumentRepository extends MongoRepository<ResultDetailDocument, String> {

}
