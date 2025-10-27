import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Clock, 
  FileText, 
  Award,
  ChevronRight,
  ChevronLeft,
  Edit2,
  X,
  Check,
  AlertCircle,
  User,
  Calendar,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { getExamDetail, updateExam, updateQuestion, deleteQuestion, createQuestion, uploadFile } from '../../../../services/exam.admin';
import { ExamDetailResponse, ExamType } from '../../../../types/exam.admin';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface QuestionForm {
  id: string;
  content: string;
  answers: string[];
  correctAnswer: string;
  score: number;
  image?: string;
}

interface ExamEditProps {
  examId: string;
  onBack?: () => void;
}

const ExamEdit: React.FC<ExamEditProps> = ({ examId, onBack }) => {
  const [exam, setExam] = useState<ExamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Edit mode states
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [basicInfoForm, setBasicInfoForm] = useState({
    title: '',
    duration: 0,
    type: ExamType.FREE as ExamType,
    active: true
  });

  const [questionForm, setQuestionForm] = useState<QuestionForm>({
    id: '',
    content: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
    score: 1,
    image: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch exam data
  useEffect(() => {
    const fetchExamDetail = async () => {
      setLoading(true);
      try {
        const response = await getExamDetail(examId);
        setExam(response.data);
        setBasicInfoForm({
          title: response.data.title,
          duration: response.data.duration,
          type: response.data.type as ExamType,
          active: response.data.active || true
        });
      } catch (err) {
        console.error('Error fetching exam detail:', err);
        setError('Không thể tải chi tiết đề thi. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetail();
  }, [examId]);

  // Navigation
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setEditingQuestionId(null);
    }
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setEditingQuestionId(null);
    }
  };

  const handleQuestionJump = async (index: number) => {
    // Check if currently editing and has unsaved data
    if (editingQuestionId && isDataChanged()) {
      const result = await Swal.fire({
        title: 'Bạn có dữ liệu chưa lưu',
        text: 'Bạn có chắc muốn thoát? Dữ liệu sẽ bị mất.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Thoát',
        cancelButtonText: 'Tiếp tục chỉnh sửa',
        confirmButtonColor: '#dc2626'
      });

      if (!result.isConfirmed) return;
    }

    setCurrentQuestionIndex(index);
    setEditingQuestionId(null);
  };

  const isDataChanged = (): boolean => {
    if (!editingQuestionId) return false;

    const currentQ = exam?.questions[currentQuestionIndex];
    if (!currentQ) return true;

    // Check if it's a new question (has temp id)
    if (editingQuestionId.startsWith('temp_')) {
      return (
        questionForm.content.trim() !== '' ||
        questionForm.answers.some(a => a.trim() !== '') ||
        questionForm.correctAnswer.trim() !== '' ||
        questionForm.score !== 1 ||
        questionForm.image !== ''
      );
    }

    // Check if data has changed for existing question
    return (
      questionForm.content !== currentQ.content ||
      JSON.stringify(questionForm.answers) !== JSON.stringify(currentQ.answers) ||
      questionForm.correctAnswer !== currentQ.correctAnswer ||
      questionForm.score !== currentQ.score ||
      questionForm.image !== (currentQ.image || '')
    );
  };

  // Basic Info Edit
  const handleEditBasicInfo = () => {
    setEditingBasicInfo(true);
  };

  const handleCancelBasicInfo = () => {
    if (exam) {
      setBasicInfoForm({
        title: exam.title,
        duration: exam.duration,
        type: exam.type as ExamType,
        active: exam.active || true
      });
    }
    setEditingBasicInfo(false);
    setErrors({});
  };

  const handleSaveBasicInfo = async () => {
    // Validate
    const newErrors: {[key: string]: string} = {};
    if (!basicInfoForm.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }
    if (basicInfoForm.duration < 1) {
      newErrors.duration = 'Thời gian phải lớn hơn 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      // Chỉ gửi title và duration
      await updateExam(examId,basicInfoForm.title,basicInfoForm.duration);
      if (exam) {
        setExam({
          ...exam,
          title: basicInfoForm.title,
          duration: basicInfoForm.duration
        });
      }
      
      setEditingBasicInfo(false);
      setErrors({});
      toast.success('✅ Cập nhật thông tin đề thi thành công!');
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error('❌ Không thể cập nhật thông tin đề thi.');
    } finally {
      setSaving(false);
    }
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
        setQuestionForm({ ...questionForm, image: String(response.data) });
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

  // Question Edit
  const handleEditQuestion = (question: any) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      id: question.id,
      content: question.content,
      answers: [...question.answers],
      correctAnswer: question.correctAnswer,
      score: question.score,
      image: question.image || ''
    });
    setErrors({});
  };

  const handleCancelEditQuestion = () => {
    // If it's a new question (temp id), remove it from the list
    if (editingQuestionId?.startsWith('temp_') && exam) {
      const newQuestions = exam.questions.filter(q => q.id !== editingQuestionId);
      setExam({
        ...exam,
        questions: newQuestions,
        totalQuestions: newQuestions.length
      });

      // Adjust current index if needed
      if (currentQuestionIndex >= newQuestions.length && newQuestions.length > 0) {
        setCurrentQuestionIndex(newQuestions.length - 1);
      } else if (newQuestions.length === 0) {
        setCurrentQuestionIndex(0);
      }
      
      toast.info('ℹ️ Đã hủy thêm câu hỏi');
    }

    setEditingQuestionId(null);
    setQuestionForm({
      id: '',
      content: '',
      answers: ['', '', '', ''],
      correctAnswer: '',
      score: 1,
      image: ''
    });
    setErrors({});
  };

  const handleSaveQuestion = async () => {
    // Validate
    const newErrors: {[key: string]: string} = {};
    if (!questionForm.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung câu hỏi';
    }
    if (questionForm.answers.some(a => !a.trim())) {
      newErrors.answers = 'Tất cả đáp án phải có nội dung';
    }
    if (!questionForm.correctAnswer.trim()) {
      newErrors.correctAnswer = 'Vui lòng chọn đáp án đúng';
    }
    if (questionForm.score <= 0) {
      newErrors.score = 'Điểm số phải lớn hơn 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSavingQuestionId(questionForm.id);
    try {
      // Check if it's a new question (tempId)
      if (questionForm.id.startsWith('temp_')) {
        // Create new question - don't send the temp id to backend
        const { id, ...questionData } = questionForm;
        const response = await createQuestion(examId, questionData);
        
        // Update local state with actual ID from server
        if (exam) {
          const updatedQuestions = exam.questions.map(q => 
            q.id === questionForm.id ? response.data : q
          );
          setExam({
            ...exam,
            questions: updatedQuestions
          });
        }
        
        toast.success('✅ Thêm câu hỏi mới thành công!');
      } else {
        // Update existing question
        await updateQuestion(questionForm.id, questionForm);
        
        // Update local state
        if (exam) {
          setExam({
            ...exam,
            questions: exam.questions.map(q => 
              q.id === questionForm.id ? { ...q, ...questionForm } : q
            )
          });
        }
        
        toast.success('✅ Cập nhật câu hỏi thành công!');
      }
      
      setEditingQuestionId(null);
      setErrors({});
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('❌ Không thể lưu câu hỏi.');
    } finally {
      setSavingQuestionId(null);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa câu hỏi?',
      text: 'Bạn có chắc muốn xóa câu hỏi này? Hành động này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteQuestion(questionId);
      
      // Update local state
      if (exam) {
        const newQuestions = exam.questions.filter(q => q.id !== questionId);
        setExam({
          ...exam,
          questions: newQuestions,
          totalQuestions: newQuestions.length
        });

        // Adjust current index if needed
        if (currentQuestionIndex >= newQuestions.length) {
          setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1));
        }
      }
      
      toast.success('✅ Xóa câu hỏi thành công!');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('❌ Không thể xóa câu hỏi.');
    }
  };

  const handleAddQuestion = () => {
    if (!exam) return;

    // Tạo một câu hỏi mới với ID tạm thời
    const tempId = `temp_${Date.now()}`;
    const newQuestion: QuestionForm = {
      id: tempId,
      content: '',
      answers: ['', '', '', ''],
      correctAnswer: '',
      score: 1,
      image: ''
    };

    // Thêm vào danh sách câu hỏi (chưa lưu lên server)
    const updatedExam = {
      ...exam,
      questions: [...exam.questions, { ...newQuestion } as any],
      totalQuestions: exam.questions.length + 1
    };
    setExam(updatedExam);

    // Chuyển đến câu hỏi mới và mở mode edit
    setCurrentQuestionIndex(exam.questions.length);
    setEditingQuestionId(tempId);
    setQuestionForm(newQuestion);
    toast.info('ℹ️ Nhập dữ liệu câu hỏi và click Lưu để thêm');
  };

  const updateAnswer = (answerIndex: number, value: string) => {
    const newAnswers = [...questionForm.answers];
    newAnswers[answerIndex] = value;
    setQuestionForm({ ...questionForm, answers: newAnswers });
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
  const isEditingCurrentQuestion = editingQuestionId === currentQuestion?.id;

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
            {editingBasicInfo ? (
              // Edit Mode - Chỉ cho phép sửa Title và Duration
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề đề thi *
                  </label>
                  <input
                    type="text"
                    value={basicInfoForm.title}
                    onChange={(e) => setBasicInfoForm({ ...basicInfoForm, title: e.target.value })}
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
                    value={basicInfoForm.duration}
                    onChange={(e) => setBasicInfoForm({ ...basicInfoForm, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="1"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveBasicInfo}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-semibold"
                  >
                    <Check size={18} />
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    onClick={handleCancelBasicInfo}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
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
                    <button
                      onClick={handleEditBasicInfo}
                      className="ml-2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Chỉnh sửa thông tin"
                    >
                      <Edit2 size={20} />
                    </button>
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
            )}

            {/* Progress indicator */}
            {!editingBasicInfo && (
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
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Question */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {isEditingCurrentQuestion ? (
                // Edit Question Mode
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Chỉnh sửa câu {currentQuestionIndex + 1}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveQuestion}
                        disabled={savingQuestionId === currentQuestion.id}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-semibold"
                      >
                        <Check size={18} />
                        {savingQuestionId === currentQuestion.id ? 'Đang lưu...' : 'Lưu'}
                      </button>
                      <button
                        onClick={handleCancelEditQuestion}
                        disabled={savingQuestionId === currentQuestion.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                      >
                        <X size={18} />
                        Hủy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nội dung câu hỏi *
                    </label>
                    <textarea
                      value={questionForm.content}
                      onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
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
                      value={questionForm.score}
                      onChange={(e) => setQuestionForm({ ...questionForm, score: parseFloat(e.target.value) || 0 })}
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
                      {questionForm.answers.map((answer, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct_answer"
                            checked={questionForm.correctAnswer === answer}
                            onChange={() => setQuestionForm({ ...questionForm, correctAnswer: answer })}
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

                    {!questionForm.image ? (
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
                          src={questionForm.image}
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
                            onClick={() => setQuestionForm({ ...questionForm, image: '' })}
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
              ) : (
                // View Question Mode
                <>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Câu {currentQuestionIndex + 1}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-lg font-semibold">
                        {currentQuestion.score} điểm
                      </span>
                      <button
                        onClick={() => handleEditQuestion(currentQuestion)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa câu hỏi"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(currentQuestion.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-lg text-gray-800 leading-relaxed mb-6">
                      {currentQuestion.content}
                    </p>

                    {currentQuestion.image && (
                      <div className="mb-6">
                        <img
                          src={currentQuestion.image}
                          alt="Hình minh họa"
                          className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-gray-700 mb-3">Các đáp án:</div>
                      {currentQuestion.answers.map((answer, index) => {
                        const answerLabel = String.fromCharCode(65 + index);
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
                              <Check className="text-green-600 flex-shrink-0 mt-2" size={24} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <Check size={18} />
                        <span className="text-sm font-semibold">
                          Đáp án đúng: {String.fromCharCode(65 + currentQuestion.answers.indexOf(currentQuestion.correctAnswer))} - {currentQuestion.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>

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
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách câu hỏi</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {exam.questions.map((question, index) => {
                  const isCurrent = index === currentQuestionIndex;
                  const isEditing = editingQuestionId === question.id;

                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-110'
                          : isEditing
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={`Câu ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleAddQuestion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold mb-4"
              >
                <Plus size={18} />
                Thêm câu hỏi
              </button>

              <div className="pt-4 border-t space-y-3">
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

export default ExamEdit;