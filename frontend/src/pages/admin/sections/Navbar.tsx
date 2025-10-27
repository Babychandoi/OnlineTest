import React, { useEffect, useState } from 'react';
import {  
  User2, 
  LogOut,
  Mail,
  Phone,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { UserResponse } from '../../../types/user';
import { getProfile, logoutApi } from '../../../services/service';
import { LogoutRequest } from '../../../types/login';
import { useAuth } from "../../../components/AuthContext";
import { useNavigate } from 'react-router-dom';
const Navbar: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.code === 200 && response.data) {
          setProfile(response.data);
        } else {
          toast.error("Không thể tải thông tin người dùng");
        }
      } catch (error) {
        toast.error("Lỗi khi tải thông tin người dùng");
      }
    };
    fetchProfile();
  }, []);



  const handleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = async () => {
      try {
        const token = sessionStorage.getItem("access-token");
        if (token === null) {
          toast.error("Không tìm thấy token đăng nhập.");
          return;
        }
        const logoutRequest: LogoutRequest = {
          token: token
        };
        await logoutApi(logoutRequest);
        logout();
        toast.success("Đăng xuất thành công");
        navigate('/ot');
      } catch (error) {
        toast.error("Đăng xuất thất bại");
      }
    };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={handleProfile}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User2 size={20} className="text-gray-600" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User2 size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{profile?.fullName}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail size={16} />
                    <span className="text-sm">{profile?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone size={16} />
                    <span className="text-sm">{profile?.phone}</span>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span className="text-sm">LogOut</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;