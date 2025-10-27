
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ExamResponse, SubjectResponse, SubjectsOfGradeResponse } from '../../../../types/exam.admin';
import ExamStats from './ExamStats';
import ExamFilters from './ExamFilters';
import ExamTable from './ExamTable';

interface ExamListProps {
  grade: SubjectsOfGradeResponse;
  subject: SubjectResponse;
  exams: ExamResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onBack: () => void;
  onToggleStatus: (examId: string) => void;
  onToggleType: (examId: string) => void;
  onView: (exam: ExamResponse) => void;
  onEdit: (exam: ExamResponse) => void;
  onCreateExam: () => void;
  onPageChange: (page: number) => void;
}

const ExamList: React.FC<ExamListProps> = ({
  grade,
  subject,
  exams,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onBack,
  onToggleStatus,
  onToggleType,
  onView,
  onEdit,
  onCreateExam,
  onPageChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && exam.active) ||
                         (filterStatus === 'inactive' && !exam.active);
      return matchSearch && matchStatus;
    });
  }, [exams, searchTerm, filterStatus]);

  const handlePreviousPage = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };

  const handleGoToPage = (page: number) => {
    if (page >= 0 && page < totalPages) onPageChange(page);
  };

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);
      
      if (currentPage <= 2) end = 3;
      if (currentPage >= totalPages - 3) start = totalPages - 4;
      
      if (start > 1) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('...');
      pages.push(totalPages - 1);
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Danh sách đề thi - {subject.name} ({grade.name})
          </h2>
          <p className="text-sm text-gray-600 mt-1">Tổng số: {totalElements} đề thi</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          ← Quay lại
        </button>
      </div>

      <ExamStats exams={exams} />
      <ExamFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setFilterStatus}
        onCreateExam={onCreateExam}
      />
      <ExamTable
        exams={filteredExams}
        onToggleStatus={onToggleStatus}
        onToggleType={onToggleType}
        onView={onView}
        onEdit={onEdit}
      />

      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {startItem} - {endItem} / {totalElements}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => handleGoToPage(page as number)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {(page as number) + 1}
                    </button>
                  )}
                </React.Fragment>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Đến trang:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                defaultValue={currentPage + 1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt((e.target as HTMLInputElement).value);
                    if (value >= 1 && value <= totalPages) handleGoToPage(value - 1);
                  }
                }}
                className="w-16 px-2 py-1 border rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;
