import React from 'react';
export interface Subject {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer">
        {/* Header with icon and title */}
        <div className="flex items-center mb-3">
          <div className={`inline-flex p-3 rounded-xl ${subject.color} text-white mr-3`}>
            <span className="text-2xl">{subject.emoji}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {subject.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {subject.description}
        </p>
      </div>
  );
};
export default SubjectCard;