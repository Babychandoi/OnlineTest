import { useEffect, useState } from "react";
import { UserResponse } from "../../../../services/user.admin";
import { X, User, Mail, Phone, Shield, Crown, Calendar } from "lucide-react";

interface EditUserModalProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateUserData) => Promise<void>;
  loading: boolean;
}

interface UpdateUserData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isPremium: boolean;
  startPremiumDate?: string;
  endPremiumDate?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState<UpdateUserData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    isPremium: false,
    startPremiumDate: '',
    endPremiumDate: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserData, string>>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPremium: user.isPremium,
        startPremiumDate: user.startPremiumDate ? new Date(user.startPremiumDate).toISOString().split('T')[0] : '',
        endPremiumDate: user.endPremiumDate ? new Date(user.endPremiumDate).toISOString().split('T')[0] : ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UpdateUserData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Tên không được trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được trống';
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    
    if (formData.isPremium && formData.endPremiumDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(formData.endPremiumDate);
      if (endDate <= today) {
        newErrors.endPremiumDate = 'Ngày kết thúc phải lớn hơn ngày hiện tại';
      }
    }
    
    setErrors(newErrors as any);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && user) {
      await onSubmit(user.id, formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name as keyof UpdateUserData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 flex-shrink-0">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Chỉnh sửa người dùng</h2>
                    <p className="text-green-100 text-sm">Cập nhật thông tin tài khoản</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  disabled={loading}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all disabled:opacity-50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-blue-600" />
                    Thông tin cơ bản
                  </h3>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Họ và tên <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên..."
                      disabled={loading}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                        errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <span>⚠️</span> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        disabled={loading}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <span>⚠️</span> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Số điện thoại <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0123456789"
                        disabled={loading}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <span>⚠️</span> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Vai trò <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all"
                    >
                      <option value="STUDENT">🎓 Học sinh</option>
                      <option value="TEACHER">👨‍🏫 Giáo viên</option>
                    </select>
                  </div>
                </div>

                {/* Premium Section */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2 pb-2 border-b">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    Gói Premium
                  </h3>

                  {/* Premium Toggle */}
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="isPremium"
                          checked={formData.isPremium}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">Kích hoạt Premium</span>
                      </div>
                    </label>
                  </div>

                  {/* Premium Dates - Only show when Premium is checked */}
                  {formData.isPremium && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Ngày bắt đầu
                          </label>
                          <input
                            type="date"
                            name="startPremiumDate"
                            value={formData.startPremiumDate}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white transition-all"
                          />
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Ngày kết thúc <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="date"
                            name="endPremiumDate"
                            value={formData.endPremiumDate}
                            onChange={handleInputChange}
                            min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${
                              errors.endPremiumDate ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                            }`}
                          />
                          {errors.endPremiumDate && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                              <span>⚠️</span> {errors.endPremiumDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-yellow-700 bg-yellow-100 rounded-lg p-3 flex items-start gap-2">
                        <span>💡</span>
                        <span>Ngày kết thúc phải lớn hơn ngày hiện tại</span>
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer with Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all font-semibold disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any);
                }}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;