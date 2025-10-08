package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.admin.response.SubjectResponse;
import org.example.onlinetest.dto.admin.response.SubjectsOfGradeResponse;
import org.example.onlinetest.entity.Grade;
import org.example.onlinetest.entity.Subject;
import org.example.onlinetest.entity.SubjectOfGrade;
import org.example.onlinetest.entity.User;
import org.example.onlinetest.repository.*;
import org.example.onlinetest.service.AdminService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Service
public class AdminServiceImpl implements AdminService {
    GradeRepository gradeRepository;
    SubjectRepository subjectRepository;
    SubjectOfGradeRepository subjectOfGradeRepository;
    ExamRepository examRepository;
    UserRepository userRepository;
    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean createGrade(String name) {
        try {
            gradeRepository.save(Grade.builder()
                    .name(name)
                    .build());
            return true;
        }catch (Exception e){
            log.error("Error in creating grade: {}", e.getMessage());
            throw new RuntimeException("Error in creating grade");
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean createSubject(String name) {
        try {
            subjectRepository.save(Subject.builder()
                    .name(name)
                    .build());
            return true;
        }catch (Exception e){
            log.error("Error in creating subject: {}", e.getMessage());
            throw new RuntimeException("Error in creating subject");
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean assignSubjectToGrade(String gradeId, String subjectId) {
        try {
            Grade grade = gradeRepository.findById(gradeId)
                    .orElseThrow(() -> new RuntimeException("Grade not found"));
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            SubjectOfGrade subjectOfGrade = SubjectOfGrade.builder()
                    .grade(grade)
                    .subject(subject)
                    .build();
            subjectOfGradeRepository.save(subjectOfGrade);
            return true;
        }catch (Exception e){
            log.error("Error in assigning subject to grade: {}", e.getMessage());
            throw new RuntimeException("Error in assigning subject to grade");
        }
    }

    public List<SubjectsOfGradeResponse> listSubjectsOfGrades() {
        try {
            List<Grade> grades = gradeRepository.findAllWithSubjects();
            return grades.stream()
                    .sorted(Comparator.comparingInt(g -> extractGradeNumber(g.getName())))
                    .map(g -> new SubjectsOfGradeResponse(
                            g.getId(),
                            g.getName(),
                            g.getGradeSubjects().stream()
                                    .map(gs -> {
                                        long count = examRepository.countBySubjectOfGrade(gs);
                                        return new SubjectResponse(
                                                gs.getSubject().getId(),
                                                gs.getSubject().getName(),
                                                count
                                        );
                                    })
                                    .toList()
                    ))
                    .toList();
        } catch (Exception e) {
            log.error("Error in listing subjects of grades: {}", e.getMessage());
            throw new RuntimeException("Error in listing subjects of grades");
        }
    }


    @Override
    public List<SubjectsOfGradeResponse> listSubjectsOfGradesUser() {
        try {
            // Lấy userId từ security context
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication != null ? authentication.getName() : null;

            if (userId == null || userId.isBlank()) {
                throw new RuntimeException("User ID is null in authentication context");
            }

            // Lấy thông tin user
            User teacher = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

            // Lấy danh sách grade-subject theo teacher
            List<Object[]> rows = examRepository.findGradeSubjectsByTeacher(userId);

            Map<String, SubjectsOfGradeResponse> grouped = new HashMap<>();

            for (Object[] row : rows) {
                String gradeId = (String) row[0];
                String gradeName = (String) row[1];
                String subjectId = (String) row[2];
                String subjectName = (String) row[3];

                // Lấy grade và subject, an toàn với Optional
                Grade grade = gradeRepository.findById(gradeId)
                        .orElseThrow(() -> new RuntimeException("Grade not found with id " + gradeId));
                Subject subject = subjectRepository.findById(subjectId)
                        .orElseThrow(() -> new RuntimeException("Subject not found with id " + subjectId));

                // Lấy SubjectOfGrade
                SubjectOfGrade sog = subjectOfGradeRepository.findBySubjectAndGrade(subject, grade);

                // Tạo response cho grade nếu chưa có
                grouped.computeIfAbsent(gradeId, id -> new SubjectsOfGradeResponse(
                        gradeId,
                        gradeName,
                        new ArrayList<>()
                ));

                SubjectsOfGradeResponse gradeResponse = grouped.get(gradeId);

                // Kiểm tra trùng môn học
                boolean exists = gradeResponse.getSubjects().stream()
                        .anyMatch(s -> s.getId().equals(subjectId));
                if (!exists) {
                    long examCount = examRepository.countBySubjectOfGradeAndTeacher(sog, teacher);
                    gradeResponse.getSubjects().add(new SubjectResponse(subjectId, subjectName, examCount));
                }
            }

            // Sắp xếp theo lớp (Lop 1 -> Lop 2 -> ...)
            return grouped.values().stream()
                    .sorted(Comparator.comparingInt(g -> {
                        try {
                            String[] parts = g.getName().split(" ");
                            return Integer.parseInt(parts[1]);
                        } catch (Exception e) {
                            return Integer.MAX_VALUE; // nếu tên không đúng format, đưa xuống cuối
                        }
                    }))
                    .toList();

        } catch (Exception e) {
            log.error("Error in listing subjects of grades for user: {}", e.getMessage());
            throw new RuntimeException("Error in listing subjects of grades for user", e);
        }
    }


    private int extractGradeNumber(String gradeName) {
        // Ví dụ: "Lop 10" -> 10
        try {
            String numberPart = gradeName.replaceAll("[^0-9]", ""); // giữ lại số
            return numberPart.isEmpty() ? 0 : Integer.parseInt(numberPart);
        } catch (NumberFormatException e) {
            return 0; // fallback nếu không parse được
        }
    }

}
