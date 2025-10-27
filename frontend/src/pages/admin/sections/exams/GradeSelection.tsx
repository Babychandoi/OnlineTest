import React from 'react';
import { GraduationCap } from 'lucide-react';
import { SubjectsOfGradeResponse } from '../../../../types/exam.admin';

interface GradeSelectionProps {
  grades: SubjectsOfGradeResponse[];
  onSelectGrade: (grade: SubjectsOfGradeResponse) => void;
}

const GradeSelection: React.FC<GradeSelectionProps> = ({ grades, onSelectGrade }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Chọn khối lớp</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grades.map((grade) => (
          <button
            key={grade.id}
            onClick={() => onSelectGrade(grade)}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <GraduationCap className="text-indigo-600" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{grade.name}</h3>
                <p className="text-sm text-gray-600">{grade.subjects.length} môn học</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Tổng số đề thi:{' '}
                <span className="font-semibold text-indigo-600">
                  {grade.subjects.reduce((sum, s) => sum + (s.totalExams || 0), 0)}
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradeSelection;