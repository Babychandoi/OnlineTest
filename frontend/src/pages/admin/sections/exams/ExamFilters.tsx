import React from 'react';
import { Search, Plus } from 'lucide-react';

interface ExamFiltersProps {
  searchTerm: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreateExam: () => void;
}

const ExamFilters: React.FC<ExamFiltersProps> = ({
  searchTerm,
  filterStatus,
  onSearchChange,
  onStatusChange,
  onCreateExam
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đề thi, giáo viên..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm dừng</option>
        </select>
      </div>
      
      <div className="flex justify-end mt-4">
        <button 
          onClick={onCreateExam}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Tạo đề thi mới
        </button>
      </div>
    </div>
  );
};

export default ExamFilters;