import React, { useState } from 'react';
import { Card, Label, TextInput, Button } from 'flowbite-react';
import { BookOpen, Eye, EyeOff, User, Mail, Lock, Phone, Check, X, GraduationCap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signUp } from '../../../services/service';
const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu không khớp!');
      return;
    }
    try {
      const userRegister = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      }
      console.log(userRegister)
      const response = await signUp(userRegister);
      if (response.code === 200 && response.data === true) {
        toast.success("Đăng ký thành công")
        navigate("/ot")
      }
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: 'Yếu', color: 'bg-red-500' },
      { strength: 2, label: 'Trung bình', color: 'bg-yellow-500' },
      { strength: 3, label: 'Khá', color: 'bg-blue-500' },
      { strength: 4, label: 'Mạnh', color: 'bg-green-500' }
    ];

    return levels[strength - 1] || { strength: 0, label: '', color: '' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <Card className="w-full max-w-4xl shadow-2xl">
        {/* Header with Animation */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Đăng ký tài khoản
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tạo tài khoản để truy cập hệ thống quản lý thư viện đề thi
          </p>
        </div>

        {/* Form */}
        <div className="mt-6">
          {/* Role Selection */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Label>Vai trò</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${formData.role === 'STUDENT'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <GraduationCap className={`h-8 w-8 ${formData.role === 'STUDENT' ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                  <span className={`font-semibold ${formData.role === 'STUDENT' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    Học sinh
                  </span>
                </div>
                {formData.role === 'STUDENT' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'TEACHER' })}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${formData.role === 'TEACHER'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Users className={`h-8 w-8 ${formData.role === 'TEACHER' ? 'text-purple-600' : 'text-gray-500'
                    }`} />
                  <span className={`font-semibold ${formData.role === 'TEACHER' ? 'text-purple-600' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    Giáo viên
                  </span>
                </div>
                {formData.role === 'TEACHER' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-purple-600" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="name">Họ và tên</Label>
                </div>
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  icon={User}
                />
              </div>

              {/* Email Field */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  icon={Mail}
                />
              </div>

              {/* Phone Field */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="phone">Số điện thoại</Label>
                </div>
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  icon={Phone}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Password Field with Strength Indicator */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="password">Mật khẩu</Label>
                </div>
                <div className="relative">
                  <TextInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    icon={Lock}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all ${level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${passwordStrength.strength === 4 ? 'text-green-600' :
                        passwordStrength.strength === 3 ? 'text-blue-600' :
                          passwordStrength.strength === 2 ? 'text-yellow-600' :
                            'text-red-600'
                      }`}>
                      Độ mạnh: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                </div>
                <div className="relative">
                  <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    icon={Lock}
                    color={formData.confirmPassword && (passwordsMatch ? 'success' : 'failure')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <p className="text-xs text-green-600 font-medium">Mật khẩu khớp</p>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-600" />
                        <p className="text-xs text-red-600 font-medium">Mật khẩu không khớp</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Register Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            size="lg"
            style={{ marginTop: '1.5rem' }}
          >
            <span className="flex items-center gap-2">
              Đăng ký
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-xs text-gray-500 font-medium">hoặc</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                onClick={() => navigate('/ot')}
                className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default RegisterForm;