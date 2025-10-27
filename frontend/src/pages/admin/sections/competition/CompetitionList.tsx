import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Award,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Search,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  listCompetitions,
  deleteCompetition,
  PageableResponse
} from '../../../../services/competition.admin';
import { CompetitionResponse } from '../../../../types/competition.admin';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { formatDateTime } from '../../../../util/util';

interface CompetitionListProps {
  onViewDetail?: (competition: CompetitionResponse) => void;
  onEdit?: (competition: CompetitionResponse) => void;
  onCreate?: () => void;
  onViewRegistrations?: (competition: CompetitionResponse) => void;
}

const CompetitionList: React.FC<CompetitionListProps> = ({
  onEdit,
  onCreate,
  onViewRegistrations
}) => {
  const [competitions, setCompetitions] = useState<CompetitionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'FREE' | 'PREMIUM'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'UPCOMING' | 'ONGOING' | 'PAST'>('all');

  // Fetch competitions
  const fetchCompetitions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PageableResponse<CompetitionResponse> = await listCompetitions(
        currentPage,
        pageSize,
        searchTerm === '' ? undefined : searchTerm,
        filterType === 'all' ? undefined : filterType === 'PREMIUM',
        filterStatus === 'all' ? undefined : filterStatus
      );

      setCompetitions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      setError('Không thể tải danh sách cuộc thi. Vui lòng thử lại sau.');
      toast.error('❌ Không thể tải danh sách cuộc thi.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleDelete = async (competition: CompetitionResponse) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa cuộc thi?',
      html: `
        <div class="text-left">
          <p class="mb-2">Bạn có chắc muốn xóa cuộc thi này?</p>
          <p class="font-semibold">"${competition.title}"</p>
          <p class="text-red-600 text-sm mt-2">⚠️ Hành động này không thể hoàn tác!</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCompetition(competition.id);
      toast.success('✅ Đã xóa cuộc thi thành công!');
      fetchCompetitions();
    } catch (error) {
      console.error('Error deleting competition:', error);
      toast.error('❌ Không thể xóa cuộc thi.');
    }
  };

  const getCompetitionStatus = (startTime: string, duration: number) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    const now = new Date();

    if (now < start) {
      return { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= start && now <= end) {
      return { label: 'Đang diễn ra', color: 'bg-green-100 text-green-700' };
    } else {
      return { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-700' };
    }
  };

  

  const filteredCompetitions = competitions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Trophy className="text-yellow-500" size={40} />
                Quản lý cuộc thi
              </h1>
              <p className="text-gray-600">Quản lý và theo dõi các cuộc thi</p>
            </div>
            <button
              onClick={onCreate}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg"
            >
              <Plus size={20} />
              Tạo cuộc thi mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng cuộc thi</p>
                  <p className="text-2xl font-bold text-gray-800">{totalElements}</p>
                </div>
                <Trophy className="text-yellow-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sắp diễn ra</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {competitions.filter(c => {
                      const start = new Date(c.startTime);
                      return start > new Date();
                    }).length}
                  </p>
                </div>
                <Calendar className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang diễn ra</p>
                  <p className="text-2xl font-bold text-green-600">
                    {competitions.filter(c => {
                      const start = new Date(c.startTime);
                      const end = new Date(start.getTime() + c.duration * 60000);
                      const now = new Date();
                      return now >= start && now <= end;
                    }).length}
                  </p>
                </div>
                <Clock className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Premium</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {competitions.filter(c => c.type).length}
                  </p>
                </div>
                <Award className="text-yellow-500" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              <option value="FREE">Miễn phí</option>
              <option value="PREMIUM">Premium</option>
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="UPCOMING">Sắp diễn ra</option>
              <option value="ONGOING">Đang diễn ra</option>
              <option value="PAST">Đã kết thúc</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchCompetitions} className="text-sm underline hover:no-underline">
              Thử lại
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách cuộc thi...</p>
          </div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">Chưa có cuộc thi nào</p>
            <button
              onClick={onCreate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tạo cuộc thi đầu tiên
            </button>
          </div>
        ) : (
          <>
            {/* Competition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredCompetitions.map((competition) => {
                const status = getCompetitionStatus(competition.startTime, competition.duration);

                return (
                  <div
                    key={competition.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Trophy className="text-yellow-300" size={28} />
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                        {competition.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Calendar size={14} />
                        <span>{formatDateTime(competition.startTime)}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      {competition.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {competition.description}
                        </p>
                      )}

                      {/* Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Layers size={14} />
                            <span>{competition.gradeName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen size={14} />
                            <span>{competition.subjectName}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} />
                            <span>{competition.duration} phút</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${competition.type
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                            }`}>
                            {competition.type ? 'Premium' : 'Miễn phí'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-4 border-t">
                        {/* Primary Actions Row */}
                        <div className="flex items-center gap-2">
                          {/* Hiện nút Chỉnh sửa nếu chưa kết thúc */}
                          {status.label === 'Sắp diễn ra' && (
                            <button
                              onClick={() => onEdit?.(competition)}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          
                          {/* Chỉ hiện nút Xóa nếu là Sắp diễn ra */}
                          {status.label === 'Sắp diễn ra' && (
                            <button
                              onClick={() => handleDelete(competition)}
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* View Registrations Button - Full Width */}
                        <button
                          onClick={() => onViewRegistrations?.(competition)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                          <span className="text-sm font-semibold">Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements} cuộc thi
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Trước
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNum: number;

                        if (totalPages <= 5) {
                          pageNum = index;
                        } else if (currentPage < 3) {
                          pageNum = index;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 5 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-colors ${currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompetitionList;