
import React, { useState, useEffect } from 'react';
import { Clock, FileText, Award, ArrowLeft, ChevronRight, ChevronLeft, User, Calendar, CheckCircle } from 'lucide-react';
import { getExamDetail } from '../../../../services/exam.admin';
import { ExamDetailResponse } from '../../../../types/exam.admin';

interface ExamDetailProps {
  examId: string;
  onBack?: () => void;
}

const ExamDetail: React.FC<ExamDetailProps> = ({ examId, onBack }) => {
  const [exam, setExam] = useState<ExamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchExamDetail = async () => {
      setLoading(true);
      try {
        const response = await getExamDetail(examId);
        setExam(response.data);
      } catch (err) {
        console.error('Error fetching exam detail:', err);
        setError('Không thể tải chi tiết đề thi. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetail();
  }, [examId]);

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <FileText size={64} className="mx-auto opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error || 'Không tìm thấy đề thi'}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalScore = exam.questions.reduce((sum, q) => sum + q.score, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Quay lại danh sách</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">{exam.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exam.type === 'FREE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {exam.type === 'FREE' ? 'Miễn phí' : 'Có phí'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exam.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {exam.active ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-indigo-600" />
                    <span>{exam.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-indigo-600" />
                    <span>{exam.totalQuestions} câu hỏi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-indigo-600" />
                    <span>{totalScore} điểm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-indigo-600" />
                    <span>{exam.teacherName}</span>
                  </div>
                  {exam.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-indigo-600" />
                      <span>{exam.createdAt}</span>
                    </div>
                  )}
                </div>

                {/* Info tags */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                    {exam.gradeName}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                    {exam.subjectName}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Câu hỏi {currentQuestionIndex + 1}/{exam.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / exam.questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Question */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  Câu {currentQuestionIndex + 1}
                </h2>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-lg font-semibold">
                  {currentQuestion.score} điểm
                </span>
              </div>

              {/* Question Content */}
              <div className="mb-8">
                <p className="text-lg text-gray-800 leading-relaxed mb-6">
                  {currentQuestion.content}
                </p>

                {/* Question Image (if exists) */}
                {currentQuestion.image && (
                  <div className="mb-6">
                    <img
                      src={currentQuestion.image}
                      alt="Hình minh họa"
                      className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                  </div>
                )}

                {/* Answers */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Các đáp án:</div>
                  {currentQuestion.answers.map((answer, index) => {
                    const answerLabel = String.fromCharCode(65 + index); // A, B, C, D
                    const isCorrect = answer === currentQuestion.correctAnswer;

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                          isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          isCorrect
                            ? 'bg-green-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {answerLabel}
                        </div>
                        <span className={`pt-2 flex-1 ${
                          isCorrect ? 'text-green-900 font-semibold' : 'text-gray-800'
                        }`}>
                          {answer}
                        </span>
                        {isCorrect && (
                          <CheckCircle className="text-green-600 flex-shrink-0 mt-2" size={24} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Correct Answer Indicator */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={18} />
                    <span className="text-sm font-semibold">
                      Đáp án đúng: {String.fromCharCode(65 + currentQuestion.answers.indexOf(currentQuestion.correctAnswer))} - {currentQuestion.correctAnswer}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <ChevronLeft size={20} />
                  Câu trước
                </button>

                <div className="text-sm text-gray-600 font-medium">
                  {currentQuestionIndex + 1} / {exam.questions.length}
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Câu tiếp
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách câu hỏi</h3>
              
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((question, index) => {
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-110'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={`Câu ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tổng câu hỏi:</span>
                  <span className="font-semibold text-gray-800">{exam.questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tổng điểm:</span>
                  <span className="font-semibold text-gray-800">{totalScore} điểm</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-semibold text-gray-800">{exam.duration} phút</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;