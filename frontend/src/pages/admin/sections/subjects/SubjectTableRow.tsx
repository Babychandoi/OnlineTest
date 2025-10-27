import React from 'react';
import { BookOpen, Edit2, Trash2, Lock } from 'lucide-react';
import { Subject } from '../../../../types/subjectforgrade.admin';

interface SubjectTableRowProps {
  subject: Subject;
  gradeCount: number;
  isProtected?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const SubjectTableRow: React.FC<SubjectTableRowProps> = ({ 
  subject, 
  gradeCount,
  isProtected = false,
  onEdit, 
  onDelete 
}) => {
  return (
    <tr className={`transition-colors ${isProtected ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isProtected ? 'bg-yellow-100' : 'bg-purple-100'}`}>
            {isProtected ? (
              <Lock className="text-yellow-600" size={18} />
            ) : (
              <BookOpen className="text-purple-600" size={18} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{subject.name}</span>
            {isProtected && (
              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                <Lock size={10} />
                Mặc định
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          {gradeCount} khối
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 justify-end">
          <button
            onClick={onEdit}
            disabled={isProtected}
            className={`p-2 rounded-lg transition-colors ${
              isProtected
                ? 'text-gray-400 cursor-not-allowed opacity-50'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
            title={isProtected ? 'Không thể chỉnh sửa môn học mặc định' : 'Chỉnh sửa'}
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            disabled={isProtected}
            className={`p-2 rounded-lg transition-colors ${
              isProtected
                ? 'text-gray-400 cursor-not-allowed opacity-50'
                : 'text-red-600 hover:bg-red-50'
            }`}
            title={isProtected ? 'Không thể xóa môn học mặc định' : 'Xóa'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SubjectTableRow;