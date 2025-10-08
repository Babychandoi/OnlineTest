import React, { useState } from "react";
import { BookOpen, User, Menu, X, LogOut, Award, UserCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { logoutApi } from "../services/service";
import { LogoutRequest } from "../types/login";
const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
      setIsUserMenuOpen(false);
      toast.success("Đăng xuất thành công");
      navigate('/ot');
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };

  const handleAchievementsClick = () => {
    setIsUserMenuOpen(false);
    navigate('/history');
  };
  return (
    <>
      <style>{`
        @keyframes moveBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }

        .gradient-border::before {
          content: "";
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border-radius: 1.5rem;
          background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
          background-size: 400% 100%;
          animation: moveBorder 4s linear infinite;
          z-index: 0;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          padding: 1px;
        }
      `}</style>

      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OT</h1>
                <p className="text-xs text-gray-500">ONLINE TEST</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="/"
                className="relative block py-2.5 font-normal transition-all duration-300 group text-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
              >
                Trang chủ
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a
                href="/subjects"
                className="relative block py-2.5 font-normal transition-all duration-300 group text-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
              >
                Danh mục đề luyện thi
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a
                href="/quiz-test"
                className="relative block py-2.5 font-normal transition-all duration-300 group text-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
              >
                Cuộc thi
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

              {isAuthenticated && (
                <a
                  href="/achievements"
                  className="relative block py-2.5 font-normal transition-all duration-300 group text-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent"
                >
                  Bảng Thành tích
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              )}
            </nav>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer" 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                      <User className="h-7 w-7 text-blue-600" />
                  </div>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={handleProfileClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <UserCircle className="h-5 w-5" />
                            <span>Thông tin cá nhân</span>
                          </button>
                          <button
                            onClick={handleAchievementsClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Award className="h-5 w-5" />
                            <span>Lịch sử luyện tập</span>
                          </button>
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <a
                  href="/ot"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <User className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              <a
                href="/"
                className="block py-2 text-gray-800 hover:text-blue-600 transition-colors"
              >
                Trang chủ
              </a>
              <a
                href="/subjects"
                className="block py-2 text-gray-800 hover:text-blue-600 transition-colors"
              >
                Danh mục đề luyện thi
              </a>
              <a
                href="/quiz-test"
                className="block py-2 text-gray-800 hover:text-blue-600 transition-colors"
              >
                Cuộc thi
              </a>
              {isAuthenticated && (
                <a
                  href="/achievements"
                  className="block py-2 text-gray-800 hover:text-blue-600 transition-colors"
                >
                  Bảng Thành tích
                </a>
              )}

              {/* Mobile User Section */}
              {isAuthenticated ? (
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Thông tin cá nhân</span>
                  </button>
                  <button
                    onClick={handleAchievementsClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Award className="h-5 w-5" />
                    <span>Lịch sử luyện tập</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/ot"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-fit mt-4"
                >
                  <User className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </a>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;