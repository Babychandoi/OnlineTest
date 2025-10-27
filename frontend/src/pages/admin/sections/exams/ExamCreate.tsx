import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  FileText, 
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { createExam, uploadFile } from '../../../../services/exam.admin';
import { ExamType } from '../../../../types/exam.admin';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface QuestionForm {
  id: string; // Chỉ dùng để quản lý UI, không gửi lên backend
  content: string;
  answers: string[];
  correct: string; // Đổi từ correctAnswer -> correct để khớp với backend
  score: number;
  image?: string;
}

interface ExamCreateProps {
  onBack?: () => void;
  onSuccess?: (examId: string) => void;
  gradeId?: string;
  subjectId?: string;
}

const ExamCreate: React.FC<ExamCreateProps> = ({ onBack, onSuccess, gradeId, subjectId }) => {
  const [creating, setCreating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [examForm, setExamForm] = useState({
    title: '',
    duration: 60,
    description: '',
    gradeId: gradeId || '',
    subjectId: subjectId || '',
    type: ExamType.FREE as ExamType
  });

  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
    id: `temp_${Date.now()}`,
    content: '',
    answers: ['', '', '', ''],
    correct: '', // Đổi từ correctAnswer -> correct
    score: 1,
    image: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navigation
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveCurrentQuestion();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentQuestion(questions[currentQuestionIndex - 1]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      saveCurrentQuestion();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1]);
    }
  };

  const handleQuestionJump = async (index: number) => {
    if (isCurrentQuestionChanged()) {
      const result = await Swal.fire({
        title: 'Bạn có dữ liệu chưa lưu',
        text: 'Bạn có muốn lưu câu hỏi này trước khi chuyển?',
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Lưu và chuyển',
        denyButtonText: 'Bỏ qua',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#4f46e5'
      });

      if (result.isConfirmed) {
        const saved = saveCurrentQuestion();
        if (!saved) return;
      } else if (result.isDenied) {
        // Continue without saving
      } else {
        return;
      }
    }

    setCurrentQuestionIndex(index);
    setCurrentQuestion(questions[index]);
  };

  const isCurrentQuestionChanged = (): boolean => {
    if (currentQuestionIndex >= questions.length) {
      // New question being added
      return (
        currentQuestion.content.trim() !== '' ||
        currentQuestion.answers.some(a => a.trim() !== '') ||
        currentQuestion.correct.trim() !== '' ||
        currentQuestion.score !== 1 ||
        currentQuestion.image !== ''
      );
    }

    const savedQuestion = questions[currentQuestionIndex];
    return (
      currentQuestion.content !== savedQuestion.content ||
      JSON.stringify(currentQuestion.answers) !== JSON.stringify(savedQuestion.answers) ||
      currentQuestion.correct !== savedQuestion.correct ||
      currentQuestion.score !== savedQuestion.score ||
      currentQuestion.image !== (savedQuestion.image || '')
    );
  };

  // Save current question to list
  const saveCurrentQuestion = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!currentQuestion.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung câu hỏi';
    }
    if (currentQuestion.answers.some(a => !a.trim())) {
      newErrors.answers = 'Tất cả đáp án phải có nội dung';
    }
    if (!currentQuestion.correct.trim()) {
      newErrors.correct = 'Vui lòng chọn đáp án đúng';
    }
    if (currentQuestion.score <= 0) {
      newErrors.score = 'Điểm số phải lớn hơn 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});

    if (currentQuestionIndex >= questions.length) {
      // Add new question
      setQuestions([...questions, currentQuestion]);
    } else {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      setQuestions(updatedQuestions);
    }

    toast.success('✅ Đã lưu câu hỏi');
    return true;
  };

  // Add new question
  const handleAddQuestion = () => {
    if (!saveCurrentQuestion()) return;

    const newQuestion: QuestionForm = {
      id: `temp_${Date.now()}`,
      content: '',
      answers: ['', '', '', ''],
      correct: '', // Đổi từ correctAnswer -> correct
      score: 1,
      image: ''
    };

    setCurrentQuestion(newQuestion);
    setCurrentQuestionIndex(questions.length);
    setErrors({});
    toast.info('ℹ️ Thêm câu hỏi mới');
  };

  // Delete question
  const handleDeleteQuestion = async (index: number) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa câu hỏi?',
      text: 'Bạn có chắc muốn xóa câu hỏi này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);

    // Adjust current index
    if (currentQuestionIndex === index) {
      if (newQuestions.length === 0) {
        // No questions left, reset to new question
        setCurrentQuestion({
          id: `temp_${Date.now()}`,
          content: '',
          answers: ['', '', '', ''],
          correct: '', // Đổi từ correctAnswer -> correct
          score: 1,
          image: ''
        });
        setCurrentQuestionIndex(0);
      } else if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(newQuestions.length - 1);
        setCurrentQuestion(newQuestions[newQuestions.length - 1]);
      } else {
        setCurrentQuestion(newQuestions[currentQuestionIndex]);
      }
    } else if (currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }

    toast.success('✅ Đã xóa câu hỏi');
  };

  // Image Upload Handler
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Vui lòng chọn một tệp hình ảnh hợp lệ.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('❌ Kích thước hình ảnh không được vượt quá 5MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadFile(file);
      if (response.data) {
        setCurrentQuestion({ ...currentQuestion, image: String(response.data) });
        toast.success('✅ Tải ảnh lên thành công!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('❌ Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handlePasteImage = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleImageUpload(file);
        }
        break;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  // Update answer
  const updateAnswer = (answerIndex: number, value: string) => {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[answerIndex] = value;
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  };

  // Create exam
  const handleCreateExam = async () => {
    // Validate basic info
    const newErrors: {[key: string]: string} = {};
    if (!examForm.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề đề thi';
    }
    if (examForm.duration < 1) {
      newErrors.duration = 'Thời gian phải lớn hơn 0';
    }
    if (!examForm.gradeId) {
      newErrors.gradeId = 'Vui lòng chọn khối lớp';
    }
    if (!examForm.subjectId) {
      newErrors.subjectId = 'Vui lòng chọn môn học';
    }

    // Save current question if editing
    if (currentQuestionIndex >= questions.length && !saveCurrentQuestion()) {
      return;
    }

    if (questions.length === 0) {
      newErrors.questions = 'Vui lòng thêm ít nhất một câu hỏi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('❌ Vui lòng kiểm tra lại thông tin');
      return;
    }

    const result = await Swal.fire({
      title: 'Xác nhận tạo đề thi?',
      html: `
        <div class="text-left">
          <p><strong>Tiêu đề:</strong> ${examForm.title}</p>
          <p><strong>Thời gian:</strong> ${examForm.duration} phút</p>
          <p><strong>Số câu hỏi:</strong> ${questions.length}</p>
          <p><strong>Tổng điểm:</strong> ${questions.reduce((sum, q) => sum + q.score, 0)}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Tạo đề thi',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#4f46e5'
    });

    if (!result.isConfirmed) return;

    setCreating(true);
    try {
      const payload = {
        ...examForm,
        questions: questions.map(({ id, ...q }) => ({
          content: q.content,
          answers: q.answers,
          correct: q.correct, // Đảm bảo tên field đúng
          score: q.score,
          image: q.image || undefined // Chỉ gửi image nếu có
        }))
      };

      const response = await createExam(payload);
      
      toast.success('✅ Tạo đề thi thành công!');
      
      if (onSuccess && response.data?.id) {
        onSuccess(response.data.id);
      } else if (onBack) {
        setTimeout(() => onBack(), 1500);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('❌ Không thể tạo đề thi. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
  };

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
  const isNewQuestion = currentQuestionIndex >= questions.length;

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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Tạo đề thi mới</h1>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề đề thi *
                </label>
                <input
                  type="text"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề đề thi"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian (phút) *
                </label>
                <input
                  type="number"
                  value={examForm.duration}
                  onChange={(e) => setExamForm({ ...examForm, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả (Tùy chọn)
                </label>
                <textarea
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={2}
                  placeholder="Nhập mô tả cho đề thi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại đề thi *
                </label>
                <select
                  value={examForm.type}
                  onChange={(e) => setExamForm({ ...examForm, type: e.target.value as ExamType })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={ExamType.FREE}>Miễn phí</option>
                  <option value={ExamType.FEE}>Có phí</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-600 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-indigo-600" />
                <span>{examForm.duration} phút</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                <span>{questions.length} câu hỏi</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-indigo-600" />
                <span>{totalScore} điểm</span>
              </div>
            </div>

            {/* Progress */}
            {questions.length > 0 && (
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Câu hỏi {currentQuestionIndex + 1}/{questions.length + (isNewQuestion ? 1 : 0)}</span>
                  <span>{questions.length} câu đã lưu</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(questions.length / Math.max(questions.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Question */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Câu {currentQuestionIndex + 1} {isNewQuestion && <span className="text-green-600">(Mới)</span>}
                  </h2>
                  <button
                    onClick={saveCurrentQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    <Check size={18} />
                    Lưu câu hỏi
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung câu hỏi *
                  </label>
                  <textarea
                    value={currentQuestion.content}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                    placeholder="Nhập nội dung câu hỏi"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.content}
                    </p>
                  )}
                </div>

                <div className="w-32">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điểm số *
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.score}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, score: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0.1"
                    step="0.1"
                  />
                  {errors.score && (
                    <p className="mt-1 text-sm text-red-600">{errors.score}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Các đáp án * (Chọn đáp án đúng)
                  </label>
                  <div className="space-y-3">
                                          {currentQuestion.answers.map((answer, aIndex) => (
                      <div key={aIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct_answer"
                          checked={currentQuestion.correct === answer}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correct: answer })}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {String.fromCharCode(65 + aIndex)}
                        </span>
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => updateAnswer(aIndex, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.answers && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.answers}
                    </p>
                  )}
                  {errors.correctAnswer && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.correctAnswer}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hình ảnh (Tùy chọn)
                  </label>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {!currentQuestion.image ? (
                    <div
                      onPaste={handlePasteImage}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center bg-indigo-50 cursor-pointer transition-all hover:border-indigo-500 hover:bg-indigo-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon size={32} className="mx-auto text-indigo-600 mb-3" />
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Kéo thả ảnh hoặc nhấp để chọn
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                      </p>
                      <p className="text-xs text-gray-500">
                        Hoặc dán ảnh (Ctrl+V / Cmd+V)
                      </p>
                      {uploadingImage && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-spin"></div>
                          <span className="text-sm text-indigo-600 font-medium">Đang tải ảnh...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={currentQuestion.image}
                        alt="Preview"
                        className="max-w-md h-auto rounded-lg border-2 border-gray-200 mb-3"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-semibold"
                        >
                          <Upload size={16} />
                          {uploadingImage ? 'Đang tải...' : 'Thay đổi ảnh'}
                        </button>
                        <button
                          onClick={() => setCurrentQuestion({ ...currentQuestion, image: '' })}
                          disabled={uploadingImage}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
                        >
                          <X size={16} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              {questions.length > 0 && (
                <div className="flex items-center justify-between pt-6 border-t mt-6">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <ChevronLeft size={20} />
                    Câu trước
                  </button>

                  <div className="text-sm text-gray-600 font-medium">
                    {currentQuestionIndex + 1} / {questions.length + (isNewQuestion ? 1 : 0)}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex >= questions.length - 1}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Câu tiếp
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách câu hỏi</h3>
              
              {questions.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {questions.map((question, index) => {
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
                  
                  {isNewQuestion && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-green-400 bg-green-50 flex items-center justify-center font-semibold text-sm text-green-600">
                      {questions.length + 1}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleAddQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold mb-4"
              >
                <Plus size={18} />
                Thêm câu hỏi
              </button>

              {questions.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Xóa câu hỏi:</p>
                  <select
                    onChange={(e) => {
                      const index = parseInt(e.target.value);
                      if (!isNaN(index)) {
                        handleDeleteQuestion(index);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Chọn câu hỏi cần xóa</option>
                    {questions.map((_, index) => (
                      <option key={index} value={index}>
                        Câu {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tổng câu hỏi:</span>
                  <span className="font-semibold text-gray-800">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tổng điểm:</span>
                  <span className="font-semibold text-gray-800">{totalScore} điểm</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-semibold text-gray-800">{examForm.duration} phút</span>
                </div>
              </div>

              {errors.questions && (
                <p className="mt-4 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.questions}
                </p>
              )}

              <button
                onClick={handleCreateExam}
                disabled={creating || questions.length === 0}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                <Save size={20} />
                {creating ? 'Đang tạo đề thi...' : 'Tạo đề thi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreate;