package org.example.onlinetest.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.onlinetest.dto.admin.request.CompetitionRequest;
import org.example.onlinetest.dto.admin.response.CompetitionExamResponse;
import org.example.onlinetest.dto.admin.response.CompetitionResponse;
import org.example.onlinetest.dto.user.request.ResultRequest;
import org.example.onlinetest.dto.user.request.SelectedAnswerRequest;
import org.example.onlinetest.dto.user.response.CompetitionForMeResponse;
import org.example.onlinetest.dto.user.response.ExamDetailResponse;
import org.example.onlinetest.dto.user.response.ResultResponse;
import org.example.onlinetest.entity.*;
import org.example.onlinetest.repository.*;
import org.example.onlinetest.service.CompetitionService;
import org.example.onlinetest.service.ExamService;
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
public class CompetitionServiceImpl implements CompetitionService {
    CompetitionRepository competitionRepository;
    ExamRepository examRepository;
    UserRepository userRepository;
    ExamService examService;
    UserForCompetitionRepository userForCompetitionRepository;
    ResultRepository resultRepository;
    ResultDetailDocumentRepository resultDetailDocumentRepository;
    QuestionRepository questionRepository;
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Boolean createCompetition(CompetitionRequest competitionRequest) {
        try {
            Exam exam = examRepository.findById(competitionRequest.getExamId())
                    .orElseThrow(() -> new RuntimeException("Exam not found"));
            Competition competition = Competition.builder()
                    .name(competitionRequest.getTitle())
                    .description(competitionRequest.getDescription())
                    .exam(exam)
                    .type(competitionRequest.getType())
                    .durationMinutes(exam.getDurationMinutes())
                    .startDate(competitionRequest.getStartTime())
                    .build();
            competitionRepository.save(competition);
            return true;
        }catch (Exception e){
            log.error("Error in creating competition: {}", e.getMessage());
            throw new RuntimeException("Error in creating competition");
        }
    }

