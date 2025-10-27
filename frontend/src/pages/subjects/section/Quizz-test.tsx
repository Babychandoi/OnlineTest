import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Badge, Button, Progress } from 'flowbite-react';
import { Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Send, ArrowLeft, Trophy, Target, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { ExamDetailResponse, ExamResult } from '../../../types/exam';
import { getExamDetail, resultExam } from '../../../services/service';
import { formatDateTime } from '../../../util/util';
interface ExamTakingProps {
  examId: string;
  onExit?: () => void;
  onComplete?: (result: ExamResult) => void;
}

const ExamTaking: React.FC<ExamTakingProps> = ({ examId, onExit, onComplete }) => {
  const [exam, setExam] = useState<ExamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answerIndex: number; answerText: string }>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Memoized values
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progressPercentage = useMemo(() => (exam ? (answeredCount / exam.questions.length) * 100 : 0), [answeredCount, exam]);
  const isTimeWarning = useMemo(() => timeRemaining < 300, [timeRemaining]);
  const currentQuestion = useMemo(() => exam?.questions[currentQuestionIndex], [exam, currentQuestionIndex]);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle answer select
  const handleAnswerSelect = useCallback((questionId: string, answerIndex: number, answerText: string) => {
    setAnswers((prev) => ({ 
      ...prev, 
      [questionId]: { 
        answerIndex, 
        answerText 
      } 
    }));
  }, []);

  // Handle navigation
  const handlePrevious = () => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => exam && setCurrentQuestionIndex((prev) => Math.min(exam.questions.length - 1, prev + 1));
  const handleQuestionJump = (index: number) => setCurrentQuestionIndex(index);

  // Handle back
  const handleBackToSubjects = useCallback(() => {
    if (examResult) {
      onExit?.();
      return;
    }
    const confirmLeave = window.confirm('Bạn có chắc muốn thoát? Dữ liệu bài thi sẽ bị mất.');
    if (confirmLeave) {
      onExit?.();
    }
  }, [examResult, onExit]);

  // Submit exam function (move above handleSubmitExam)
  const fetchSubmitExam = useCallback(async () => {
    if (!exam) return;
    try {
      const payload = {
        examId: exam.id,
        selectedAnswers: exam.questions.map((question) => {
          const answer = answers[question.id];
          return {
            questionId: question.id,
            selectedAnswer: answer ? answer.answerText : '',
          };
        }),
      };
      
      const response = await resultExam(payload);
      if(response.code === 200){
        console.log(response.data);
        toast.success('Nộp bài thành công!');
        setIsExamSubmitted(true);
        setExamResult(response.data);
        onComplete?.(response.data);
      } else {
        toast.error('Đã xảy ra lỗi khi nộp bài!');
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi nộp bài!');
      setIsSubmitting(false);
    }
  }, [exam, answers, onComplete]);

  // Handle submit
  const handleSubmitExam = useCallback(async () => {
    if (!exam) return;

    const unansweredCount = exam.questions.length - answeredCount;
    if (unansweredCount > 0 && !showSubmitConfirm) {
      setShowSubmitConfirm(true);
      return;
    }
    fetchSubmitExam();
    setIsSubmitting(true);
    setShowSubmitConfirm(false);

    
  }, [exam, answeredCount, showSubmitConfirm, fetchSubmitExam]);
  const handleAutoSubmit = useCallback(() => {
    toast.warning('Hết giờ! Bài thi sẽ được nộp tự động.');
    setIsExamSubmitted(true);
    fetchSubmitExam();
  }, [fetchSubmitExam]);

  // Fetch exam
  useEffect(() => {
    if (!examId) {
      toast.error('Không tìm thấy mã đề thi');
      onExit?.();
      return;
    }

    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        const response = await getExamDetail(examId);
        if (response.code === 200) {
          setExam(response.data);
          setTimeRemaining(response.data.duration * 60);
        } else toast.error('Không tải được đề thi');
      } catch {
        toast.error('Đã xảy ra lỗi khi tải đề thi');
      } finally {
        setLoading(false);
      }
    };
    fetchExamDetail();
  }, [examId, onExit]);

  // Timer
  useEffect(() => {
    if (!exam || timeRemaining <= 0 || isExamSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, timeRemaining, handleAutoSubmit, isExamSubmitted]);

  // Prevent accidental exit
  useEffect(() => {
    if (isExamSubmitted) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Bạn có chắc muốn rời khỏi trang?';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExamSubmitted]);

  // UI states
  if (loading || !exam)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  // Result Screen
  if (examResult) {
    const percentage = exam ? Math.round((examResult.score / exam.totalScore) * 100) : 0;
    const isPassed = percentage >= 50;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              isPassed ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Trophy className={`w-12 h-12 ${isPassed ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isPassed ? 'Chúc mừng!' : 'Hoàn thành bài thi'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {isPassed ? 'Bạn đã vượt qua bài thi!' : 'Bạn đã hoàn thành bài thi'}
            </p>
          </div>

          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Kết quả bài thi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <span className="text-gray-600 dark:text-gray-400">Điểm số</span>
                </div>
                <div className="text-4xl font-bold text-indigo-600">
                  {examResult.score}/{exam.totalScore}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {percentage}%
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Số câu đúng</span>
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {examResult.totalQuestionsCorrect}/{exam.totalQuestions}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round((examResult.totalQuestionsCorrect / exam.totalQuestions) * 100)}% câu đúng
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian nộp bài</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatDateTime(examResult.submittedAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tỷ lệ hoàn thành
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {percentage}%
                </span>
              </div>
              <Progress 
                progress={percentage} 
                color={isPassed ? 'green' : 'yellow'} 
                size="lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {exam.totalQuestions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số câu</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {examResult.totalQuestionsCorrect}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Câu đúng</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {exam.totalQuestions - examResult.totalQuestionsCorrect}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Câu sai</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                color="gray" 
                onClick={handleBackToSubjects}
                className="flex-1"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại môn học
              </Button>
              <Button 
                color="indigo" 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Làm lại
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Exam Taking Screen
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBackToSubjects}
          className="flex items-center gap-2 mb-4 text-indigo-600 hover:text-indigo-800 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Thoát bài thi</span>
        </button>

        <div className="mb-6 sticky top-0 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{exam.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge color="purple">{exam.type}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {exam.totalQuestions} câu • {exam.totalScore} điểm
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isTimeWarning ? 'bg-red-100 dark:bg-red-900' : 'bg-indigo-100 dark:bg-indigo-900'
              }`}
            >
              <Clock className={`h-6 w-6 ${isTimeWarning ? 'text-red-600' : 'text-indigo-600'}`} />
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Thời gian còn lại</div>
                <div
                  className={`text-xl font-bold ${
                    isTimeWarning ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Đã làm: {answeredCount}/{exam.questions.length}
              </span>
              <span className="text-sm font-medium text-indigo-600">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress progress={progressPercentage} color="indigo" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge color="indigo" size="lg">Câu {currentQuestionIndex + 1}</Badge>
                  <Badge color="gray">{currentQuestion.score} điểm</Badge>
                </div>
                {answers[currentQuestion.id] && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>

              <div className="mb-6">
                <p className="text-lg text-gray-900 dark:text-white font-medium leading-relaxed">
                  {currentQuestion.content}
                </p>
                {currentQuestion.image && (
                  <img src={currentQuestion.image} alt="Question" className="mt-4 rounded-lg border-2 border-gray-200" />
                )}
              </div>

              <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = answers[currentQuestion.id]?.answerIndex === index;
                  const optionLabel = String.fromCharCode(65 + index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index, answer)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {optionLabel}
                        </div>
                        <span>{answer}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <Button color="gray" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  <ChevronLeft className="h-5 w-5 mr-2" /> Câu trước
                </Button>
                <Button color="indigo" onClick={handleNext} disabled={currentQuestionIndex === exam.questions.length - 1}>
                  Câu sau <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Danh sách câu hỏi</h3>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {exam.questions.map((question, index) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isCurrent = index === currentQuestionIndex;
                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                          : isAnswered
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <Button color="success" onClick={() => setShowSubmitConfirm(true)} className="w-full">
                <Send className="h-5 w-5 mr-2" /> Nộp bài
              </Button>
            </Card>
          </div>
        </div>

        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Xác nhận nộp bài</h3>
                <p className="mb-4">
                  Bạn đã làm {answeredCount}/{exam.questions.length} câu hỏi.
                </p>
                <div className="flex gap-3">
                  <Button color="gray" onClick={() => setShowSubmitConfirm(false)} className="flex-1">
                    Hủy
                  </Button>
                  <Button color="success" onClick={handleSubmitExam} className="flex-1" disabled={isSubmitting}>
                    Nộp bài
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="text-center py-8">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <Send className="absolute inset-0 m-auto h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Đang nộp bài...</h3>
                <p className="text-gray-600 dark:text-gray-400">Vui lòng đợi trong giây lát</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTaking;