import React from 'react';
import { Plus, Edit2, Trash2, BookOpen, GraduationCap, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import SubjectCard from '../subjects/SubjectCard';
import { SubjectsOfGradeResponse } from '../../../../types/subjectforgrade.admin';

interface GradeCardProps {
  grade: SubjectsOfGradeResponse;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubject: () => void;
  onRemoveSubject: (subjectId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const GradeCard: React.FC<GradeCardProps> = ({ 
  grade, 
  onEdit, 
  onDelete, 
  onAddSubject, 
  onRemoveSubject, 
  isExpanded, 
  onToggle 
}) => {
  // Kiểm tra xem grade có phải là grade mặc định không (id === "1")
  const isProtected = grade.id === "1";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <GraduationCap className="text-white" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white">{grade.name}</h3>
                {isProtected && (
                  <span className="flex items-center gap-1 bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                    <Lock size={12} />
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-indigo-100 text-sm">• {grade.subjects.length} môn học</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddSubject}
              disabled={isProtected}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isProtected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
              title={isProtected ? 'Không thể chỉnh sửa khối lớp mặc định' : 'Thêm môn học'}
            >
              <Plus size={18} />
              Thêm môn học
            </button>
            <button
              onClick={onEdit}
              disabled={isProtected}
              className={`p-2 rounded-lg transition-colors ${
                isProtected
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
              title={isProtected ? 'Không thể chỉnh sửa khối lớp mặc định' : 'Chỉnh sửa'}
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={onDelete}
              disabled={isProtected}
              className={`p-2 rounded-lg transition-colors ${
                isProtected
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
              title={isProtected ? 'Không thể xóa khối lớp mặc định' : 'Xóa'}
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onToggle}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors ml-2"
              title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {isProtected && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <Lock size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Đây là khối lớp mặc định của hệ thống. Bạn không thể chỉnh sửa, xóa hoặc thêm môn học.
              </p>
            </div>
          )}
          
          {grade.subjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grade.subjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onRemove={isProtected ? undefined : () => onRemoveSubject(subject.id)}
                  showRemove={!isProtected}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
              <p>Chưa có môn học nào</p>
              {!isProtected && (
                <button
                  onClick={onAddSubject}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Thêm môn học đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradeCard;