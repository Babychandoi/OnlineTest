import { X } from "lucide-react";
import { UserResponse } from "../../../../services/employees";

interface EmployeeDetailModalProps {
  employee: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
}
const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết nhân viên</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="text-sm text-gray-600 break-all">{employee.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <p className="text-sm text-gray-900 font-medium">{employee.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-600">{employee.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Điện thoại</label>
              <p className="text-sm text-gray-600">{employee.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <p className="text-sm text-gray-900 font-medium">{employee.role}</p>
            </div>
          </div>
          <div className="flex gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmployeeDetailModal