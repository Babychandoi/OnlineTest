import React, { useState } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { BookOpen, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../../services/service';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
            setTimeout(() => {
                    navigate('/ot');
                }, 3000);
        } catch (err: any) {
            setError(err?.message ?? String(err) ?? 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/ot/signin');
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
                            Kiểm tra email của bạn
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại mật khẩu.
                            Liên kết sẽ hết hạn sau 15 phút.
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Button
                            onClick={handleBackToLogin}
                            className="w-full"
                            color="gray"
                            outline
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại đăng nhập
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            Không nhận được email?{' '}
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-blue-600 hover:text-purple-600 font-medium"
                            >
                                Gửi lại
                            </button>
                        </p>
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
                        Quên mật khẩu?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu
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
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && email) {
                                    handleSubmit();
                                }
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !email}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        size="lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang gửi...</span>
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Gửi liên kết đặt lại mật khẩu
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </Button>

                    {/* Back to Login */}
                    <div className="text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium flex items-center justify-center gap-1 mx-auto"
                            disabled={isLoading}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </Card>
        </main>
    );
}