import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { deleteUser, updateUser, getUsers, UserResponse } from "../../../services/user.admin";
import UserDetailModal from "./user/UserDetailModal";
import UsersTable from "./user/UsersTable";
import FilterSection from "./user/FilterSection";
import PaginationSection from "./user/PaginationSection";
import EditUserModal from "./user/EditUserModal";
import Swal from "sweetalert2";

interface FilterState {
    name: string;
    email: string;
    phone: string;
    role: string;
    isPremium: string;
}


interface UpdateUserData {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    isPremium: boolean;
    startPremiumDate?: string;
    endPremiumDate?: string;
}

export default function UsersManagement() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        name: '',
        email: '',
        phone: '',
        role: '',
        isPremium: '',
    });

    const fetchUsers = useCallback(
        async (page = 0) => {
            setLoading(true);
            try {
                const params: any = {
                    page,
                    size: pageSize,
                    ...(filters.name && { name: filters.name }),
                    ...(filters.email && { email: filters.email }),
                    ...(filters.phone && { phone: filters.phone }),
                    ...(filters.role && { role: filters.role }),
                };

                if (filters.isPremium !== '') {
                    params.isPremium = filters.isPremium === 'true';
                }

                const response = await getUsers(params);

                setUsers(response.content || []);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
                setCurrentPage(response.number || page);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Lỗi khi tải danh sách người dùng');
            } finally {
                setLoading(false);
            }
        },
        [filters, pageSize]
    );

    useEffect(() => {
        fetchUsers(0);
    }, [filters, pageSize, fetchUsers]);

    const handleFilterChange = useCallback(
        (field: keyof FilterState, value: string) => {
            setFilters((prev) => ({ ...prev, [field]: value }));
            setCurrentPage(0);
        },
        []
    );

    const clearFilters = useCallback(() => {
        setFilters({ name: '', email: '', phone: '', role: '', isPremium: '' });
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage >= 0 && newPage < totalPages) {
                fetchUsers(newPage);
            }
        },
        [totalPages, fetchUsers]
    );

    const handleViewDetail = useCallback((user: UserResponse) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    }, []);

    const handleEdit = useCallback((user: UserResponse) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    }, []);

    const handleDelete = useCallback((user: UserResponse) => {
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${user.fullName}?`,
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                deleteUser(user.id)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Người dùng đã được xóa thành công.',
                            confirmButtonText: 'OK',
                        });
                        fetchUsers(0);
                    })
                    .catch((error) => {
                        console.error('Error deleting user:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Xóa người dùng thất bại. Vui lòng thử lại sau.',
                            confirmButtonText: 'Đóng',
                        });
                    })
                    .finally(() => setLoading(false));
            }
        });
    }, [fetchUsers]);


    const handleUpdateUser = useCallback(
        async (id: string, data: UpdateUserData) => {
            setIsUpdating(true);
            try {
                await updateUser(id, {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                    isPremium: data.isPremium,
                    ...(data.startPremiumDate && { startPremiumDate: data.startPremiumDate }),
                    ...(data.endPremiumDate && { endPremiumDate: data.endPremiumDate }),
                });
                toast.success('Cập nhật người dùng thành công');
                setIsEditModalOpen(false);
                setSelectedUser(null);
                fetchUsers(currentPage);
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Lỗi khi cập nhật người dùng');
            } finally {
                setIsUpdating(false);
            }
        },
        [fetchUsers, currentPage]
    );

    const getRoleBadgeColor = useMemo(
        () => (role: string) => {
            switch (role) {
                case 'ADMIN':
                    return 'bg-red-100 text-red-800';
                case 'TEACHER':
                    return 'bg-blue-100 text-blue-800';
                case 'STUDENT':
                    return 'bg-green-100 text-green-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        },
        []
    );

    const hasActiveFilters = Object.values(filters).some((v) => v !== '');

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
                        <p className="text-gray-600 mt-2">Danh sách và quản lý thông tin người dùng hệ thống</p>
                    </div>
                </div>

                {/* Filters */}
                <FilterSection
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Table */}
                <UsersTable
                    users={users}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getRoleBadgeColor={getRoleBadgeColor}
                />

                {/* Pagination */}
                {users.length > 0 && (
                    <PaginationSection
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        onPageChange={handlePageChange}
                        onPageSizeChange={setPageSize}
                    />
                )}
            </div>

            {/* Detail Modal */}
            <UserDetailModal
                user={selectedUser}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(null);
                }}
            />

            {/* Edit Modal */}
            <EditUserModal
                user={selectedUser}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleUpdateUser}
                loading={isUpdating}
            />
        </div>
    );
}