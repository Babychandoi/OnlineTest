// ============================================
// File: ExamManagement.tsx (Updated with ExamCreate)
// ============================================

import React, { useState, useEffect } from 'react';
import {
  ExamResponse,
  SubjectResponse,
  SubjectsOfGradeResponse,
} from '../../../types/exam.admin';
import ExamBreadcrumb from './exams/ExamBreadcrumb';
import GradeSelection from './exams/GradeSelection';
import SubjectSelection from './exams/SubjectSelection';
import ExamList from './exams/ExamList';
import ExamDetail from './exams/ExamDetail';
import ExamEdit from './exams/ExamEdit';
import ExamCreate from './exams/ExamCreate';
import {
  listSubjectsOfGradesForExam,
  listExamsByGradeAndSubject,
  toggleExamStatus,
  toggleExamType,
  PageableResponse,
} from '../../../services/exam.admin';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ExamManagement: React.FC = () => {
  const [grades, setGrades] = useState<SubjectsOfGradeResponse[]>([]);
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<SubjectsOfGradeResponse | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State for exam detail view
  const [viewingExamId, setViewingExamId] = useState<string | null>(null);
  
  // State for exam edit view
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  // State for exam create view
  const [isCreating, setIsCreating] = useState(false);

  // =============================
  // 🟢 Fetch danh sách khối lớp
  // =============================
  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      try {
        const response = await listSubjectsOfGradesForExam();
        setGrades(response.data);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setError('Không thể tải danh sách khối lớp. Vui lòng thử lại sau.');
        toast.error('❌ Không thể tải danh sách khối lớp.');
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  // =============================
  // 🟢 Fetch danh sách đề thi
  // =============================
  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedGrade || !selectedSubject) {
        setExams([]);
        setTotalPages(0);
        setTotalElements(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response: PageableResponse<ExamResponse> = await listExamsByGradeAndSubject(
          selectedGrade.id,
          selectedSubject.id,
          currentPage,
          pageSize
        );

        setExams(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setError('Không thể tải danh sách đề thi. Vui lòng thử lại sau.');
        toast.error('❌ Lỗi tải danh sách đề thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [selectedGrade, selectedSubject, currentPage, pageSize]);

  // =============================
  // 🔹 Điều hướng
  // =============================
  const handleNavigateToGrades = () => {
    setSelectedGrade(null);
    setSelectedSubject(null);
    setExams([]);
    setCurrentPage(0);
    setTotalPages(0);
    setTotalElements(0);
    setError(null);
    setViewingExamId(null);
    setEditingExamId(null);
    setIsCreating(false);
  };

  const handleNavigateToSubjects = () => {
    setSelectedSubject(null);
    setExams([]);
    setCurrentPage(0);
    setTotalPages(0);
    setTotalElements(0);
    setError(null);
    setViewingExamId(null);
    setEditingExamId(null);
    setIsCreating(false);
  };

  // =============================
  // 🔹 Chọn khối / môn
  // =============================
  const handleGradeSelect = (grade: SubjectsOfGradeResponse) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setExams([]);
    setCurrentPage(0);
    setError(null);
    setViewingExamId(null);
    setEditingExamId(null);
    setIsCreating(false);
  };

  const handleSubjectSelect = (subject: SubjectResponse) => {
    setSelectedSubject(subject);
    setCurrentPage(0);
    setError(null);
    setViewingExamId(null);
    setEditingExamId(null);
    setIsCreating(false);
  };

  // =============================
  // 🔹 Toggle trạng thái đề thi
  // =============================
  const handleToggleExamStatus = async (examId: string) => {
    try {
      setExams(exams.map(e => e.id === examId ? { ...e, active: !e.active } : e));
      await toggleExamStatus(examId);
      toast.success('✅ Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error toggling exam status:', error);
      setExams(exams.map(e => e.id === examId ? { ...e, active: !e.active } : e));
      toast.error('❌ Không thể thay đổi trạng thái đề thi.');
    }
  };

  // =============================
  // 🔹 Toggle loại đề thi
  // =============================
  const handleToggleExamType = async (examId: string) => {
    try {
      const exam = exams.find(e => e.id === examId);
      if (!exam) return;

      const newType = exam.type === 'FREE' ? 'FEE' : 'FREE';

      const result = await Swal.fire({
        title: 'Xác nhận thay đổi loại đề thi?',
        text: `Bạn có chắc muốn chuyển đề thi này sang loại "${newType}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
      });

      if (!result.isConfirmed) return;

      setExams(exams.map(e => e.id === examId ? { ...e, type: newType as any } : e));
      await toggleExamType(examId, newType);
      toast.success(`✅ Đã chuyển sang loại ${newType === 'FREE' ? 'Miễn phí' : 'Trả phí'}.`);
    } catch (error) {
      console.error('Error toggling exam type:', error);
      toast.error('❌ Không thể thay đổi loại đề thi.');
    }
  };

  // =============================
  // 🔹 Xem chi tiết đề thi
  // =============================
  const handleViewExam = (exam: ExamResponse) => {
    setViewingExamId(exam.id);
    setEditingExamId(null);
    setIsCreating(false);
  };

  const handleBackFromDetail = () => {
    setViewingExamId(null);
  };

  // =============================
  // 🔹 Chỉnh sửa đề thi
  // =============================
  const handleEditExam = (exam: ExamResponse) => {
    setEditingExamId(exam.id);
    setViewingExamId(null);
    setIsCreating(false);
  };

  const handleBackFromEdit = async () => {
    setEditingExamId(null);
    
    // Refresh exam list khi quay lại từ trang edit
    if (selectedGrade && selectedSubject) {
      setLoading(true);
      try {
        const response: PageableResponse<ExamResponse> = await listExamsByGradeAndSubject(
          selectedGrade.id,
          selectedSubject.id,
          currentPage,
          pageSize
        );
        setExams(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Error refreshing exams:', error);
        toast.error('❌ Không thể tải lại danh sách đề thi.');
      } finally {
        setLoading(false);
      }
    }
  };

  // =============================
  // 🔹 Tạo đề thi mới
  // =============================
  const handleCreateExam = () => {
    if (!selectedGrade || !selectedSubject) {
      toast.warn('⚠️ Vui lòng chọn khối lớp và môn học trước.');
      return;
    }
    setIsCreating(true);
    setViewingExamId(null);
    setEditingExamId(null);
  };

  const handleBackFromCreate = () => {
    setIsCreating(false);
  };

  const handleCreateSuccess = async (examId: string) => {
    setIsCreating(false);
    
    // Refresh exam list sau khi tạo thành công
    if (selectedGrade && selectedSubject) {
      setLoading(true);
      try {
        const response: PageableResponse<ExamResponse> = await listExamsByGradeAndSubject(
          selectedGrade.id,
          selectedSubject.id,
          currentPage,
          pageSize
        );
        setExams(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        
        // Có thể chuyển đến xem chi tiết đề thi vừa tạo
        // setViewingExamId(examId);
      } catch (error) {
        console.error('Error refreshing exams:', error);
        toast.error('❌ Không thể tải lại danh sách đề thi.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const retryFetchExams = () => {
    if (selectedGrade && selectedSubject) {
      setError(null);
      setLoading(true);
      listExamsByGradeAndSubject(selectedGrade.id, selectedSubject.id, currentPage, pageSize)
        .then(response => {
          setExams(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
          toast.success('🔄 Đã tải lại danh sách đề thi.');
        })
        .catch(() => toast.error('❌ Không thể tải danh sách đề thi.'))
        .finally(() => setLoading(false));
    }
  };

  // =============================
  // 🔹 Render giao diện
  // =============================

  // If creating exam, show create view
  if (isCreating && selectedGrade && selectedSubject) {
    return (
      <ExamCreate
        gradeId={selectedGrade.id}
        subjectId={selectedSubject.id}
        onBack={handleBackFromCreate}
        onSuccess={handleCreateSuccess}
      />
    );
  }

  // If editing exam, show edit view
  if (editingExamId) {
    return (
      <ExamEdit
        examId={editingExamId}
        onBack={handleBackFromEdit}
      />
    );
  }

  // If viewing exam detail, show only the detail view
  if (viewingExamId) {
    return <ExamDetail examId={viewingExamId} onBack={handleBackFromDetail} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý đề thi</h1>
          <p className="text-gray-600">Chọn khối lớp và môn học để xem danh sách đề thi</p>
        </div>

        {error && !loading && !selectedGrade && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => window.location.reload()} className="text-sm underline hover:no-underline">
              Tải lại trang
            </button>
          </div>
        )}

        <ExamBreadcrumb
          selectedGrade={selectedGrade}
          selectedSubject={selectedSubject}
          onNavigateToGrades={handleNavigateToGrades}
          onNavigateToSubjects={handleNavigateToSubjects}
        />

        {loadingGrades && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách khối lớp...</p>
          </div>
        )}

        {!loadingGrades && !selectedGrade && grades.length > 0 && (
          <GradeSelection grades={grades} onSelectGrade={handleGradeSelect} />
        )}

        {!loadingGrades && !selectedGrade && grades.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Không có khối lớp nào</p>
          </div>
        )}

        {selectedGrade && !selectedSubject && (
          <SubjectSelection
            grade={selectedGrade}
            onSelectSubject={handleSubjectSelect}
            onBack={handleNavigateToGrades}
          />
        )}

        {selectedGrade && selectedSubject && (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={retryFetchExams} className="text-sm underline hover:no-underline">
                  Thử lại
                </button>
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Đang tải danh sách đề thi...</p>
              </div>
            ) : (
              <ExamList
                grade={selectedGrade}
                subject={selectedSubject}
                exams={exams}
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onBack={handleNavigateToSubjects}
                onToggleStatus={handleToggleExamStatus}
                onToggleType={handleToggleExamType}
                onView={handleViewExam}
                onEdit={handleEditExam}
                onCreateExam={handleCreateExam}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;