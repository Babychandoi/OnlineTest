import { Clock, Eye, Edit2, FileText } from 'lucide-react';
import { ExamResponse, ExamType } from '../../../../types/exam.admin';

interface ExamTableProps {
  exams: ExamResponse[];
  onToggleStatus: (examId: string) => void;
  onToggleType: (examId: string) => void;
  onView: (exam: ExamResponse) => void;
  onEdit: (exam: ExamResponse) => void;
}

const ExamTable: React.FC<ExamTableProps> = ({
  exams,
  onToggleStatus,
  onToggleType,
  onView,
  onEdit,
}) => {
  const getTypeLabel = (type: ExamType) => {
    return type === ExamType.FREE ? 'Miễn phí' : 'Có phí';
  };

  const getTypeColor = (type: ExamType) => {
    return type === ExamType.FREE 
      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
  };

  if (exams.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="text-center py-12 text-gray-400">
          <FileText size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Chưa có đề thi nào</p>
          <p className="text-sm mt-2">Nhấn "Tạo đề thi mới" để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đề thi</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Loại</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Thông tin</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Giáo viên</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <h4 className="font-semibold text-gray-800">{exam.title}</h4>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleType(exam.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${getTypeColor(exam.type)}`}
                    title="Click để chuyển đổi loại đề thi"
                  >
                    {getTypeLabel(exam.type)}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock size={14} />
                      <span>{exam.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{exam.totalQuestions} câu</span>
                      <span>•</span>
                      <span>{exam.totalScore} điểm</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">{exam.teacherName}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onToggleStatus(exam.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      exam.active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {exam.active ? 'Hoạt động' : 'Tạm dừng'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => onView(exam)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEdit(exam)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Chỉnh sửa">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamTable;