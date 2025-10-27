import React, { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { BookOpen, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../../services/service';
import { Login } from '../../../types/login';
import { useAuth } from '../../../components/AuthContext';
import { decodeToken, getAccessToken } from '../../../util/tokenUtils';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Check if user is already authenticated
    useEffect(() => {
        const checkAuth = async () => {
            setIsCheckingAuth(true);
            
            // Check if token exists in sessionStorage
            const token = getAccessToken();
            if (token && isAuthenticated) {
                // Decode token to get user role
                const decodedToken = decodeToken(token);
                const userScope = decodedToken?.scope;
                
                // Redirect based on role
                if (userScope === 'ADMIN') {
                    navigate('/administration');
                } else {
                    navigate('/');
                }
            } else {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, navigate]);

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        const loginData: Login = {
            email: email,
            password: password
        }

        try {
            const response = await signIn(loginData);
            if (response.code === 200) {
                await login(response.data.token, response.data.refreshToken);
                
                // Decode token to get user role/scope
                const decodedToken = decodeToken(response.data.token);
                const userScope = decodedToken?.scope;
                
                // Navigate based on role
                if (userScope === 'ADMIN') {
                    navigate('/administration');
                } else if (userScope === 'TEACHER' || userScope === 'STUDENT') {
                    navigate('/');
                } else {
                    navigate('/');
                }
            } else {
                setError('Email hoặc mật khẩu không chính xác');
            }
        } catch (error) {
            setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccount = () => {
        navigate('/ot/signup');
    };

    const handleForgotPassword = () => {
        navigate('/ot/forgot-password');
    };

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <Card className="w-full max-w-md shadow-2xl">
                {/* Header with Animation */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                            <BookOpen className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Đăng nhập
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Đăng nhập vào hệ thống quản lý thư viện đề thi
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert color="failure" icon={AlertCircle} className="mt-4">
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <div className="space-y-4 mt-6">
                    {/* Email Field */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="admin@exam.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={Mail}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                            <Label htmlFor="password">Mật khẩu</Label>
                        </div>
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                icon={Lock}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="text-right mt-2">
                            <button
                                onClick={handleForgotPassword}
                                className="text-sm text-blue-600 hover:text-purple-600 transition-colors font-medium"
                                disabled={isLoading}
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !email || !password}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        size="lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang đăng nhập...</span>
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Đăng nhập
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        <span className="text-xs text-gray-500 font-medium">hoặc</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* Create Account Button */}
                    <Button
                        onClick={handleCreateAccount}
                        className="w-full"
                        color="gray"
                        outline
                        disabled={isLoading}
                    >
                        Tạo tài khoản mới
                    </Button>
                </div>
            </Card>
        </main>
    );
}