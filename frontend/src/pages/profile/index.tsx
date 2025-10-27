import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, Crown, Edit2, Save, X, Loader2 } from 'lucide-react';
import { UserResponse } from '../../types/user';
import { getProfile,updateProfile } from '../../services/service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [editData, setEditData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfile();
        
        if (response.code === 200 && response.data) {
          setUserData(response.data);
          setEditData(response.data);
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } catch (error: unknown) {
        console.error('Failed to fetch profile:', error);
        setError('Đã xảy ra lỗi khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700';
      case 'TEACHER': return 'bg-blue-100 text-blue-700';
      case 'STUDENT': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản Trị Viên';
      case 'TEACHER': return 'Giáo Viên';
      case 'STUDENT': return 'Học Sinh';
      default: return role;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleSave = async () => {
    if (!editData) return;
    
    try {
      console.log(editData);
      const response = await updateProfile(editData);
      if(response.code === 200 && response.data === true){
        setUserData(editData);
        setIsEditing(false);
        toast.success("Cập nhật dự liệu thành công")
      } else {
        toast.error("Cập nhật dự liệu không thành công")
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Không thể cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };
  const handlePayment = () => {
    navigate('/payment');
  };
  const handleChange = (field: keyof UserResponse, value: string) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !userData || !editData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error || 'Không thể tải thông tin người dùng'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                  <User className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">{userData.fullName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(userData.role)}`}>
                      {getRoleLabel(userData.role)}
                    </span>
                    {userData.isPremium && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh Sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Thông Tin Chi Tiết
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600">Họ và Tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full text-lg font-semibold text-gray-800 mt-1 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800 mt-1">{userData.fullName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{userData.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600">Số Điện Thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full text-lg font-semibold text-gray-800 mt-1 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-800 mt-1">{userData.phone}</p>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600">Vai Trò</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">{getRoleLabel(userData.role)}</p>
              </div>
            </div>

            {/* Premium Status */}
            <div className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
              userData.isPremium 
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' 
                : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                userData.isPremium ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                <Crown className={`w-6 h-6 ${userData.isPremium ? 'text-yellow-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600">Trạng Thái Premium</label>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {userData.isPremium ? 'Tài khoản Premium' : 'Tài khoản Thường'}
                </p>
                {userData.isPremium ? (
                  <p className="text-sm text-gray-600 mt-1">Bạn đang sử dụng đầy đủ tính năng premium</p>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-3">Nâng cấp lên Premium để trải nghiệm đầy đủ tính năng</p>
                    <button
                      onClick={() => handlePayment()}
                      className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Crown className="w-4 h-4" />
                      Đăng Ký Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;