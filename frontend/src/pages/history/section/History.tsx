import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, TextInput } from 'flowbite-react';
import {
    Trophy,
    Calendar,
    Target,
    CheckCircle,
    XCircle,
    Search,
    TrendingUp,
    Award,
    FileText,
    BookOpen,
    GraduationCap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { historyExam } from '../../../services/service';
import { ResultResponse } from '../../../types/exam';

interface GroupedResults {
    [grade: string]: {
        [subject: string]: ResultResponse[];
    };
}

const ExamHistory: React.FC = () => {
    const [results, setResults] = useState<ResultResponse[]>([]);
    const [groupedResults, setGroupedResults] = useState<GroupedResults>({});
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Fetch exam history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await historyExam();
                setResults(response.data);

                // Group results by grade and subject
                const grouped: GroupedResults = {};
                response.data.forEach((result: ResultResponse) => {
                    if (!grouped[result.grade]) {
                        grouped[result.grade] = {};
                    }
                    if (!grouped[result.grade][result.subject]) {
                        grouped[result.grade][result.subject] = [];
                    }
                    grouped[result.grade][result.subject].push(result);
                });

                setGroupedResults(grouped);

                // Set default grade to first available
                const firstGrade = Object.keys(grouped)[0];
                if (firstGrade) {
                    setSelectedGrade(firstGrade);
                }
            } catch (error) {
                toast.error('Không thể tải lịch sử bài thi');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGrade, selectedSubject, searchTerm]);

    // Get filtered results based on selection
    const getFilteredResults = () => {
        let filtered = results;

        // Filter by grade
        if (selectedGrade !== 'all') {
            filtered = filtered.filter(r => r.grade === selectedGrade);
        }

        // Filter by subject
        if (selectedSubject !== 'all') {
            filtered = filtered.filter(r => r.subject === selectedSubject);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
    };

    const filteredResults = getFilteredResults();

    // Pagination calculations
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Get page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Get unique grades and subjects
    const grades = ['all', ...Object.keys(groupedResults)];
    const subjects = selectedGrade === 'all'
        ? ['all', ...Array.from(new Set(results.map(r => r.subject)))]
        : ['all', ...Object.keys(groupedResults[selectedGrade] || {})];

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status info
    const getStatusInfo = (score: number, totalScore: number) => {
        const percentage = (score / totalScore) * 100;

        if (percentage >= 90) {
            return { label: 'Xuất sắc', color: 'bg-green-100 text-green-700 border-green-300', icon: Trophy };
        } else if (percentage >= 80) {
            return { label: 'Giỏi', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Award };
        } else if (percentage >= 70) {
            return { label: 'Khá', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: TrendingUp };
        } else if (percentage >= 50) {
            return { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: CheckCircle };
        } else {
            return { label: 'Yếu', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle };
        }
    };

    // Calculate statistics for current filter
    const statistics = {
        totalExams: filteredResults.length,
        averageScore: filteredResults.length > 0
            ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length)
            : 0,
        totalCorrect: filteredResults.reduce((sum, r) => sum + r.totalQuestionsCorrect, 0),
        totalQuestions: filteredResults.reduce((sum, r) => sum + r.totalQuestions, 0),
        passedExams: filteredResults.filter(r => {
            const percentage = (r.score / r.totalScore) * 100;
            return percentage >= 50;
        }).length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Lịch sử làm bài
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Xem lại kết quả các bài thi đã hoàn thành theo lớp và môn học
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 border-indigo-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng bài thi</p>
                                <p className="text-3xl font-bold text-indigo-600">{statistics.totalExams}</p>
                            </div>
                            <FileText className="w-12 h-12 text-indigo-600 opacity-50" />
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm trung bình</p>
                                <p className="text-3xl font-bold text-green-600">{statistics.averageScore}</p>
                            </div>
                            <Target className="w-12 h-12 text-green-600 opacity-50" />
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tỷ lệ đúng</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {statistics.totalQuestions > 0
                                        ? Math.round((statistics.totalCorrect / statistics.totalQuestions) * 100)
                                        : 0}%
                                </p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-purple-600 opacity-50" />
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bài đạt</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {statistics.passedExams}/{statistics.totalExams}
                                </p>
                            </div>
                            <Trophy className="w-12 h-12 text-yellow-600 opacity-50" />
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Grade Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <GraduationCap className="inline w-4 h-4 mr-1" />
                                Lớp học
                            </label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => {
                                    setSelectedGrade(e.target.value);
                                    setSelectedSubject('all');
                                }}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="all">Tất cả lớp</option>
                                {grades.filter(g => g !== 'all').map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <BookOpen className="inline w-4 h-4 mr-1" />
                                Môn học
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="all">Tất cả môn</option>
                                {subjects.filter(s => s !== 'all').map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Search className="inline w-4 h-4 mr-1" />
                                Tìm kiếm
                            </label>
                            <TextInput
                                icon={Search}
                                placeholder="Tìm theo tên bài thi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Items per page */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Số bài/trang
                            </label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Results List */}
                {filteredResults.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Không tìm thấy kết quả
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Results info */}
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredResults.length)} trong tổng số {filteredResults.length} kết quả
                        </div>

                        <div className="space-y-4">
                            {currentResults.map((result) => {
                                const status = getStatusInfo(result.score, result.totalScore);
                                const StatusIcon = status.icon;
                                const percentage = Math.round((result.totalQuestionsCorrect / result.totalQuestions) * 100);
                                const scorePercentage = Math.round((result.score / result.totalScore) * 100);

                                return (
                                    <Card key={result.id} className="hover:shadow-lg transition-shadow duration-200">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Left Section */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="mt-1">
                                                        <StatusIcon className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <Badge color="purple" className="text-xs">
                                                                <GraduationCap className="w-3 h-3 mr-1 inline" />
                                                                {result.grade}
                                                            </Badge>
                                                            <Badge color="indigo" className="text-xs">
                                                                <BookOpen className="w-3 h-3 mr-1 inline" />
                                                                {result.subject}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                            {result.examTitle}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatDate(result.submittedAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stats Row */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Điểm số</p>
                                                        <p className="text-xl font-bold text-indigo-600">
                                                            {result.score}/{result.totalScore}
                                                        </p>
                                                    </div>

                                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Câu đúng</p>
                                                        <p className="text-xl font-bold text-green-600">
                                                            {result.totalQuestionsCorrect}/{result.totalQuestions}
                                                        </p>
                                                    </div>

                                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tỷ lệ đúng</p>
                                                        <p className="text-xl font-bold text-purple-600">
                                                            {percentage}%
                                                        </p>
                                                    </div>

                                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Đánh giá</p>
                                                        <p className="text-xl font-bold text-yellow-600">
                                                            {scorePercentage}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section */}
                                            <div className="flex flex-col items-end gap-3">
                                                <Badge className={`${status.color} border px-4 py-2 text-sm font-semibold`}>
                                                    {status.label}
                                                </Badge>
                                                <Button
                                                    color="indigo"
                                                    size="sm"
                                                    onClick={() => {
                                                        console.log('View details:', result.id);
                                                    }}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    Hoàn thành
                                                </span>
                                                <span className="text-xs font-semibold text-indigo-600">
                                                    {percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all duration-500 ${percentage >= 90
                                                        ? 'bg-green-600'
                                                        : percentage >= 70
                                                            ? 'bg-blue-600'
                                                            : percentage >= 50
                                                                ? 'bg-yellow-600'
                                                                : 'bg-red-600'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Card className="mt-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    {/* Previous Button */}
                                    <Button
                                        color="gray"
                                        size="sm"
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className="w-full sm:w-auto"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Trang trước
                                    </Button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                        {getPageNumbers().map((page, index) => (
                                            <React.Fragment key={index}>
                                                {page === '...' ? (
                                                    <span className="px-3 py-1 text-gray-500">...</span>
                                                ) : (
                                                    <button
                                                        onClick={() => goToPage(page as number)}
                                                        className={`px-3 py-1 rounded-lg transition-colors ${currentPage === page
                                                            ? 'bg-indigo-600 text-white font-semibold'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <Button
                                        color="gray"
                                        size="sm"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="w-full sm:w-auto"
                                    >
                                        Trang sau
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExamHistory;