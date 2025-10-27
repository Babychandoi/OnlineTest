import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Badge } from 'flowbite-react';
import { FileText, ChevronRight, Clock, Award, ArrowLeft, Lock, ChevronLeft } from 'lucide-react';
import { listExams } from '../../../../services/service';
import { ExamResponse } from '../../../../types/exam';
import ExamTaking from '../Quizz-test';
import { getUserFromToken } from '../../../../util/tokenUtils';

// Định nghĩa interface cho User
interface User {
  id: string;
  accountType: string;
  scope: string;
  isPremium: boolean;
  exp?: number;
  iat?: number;
}

const ExamList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get IDs from URL params
  const subjectId = searchParams.get('subjectId') || '';
  const gradeId = searchParams.get('gradeId') || '';
  
  // Get names from location state (hidden from URL)
  const { subjectName = 'Môn học', gradeName = 'Khối' } = location.state || {};

  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [user] = useState<User | null>(() => getUserFromToken());

  useEffect(() => {
    if (!subjectId || !gradeId) {
      navigate('/subjects');
      return;
    }

    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await listExams(subjectId, gradeId, currentPage) as any;
        console.log(response);
        // Handle paginated response
        if (response.content) {
          setExams(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
        } else {
          // Fallback for non-paginated response
          setExams(response);
          setTotalElements(response.length);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [gradeId, subjectId, currentPage, navigate]);

  const isAuthenticated = () => {
    const token = sessionStorage.getItem('access-token');
    return !!token;
  };

  const handleExamClick = (exam: ExamResponse) => {
    // Kiểm tra đăng nhập trước
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return;
    }

    // Kiểm tra nếu là đề thi FEE và user chưa Premium
    if (exam.type === 'FEE') {
      if (!user || !user.isPremium) {
        setShowPremiumModal(true);
        return;
      }
    }

    // Cho phép làm bài thi
    setSelectedExamId(exam.id);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/ot';
  };

  const handlePremiumRedirect = () => {
    setShowPremiumModal(false);
    navigate('/payment');
  };

  const handleExamExit = () => {
    setSelectedExamId(null);
  };

  const handleExamComplete = (result: any) => {
    console.log('Exam completed with result:', result);
    // You can handle the result here if needed
  };

  const handleBackToSubjects = () => {
    navigate('/subjects');
  };

  const getExamTypeInfo = (type: string) => {
    switch (type) {
      case 'FEE':
        return { label: 'Có phí', color: 'info' };
      case 'FREE':
        return { label: 'Miễn phí', color: 'warning' };
      default:
        return { label: type, color: 'gray' };
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push(-1); // ellipsis
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push(-1);
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  // If exam is selected, show ExamTaking component
  if (selectedExamId) {
    return (
      <ExamTaking
        examId={selectedExamId}
        onExit={handleExamExit}
        onComplete={handleExamComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToSubjects}
          className="flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại danh sách môn học</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge color="indigo" size="lg">{gradeName}</Badge>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <Badge color="purple" size="lg">{subjectName}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Danh Sách Đề Thi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalElements} đề thi có sẵn
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Không có đề thi nào
            </p>
          </div>
        ) : (
          <>
            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {exams.map((exam) => {
                const typeInfo = getExamTypeInfo(exam.type);
                const isFeeExam = exam.type === 'FEE';
                const canAccessExam = !isFeeExam || (user && user.isPremium);
                
                return (
                  <Card
                    key={exam.id}
                    className={`cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${
                      !canAccessExam ? 'relative' : ''
                    }`}
                    onClick={() => handleExamClick(exam)}
                  >
                    {/* Premium Lock Overlay */}
                    {isFeeExam && (!user || !user.isPremium) && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full shadow-lg">
                          <Lock className="h-4 w-4" />
                        </div>
                      </div>
                    )}

                    {/* Exam Header */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge color={typeInfo.color as any}>{typeInfo.label}</Badge>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Exam Title */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {exam.title}
                    </h3>

                    {/* Exam Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Thời gian: {exam.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FileText className="h-4 w-4" />
                        <span>{exam.totalQuestions} câu hỏi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Award className="h-4 w-4" />
                        <span>Tổng điểm: {exam.totalScore}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                    {/* Action Button */}
                    <button className={`w-full py-2 px-4 rounded-lg transition-all font-medium ${
                      isFeeExam && (!user || !user.isPremium)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                    }`}>
                      {isFeeExam && (!user || !user.isPremium) ? 'Nâng cấp Premium' : 'Làm bài thi'}
                    </button>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  page === -1 ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {page + 1}
                    </button>
                  )
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Yêu cầu đăng nhập
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn cần đăng nhập để làm bài thi. Vui lòng đăng nhập để tiếp tục.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLoginRedirect}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all font-medium"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Required Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Yêu cầu Premium
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Đề thi này chỉ dành cho thành viên Premium. Vui lòng nâng cấp tài khoản để truy cập.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePremiumRedirect}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                >
                  Đăng ký Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;