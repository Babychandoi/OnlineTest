import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import SubjectTableRow from './SubjectTableRow';
import { SubjectResponse, SubjectsOfGradeResponse } from '../../../../types/subjectforgrade.admin';

interface SubjectsManagementProps {
  subjects: SubjectResponse[];
  gradesWithSubjects: SubjectsOfGradeResponse[];
  onAddSubject: () => void;
  onEditSubject: (subject: SubjectResponse) => void;
  onDeleteSubject: (subjectId: string) => void;
}

const SubjectsManagement: React.FC<SubjectsManagementProps> = ({ 
  subjects, 
  gradesWithSubjects, 
  onAddSubject, 
  onEditSubject, 
  onDeleteSubject 
}) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const getGradeCountForSubject = (subjectId: string): number => {
    return gradesWithSubjects.filter(grade => 
      grade.subjects.some(s => s.id === subjectId)
    ).length;
  };

  // Define protected subject logic here (example: protect subjects with id 'default' or any rule you want)
  const isProtectedSubject = (subjectId: string): boolean => {
    // Example: protect subject with id 'default', adjust logic as needed
    return subjectId === '1';
  };

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(subjects.length / itemsPerPage);
  
  const currentSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return subjects.slice(startIndex, endIndex);
  }, [subjects, currentPage]);

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
        <h2 className="text-2xl font-bold text-gray-800">Danh sách Môn học</h2>
        <button
          onClick={onAddSubject}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Thêm môn học
        </button>
      </div>

      {subjects.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên môn học</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Số khối lớp</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentSubjects.map(subject => (
                  <SubjectTableRow
                    key={subject.id}
                    subject={subject}
                    gradeCount={getGradeCountForSubject(subject.id)}
                    isProtected={isProtectedSubject(subject.id)}
                    onEdit={() => onEditSubject(subject)}
                    onDelete={() => onDeleteSubject(subject.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, subjects.length)} trong tổng số {subjects.length} môn học
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
          <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có môn học nào</h3>
          <p className="text-gray-500 mb-6">Hãy thêm môn học đầu tiên để bắt đầu</p>
          <button
            onClick={onAddSubject}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Thêm môn học
          </button>
        </div>
      )}
    </div>
  );
};

export default SubjectsManagement;