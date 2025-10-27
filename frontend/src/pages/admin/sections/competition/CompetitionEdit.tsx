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
  Search,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  listSubjectsOfGradesForExam, 
  listExamsByGradeAndSubject 
} from '../../../../services/exam.admin';
import { 
  CompetitionResponse, 
  PageableResponse,
  SubjectsOfGradeResponse 
} from '../../../../types/competition.admin';
import { 
  updateCompetition,
  updateCompetitionExam 
} from '../../../../services/competition.admin';
import { ExamResponse } from '../../../../types/exam.admin';
import { calculateCompetitionStatus } from '../../../../util/util';

interface EditCompetitionProps {
  competition: CompetitionResponse;
  onBack: () => void;
  onSuccess: () => void;
}

interface ComptitionRequest {
  title: string;
  description: string;
  startTime: string;
  type: boolean;
}


const EditCompetition: React.FC<EditCompetitionProps> = ({
  competition,
  onBack,
  onSuccess
}) => {
  const currentStatus = calculateCompetitionStatus(
    competition.startTime, 
    competition.duration
  );

  // Form state cho thông tin cơ bản
  const [basicInfo, setBasicInfo] = useState<ComptitionRequest>({
    title: competition.title,
    description: competition.description || '',
    startTime: competition.startTime ? new Date(competition.startTime).toISOString().slice(0, 16) : '',
    type: competition.type,
  });

  // State cho exam
  const [currentExamId, setCurrentExamId] = useState<string>(competition.examId || '');

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
  const [loadingBasicInfo, setLoadingBasicInfo] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [hasBasicInfoChanges, setHasBasicInfoChanges] = useState(false);
  const [hasExamChanges, setHasExamChanges] = useState(false);
  const [examSearch, setExamSearch] = useState('');

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

   const fetchExams = React.useCallback(
    async (gradeId: string, subjectId: string, page: number = 0) => {
      setLoadingExams(true);
      try {
        const response = await listExamsByGradeAndSubject(gradeId, subjectId, page, 5);
        const pageableData = response as PageableResponse<ExamResponse>;
        
        setExams(pageableData.content);
        setCurrentPage(pageableData.number);
        setTotalPages(pageableData.totalPages);
        setTotalExams(pageableData.totalElements);

        // Set selected exam if it matches current examId
        if (currentExamId) {
          const exam = pageableData.content.find(e => e.id === currentExamId);
          if (exam) {
            setSelectedExam(exam);
          }
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        toast.error('❌ Không thể tải danh sách đề thi.');
        setExams([]);
      } finally {
        setLoadingExams(false);
      }
    },
    []
  );

  // Fetch grades on mount
  useEffect(() => {
    fetchGrades();
  }, []);

  // Initialize selected grade and subject from competition data
  useEffect(() => {
    if (grades.length > 0 && competition.gradeName && competition.subjectName) {
      const grade = grades.find(g => g.name === competition.gradeName);
      if (grade) {
        setSelectedGradeId(grade.id);
        const subject = grade.subjects.find(s => s.name === competition.subjectName);
        if (subject) {
          setSelectedSubjectId(subject.id);
        }
      }
    }
  }, [grades, competition]);

  // Fetch exams when grade and subject selected
  useEffect(() => {
    if (selectedGradeId && selectedSubjectId) {
      fetchExams(selectedGradeId, selectedSubjectId, 0);
    } else {
      setExams([]);
      setSelectedExam(null);
    }
  }, [selectedGradeId, selectedSubjectId, fetchExams]);

  // Track basic info changes
  useEffect(() => {
    const changed = 
      basicInfo.title !== competition.title ||
      basicInfo.description !== (competition.description || '') ||
      basicInfo.startTime !== (competition.startTime ? new Date(competition.startTime).toISOString().slice(0, 16) : '') ||
      basicInfo.type !== competition.type;
    
    setHasBasicInfoChanges(changed);
  }, [basicInfo, competition]);

  // Track exam changes
  useEffect(() => {
    setHasExamChanges(currentExamId !== (competition.examId || ''));
  }, [currentExamId, competition.examId]);

  const handleGradeChange = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    setSelectedSubjectId('');
    setExams([]);
    setSelectedExam(null);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setExams([]);
    setSelectedExam(null);
  };

  const handleExamSelect = (exam: ExamResponse) => {
    setSelectedExam(exam);
    setCurrentExamId(exam.id);
  };

  const handleBasicInfoChange = (field: keyof ComptitionRequest, value: any) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchExams(selectedGradeId, selectedSubjectId, newPage);
    }
  };

  const validateCompetition = (): boolean => {
    if (!basicInfo.title.trim()) {
      toast.error('❌ Vui lòng nhập tiêu đề cuộc thi.');
      return false;
    }

    if (!basicInfo.startTime) {
      toast.error('❌ Vui lòng chọn thời gian bắt đầu.');
      return false;
    }

    // Validate thời gian phải sau hiện tại
    const startDate = new Date(basicInfo.startTime);
    const now = new Date();
    if (startDate <= now) {
      toast.error('❌ Thời gian bắt đầu phải sau thời điểm hiện tại.');
      return false;
    }

    return true;
  };

  const validateExam = (): boolean => {
    if (!currentExamId) {
      toast.error('❌ Vui lòng chọn đề thi.');
      return false;
    }
    return true;
  };

  // Handler để lưu thông tin cơ bản
  const handleSaveBasicInfo = async () => {
    if (!validateCompetition()) return;
    
    if (!hasBasicInfoChanges) {
      toast.info('ℹ️ Không có thay đổi nào về thông tin cơ bản.');
      return;
    }

    setLoadingBasicInfo(true);
    try {
      await updateCompetition(competition.id, basicInfo);
      toast.success('✅ Cập nhật thông tin cơ bản thành công!');
      onSuccess();
    } catch (error) {
      console.error('Error updating basic info:', error);
      toast.error('❌ Không thể cập nhật thông tin cơ bản. Vui lòng thử lại.');
    } finally {
      setLoadingBasicInfo(false);
    }
  };

  // Handler để thay đổi đề thi
  const handleSaveExam = async () => {
    if (!validateExam()) return;

    if (!hasExamChanges) {
      toast.info('ℹ️ Không có thay đổi nào về đề thi.');
      return;
    }

    setLoadingExam(true);
    try {
      await updateCompetitionExam(competition.id,currentExamId );
      toast.success('✅ Thay đổi đề thi thành công!');
      onSuccess();
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error('❌ Không thể thay đổi đề thi. Vui lòng thử lại.');
    } finally {
      setLoadingExam(false);
    }
  };

  const selectedGrade = grades.find(g => g.id === selectedGradeId);
  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(examSearch.toLowerCase())
  );
  if (currentStatus !== 'UPCOMING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Trophy className="text-yellow-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {competition.title}
              </h2>
              <p className="text-gray-600">
                {currentStatus === 'ONGOING' 
                  ? '⚠️ Cuộc thi đang diễn ra - Không thể chỉnh sửa'
                  : '⚠️ Cuộc thi đã kết thúc - Không thể chỉnh sửa'
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Loại:</span>
                  <span className="ml-2 font-semibold">{competition.type ? 'Premium' : 'Miễn phí'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thời lượng:</span>
                  <span className="ml-2 font-semibold">{competition.duration} phút</span>
                </div>
                <div>
                  <span className="text-gray-600">Khối lớp:</span>
                  <span className="ml-2 font-semibold">{competition.gradeName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Môn học:</span>
                  <span className="ml-2 font-semibold">{competition.subjectName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Đề thi:</span>
                  <span className="ml-2 font-semibold">{competition.examName}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              <ArrowLeft size={20} />
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa cuộc thi</h1>
          </div>
          <p className="text-gray-600">Cập nhật thông tin cuộc thi</p>
        </div>

        {/* Basic Information Section */}
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
                value={basicInfo.title}
                onChange={(e) => handleBasicInfoChange('title', e.target.value)}
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
                value={basicInfo.description}
                onChange={(e) => handleBasicInfoChange('description', e.target.value)}
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
                    checked={!basicInfo.type}
                    onChange={() => handleBasicInfoChange('type', false)}
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
                    checked={basicInfo.type}
                    onChange={() => handleBasicInfoChange('type', true)}
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
                  value={basicInfo.startTime}
                  onChange={(e) => handleBasicInfoChange('startTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ⏰ Thời gian phải sau thời điểm hiện tại
              </p>
            </div>
          </div>

          {/* Save Basic Info Button */}
          <div className="flex items-center justify-end gap-4 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleSaveBasicInfo}
              disabled={loadingBasicInfo || !hasBasicInfoChanges}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingBasicInfo ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Lưu thông tin cơ bản
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grade and Subject Selection + Exam Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Layers size={24} className="text-purple-600" />
            Thay đổi đề thi
          </h2>

          {/* Current Exam Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-1">Đề thi hiện tại:</p>
            <p className="text-blue-900 font-bold">{competition.examName}</p>
            <p className="text-sm text-blue-700 mt-1">
              {competition.gradeName} - {competition.subjectName}
            </p>
          </div>

          {loadingGrades ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <p className="text-gray-600">Đang tải danh sách lớp...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Grade */}
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

                {/* Subject */}
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

              {/* Exam List */}
              {!selectedGradeId || !selectedSubjectId ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Vui lòng chọn khối lớp và môn học để xem danh sách đề thi</p>
                </div>
              ) : loadingExams ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                  <p className="text-gray-600">Đang tải danh sách đề thi...</p>
                </div>
              ) : (
                <>
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm đề thi..."
                      value={examSearch}
                      onChange={(e) => setExamSearch(e.target.value)}
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
            </>
          )}

          {/* Save Exam Button */}
          <div className="flex items-center justify-end gap-4 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleSaveExam}
              disabled={loadingExam || !hasExamChanges}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingExam ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Thay đổi đề thi
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            <X size={20} />
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditCompetition;