import React from 'react';
import { BookOpen } from 'lucide-react';
import { SubjectResponse, SubjectsOfGradeResponse } from '../../../../types/exam.admin';

interface SubjectSelectionProps {
  grade: SubjectsOfGradeResponse;
  onSelectSubject: (subject: SubjectResponse) => void;
  onBack: () => void;
}

const SubjectSelection: React.FC<SubjectSelectionProps> = ({ 
  grade, 
  onSelectSubject, 
  onBack 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Chọn môn học - {grade.name}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Quay lại
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grade.subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Số đề thi</span>
              <span className="text-2xl font-bold text-indigo-600">
                {subject.totalExams || 0}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection;