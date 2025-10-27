import React from 'react';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { ExamResponse } from '../../../../types/exam.admin';

interface ExamStatsProps {
  exams: ExamResponse[];
}

const ExamStats: React.FC<ExamStatsProps> = ({ exams }) => {
  const totalExams = exams.length;
  const activeExams = exams.filter(e => e.active).length;
  const inactiveExams = exams.filter(e => !e.active).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng đề thi</p>
            <p className="text-2xl font-bold text-gray-800">{totalExams}</p>
          </div>
          <FileText className="text-blue-600" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600">{activeExams}</p>
          </div>
          <CheckCircle className="text-green-600" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tạm dừng</p>
            <p className="text-2xl font-bold text-red-600">{inactiveExams}</p>
          </div>
          <XCircle className="text-red-600" size={32} />
        </div>
      </div>
    </div>
  );
};

export default ExamStats;