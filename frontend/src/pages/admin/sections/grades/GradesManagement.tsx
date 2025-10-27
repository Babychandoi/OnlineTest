import React, { useState, useMemo, useEffect } from 'react';
import { Plus, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import GradeCard from './GradeCard';
import { SubjectsOfGradeResponse } from '../../../../types/subjectforgrade.admin';

interface GradesManagementProps {
  gradesWithSubjects: SubjectsOfGradeResponse[];
  onAddGrade: () => void;
  onEditGrade: (grade: SubjectsOfGradeResponse) => void;
  onDeleteGrade: (gradeId: string) => void;
  onAddSubjectToGrade: (gradeId: string) => void;
  onRemoveSubjectFromGrade: (gradeId: string, subjectId: string) => void;
  expandedGrades: Record<string, boolean>;
  onToggleGrade: (gradeId: string) => void;
}

const GradesManagement: React.FC<GradesManagementProps> = ({ 
  gradesWithSubjects, 
  onAddGrade, 
  onEditGrade, 
  onDeleteGrade,
  onAddSubjectToGrade,
  onRemoveSubjectFromGrade,
  expandedGrades,
  onToggleGrade
}) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(gradesWithSubjects.length / itemsPerPage);
  
  const currentGrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return gradesWithSubjects.slice(startIndex, endIndex);
  }, [gradesWithSubjects, currentPage]);

  // Reset về trang hợp lệ khi dữ liệu thay đổi
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 py-2 text-gray-500">...</span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            currentPage === i
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 py-2 text-gray-500">...</span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách Khối lớp</h2>
        <button
          onClick={onAddGrade}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Thêm khối lớp
        </button>
      </div>

      {gradesWithSubjects.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentGrades.map(grade => (
              <GradeCard
                key={grade.id}
                grade={grade}
                onEdit={() => onEditGrade(grade)}
                onDelete={() => onDeleteGrade(grade.id)}
                onAddSubject={() => onAddSubjectToGrade(grade.id)}
                onRemoveSubject={(subjectId) => onRemoveSubjectFromGrade(grade.id, subjectId)}
                isExpanded={expandedGrades[grade.id] || false}
                onToggle={() => onToggleGrade(grade.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, gradesWithSubjects.length)} trong tổng số {gradesWithSubjects.length} khối lớp
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <GraduationCap size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có khối lớp nào</h3>
          <p className="text-gray-500 mb-6">Hãy thêm khối lớp đầu tiên để bắt đầu</p>
          <button
            onClick={onAddGrade}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Thêm khối lớp
          </button>
        </div>
      )}
    </div>
  );
};

export default GradesManagement;