import { AlertCircle, Edit2, Eye, Trash2 } from "lucide-react";
import { UserResponse } from "../../../../services/employees";

const EmployeesTable: React.FC<{
  employees: UserResponse[];
  loading: boolean;
  onViewDetail: (employee: UserResponse) => void;
  onEdit: (employee: UserResponse) => void;
  onDelete: (employee: UserResponse) => void;
  getRoleBadgeColor: (role: string) => string;
}> = ({ employees, loading, onViewDetail, onEdit, onDelete, getRoleBadgeColor }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    ) : employees.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Điện thoại</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vai trò</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{employee.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(employee.role)}`}>
                    {employee.role === 'ADMIN' ? 'Admin' : 'Nhân viên'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onViewDetail(employee)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </button>
                    <button
                      onClick={() => onEdit(employee)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Không có nhân viên nào được tìm thấy</p>
      </div>
    )}
  </div>
);
export default EmployeesTable