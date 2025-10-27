import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { decodeToken, getAccessToken } from '../../util/tokenUtils';
import Sidebar from './sections/Sidebar';
import Navbar from './sections/Navbar';
import { toast } from 'react-toastify';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const verifyAccess = async () => {
      setIsLoading(true);

      // Check if token exists
      const token = getAccessToken();
      if (!token) {
        sessionStorage.clear();
        navigate('/ot');
        setIsLoading(false);
        return;
      }

      try {
        // Refresh auth to verify token validity
        await refreshAuth();
        
        // Decode token to check user role/scope
        const decodedToken = decodeToken(token);
        const userScope = decodedToken?.scope;

        if (userScope === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          toast.error('Bạn không có quyền truy cập trang này');
          navigate('/');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        sessionStorage.clear();
        navigate('/ot');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [ navigate, refreshAuth]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Not authorized state
  if (!isAuthorized) {
    return null;
  }

  // Authorized - render dashboard
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;