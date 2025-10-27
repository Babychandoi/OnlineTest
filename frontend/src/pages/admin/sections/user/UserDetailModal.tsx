import { X, Crown, User, Mail, Phone, Shield, Calendar, CheckCircle2 } from "lucide-react";
import { UserResponse } from "../../../../services/user.admin";

interface UserDetailModalProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'STUDENT':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'TEACHER':
        return 'Giáo viên';
      case 'STUDENT':
        return 'Học sinh';
      default:
        return role;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative flex-shrink-0">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Chi tiết người dùng</h2>
                  <p className="text-blue-100 text-sm">Thông tin đầy đủ về tài khoản</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* Premium Badge */}
            {user.isPremium && (
              <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <Crown className="h-6 w-6 text-yellow-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-900 text-lg">Tài khoản Premium</h3>
                    <p className="text-yellow-700 text-sm">Người dùng này đang sử dụng gói Premium</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Full Name */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Họ và tên</label>
                    <p className="text-gray-900 font-semibold text-lg mt-1">{user.fullName}</p>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vai trò</label>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getRoleColor(user.role)}`}>
                        <CheckCircle2 className="h-4 w-4" />
                        {getRoleName(user.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                    <p className="text-gray-900 font-medium mt-1 break-all">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Điện thoại</label>
                    <p className="text-gray-900 font-medium mt-1">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Dates */}
            {user.isPremium && (user.startPremiumDate || user.endPremiumDate) && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border-2 border-yellow-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  Thông tin gói Premium
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.startPremiumDate && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        Ngày bắt đầu
                      </label>
                      <p className="text-gray-900 font-bold text-lg">
                        {new Date(user.startPremiumDate).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {user.endPremiumDate && (
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2">
                        Ngày kết thúc
                      </label>
                      <p className="text-gray-900 font-bold text-lg">
                        {new Date(user.endPremiumDate).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserDetailModal;