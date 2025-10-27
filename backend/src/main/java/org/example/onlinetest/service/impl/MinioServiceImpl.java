package org.example.onlinetest.service.impl;

import io.minio.*;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.security.MinioConfig;
import org.example.onlinetest.service.MinioService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Service
public class MinioServiceImpl implements MinioService {
    MinioClient minioClient;
    MinioConfig minioConfig;

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            String bucket = minioConfig.getImagesBucket();
            return saveFile(file, bucket);
        } catch (Exception e) {
            log.error("Error uploading file to MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    private String saveFile(MultipartFile file, String bucket) throws IOException, ServerException,
            InsufficientDataException, InvalidKeyException, NoSuchAlgorithmException, XmlParserException, ErrorResponseException, InvalidResponseException, InternalException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        InputStream inputStream = file.getInputStream();
        boolean isExists = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucket).build());
        if (!isExists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder().bucket(bucket).build());
        }
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(filename)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );
        return minioConfig.getUrl() + "/" + bucket + "/" + filename;

    }
}
