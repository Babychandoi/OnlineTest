import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Copy, ChevronRight } from 'lucide-react';
import { createExam, getGrades, getSubjects } from '../../../../services/service';
import { toast } from 'react-toastify';
import { ExamRequest, ExamType, GradeResponse, QuestionRequest, SubjectRes } from '../../../../types/exam';
import { useNavigate } from 'react-router-dom';


const MAX_QUESTIONS = 100;
const MAX_ANSWER_LENGTH = 500;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;

export default function ExamCreationForm() {
  const [exam, setExam] = useState<ExamRequest>({
    title: '',
    duration: 60,
    description: '',
    subjectId: '',
    gradeId: '',
    type: 'FREE',
    questions: [
      {
        content: '',
        answers: ['', '', '', ''],
        correct: '',
        score: 1,
        image: ''
      }
    ]
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [subjects, setSubjects] = useState<SubjectRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Fetch grades on component mount
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const response = await getGrades();

        // Sort by grade number (Lớp 1, Lớp 2, ..., Lớp 12)
        const sortedGrades = response.data.sort((a: GradeResponse, b: GradeResponse) => {
          const numA = parseInt(a.name.replace(/[^\d]/g, ''), 10);
          const numB = parseInt(b.name.replace(/[^\d]/g, ''), 10);
          return numA - numB;
        });

        setGrades(sortedGrades);
        setError('');
      } catch (err) {
        toast.error('Lấy thông tin lớp học thất bại');
        setError('Lấy thông tin lớp học thất bại');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Fetch subjects when grade changes
  useEffect(() => {
    if (exam.gradeId) {
      handleFetchSubject(exam.gradeId);
    } else {
      setSubjects([]);
    }
  }, [exam.gradeId]);

  const handleFetchSubject = async (gradeId: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await getSubjects(gradeId);
      setSubjects(response.data);
    } catch (err) {
      toast.error('Lấy thông tin môn học không thành công');
      setError('Lấy thông tin môn học không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (field: keyof ExamRequest, value: any) => {
    setExam(prev => ({ ...prev, [field]: value }));
  };

  const handleGradeChange = (gradeId: string) => {
    setExam(prev => ({ ...prev, gradeId, subjectId: '' }));
  };

  const handleSubjectChange = (subjectId: string) => {
    setExam(prev => ({ ...prev, subjectId }));
  };

  const handleQuestionChange = (qIdx: number, field: keyof QuestionRequest, value: any) => {
    setExam(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) =>
        idx === qIdx ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleAnswerChange = (qIdx: number, aIdx: number, value: string) => {
    if (value.length <= MAX_ANSWER_LENGTH) {
      setExam(prev => ({
        ...prev,
        questions: prev.questions.map((q, idx) =>
          idx === qIdx
            ? { ...q, answers: q.answers.map((a, i) => i === aIdx ? value : a) }
            : q
        )
      }));
    }
  };

  const addQuestion = () => {
    if (exam.questions.length >= MAX_QUESTIONS) {
      toast.error(`Tối đa ${MAX_QUESTIONS} câu hỏi`);
      return;
    }
    setExam(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          content: '',
          answers: ['', '', '', ''],
          correct: '',
          score: 1,
          image: ''
        }
      ]
    }));
  };

  const duplicateQuestion = (idx: number) => {
    if (exam.questions.length >= MAX_QUESTIONS) {
      toast.error(`Tối đa ${MAX_QUESTIONS} câu hỏi`);
      return;
    }
    const originalQuestion = exam.questions[idx];
    const question = {
      ...originalQuestion,
      answers: [...originalQuestion.answers],
      image: originalQuestion.image
    };
    setExam(prev => ({
      ...prev,
      questions: [...prev.questions.slice(0, idx + 1), question, ...prev.questions.slice(idx + 1)]
    }));
    toast.success('Câu hỏi đã được sao chép');
  };

  const removeQuestion = (idx: number) => {
    if (exam.questions.length > 1) {
      setExam(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== idx)
      }));
      toast.success('Câu hỏi đã được xóa');
    } else {
      toast.warning('Phải có ít nhất 1 câu hỏi');
    }
  };

  const hasDuplicateAnswers = (question: QuestionRequest): boolean => {
    const nonEmptyAnswers = question.answers.filter(a => a.trim());
    const uniqueAnswers = new Set(nonEmptyAnswers);
    return uniqueAnswers.size !== nonEmptyAnswers.length;
  };

  const validateQuestion = (question: QuestionRequest): string | null => {
    if (!question.content.trim()) {
      return 'Câu hỏi không được để trống';
    }
    if (question.answers.some(a => !a.trim())) {
      return 'Tất cả các đáp án phải được điền';
    }
    if (hasDuplicateAnswers(question)) {
      return 'Không được có đáp án trùng lặp';
    }
    if (!question.correct) {
      return 'Phải chọn đáp án đúng';
    }
    if (!question.answers.includes(question.correct)) {
      return 'Đáp án đúng phải nằm trong các đáp án';
    }
    if (question.score <= 0) {
      return 'Điểm phải lớn hơn 0';
    }
    return null;
  };

  const handleSubmit = async () => {
    // Validate basic info
    if (!exam.title.trim() || !exam.duration || !exam.subjectId || !exam.gradeId) {
      toast.error('Vui lòng điền đầy đủ thông tin cơ bản');
      return;
    }

    // Validate all questions
    for (let i = 0; i < exam.questions.length; i++) {
      const error = validateQuestion(exam.questions[i]);
      if (error) {
        toast.error(`Câu ${i + 1}: ${error}`);
        return;
      }
    }
    try{
        await createExam(exam);
        toast.success("Tạo bài luyện tập thành công");
        navigate('/subjects')
    }catch(error){
        toast.error("Tạo bài luyện tập không thành công");
    }
  };

  const handleBackToBasicInfo = () => {
    const hasUnsavedQuestions = exam.questions.some(
      q => q.content.trim() || q.answers.some(a => a.trim())
    );

    if (hasUnsavedQuestions) {
      if (window.confirm('Bạn sẽ mất dữ liệu câu hỏi. Tiếp tục?')) {
        setCurrentStep(0);
      }
    } else {
      setCurrentStep(0);
    }
  };

  const isBasicInfoValid = exam.title.trim() && exam.duration > 0 && exam.subjectId && exam.gradeId;
  const isQuestionsValid = exam.questions.every(q => !validateQuestion(q));
  const selectedGrade = grades.find(g => g.id === exam.gradeId);
  const selectedSubject = subjects.find(s => s.id === exam.subjectId);
  const availableSubjects = subjects || [];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tạo bài luyện tập</h1>
        </div>

        {/* Steps Indicator */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setCurrentStep(0)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Thông tin cơ bản
          </button>
          <button
            onClick={() => isBasicInfoValid && setCurrentStep(1)}
            disabled={!isBasicInfoValid}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? 'bg-blue-600 text-white'
                : isBasicInfoValid
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Các câu hỏi
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="bg-white rounded-lg p-8 space-y-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin bài làm</h2>

            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lớp *
              </label>
              <select
                value={exam.gradeId}
                onChange={(e) => handleGradeChange(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loading ? 'Đang tải...' : 'Chọn lớp học tương ứng'}
                </option>
                {grades.map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Môn học *
              </label>
              <select
                value={exam.subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                disabled={!exam.gradeId || loading}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loading ? 'Đang tải...' : exam.gradeId ? 'Chọn môn học' : 'Hãy chọn lớp trước'}
                </option>
                {availableSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <hr className="my-6" />

            {/* Exam Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài làm * ({exam.title.length}/{MAX_TITLE_LENGTH})
              </label>
              <input
                type="text"
                value={exam.title}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_TITLE_LENGTH) {
                    handleExamChange('title', e.target.value);
                  }
                }}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Nhập tiêu đề bài làm"
                maxLength={MAX_TITLE_LENGTH}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian làm bài (phút) *
                </label>
                <input
                  type="number"
                  value={exam.duration}
                  onChange={(e) => handleExamChange('duration', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  min="1"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại bài luyện tập *
                </label>
                <select
                  value={exam.type}
                  onChange={(e) => handleExamChange('type', e.target.value as ExamType)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="FREE">Miễn phí</option>
                  <option value="FEE">Có phí</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả bài làm ({exam.description.length}/{MAX_DESCRIPTION_LENGTH})
              </label>
              <textarea
                value={exam.description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    handleExamChange('description', e.target.value);
                  }
                }}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mô tả ngắn về bài làm (tùy chọn)"
                rows={4}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
            </div>

            {/* Summary */}
            {isBasicInfoValid && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{exam.title}</span> · {selectedGrade?.name} · {selectedSubject?.name} · {exam.duration} phút
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => isBasicInfoValid && setCurrentStep(1)}
                disabled={!isBasicInfoValid}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Thêm câu hỏi và đáp án
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Questions */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">
                Tổng câu hỏi: <span className="font-semibold">{exam.questions.length}/{MAX_QUESTIONS}</span>
              </p>
            </div>

            {exam.questions.map((question, qIdx) => (
              <div key={qIdx} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Câu hỏi {qIdx + 1}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateQuestion(qIdx)}
                      disabled={exam.questions.length >= MAX_QUESTIONS}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Sao chép câu hỏi"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => removeQuestion(qIdx)}
                      disabled={exam.questions.length === 1}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Câu hỏi * ({question.content.length}/500)
                    </label>
                    <textarea
                      value={question.content}
                      onChange={(e) => handleQuestionChange(qIdx, 'content', e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Nhập câu hỏi"
                      rows={3}
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ảnh minh họa ({question.image?.length || 0}/500)
                    </label>
                    <input
                      type="text"
                      value={question.image || ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          handleQuestionChange(qIdx, 'image', e.target.value);
                        }
                      }}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Đường dẫn hình ảnh (tùy chọn)"
                      maxLength={500}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Các đáp án *
                      {hasDuplicateAnswers(question) && (
                        <span className="text-red-600 text-xs ml-2">Có đáp án trùng lặp!</span>
                      )}
                    </label>
                    <div className="space-y-2">
                      {question.answers.map((answer, aIdx) => (
                        <input
                          key={aIdx}
                          type="text"
                          value={answer}
                          onChange={(e) => handleAnswerChange(qIdx, aIdx, e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder={`Đáp án ${aIdx + 1}`}
                          maxLength={MAX_ANSWER_LENGTH}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đáp án đúng *
                      </label>
                      <select
                        value={question.correct}
                        onChange={(e) => handleQuestionChange(qIdx, 'correct', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Chọn đáp án đúng</option>
                        {question.answers.map((ans, idx) => (
                          <option key={idx} value={ans}>
                            {ans || `Đáp án ${idx + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Điểm * (1-100)
                      </label>
                      <input
                        type="number"
                        value={question.score}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          handleQuestionChange(qIdx, 'score', Math.max(1, Math.min(100, val)));
                        }}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  {validateQuestion(question) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{validateQuestion(question)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addQuestion}
              disabled={exam.questions.length >= MAX_QUESTIONS}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-gray-300"
            >
              <Plus size={20} />
              Thêm câu hỏi
            </button>

            <div className="flex justify-between pt-4">
              <button
                onClick={handleBackToBasicInfo}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isBasicInfoValid || !isQuestionsValid}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tạo bài luyện tập
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}