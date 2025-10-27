import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Layers,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Mail,
  Phone,
  User,
  Medal,
  Target,
  Search as SearchIcon
} from 'lucide-react';
import { getCompetitionDetail } from '../../../../services/competition.admin';
import { CompetitionDetailResponse } from '../../../../types/competition.admin';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../../../util/util';

interface CompetitionDetailViewProps {
  competitionId: string;
  onBack?: () => void;
}

const CompetitionDetailView: React.FC<CompetitionDetailViewProps> = ({
  competitionId,
  onBack
}) => {
  const [competition, setCompetition] = useState<CompetitionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'not-submitted'>('all');

  const fetchCompetitionDetail = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCompetitionDetail(competitionId);
      setCompetition(response.data);
    } catch (error) {
      console.error('Error fetching competition detail:', error);
      toast.error('❌ Không thể tải thông tin cuộc thi.');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  useEffect(() => {
    fetchCompetitionDetail();
  }, [competitionId, fetchCompetitionDetail]);

  const getCompetitionStatus = (startTime: string, duration: number) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    const now = new Date();

    if (now < start) {
      return { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-700', icon: Clock };
    } else if (now >= start && now <= end) {
      return { label: 'Đang diễn ra', color: 'bg-green-100 text-green-700', icon: AlertCircle };
    } else {
      return { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-700', icon: CheckCircle };
    }
  };

  const exportToCSV = () => {
    if (!competition) return;

    const status = getCompetitionStatus(competition.startTime, competition.duration);
    const isUpcoming = status.label === 'Sắp diễn ra';

    let csvContent = 'STT,Họ và tên,Email,Số điện thoại';
    if (!isUpcoming) {
      csvContent += ',Điểm số,Số câu đúng,Trạng thái';
    }
    csvContent += '\n';

    competition.registeredUsers.forEach((user, index) => {
      let row = `${index + 1},"${user.fullName}","${user.email}","${user.phoneNumber}"`;
      if (!isUpcoming) {
        const score = user.score !== undefined ? user.score : 'Chưa nộp';
        const correct = user.totalCorrectAnswers !== undefined ? user.totalCorrectAnswers : '-';
        const userStatus = user.score !== undefined ? 'Đã nộp' : 'Chưa nộp';
        row += `,"${score}","${correct}","${userStatus}"`;
      }
      csvContent += row + '\n';
    });

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `danh-sach-thi-sinh-${competition.title.replace(/\s+/g, '-')}.csv`;
    link.click();
    toast.success('✅ Đã xuất file CSV thành công!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin cuộc thi...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy thông tin cuộc thi</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const status = getCompetitionStatus(competition.startTime, competition.duration);
  const StatusIcon = status.icon;
  const isUpcoming = status.label === 'Sắp diễn ra';

  const submittedUsers = competition.registeredUsers.filter(u => u.score !== undefined);
  const notSubmittedUsers = competition.registeredUsers.filter(u => u.score === undefined);

  const filteredUsers = competition.registeredUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phoneNumber.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'submitted') return matchesSearch && user.score !== undefined;
    if (filterStatus === 'not-submitted') return matchesSearch && user.score === undefined;
    
    return matchesSearch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.score !== undefined && b.score !== undefined) {
      return b.score - a.score;
    }
    if (a.score !== undefined) return -1;
    if (b.score !== undefined) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="text-yellow-500" size={32} />
                  <h1 className="text-3xl font-bold text-gray-800">{competition.title}</h1>
                </div>
                {competition.description && (
                  <p className="text-gray-600 mb-4">{competition.description}</p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${status.color}`}>
                <StatusIcon size={16} />
                {status.label}
              </span>
            </div>

            {/* Competition Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Thời gian bắt đầu</p>
                  <p className="font-semibold text-gray-800 text-sm">{formatDateTime(competition.startTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="text-green-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Thời lượng</p>
                  <p className="font-semibold text-gray-800">{competition.duration} phút</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Layers className="text-purple-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Khối lớp</p>
                  <p className="font-semibold text-gray-800">{competition.gradeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="text-blue-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Môn học</p>
                  <p className="font-semibold text-gray-800">{competition.subjectName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
              <Award className="text-indigo-600" size={24} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Đề thi</p>
                <p className="font-semibold text-gray-800">{competition.examName}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                competition.type ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {competition.type ? 'Premium' : 'Miễn phí'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đăng ký</p>
                <p className="text-2xl font-bold text-gray-800">{competition.registeredUsers.length}</p>
              </div>
              <Users className="text-indigo-500" size={32} />
            </div>
          </div>

          {!isUpcoming && (
            <>
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã nộp bài</p>
                    <p className="text-2xl font-bold text-green-600">{submittedUsers.length}</p>
                  </div>
                  <CheckCircle className="text-green-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chưa nộp bài</p>
                    <p className="text-2xl font-bold text-orange-600">{notSubmittedUsers.length}</p>
                  </div>
                  <XCircle className="text-orange-500" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Điểm cao nhất</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {submittedUsers.length > 0 
                        ? Math.max(...submittedUsers.map(u => u.score!))
                        : '-'}
                    </p>
                  </div>
                  <Medal className="text-yellow-500" size={32} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* User List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={28} />
              Danh sách thí sinh ({competition.registeredUsers.length})
            </h2>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Xuất CSV
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {!isUpcoming && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="submitted">Đã nộp bài</option>
                <option value="not-submitted">Chưa nộp bài</option>
              </select>
            )}
          </div>

          {/* Table */}
          {sortedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy thí sinh nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">STT</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Họ và tên</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Số điện thoại</th>
                    {!isUpcoming && (
                      <>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Điểm số</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Số câu đúng</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-700">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-800">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} className="text-gray-400" />
                          <span>{user.phoneNumber}</span>
                        </div>
                      </td>
                      {!isUpcoming && (
                        <>
                          <td className="px-4 py-4 text-center">
                            {user.score !== undefined ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                                <Target size={14} />
                                {user.score}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {user.totalCorrectAnswers !== undefined ? (
                              <span className="font-semibold text-gray-700">{user.totalCorrectAnswers}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {user.score !== undefined ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                <CheckCircle size={14} />
                                Đã nộp
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                                <AlertCircle size={14} />
                                Chưa nộp
                              </span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetailView;