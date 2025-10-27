import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  FileText,
  Layers,
  BookOpen,
  Award,
  ArrowLeft,
  Save,
  X,
  ChevronDown,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { listSubjectsOfGradesForExam, listExamsByGradeAndSubject } from '../../../../services/exam.admin';
import { CompetitionRequest, PageableResponse, SubjectsOfGradeResponse } from '../../../../types/competition.admin';
import { createCompetition } from '../../../../services/competition.admin';
import { ExamResponse } from '../../../../types/exam.admin';

// Types




interface CreateCompetitionProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CreateCompetition: React.FC<CreateCompetitionProps> = ({
  onBack,
  onSuccess
}) => {
  // Form state
  const [formData, setFormData] = useState<CompetitionRequest>({
    title: '',
    description: '',
    examId: '',
    startTime: '',
    type: false
  });

  // Selection state
  const [grades, setGrades] = useState<SubjectsOfGradeResponse[]>([]);
  const [selectedGradeId, setSelectedGradeId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalExams, setTotalExams] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [examSearchTerm, setExamSearchTerm] = useState('');

  // Fetch grades on mount
  useEffect(() => {
    fetchGrades();
  }, []);

  // Fetch exams when grade and subject selected
  useEffect(() => {
    if (selectedGradeId && selectedSubjectId) {
      setCurrentPage(0);
      fetchExams(selectedGradeId, selectedSubjectId, 0);
    } else {
      setExams([]);
      setSelectedExam(null);
      setFormData(prev => ({ ...prev, examId: '' }));
      setCurrentPage(0);
      setTotalPages(0);
    }
  }, [selectedGradeId, selectedSubjectId]);

  const fetchGrades = async () => {
    setLoadingGrades(true);
    try {
      const response = await listSubjectsOfGradesForExam();
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('❌ Không thể tải danh sách lớp học.');
    } finally {
      setLoadingGrades(false);
    }
  };

  const fetchExams = async (gradeId: string, subjectId: string, page: number = 0) => {
    setLoadingExams(true);
    try {
      const response = await listExamsByGradeAndSubject(gradeId, subjectId, page, 15);
      const pageableData = response as PageableResponse<ExamResponse>;
      
      setExams(pageableData.content);
      setCurrentPage(pageableData.number);
      setTotalPages(pageableData.totalPages);
      setTotalExams(pageableData.totalElements);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('❌ Không thể tải danh sách đề thi.');
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    setSelectedSubjectId('');
    setExams([]);
    setSelectedExam(null);
    setFormData(prev => ({ ...prev, examId: '' }));
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setExams([]);
    setSelectedExam(null);
    setFormData(prev => ({ ...prev, examId: '' }));
  };

  const handleExamSelect = (exam: ExamResponse) => {
    setSelectedExam(exam);
    setFormData(prev => ({ ...prev, examId: exam.id }));
  };

  const handleInputChange = (field: keyof CompetitionRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchExams(selectedGradeId, selectedSubjectId, newPage);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('❌ Vui lòng nhập tiêu đề cuộc thi.');
      return false;
    }
    if (!selectedGradeId) {
      toast.error('❌ Vui lòng chọn khối lớp.');
      return false;
    }
    if (!selectedSubjectId) {
      toast.error('❌ Vui lòng chọn môn học.');
      return false;
    }
    if (!formData.examId) {
      toast.error('❌ Vui lòng chọn đề thi.');
      return false;
    }
    if (!formData.startTime) {
      toast.error('❌ Vui lòng chọn thời gian bắt đầu.');
      return false;
    }

    const startDate = new Date(formData.startTime);
    const now = new Date();
    if (startDate <= now) {
      toast.error('❌ Thời gian bắt đầu phải sau thời điểm hiện tại.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
        await createCompetition(formData);
      
      
      toast.success('✅ Tạo cuộc thi thành công!');
      onSuccess();
    } catch (error) {
      console.error('Error creating competition:', error);
      toast.error('❌ Không thể tạo cuộc thi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const selectedGrade = grades.find(g => g.id === selectedGradeId);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(examSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-500" size={36} />
            <h1 className="text-3xl font-bold text-gray-800">Tạo cuộc thi mới</h1>
          </div>
          <p className="text-gray-600">Điền thông tin để tạo cuộc thi cho học sinh</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={24} className="text-indigo-600" />
              Thông tin cơ bản
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề cuộc thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề cuộc thi..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả về cuộc thi..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Competition Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại cuộc thi <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={!formData.type}
                      onChange={() => handleInputChange('type', false)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                      <Award size={16} />
                      Miễn phí
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type}
                      onChange={() => handleInputChange('type', true)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
                      <Award size={16} />
                      Premium
                    </span>
                  </label>
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grade and Subject Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Layers size={24} className="text-purple-600" />
              Chọn khối lớp và môn học
            </h2>

            {loadingGrades ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p className="text-gray-600">Đang tải danh sách lớp...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Grade Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Khối lớp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={selectedGradeId}
                      onChange={(e) => handleGradeChange(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                      required
                    >
                      <option value="">-- Chọn khối lớp --</option>
                      {grades.map(grade => (
                        <option key={grade.id} value={grade.id}>
                          {grade.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Môn học <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      disabled={!selectedGradeId}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">-- Chọn môn học --</option>
                      {selectedGrade?.subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exam Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              Chọn đề thi
            </h2>

            {!selectedGradeId || !selectedSubjectId ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Vui lòng chọn khối lớp và môn học trước</p>
              </div>
            ) : loadingExams ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p className="text-gray-600">Đang tải danh sách đề thi...</p>
              </div>
            ) : (
              <>
                {/* Search Exams */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đề thi..."
                    value={examSearchTerm}
                    onChange={(e) => setExamSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {filteredExams.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">Không tìm thấy đề thi nào</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto mb-4">
                      {filteredExams.map(exam => (
                        <div
                          key={exam.id}
                          onClick={() => handleExamSelect(exam)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedExam?.id === exam.id
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-800">{exam.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  exam.active 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {exam.active ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Giáo viên: <span className="font-medium">{exam.teacherName}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {exam.duration} phút
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText size={14} />
                                  {exam.totalQuestions} câu hỏi
                                </span>
                                <span className="flex items-center gap-1">
                                  <Award size={14} />
                                  {exam.totalScore} điểm
                                </span>
                              </div>
                            </div>
                            {selectedExam?.id === exam.id && (
                              <div className="ml-4">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Trang {currentPage + 1} / {totalPages} ({totalExams} đề thi)
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Trước
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Sau
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <X size={20} />
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Tạo cuộc thi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetition;