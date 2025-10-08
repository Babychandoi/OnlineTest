import React, { useEffect, useState } from 'react';
import { Clock, Calendar, BookOpen, GraduationCap, Lock, Trophy } from 'lucide-react';
import { getAccessToken, getUserFromToken } from '../../../util/tokenUtils';
import { Competition } from '../../../types/competition';
import { getCompetition, addStudentForCompetition, getCompetitionsOfMe } from '../../../services/service';
import { useNavigate } from 'react-router-dom';
// Định nghĩa interface cho User
interface User {
    id: string;
    accountType: string;
    scope: string;
    isPremium: boolean;
    exp?: number;
    iat?: number;
}

const CompetitionList = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [user] = useState<User | null>(() => getUserFromToken());
    const navigate = useNavigate();
    // Theo dõi các cuộc thi đã đăng ký (lưu Set của ID)
    const [registeredCompetitions, setRegisteredCompetitions] = useState<Set<string>>(new Set());

    // State để force re-render mỗi giây (cho countdown)
    const [, setCurrentTime] = useState(Date.now());

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalType, setModalType] = useState<'error' | 'success' | 'warning'>('error');
    const [loading, setLoading] = useState<boolean>(true);

    // Update currentTime mỗi giây để countdown hoạt động
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Fetch danh sách cuộc thi
    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                setLoading(true);
                const token = getAccessToken();

                if (token) {
                    // Nếu đã đăng nhập, lấy danh sách cuộc thi của user (có isRegistered)
                    const response = await getCompetitionsOfMe();
                    setCompetitions(response.data);
                    console.log(response.data)
                    // Lọc ra các cuộc thi đã đăng ký
                    const registeredIds = response.data
                        .filter((comp: Competition & { isRegistered?: boolean }) => comp.isRegistered)
                        .map((comp: Competition) => comp.id);
                    setRegisteredCompetitions(new Set(registeredIds));
                } else {
                    // Nếu chưa đăng nhập, lấy tất cả cuộc thi
                    const response = await getCompetition();
                    setCompetitions(response.data);
                }
            } catch (error) {
                console.error('Error fetching competitions:', error);
                setModalType('error');
                setModalMessage('Không thể tải danh sách cuộc thi. Vui lòng thử lại!');
                setShowModal(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitions();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Tính thời gian còn lại đến khi thi
    const getTimeRemaining = (startTime: string) => {
        const now = Date.now();
        const startDate = new Date(startTime).getTime();
        const diff = startDate - now;

        if (diff <= 0) {
            return null; // Đã đến giờ thi
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    // Format hiển thị thời gian còn lại
    const formatTimeRemaining = (timeRemaining: { days: number; hours: number; minutes: number; seconds: number } | null) => {
        if (!timeRemaining) return null;

        const { days, hours, minutes, seconds } = timeRemaining;

        if (days > 0) {
            return `${days} ngày ${hours} giờ`;
        } else if (hours > 0) {
            return `${hours} giờ ${minutes} phút`;
        } else if (minutes > 0) {
            return `${minutes} phút ${seconds} giây`;
        } else {
            return `${seconds} giây`;
        }
    };

    // Kiểm tra có thể làm bài thi không (đã đến giờ)
    const canTakeExam = (startTime: string) => {
        return getTimeRemaining(startTime) === null;
    };

    // Xử lý khi click vào nút làm bài thi
    const handleTakeExam = (competition: Competition) => {
        navigate(`/competition?competitionId=${competition.id}`);
    };

    const handleRegister = async (competition: Competition) => {
        // Kiểm tra đã đăng ký chưa
        if (registeredCompetitions.has(competition.id)) {
            setModalType('warning');
            setModalMessage('Bạn đã đăng ký cuộc thi này rồi!');
            setShowModal(true);
            return;
        }

        // Kiểm tra đăng nhập
        const token = getAccessToken();
        if (!token) {
            setModalType('error');
            setModalMessage('Bạn cần đăng nhập để đăng ký cuộc thi!');
            setShowModal(true);
            return;
        }

        // Kiểm tra type của cuộc thi (Premium only)
        if (competition.type === true) {
            if (!user || !user.isPremium) {
                setModalType('warning');
                setModalMessage('Cuộc thi này chỉ dành cho thành viên Premium. Vui lòng nâng cấp tài khoản để tham gia!');
                setShowModal(true);
                return;
            }
        }

        try {
            const response = await addStudentForCompetition(competition.id);

            if (response.data === true) {
                setModalType('success');
                setModalMessage(`Đăng ký cuộc thi "${competition.title}" thành công!`);
                setShowModal(true);

                // Thêm vào danh sách đã đăng ký
                setRegisteredCompetitions(prev => new Set([...Array.from(prev), competition.id]));
            } else {
                setModalType('error');
                setModalMessage('Đăng ký không thành công. Vui lòng thử lại!');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error registering competition:', error);
            setModalType('error');
            setModalMessage('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
            setShowModal(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách cuộc thi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Danh Sách Cuộc Thi</h1>
                    <p className="text-gray-600">Chọn cuộc thi phù hợp và đăng ký ngay!</p>
                </div>

                {/* Empty State */}
                {competitions.length === 0 && (
                    <div className="text-center py-12">
                        <Trophy className="mx-auto text-gray-400 mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Chưa có cuộc thi nào
                        </h3>
                        <p className="text-gray-500">
                            Hiện tại chưa có cuộc thi nào được tổ chức. Vui lòng quay lại sau!
                        </p>
                    </div>
                )}

                {/* Competition Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {competitions.map((competition) => (
                        <div
                            key={competition.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                        >
                            {/* Badge Premium */}
                            {competition.type && (
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold flex items-center gap-2">
                                    <Lock size={16} />
                                    PREMIUM
                                </div>
                            )}

                            <div className="p-6">
                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-start gap-2">
                                    <Trophy className="text-yellow-500 flex-shrink-0 mt-1" size={24} />
                                    {competition.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {competition.description}
                                </p>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Clock className="text-blue-500" size={18} />
                                        <span>{competition.duration} phút</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Calendar className="text-green-500" size={18} />
                                        <span>{formatDate(competition.startTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <BookOpen className="text-orange-500" size={18} />
                                        <span>{competition.subjectName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <GraduationCap className="text-purple-500" size={18} />
                                        <span>{competition.gradeName}</span>
                                    </div>
                                </div>

                                {/* Register/Exam Button */}
                                {registeredCompetitions.has(competition.id) ? (
                                    // Đã đăng ký - Hiển thị countdown hoặc nút làm bài
                                    canTakeExam(competition.startTime) ? (
                                        // Đã đến giờ thi - Hiển thị nút làm bài
                                        <button
                                            onClick={() => handleTakeExam(competition)}
                                            className="w-full py-3 rounded-lg font-semibold transition-all duration-300 bg-green-500 hover:bg-green-600 text-white animate-pulse"
                                        >
                                            🎯 Làm bài thi
                                        </button>
                                    ) : (
                                        // Chưa đến giờ - Hiển thị countdown
                                        <div className="w-full py-3 rounded-lg font-semibold bg-gray-400 text-white text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Clock size={20} className="animate-pulse" />
                                                <span>Còn {formatTimeRemaining(getTimeRemaining(competition.startTime))}</span>
                                            </div>
                                        </div>

                                    )
                                ) : (
                                    // Chưa đăng ký - Hiển thị nút đăng ký
                                    <button
                                        onClick={() => handleRegister(competition)}
                                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${competition.type
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}
                                    >
                                        Đăng ký tham gia
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                            <div className="text-center">
                                {modalType === 'error' && (
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-red-500 text-3xl">✕</span>
                                    </div>
                                )}
                                {modalType === 'success' && (
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-green-500 text-3xl">✓</span>
                                    </div>
                                )}
                                {modalType === 'warning' && (
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-yellow-500 text-3xl">⚠</span>
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {modalType === 'error' && 'Lỗi'}
                                    {modalType === 'success' && 'Thành công'}
                                    {modalType === 'warning' && 'Thông báo'}
                                </h3>
                                <p className="text-gray-600 mb-6">{modalMessage}</p>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default CompetitionList;