import { AlertCircle, Edit2, Eye, Trash2, Crown } from "lucide-react";
import { UserResponse } from "../../../../services/user.admin";

const UsersTable: React.FC<{
  users: UserResponse[];
  loading: boolean;
  onViewDetail: (user: UserResponse) => void;
  onEdit: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
  getRoleBadgeColor: (role: string) => string;
}> = ({ users, loading, onViewDetail, onEdit, onDelete, getRoleBadgeColor }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {loading ? (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    ) : users.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Điện thoại</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vai trò</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                    { user.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {user.isPremium ? (
                    <span title="Premium">
                      <Crown className="h-5 w-5 text-yellow-500 mx-auto" />
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Free</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => onViewDetail(user)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors text-sm font-medium"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(user)}
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
        <p className="text-gray-600 text-lg">Không có người dùng nào được tìm thấy</p>
      </div>
    )}
  </div>
);
export default UsersTable;