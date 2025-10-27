import { useEffect, useState } from "react";
import { UserResponse } from "../../../../services/employees";
import { X } from "lucide-react";

// Modal chỉnh sửa nhân viên
interface EditEmployeeModalProps {
  employee: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: CreateEmployeeData) => Promise<void>;
  loading: boolean;
}
interface CreateEmployeeData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState<CreateEmployeeData>({
    fullName: '',
    email: '',
    phone: '',
    role: 'EMPLOYEES'
  });
  const [errors, setErrors] = useState<Partial<CreateEmployeeData>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Partial<CreateEmployeeData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Tên không được trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được trống';
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && employee) {
      await onSubmit(employee.id, formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateEmployeeData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa nhân viên</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập tên..."
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-600">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email..."
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span className="text-red-600">*</span></label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại..."
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Vai trò */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò <span className="text-red-600">*</span></label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="EMPLOYEES">Nhân viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
          </form>

          <div className="flex gap-3 p-6 border-t">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                'Cập nhật'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditEmployeeModal