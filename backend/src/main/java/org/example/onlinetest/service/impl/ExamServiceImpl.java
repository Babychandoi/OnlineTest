package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.user.request.*;
import org.example.onlinetest.dto.user.response.*;
import org.example.onlinetest.entity.*;
import org.example.onlinetest.mapper.ExamMapper;
import org.example.onlinetest.repository.*;
import org.example.onlinetest.service.ExamService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Service
public class ExamServiceImpl implements ExamService {
    SubjectRepository subjectRepository;
    GradeRepository gradeRepository;
    ExamRepository examRepository;
    UserRepository userRepository;
    QuestionRepository questionRepository;
    ExamMapper examMapper;
    SubjectOfGradeRepository subjectOfGradeRepository;
    ResultRepository resultRepository;
    ResultDetailDocumentRepository resultDetailDocumentRepository;
    @Override
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")

    @Transactional
    public Boolean createExam(ExamRequest examRequest) {
        try{
            var context = SecurityContextHolder.getContext();
            int totalScore = 0;
            String userId = context.getAuthentication().getName();
            var user = userRepository.findById(userId)
                    .orElseThrow(()-> new RuntimeException("User not found"));
            Subject subject = subjectRepository.findById(examRequest.getSubjectId())
                    .orElseThrow(()-> new RuntimeException("Subject not found"));
            Grade grade = gradeRepository.findById(examRequest.getGradeId())
                    .orElseThrow(()-> new RuntimeException("Grade not found"));
            Exam exam = examMapper.toExam(examRequest);
            exam.setSubjectOfGrade(
                    subjectOfGradeRepository.findBySubjectAndGrade(subject, grade));
            exam.setTeacher(user);
            exam.setTotalQuestions(examRequest.getQuestions().size());
            for(QuestionRequest question : examRequest.getQuestions()){
                totalScore += question.getScore();
            }
            exam.setTotalScore(totalScore);
            exam.setActive(true);
            Exam examFinal  = examRepository.save(exam);
            List<QuestionRequest> questions = examRequest.getQuestions();
            questions.forEach(questionRequest -> {
                var question = examMapper.toQuestion(questionRequest);
                question.setExamId(examFinal.getId());
                if(questionRequest.getImage() != null){
                    question.setImage(questionRequest.getImage());
                }
                questionRepository.save(question);
            });
            return true;
        }catch (Exception e){
            log.error("Error creating exam", e); // in cả stacktrace
            throw new RuntimeException("Error creating exam: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ExamResponse> getExamsOfMe(String subjectId, String gradeId) {
        try {
            var context = SecurityContextHolder.getContext();
            String email = context.getAuthentication().getName();
            List<Exam> exam = examRepository.findAllBySubjectOfGradeAndTeacher(
                    subjectOfGradeRepository.findBySubjectAndGrade(
                            subjectRepository.findById(subjectId)
                                    .orElseThrow(()-> new RuntimeException("Subject not found")),
                            gradeRepository.findById(gradeId)
                                    .orElseThrow(()-> new RuntimeException("Grade not found"))
                    ),
                    userRepository.findByEmail(email)
                            .orElseThrow(()-> new RuntimeException("User not found"))
            );
            return exam.stream().map(examMapper::toExamResponse).toList();
        }catch (Exception e){
            log.error("Error getting exams: {}", e.getMessage());
            throw new RuntimeException("Error getting exams");
        }
    }

    @Override
    public Page<ExamResponse> getExams(Pageable pageable, String subjectId, String gradeId) {
        try{
            SubjectOfGrade subjectOfGrade = subjectOfGradeRepository.findBySubjectAndGrade(
                    subjectRepository.findById(subjectId)
                            .orElseThrow(()-> new RuntimeException("Subject not found")),
                    gradeRepository.findById(gradeId)
                            .orElseThrow(()-> new RuntimeException("Grade not found"))
            );
            Page<Exam> exams = examRepository.findAllBySubjectOfGradeAndActive(subjectOfGrade, pageable,true);
            return exams.map(examMapper::toExamResponse);
        }catch (Exception e){
            log.error("Error getting exams: {}", e.getMessage());
            throw new RuntimeException("Error getting exams");
        }
    }

    @Override
    public List<GradeResponse> getGradesOfMe() {
        try {
            var context = SecurityContextHolder.getContext();
            String email = context.getAuthentication().getName();
            var user = userRepository.findByEmail(email)
                    .orElseThrow(()-> new RuntimeException("User not found"));
            List<Exam> exams = examRepository.findAllByTeacher(user);
            Set<Grade> grades = new HashSet<>();
            for(Exam exam : exams){
                grades.add(exam.getSubjectOfGrade().getGrade());
            }
            return grades.stream().map(grade -> GradeResponse.builder()
                    .id(grade.getId())
                    .name(grade.getName())
                    .build()).toList();
        }catch (Exception e){
            log.error("Error getting grades: {}", e.getMessage());
            throw new RuntimeException("Error getting grades");
        }
    }

    @Override
    public List<SubjectResponse> getSubjectsOfMe(String gradeId) {
        try {
            var context = SecurityContextHolder.getContext();
            String email = context.getAuthentication().getName();
            var user = userRepository.findByEmail(email)
                    .orElseThrow(()-> new RuntimeException("User not found"));
            Grade grade = gradeRepository.findById(gradeId)
                    .orElseThrow(()-> new RuntimeException("Grade not found"));
            List<Exam> exams = examRepository.findAllByTeacher(user);
            Set<Subject> subjects = new HashSet<>();
            for(Exam exam : exams){
                if(exam.getSubjectOfGrade().getGrade().equals(grade)){
                    subjects.add(exam.getSubjectOfGrade().getSubject());
                }
            }
            return subjects.stream().map(subject -> SubjectResponse.builder()
                    .id(subject.getId())
                    .name(subject.getName())
                    .build()).toList();
        }catch (Exception e){
            log.error("Error getting subjects: {}", e.getMessage());
            throw new RuntimeException("Error getting subjects");
        }
    }

    @Override
    public ExamDetailResponse getExamDetail(String examId) {
        try {
            Exam exam = examRepository.findById(examId)
                    .orElseThrow(()-> new RuntimeException("Exam not found"));
            List<Question> question = questionRepository.findAllByExamId(examId);
            return examMapper.toExamDetailResponse(exam, question);
        }catch (Exception e){
            log.error("Error getting exam detail: {}", e.getMessage());
            throw new RuntimeException("Error getting exam detail");
        }
    }

    @Override
    @Transactional
    public ResultResponse saveResult(ResultRequest request) {
        try {
            var context = SecurityContextHolder.getContext();
            String userId = context.getAuthentication().getName();
            var user = userRepository.findById(userId)
                    .orElseThrow(()-> new RuntimeException("User not found"));
            List<ResultDetailDocument.ResultDetail> resultDetails = new ArrayList<>();
            int totalScore = 0;
            int totalQuestionsCorrect = 0;
            List<String> ids = request.getSelectedAnswers()
                    .stream()
                    .map(SelectedAnswerRequest::getQuestionId)
                    .toList();
            Map<String, Question> questions = questionRepository.findAllById(ids)
                    .stream()
                    .collect(Collectors.toMap(Question::getId, q -> q));
            for(SelectedAnswerRequest selectedAnswerRequest : request.getSelectedAnswers()){
                Question question = questions.get(selectedAnswerRequest.getQuestionId());
                if(selectedAnswerRequest.getSelectedAnswer().equals(question.getCorrect())){
                    totalScore += question.getScore();
                    resultDetails.add(
                            ResultDetailDocument.ResultDetail.builder()
                                    .questionId(question.getId())
                                    .correctOption(question.getCorrect())
                                    .selectedOption(selectedAnswerRequest.getSelectedAnswer())
                                    .isCorrect(true)
                                    .build()
                    );
                    totalQuestionsCorrect++;
                }else{
                    resultDetails.add(
                            ResultDetailDocument.ResultDetail.builder()
                                    .questionId(question.getId())
                                    .correctOption(question.getCorrect())
                                    .selectedOption(selectedAnswerRequest.getSelectedAnswer())
                                    .isCorrect(false)
                                    .build()
                    );
                }

            }
            Result result = resultRepository.saveAndFlush(Result.builder()
                    .exam(examRepository.findById(request.getExamId())
                            .orElseThrow(()-> new RuntimeException("Exam not found")))
                    .student(user)
                    .totalQuestionsCorrect(totalQuestionsCorrect)
                    .score(totalScore)
                    .build());
            resultDetailDocumentRepository.save(ResultDetailDocument.builder()
                    .resultId(result.getId())
                    .details(resultDetails)
                    .build());
            return ResultResponse.builder()
                    .examTitle(result.getExam().getTitle())
                    .submittedAt(result.getSubmittedAt())
                    .score(result.getScore())
                    .totalQuestionsCorrect(result.getTotalQuestionsCorrect())
                    .build();
        }catch (Exception e){
            log.error("Error saving result", e);
            throw new RuntimeException("Error saving result");
        }
    }

    @Override
    public List<ResultResponse> getResultsOfMe() {
        try{
            var context = SecurityContextHolder.getContext();
            String userId = context.getAuthentication().getName();
            var user = userRepository.findById(userId)
                    .orElseThrow(()-> new RuntimeException("User not found"));
            List<Result> results = resultRepository.findByStudentOrderBySubmittedAtDesc(user);
            return results.stream().map(result -> ResultResponse.builder()
                    .id(result.getId())
                    .examTitle(result.getExam().getTitle())
                    .score(result.getScore())
                    .totalQuestionsCorrect(result.getTotalQuestionsCorrect())
                    .submittedAt(result.getSubmittedAt())
                    .totalQuestions(result.getExam().getTotalQuestions())
                    .totalScore(result.getExam().getTotalScore())
                    .subject(result.getExam().getSubjectOfGrade().getSubject().getName())
                    .grade(result.getExam().getSubjectOfGrade().getGrade().getName())
                    .build()).toList();
        }catch (Exception e){
            log.error("Error getting results: {}", e.getMessage());
            throw new RuntimeException("Error getting results");
        }
    }

    @Override
    public List<GradeResponse> getGrades() {
        try {
            List<Grade> grades = gradeRepository.findAll();
            return grades.stream().map(grade -> GradeResponse.builder()
                    .id(grade.getId())
                    .name(grade.getName())
                    .build()).toList();
        }catch (Exception e){
            log.error("Error getting grades: {}", e.getMessage());
            throw new RuntimeException("Error getting grades");
        }
    }

    @Override
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<SubjectRes> getSubjects(String gradeId) {
        try {
            Grade grade = gradeRepository.findById(gradeId)
                    .orElseThrow(()-> new RuntimeException("Grade not found"));
            List<SubjectOfGrade> subjectOfGrades = subjectOfGradeRepository.findAllByGrade(grade);
            return subjectOfGrades.stream().map(subjectOfGrade -> SubjectRes.builder()
                    .id(subjectOfGrade.getSubject().getId())
                    .name(subjectOfGrade.getSubject().getName())
                    .build()).toList();
        }catch (Exception e){
            log.error("Error getting subjects: {}", e.getMessage());
            throw new RuntimeException("Error getting subjects");
        }
    }

}
