package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.common.ErrorCode;
import org.example.onlinetest.common.ExamType;
import org.example.onlinetest.common.Role;
import org.example.onlinetest.dto.AppException;
import org.example.onlinetest.dto.admin.request.CompetitionRequest;
import org.example.onlinetest.dto.admin.request.EmployeesRequest;
import org.example.onlinetest.dto.admin.request.QuestionRequest;
import org.example.onlinetest.dto.admin.request.UserRequest;
import org.example.onlinetest.dto.admin.response.*;
import org.example.onlinetest.dto.user.request.ExamRequest;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;
import org.example.onlinetest.dto.user.response.QuestionResponse;
import org.example.onlinetest.entity.*;
import org.example.onlinetest.mapper.ExamMapper;
import org.example.onlinetest.repository.*;
import org.example.onlinetest.repository.specification.CompetitionSpecification;
import org.example.onlinetest.repository.specification.UserSpecification;
import org.example.onlinetest.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

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
    PaymentRepository paymentRepository;
    ResultRepository resultRepository;
    UserForCompetitionRepository userForCompetitionRepository;
    QuestionRepository questionRepository;
    ExamMapper examMapper;
    ResultDetailDocumentRepository resultDetailDocumentRepository;
    CompetitionRepository competitionRepository;
    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public GradeResponse createGrade(String name) {
        try {
            Grade grade =gradeRepository.save(Grade.builder()
                    .name(name)
                    .build());
            return new GradeResponse(grade.getId(), grade.getName());
        }catch (Exception e){
            log.error("Error in creating grade: {}", e.getMessage());
            throw new RuntimeException("Error in creating grade");
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public SubjectResponse createSubject(String name) {
        try {
            Subject subject = subjectRepository.save(Subject.builder()
                    .name(name)
                    .build());
            return SubjectResponse.builder()
                    .id(subject.getId())
                    .name(subject.getName())
                    .build();
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
            if(gradeId.equals(String.valueOf('1')) || subjectId.equals(String.valueOf('1'))){
                throw new RuntimeException("Cannot assign default grade or subject");
            }
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
                                        long count = examRepository.countBySubjectOfGradeAndActive(gs, true);
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
    public List<SubjectsOfGradeResponse> listSubjectsOfGradesForExam() {
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
    @Transactional
    public Page<ExamResponse> getExams(Pageable pageable, String subjectId, String gradeId) {
        try{
            SubjectOfGrade subjectOfGrade = subjectOfGradeRepository.findBySubjectAndGrade(
                    subjectRepository.findById(subjectId)
                            .orElseThrow(()-> new RuntimeException("Subject not found")),
                    gradeRepository.findById(gradeId)
                            .orElseThrow(()-> new RuntimeException("Grade not found"))
            );
            Page<Exam> exams = examRepository.findAllBySubjectOfGrade(subjectOfGrade, pageable);
            return exams.map(exam -> ExamResponse.builder()
                    .id(exam.getId())
                    .title(exam.getTitle())
                    .active(exam.isActive())
                    .duration(exam.getDurationMinutes())
                    .gradeId(exam.getSubjectOfGrade().getGrade().getId())
                    .gradeName(exam.getSubjectOfGrade().getGrade().getName())
                    .subjectId(exam.getSubjectOfGrade().getSubject().getId())
                    .subjectName(exam.getSubjectOfGrade().getSubject().getName())
                    .teacherId(exam.getTeacher().getId())
                    .teacherName(exam.getTeacher().getFullName())
                    .totalQuestions(exam.getTotalQuestions())
                    .totalScore(exam.getTotalScore())
                    .type(exam.getType())
                    .build());
        }catch (Exception e){
            log.error("Error getting exams: {}", e.getMessage());
            throw new RuntimeException("Error getting exams");
        }
    }

    @Override
    @Transactional
    public Boolean changeActive(String examId) {
        try{
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            exam.setActive(!exam.isActive());
            examRepository.save(exam);
            return true;
        }catch (Exception e){
            log.error("Error changing active status of exam: {}", e.getMessage());
            throw new RuntimeException("Error changing active status of exam");
        }
    }

    @Override
    @Transactional
    public Boolean changeType(String examId, String type) {
        try{
            if(!type.equals("FREE") && !type.equals("FEE")){
                throw new RuntimeException("Invalid type");
            }
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            exam.setType(ExamType.valueOf(type));
            examRepository.save(exam);
            return true;
        }catch (Exception e){
            log.error("Error changing type of exam: {}", e.getMessage());
            throw new RuntimeException("Error changing type of exam");
        }
    }

    @Override
    @Transactional
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

    @Override
    @Transactional
    public UserResponse getProfile() {
        try {
            var context = SecurityContextHolder.getContext();
            var authentication = context.getAuthentication();
            String userId = authentication.getName();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
            return UserResponse.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .build();
        }catch (Exception e){
            log.error("Error in getting profile: {}", e.getMessage());
            throw new RuntimeException("Error in getting profile");
        }
    }

    @Override
    @Transactional
    public Page<UserResponse> getEmployees(Pageable pageable, String fullName, String email, String phone) {
        try{
            Specification<User> spec = Specification.allOf(
                    UserSpecification.hasFullName(fullName),
                    UserSpecification.hasEmail(email),
                    UserSpecification.hasPhone(phone),
                    UserSpecification.hasRole(String.valueOf(Role.EMPLOYEES))
            );
            Page<User> users = userRepository.findAll(spec, pageable);
            return users.map(user -> UserResponse.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(String.valueOf(user.getRole()))
                    .build());
        }catch (Exception e){
            log.error("Error in getting employees: {}", e.getMessage());
            throw new RuntimeException("Error in getting employees");
        }
    }

    @Override
    @Transactional
    public UserResponse createEmployee(EmployeesRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_EXISTED);
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode("12345678"))
                .isPremium(false)
                .role(Role.EMPLOYEES)
                .build();

        User savedUser = userRepository.save(user);
        return UserResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(String.valueOf(savedUser.getRole()))
                .build();
    }


    @Override
    @Transactional
    public Boolean deleteEmployee(String id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + id));
            if(user.getRole() != Role.EMPLOYEES){
                throw new RuntimeException("User is not an employee");
            }
            userRepository.delete(user);
            return true;
        }catch (Exception e){
            log.error("Error in deleting employee: {}", e.getMessage());
            throw new RuntimeException("Error in deleting employee");
        }
    }
    @Transactional
    @Override
    public UserResponse updateEmployee(EmployeesRequest request, String id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + id));
            if(user.getRole() != Role.EMPLOYEES){
                throw new RuntimeException("User is not an employee");
            }
            if(request.getRole() != null){
                user.setRole(Role.valueOf(request.getRole()));
            }
            if(request.getEmail() != null && !request.getEmail().equals(user.getEmail())){
                if(userRepository.existsByEmail(request.getEmail())){
                    throw new RuntimeException("Email already exists");
                }
                user.setEmail(request.getEmail());
            }
            if(request.getFullName() != null){
                user.setFullName(request.getFullName());
            }
            if(request.getPhone() != null){
                user.setPhone(request.getPhone());
            }
            User updatedUser = userRepository.save(user);
            return UserResponse.builder()
                    .id(updatedUser.getId())
                    .fullName(updatedUser.getFullName())
                    .email(updatedUser.getEmail())
                    .phone(updatedUser.getPhone())
                    .role(String.valueOf(updatedUser.getRole()))
                    .build();
        }catch (Exception e){
            log.error("Error in updating employee: {}", e.getMessage());
            throw new RuntimeException("Error in updating employee");
        }
    }

    @Override
    @Transactional
    public Page<UserResponse> getUsers(Pageable pageable, String fullName, String email, String phone, String role, Boolean isPremium) {
        try {

            Specification<User> spec;

            if (role != null) {
                spec = Specification.allOf(
                        UserSpecification.hasFullName(fullName),
                        UserSpecification.hasEmail(email),
                        UserSpecification.hasPhone(phone),
                        UserSpecification.hasRole(role),
                        UserSpecification.hasIsPremium(isPremium)
                );
            }
            else {
                List<Role> roles = List.of(Role.STUDENT, Role.TEACHER);
                spec = Specification.allOf(
                        UserSpecification.hasFullName(fullName),
                        UserSpecification.hasEmail(email),
                        UserSpecification.hasPhone(phone),
                        UserSpecification.hasRoleIn(roles),
                        UserSpecification.hasIsPremium(isPremium)
                );
            }

            Page<User> users = userRepository.findAll(spec, pageable);
            return users.map(user -> UserResponse.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(String.valueOf(user.getRole()))
                    .isPremium(user.isPremium())
                    .startPremiumDate(user.getPremiumStart())
                    .endPremiumDate(user.getPremiumExpiry())
                    .build());

        } catch (Exception e) {
            log.error("Error in getting employees: {}", e.getMessage(), e);
            throw new RuntimeException("Error in getting employees");
        }
    }

    @Override
    @Transactional
    public Boolean deleteUser(String id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + id));
            List<Result> results = resultRepository.findAllByStudent(user);
            userForCompetitionRepository.deleteAllByUser(user);
            for(Result r : results){
                    resultDetailDocumentRepository.deleteByResultId(r.getId());

            }
            resultRepository.deleteAllByStudent(user);
            paymentRepository.deleteAllByUser(user);
            userRepository.delete(user);
            return true;
        } catch (Exception e){
            log.error("Error in deleting user: {}", e.getMessage());
            throw new RuntimeException("Error in deleting user");
        }
    }

    @Override
    @Transactional
    public UserResponse updateUser(UserRequest request, String id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + id));
            user.setRole(request.getRole());
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            if(request.getIsPremium()){
                user.setPremium(true);
                user.setPremiumStart(request.getStartPremiumDate());
                user.setPremiumExpiry(request.getEndPremiumDate());
            }else{
                user.setPremium(false);
                user.setPremiumStart(null);
                user.setPremiumExpiry(null);
            }
            User updatedUser = userRepository.save(user);
            UserResponse userResponse = UserResponse.builder()
                    .id(updatedUser.getId())
                    .fullName(updatedUser.getFullName())
                    .email(updatedUser.getEmail())
                    .phone(updatedUser.getPhone())
                    .role(String.valueOf(updatedUser.getRole()))
                    .isPremium(updatedUser.isPremium())
                    .build();
            if(updatedUser.isPremium()){
                userResponse.setStartPremiumDate(updatedUser.getPremiumStart());
                userResponse.setEndPremiumDate(updatedUser.getPremiumExpiry());
            }
            return userResponse;
        }catch (Exception e){
            log.error("Error in updating user: {}", e.getMessage());
            throw new RuntimeException("Error in updating user");
        }
    }

    @Override
    @Transactional
    public Object subjectsGrades() {
        List<Grade> grades = gradeRepository.findAll();
        List<Subject> subjects = subjectRepository.findAll();
        List<SubjectOfGrade> subjectOfGrades = subjectOfGradeRepository.findAll();

        // Danh sách môn học
        List<SubjectResponse> subjectResponses = subjects.stream()
                .map(s -> SubjectResponse.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .build())
                .toList();

        // ✅ Gom nhóm môn học theo lớp
        Map<String, List<SubjectResponse>> subjectsByGrade = subjectOfGrades.stream()
                .collect(Collectors.groupingBy(
                        sog -> sog.getGrade().getId(),
                        Collectors.mapping(
                                sog -> SubjectResponse.builder()
                                        .id(sog.getSubject().getId())
                                        .name(sog.getSubject().getName())
                                        .build(),
                                Collectors.toList()
                        )
                ));
        List<SubjectsOfGradeResponse> subjectsOfGradeResponses = grades.stream()
                .map(g -> new SubjectsOfGradeResponse(
                        g.getId(),
                        g.getName(),
                        subjectsByGrade.getOrDefault(g.getId(), List.of())
                ))
                .sorted(Comparator.comparingInt(g -> extractGradeNumber(g.getName())))
                .toList();

        // Trả về đối tượng tổng hợp
        Map<String, Object> result = new HashMap<>();
        result.put("subjects", subjectResponses);
        result.put("subjectsOfGrades", subjectsOfGradeResponses);
        return result;
    }

    @Override
    @Transactional
    public Boolean deleteSubject(String id) {
        try {
            if(id.equals("1")){
                throw new RuntimeException("Cannot delete default subject");
            }
            Subject subject = subjectRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Subject not found with id " + id));
            List<SubjectOfGrade> subjectOfGrades = subjectOfGradeRepository.findAllBySubject(subject);
            SubjectOfGrade subjectOfGrade = subjectOfGradeRepository.findBySubjectAndGrade(
                    subjectRepository.findById(String.valueOf('1')).orElseThrow(),
                    gradeRepository.findById(String.valueOf('1')).orElseThrow()
            );
            for(SubjectOfGrade sog : subjectOfGrades){
                List<Exam> exams = examRepository.findAllBySubjectOfGrade(sog);
                for(Exam exam : exams){
                    exam.setSubjectOfGrade(subjectOfGrade);
                    examRepository.save(exam);
                }
            }
            subjectOfGradeRepository.deleteAll(subjectOfGrades);
            subjectRepository.delete(subject);
            return true;
        }catch (Exception e){
            log.error("Error in deleting subject: {}", e.getMessage());
            throw new RuntimeException("Error in deleting subject");
        }
    }

    @Override
    @Transactional
    public Boolean deleteGrade(String id) {
        try {
            if(id.equals("1")){
                throw new RuntimeException("Cannot delete default grade");
            }
            Grade grade = gradeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Grade not found with id " + id));
            List<SubjectOfGrade> subjectOfGrades = subjectOfGradeRepository.findAllByGrade(grade);
            SubjectOfGrade subjectOfGrade = subjectOfGradeRepository.findBySubjectAndGrade(
                    subjectRepository.findById(String.valueOf('1')).orElseThrow(),
                    gradeRepository.findById(String.valueOf('1')).orElseThrow()
            );
            for(SubjectOfGrade sog : subjectOfGrades){
                List<Exam> exams = examRepository.findAllBySubjectOfGrade(sog);
                for(Exam exam : exams){
                    exam.setSubjectOfGrade(subjectOfGrade);
                    examRepository.save(exam);
                }
            }
            subjectOfGradeRepository.deleteAll(subjectOfGrades);
            gradeRepository.delete(grade);
            return true;
        }catch (Exception e){
            log.error("Error in deleting grade: {}", e.getMessage());
            throw new RuntimeException("Error in deleting grade");
        }
    }

    @Override
    @Transactional
    public Boolean removeSubjectFromGrade(String gradeId, String subjectId) {
        try {
            if(gradeId.equals(String.valueOf('1')) || subjectId.equals(String.valueOf('1'))){
                throw new RuntimeException("Cannot remove default grade or subject");
            }
            Grade grade = gradeRepository.findById(gradeId)
                    .orElseThrow(() -> new RuntimeException("Grade not found"));
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            SubjectOfGrade subjectOfGrade = subjectOfGradeRepository.findBySubjectAndGrade(subject, grade);
            if(subjectOfGrade == null){
                return true;
            }
            SubjectOfGrade defaultSog = subjectOfGradeRepository.findBySubjectAndGrade(
                    subjectRepository.findById(String.valueOf('1')).orElseThrow(),
                    gradeRepository.findById(String.valueOf('1')).orElseThrow()
            );
            List<Exam> exams = examRepository.findAllBySubjectOfGrade(subjectOfGrade);
            for(Exam exam : exams){
                exam.setSubjectOfGrade(defaultSog);
                examRepository.save(exam);
            }
            subjectOfGradeRepository.delete(subjectOfGrade);
            return true;
        }catch (Exception e){
            log.error("Error in removing subject from grade: {}", e.getMessage());
            throw new RuntimeException("Error in removing subject from grade");
        }
    }

    @Override
    @Transactional
    public Boolean updateGrade(String id, String name) {
        try {
            Grade grade = gradeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Grade not found with id " + id));
            grade.setName(name);
            gradeRepository.save(grade);
            return true;
        }catch (Exception e){
            log.error("Error in updating grade: {}", e.getMessage());
            throw new RuntimeException("Error in updating grade");
        }
    }

    @Override
    @Transactional
    public Boolean updateSubject(String id, String name) {
        try {
            Subject subject = subjectRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Subject not found with id " + id));
            subject.setName(name);
            subjectRepository.save(subject);
            return true;
        }catch (Exception e){
            log.error("Error in updating subject: {}", e.getMessage());
            throw new RuntimeException("Error in updating subject");
        }
    }
    @Override
    @Transactional
    public ExamDetailResponse getExamDetail(String examId) {
        try {
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            List<Question> question = questionRepository.findAllByExamId(examId);
            return examMapper.toExamDetailResponseAdmin(exam, question);
        }catch (Exception e){
            log.error("Error getting exam detail: {}", e.getMessage());
            throw new RuntimeException("Error getting exam detail");
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEES')")
    public Boolean updateQuestion(String id, QuestionRequest questionRequest) {
        try {
            Question question = questionRepository.findById(id).orElseThrow(()-> new RuntimeException("Question not found"));
            question.setContent(questionRequest.getContent());
            question.setAnswers(questionRequest.getAnswers());
            question.setCorrect(questionRequest.getCorrectAnswer());
            question.setScore(questionRequest.getScore());
            if(questionRequest.getImage() != null){
                question.setImage(questionRequest.getImage());
            }
            questionRepository.save(question);
            List<ResultDetailDocument> resultDetailDocuments = resultDetailDocumentRepository.findByDetailsQuestionId(id);
            for(ResultDetailDocument rdd : resultDetailDocuments){
                boolean needsUpdate = false;
                for(ResultDetailDocument.ResultDetail rd : rdd.getDetails()){
                    if(rd.getQuestionId().equals(id)){
                        if(!rd.getCorrectOption().equals(questionRequest.getCorrectAnswer())){
                            rd.setCorrectOption(questionRequest.getCorrectAnswer());
                            rd.setCorrect(rd.getSelectedOption() != null && rd.getSelectedOption().equals(questionRequest.getCorrectAnswer()));
                            needsUpdate = true;
                        }
                    }
                }
                if(needsUpdate){
                    resultDetailDocumentRepository.save(rdd);
                    // Cập nhật lại điểm số trong bảng Result
                    Result result = resultRepository.findById(rdd.getResultId())
                            .orElseThrow(()-> new RuntimeException("Result not found with id " + rdd.getResultId()));
                    List<ResultDetailDocument> rdds = resultDetailDocumentRepository.findByResultId(result.getId());
                    int totalScore = 0;
                    for(ResultDetailDocument doc : rdds){
                        for(ResultDetailDocument.ResultDetail detail : doc.getDetails()){
                            if(detail.isCorrect()){
                                totalScore += questionRequest.getScore();
                            }
                        }
                    }
                    result.setScore(totalScore);
                    resultRepository.save(result);
                }
            }
            return true;
        }catch (Exception e){
            log.error("Error update question : {}", e.getMessage());
            throw new RuntimeException("Error update question");
        }
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEES')")
    public Boolean deleteQuestion(String id) {
        try {
            Question question = questionRepository.findById(id).orElseThrow(()-> new RuntimeException("Question not found"));
            List<ResultDetailDocument> resultDetailDocuments = resultDetailDocumentRepository.findByDetailsQuestionId(id);
            for(ResultDetailDocument rdd : resultDetailDocuments){
                boolean needsUpdate = false;
                Iterator<ResultDetailDocument.ResultDetail> iterator = rdd.getDetails().iterator();
                while (iterator.hasNext()) {
                    ResultDetailDocument.ResultDetail rd = iterator.next();
                    if (rd.getQuestionId().equals(id)) {
                        iterator.remove(); // Xóa câu hỏi khỏi danh sách
                        needsUpdate = true;
                    }
                }
                if(needsUpdate){
                    resultDetailDocumentRepository.save(rdd);
                    // Cập nhật lại điểm số trong bảng Result
                    Result result = resultRepository.findById(rdd.getResultId())
                            .orElseThrow(()-> new RuntimeException("Result not found with id " + rdd.getResultId()));
                    List<ResultDetailDocument> rdds = resultDetailDocumentRepository.findByResultId(result.getId());
                    int totalScore = 0;
                    for(ResultDetailDocument doc : rdds){
                        for(ResultDetailDocument.ResultDetail detail : doc.getDetails()){
                            if(detail.isCorrect()){
                                Question q = questionRepository.findById(detail.getQuestionId())
                                        .orElseThrow(()-> new RuntimeException("Question not found with id " + detail.getQuestionId()));
                                totalScore += q.getScore();
                            }
                        }
                    }
                    result.setScore(totalScore);
                    resultRepository.save(result);
                }
            }
            Exam exam = examRepository.findById(question.getExamId())
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            exam.setTotalQuestions(exam.getTotalQuestions() - 1);
            exam.setTotalScore(exam.getTotalScore() - question.getScore());
            examRepository.save(exam);
            questionRepository.delete(question);
            return true;
        }catch (Exception e){
            log.error("Error delete question : {}", e.getMessage());
            throw new RuntimeException("Error delete question");
        }
    }

    @Override
    @Transactional
    public QuestionResponse addQuestion(String examId, QuestionRequest questionRequest) {
        try{
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            Question question = Question.builder()
                    .content(questionRequest.getContent())
                    .answers(questionRequest.getAnswers())
                    .correct(questionRequest.getCorrectAnswer())
                    .score(questionRequest.getScore())
                    .examId(examId)
                    .build();
            if(questionRequest.getImage() != null){
                question.setImage(questionRequest.getImage());
            }
            Question savedQuestion = questionRepository.save(question);
            exam.setTotalQuestions(exam.getTotalQuestions() + 1);
            exam.setTotalScore(exam.getTotalScore() + questionRequest.getScore());
            examRepository.save(exam);
            return QuestionResponse.builder()
                    .id(savedQuestion.getId())
                    .content(savedQuestion.getContent())
                    .answers(savedQuestion.getAnswers())
                    .correctAnswer(savedQuestion.getCorrect())
                    .score(savedQuestion.getScore())
                    .image(savedQuestion.getImage() != null ? savedQuestion.getImage() : null)
                    .build();
        }catch (Exception e){
            log.error("Error add question : {}", e.getMessage());
            throw new RuntimeException("Error add question");
        }
    }

    @Override
    @Transactional
    public Boolean updateExam(String examId, String title, Integer duration) {
        try{
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            exam.setTitle(title);
            exam.setDurationMinutes(duration);
            examRepository.save(exam);
            return true;
        }catch (Exception e){
            log.error("Error update exam : {}", e.getMessage());
            throw new RuntimeException("Error update exam");
        }
    }

    @Override
    @Transactional
    public ExamResponse createExam(ExamRequest examRequest) {
        try {
            var context = SecurityContextHolder.getContext();
            var authentication = context.getAuthentication();
            String userId = authentication.getName();
            User teacher = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
            Grade grade = gradeRepository.findById(examRequest.getGradeId())
                    .orElseThrow(() -> new RuntimeException("Grade not found with id " + examRequest.getGradeId()));
            Subject subject = subjectRepository.findById(examRequest.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found with id " + examRequest.getSubjectId()));
            SubjectOfGrade subjectOfGrade = subjectOfGradeRepository.findBySubjectAndGrade(subject, grade);
            if(subjectOfGrade == null){
                throw new RuntimeException("Subject is not assigned to grade");
            }
            Exam exam = Exam.builder()
                    .title(examRequest.getTitle())
                    .durationMinutes(examRequest.getDuration())
                    .subjectOfGrade(subjectOfGrade)
                    .teacher(teacher)
                    .totalQuestions(0)
                    .totalScore(0)
                    .type(ExamType.FREE)
                    .active(false)
                    .build();
            Exam savedExam = examRepository.save(exam);
            for(org.example.onlinetest.dto.user.request.QuestionRequest qr : examRequest.getQuestions()){
                Question question = Question.builder()
                        .content(qr.getContent())
                        .answers(qr.getAnswers())
                        .correct(qr.getCorrect())
                        .score(qr.getScore())
                        .examId(savedExam.getId())
                        .build();
                if(qr.getImage() != null){
                    question.setImage(qr.getImage());
                }
                questionRepository.save(question);
                savedExam.setTotalQuestions(savedExam.getTotalQuestions() + 1);
                savedExam.setTotalScore(savedExam.getTotalScore() + qr.getScore());
            }
            examRepository.save(savedExam);
            return ExamResponse.builder()
                    .id(savedExam.getId())
                    .title(savedExam.getTitle())
                    .duration(savedExam.getDurationMinutes())
                    .type(savedExam.getType())
                    .teacherId(teacher.getId())
                    .teacherName(teacher.getFullName())
                    .subjectId(subject.getId())
                    .subjectName(subject.getName())
                    .gradeId(grade.getId())
                    .gradeName(grade.getName())
                    .active(savedExam.isActive())
                    .totalQuestions(savedExam.getTotalQuestions())
                    .totalScore(savedExam.getTotalScore())
                    .build();

        }catch (Exception e){
            log.error("Error create exam : {}", e.getMessage());
            throw new RuntimeException("Error create exam");
        }
    }

    @Override
    @Transactional
    public Page<CompetitionResponse> getAllCompetitions(Pageable pageable, String keyword, Boolean type, String status) {
        try {
            Specification<Competition> spec = Specification.allOf(
                    CompetitionSpecification.hasKeyword(keyword),
                    CompetitionSpecification.hasType(type),
                    CompetitionSpecification.hasStatus(status)
            );
            Page<Competition> competitions = competitionRepository.findAll(spec, pageable);
            return competitions.map(c -> CompetitionResponse.builder()
                    .id(c.getId())
                    .title(c.getName())
                    .description(c.getDescription())
                    .startTime(String.valueOf(c.getStartDate()))
                    .duration(c.getDurationMinutes())
                    .type(c.getType())
                    .subjectName(c.getExam().getSubjectOfGrade().getSubject().getName())
                    .gradeName(c.getExam().getSubjectOfGrade().getGrade().getName())
                    .examId(c.getExam().getId())
                    .examName(c.getExam().getTitle())
                    .build());
        }catch (Exception e){
            log.error("Error getting competitions: {}", e.getMessage());
            throw new RuntimeException("Error getting competitions");
        }
    }

    @Override
    @Transactional
    public CompetitionDetailResponse getCompetitionDetail(String competitionId) {
        try {
            Competition competition = competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new RuntimeException("Competition not found with id " + competitionId));
            List<UserForCompetition> registeredUsers = userForCompetitionRepository.findAllByCompetition(competition);
            List<RegisteredUser> registeredUserResponses = registeredUsers.stream()
                    .map(uc -> RegisteredUser.builder()
                            .id(uc.getUser().getId())
                            .fullName(uc.getUser().getFullName())
                            .email(uc.getUser().getEmail())
                            .phoneNumber(uc.getUser().getPhone())
                            .score(uc.getResult() != null ? uc.getResult().getScore() : null)
                            .totalCorrectAnswers(uc.getResult() != null ? uc.getResult().getTotalQuestionsCorrect() : null)
                            .build())
                    .toList();
            return CompetitionDetailResponse.builder()
                    .id(competition.getId())
                    .title(competition.getName())
                    .description(competition.getDescription())
                    .startTime(String.valueOf(competition.getStartDate()))
                    .duration(competition.getDurationMinutes())
                    .type(competition.getType())
                    .subjectName(competition.getExam().getSubjectOfGrade().getSubject().getName())
                    .gradeName(competition.getExam().getSubjectOfGrade().getGrade().getName())
                    .examName(competition.getExam().getTitle())
                    .registeredUsers(registeredUserResponses)
                    .build();
        }catch (Exception e){
            log.error("Error getting competition detail: {}", e.getMessage());
            throw new RuntimeException("Error getting competition detail");
        }
    }

    @Override
    @Transactional
    public Boolean deleteCompetition(String competitionId) {
        try{

            Competition competition = competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new RuntimeException("Competition not found with id " + competitionId));
            if(!competition.getStartDate().after(new Date())){
                throw new RuntimeException("Cannot delete competition that has started");
            }
            competitionRepository.deleteById(competitionId);
            return true;
        }catch (Exception e){
            log.error("Error deleting competition: {}", e.getMessage());
            throw new RuntimeException("Error deleting competition");
        }
    }

    @Override
    @Transactional
    public Boolean updateCompetition(String id, CompetitionRequest request) {
        try{
            Competition competition = competitionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Competition not found with id " + id));
            competition.setName(request.getTitle());
            competition.setDescription(request.getDescription());
            competition.setStartDate(request.getStartTime());
            competition.setType(request.getType());
            competitionRepository.save(competition);
            return true;
        }catch (Exception e){
            log.error("Error updating competition: {}", e.getMessage());
            throw new RuntimeException("Error updating competition");
        }
    }

    @Override
    @Transactional
    public Boolean updateExamOfCompetition(String competitionId, String examId) {
        try {
            Competition competition = competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new RuntimeException("Competition not found with id " + competitionId));
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(() -> new RuntimeException("Exam not found with id " + examId));
            competition.setExam(exam);
            competitionRepository.save(competition);
            return true;
        }catch (Exception e){
            log.error("Error updating exam of competition: {}", e.getMessage());
            throw new RuntimeException("Error updating exam of competition");
        }
    }


    private int extractGradeNumber(String gradeName) {
        // Ví dụ: "Lop 10" -> 10
        try {
            String numberPart = gradeName.replaceAll("[^0-9]", ""); // giữ lại số
            return numberPart.isEmpty() ? 0 : Integer.parseInt(numberPart);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

}
