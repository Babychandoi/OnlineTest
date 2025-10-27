import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SubjectResponse, SubjectsOfGradeResponse } from '../../../../types/exam.admin';

interface ExamBreadcrumbProps {
  selectedGrade: SubjectsOfGradeResponse | null;
  selectedSubject: SubjectResponse | null;
  onNavigateToGrades: () => void;
  onNavigateToSubjects: () => void;
}

const ExamBreadcrumb: React.FC<ExamBreadcrumbProps> = ({
  selectedGrade,
  selectedSubject,
  onNavigateToGrades,
  onNavigateToSubjects
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onNavigateToGrades}
          className={`px-3 py-1 rounded-lg transition-colors ${
            !selectedGrade 
              ? 'bg-indigo-100 text-indigo-700 font-medium' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Chọn khối lớp
        </button>
        
        {selectedGrade && (
          <>
            <ArrowRight size={16} className="text-gray-400" />
            <button
              onClick={onNavigateToSubjects}
              className={`px-3 py-1 rounded-lg transition-colors ${
                !selectedSubject 
                  ? 'bg-indigo-100 text-indigo-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {selectedGrade.name} - Chọn môn học
            </button>
          </>
        )}
        
        {selectedSubject && (
          <>
            <ArrowRight size={16} className="text-gray-400" />
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-medium rounded-lg">
              {selectedSubject.name} - Danh sách đề thi
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamBreadcrumb;