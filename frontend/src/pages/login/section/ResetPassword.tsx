// ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { BookOpen, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../../services/service';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Liên kết đặt lại mật khẩu không hợp lệ');
        }
    }, [searchParams]);

    const validatePassword = () => {
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError('');

        if (!validatePassword()) {
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token,password);

                setSuccess(true);
                setTimeout(() => {
                    navigate('/ot');
                }, 3000);
        } catch (err : any) {
            setError(err?.message ?? String(err) ?? 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/ot');
    };

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
                <Card className="w-full max-w-md shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Đặt lại mật khẩu thành công!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Mật khẩu của bạn đã được cập nhật thành công.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...
                        </p>
                    </div>

                    <div className="mt-6">
                        <Button
                            onClick={handleBackToLogin}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                        >
                            Đến trang đăng nhập
                        </Button>
                    </div>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <Card className="w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                            <BookOpen className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Đặt lại mật khẩu
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Nhập mật khẩu mới của bạn
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
                    {/* New Password Field */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                            <Label htmlFor="password">Mật khẩu mới</Label>
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
                                disabled={isLoading || !token}
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
                        <p className="text-xs text-gray-500 mt-1">
                            Mật khẩu phải có ít nhất 6 ký tự
                        </p>
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
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                icon={Lock}
                                disabled={isLoading || !token}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && password && confirmPassword) {
                                        handleSubmit();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !password || !confirmPassword || !token}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        size="lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang đặt lại...</span>
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Đặt lại mật khẩu
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        )}
                    </Button>

                    {/* Back to Login */}
                    <div className="text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
                            disabled={isLoading}
                        >
                            Hủy và quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </Card>
        </main>
    );
}