    @Override
    @Transactional
    public Boolean addStudentToCompetition(String competitionId) {
        try {
            var context = SecurityContextHolder.getContext();
            String userId = context.getAuthentication().getName();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Competition competition = competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new RuntimeException("Competition not found"));
            UserForCompetition userForCompetition = UserForCompetition.builder()
                    .competition(competition)
                    .user(user)
                    .hasParticipated(false)
                    .build();
            userForCompetitionRepository.save(userForCompetition);
            return true;
        }catch (Exception e){
            log.error("Error in adding student to competition: {}", e.getMessage());
            throw new RuntimeException("Error in adding student to competition");
        }
    }

    @Override
    public List<CompetitionResponse> getAllCompetitions() {
        try {
            List<Competition> competitions = competitionRepository.findByStartDateAfter(new Date());
            return competitions.stream().
                    <CompetitionResponse>map(competition -> CompetitionResponse.builder()
                    .id(competition.getId())
                    .title(competition.getName())
                    .description(competition.getDescription())
                    .startTime(String.valueOf(competition.getStartDate()))
                    .duration(competition.getDurationMinutes())
                    .gradeName(competition.getExam().getSubjectOfGrade().getGrade().getName())
                    .subjectName(competition.getExam().getSubjectOfGrade().getSubject().getName())
                    .type(competition.getType())
                    .build()).toList();
        }catch (Exception e){
            log.error("Error in getting all competitions: {}", e.getMessage());
            throw new RuntimeException("Error in getting all competitions");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompetitionForMeResponse> getCompetitionsOfMe() {
        try {
            var context = SecurityContextHolder.getContext();
            String userId = context.getAuthentication().getName();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Competition> allCompetitions = competitionRepository.findAll();
            Date now = new Date();

            return allCompetitions.stream()
                    .<CompetitionForMeResponse>map(c -> {
                        // ✅ Tìm bản ghi UserForCompetition của user hiện tại
                        UserForCompetition registration = c.getRegisteredUsers()
                                .stream()
                                .filter(reg -> reg.getUser().equals(user))
                                .findFirst()
                                .orElse(null);

                        boolean isRegistered = registration != null;
                        boolean hasParticipated = registration != null && Boolean.TRUE.equals(registration.getHasParticipated());

                        // ✅ Tính thời gian kết thúc của cuộc thi
                        long endTimeMillis = c.getStartDate().getTime() + (long) c.getDurationMinutes() * 60 * 1000;
                        boolean isEnded = now.after(new Date(endTimeMillis));

                        // ✅ Chỉ hiển thị khi:
                        // - user chưa đăng ký, và cuộc thi còn chưa bắt đầu
                        // - hoặc user đã đăng ký, chưa thi và cuộc thi chưa kết thúc
                        if ((!isRegistered && c.getStartDate().after(now))
                                || (isRegistered && !hasParticipated && !isEnded)) {

                            return CompetitionForMeResponse.builder()
                                    .id(c.getId())
                                    .title(c.getName())
                                    .description(c.getDescription())
                                    .duration(c.getDurationMinutes())
                                    .subjectName(c.getExam().getSubjectOfGrade().getSubject().getName())
                                    .gradeName(c.getExam().getSubjectOfGrade().getGrade().getName())
                                    .startTime(c.getStartDate().toString())
                                    .type(c.getType())
                                    .isRegistered(isRegistered)
                                    .build();
                        }

                        return null;
                    })
                    .filter(Objects::nonNull)
                    .toList();

        } catch (Exception e) {
            log.error("Error in getting competitions of me: {}", e.getMessage());
            throw new RuntimeException("Error in getting competitions of me");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CompetitionExamResponse getExam(String competitionId) {
        try {
            var context = SecurityContextHolder.getContext();
            String userId = context.getAuthentication().getName();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Competition competition = competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new RuntimeException("Competition not found"));

            // ✅ Kiểm tra xem user có trong danh sách đăng ký không
            boolean isRegistered = competition.getRegisteredUsers().stream()
                    .anyMatch(reg -> reg.getUser().equals(user));

            if (!isRegistered) {
                throw new RuntimeException("User not registered for this competition");
            }

            // ✅ (Tuỳ chọn) Có thể chặn luôn nếu user đã làm bài rồi:
            boolean hasParticipated = competition.getRegisteredUsers().stream()
                    .filter(reg -> reg.getUser().getId().equals(userId))
                    .findFirst()
                    .map(UserForCompetition::getHasParticipated)
                    .orElse(false);

            if (hasParticipated) {
                throw new RuntimeException("You have already completed this competition");
            }

            // ✅ Lấy chi tiết bài thi
            ExamDetailResponse examDetailResponse = examService.getExamDetail(competition.getExam().getId());

            return CompetitionExamResponse.builder()
                    .competitionExam(examDetailResponse)
                    .id(competition.getId())
                    .title(competition.getName())
                    .description(competition.getDescription())
                    .duration(competition.getDurationMinutes())
                    .startTime(competition.getStartDate().toString())
                    .type(competition.getType())
                    .gradeName(competition.getExam().getSubjectOfGrade().getGrade().getName())
                    .subjectName(competition.getExam().getSubjectOfGrade().getSubject().getName())
                    .build();

        } catch (Exception e) {
            log.error("Error in getting exam detail: {}", e.getMessage());
            throw new RuntimeException("Error in getting exam detail");
        }
    }

    @Override
    @Transactional
    public ResultResponse saveResult(ResultRequest request, String competitionId) {
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
            // ✅ Cập nhật trạng thái đã thi của user trong cuộc thi
            Competition competition = competitionRepository.findById(competitionId)
                    .orElseThrow(() -> new RuntimeException("Competition not found"));
            UserForCompetition userForCompetition = userForCompetitionRepository
                    .findByUserAndCompetition(user, competition);
            userForCompetition.setHasParticipated(true);
            userForCompetitionRepository.save(userForCompetition);

            user.getResults().add(result);
            userRepository.save(user);
            return ResultResponse.builder()
                    .examTitle(result.getExam().getTitle())
                    .submittedAt(result.getSubmittedAt())
                    .score(result.getScore())
                    .totalQuestionsCorrect(result.getTotalQuestionsCorrect())
                    .build();
        }catch (Exception e){
            log.error("Error in saving result: {}", e.getMessage());
            throw new RuntimeException("Error in saving result");
        }
    }


}
