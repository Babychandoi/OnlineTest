import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { Subject } from '../../../../types/subjectforgrade.admin';

interface SubjectCardProps {
  subject: Subject;
  onRemove?: () => void;
  showRemove?: boolean;
  onClick?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onRemove, 
  showRemove = false, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`group bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4 hover:shadow-lg transition-all ${
        onClick ? 'cursor-pointer hover:border-indigo-500' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-purple-200 p-2 rounded-lg">
            <BookOpen className="text-purple-700" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{subject.name}</h4>
          </div>
        </div>
        {showRemove && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;