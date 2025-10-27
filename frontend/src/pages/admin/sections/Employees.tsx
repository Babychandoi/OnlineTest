import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { createEmployee, deleteEmployee, updateEmployee } from "../../../services/employees";
import { getEmployees } from "../../../services/employees";
import { UserResponse } from "../../../services/employees";
import EmployeeDetailModal from "./employee/EmployeeDetailModal";
import EmployeesTable from "./employee/EmployeesTable";
import FilterSection from "./employee/FilterSection";
import PaginationSection from "./employee/PaginationSection";
import CreateEmployeeModal from "./employee/CreateEmployees";
import EditEmployeeModal from "./employee/EditEmployeeModal";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";

interface FilterState {
    name: string;
    email: string;
    phone: string;
}

interface CreateEmployeeData {
    fullName: string;
    email: string;
    phone: string;
}

interface UpdateEmployeeData {
    fullName: string;
    email: string;
    phone: string;
    role: string;
}

export default function EmployeesManagement() {
    const [employees, setEmployees] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        name: '',
        email: '',
        phone: '',
    });

    const fetchEmployees = useCallback(
        async (page = 0) => {
            setLoading(true);
            try {
                const params = {
                    page,
                    size: pageSize,
                    ...(filters.name && { name: filters.name }),
                    ...(filters.email && { email: filters.email }),
                    ...(filters.phone && { phone: filters.phone }),
                };

                const response = await getEmployees(params);

                setEmployees(response.content || []);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
                setCurrentPage(response.number || page);
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error('Lỗi khi tải danh sách nhân viên');
            } finally {
                setLoading(false);
            }
        },
        [filters, pageSize]
    );

    useEffect(() => {
        fetchEmployees(0);
    }, [filters, pageSize, fetchEmployees]);

    const handleFilterChange = useCallback(
        (field: keyof FilterState, value: string) => {
            setFilters((prev) => ({ ...prev, [field]: value }));
            setCurrentPage(0);
        },
        []
    );

    const clearFilters = useCallback(() => {
        setFilters({ name: '', email: '', phone: '' });
        setCurrentPage(0);
    }, []);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage >= 0 && newPage < totalPages) {
                fetchEmployees(newPage);
            }
        },
        [totalPages, fetchEmployees]
    );

    const handleViewDetail = useCallback((employee: UserResponse) => {
        setSelectedEmployee(employee);
        setIsDetailModalOpen(true);
    }, []);

    const handleEdit = useCallback((employee: UserResponse) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    }, []);

    const handleDelete = useCallback((employee: UserResponse) => {
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${employee.fullName}?`,
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
                deleteEmployee(employee.id)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Nhân viên đã được xóa thành công.',
                            confirmButtonText: 'OK',
                        });
                        fetchEmployees(0);
                    })
                    .catch((error) => {
                        console.error('Error deleting employee:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Xóa nhân viên thất bại. Vui lòng thử lại sau.',
                            confirmButtonText: 'Đóng',
                        });
                    })
                    .finally(() => setLoading(false));
            }
        });
    }, [fetchEmployees]);

    const handleCreateEmployee = useCallback(
        async (data: CreateEmployeeData) => {
            setIsCreating(true);
            try {
                await createEmployee({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                });
                toast.success('Thêm nhân viên thành công');
                setIsCreateModalOpen(false);
                fetchEmployees(0);
            } catch (error) {
                console.error('Error creating employee:', error);
                toast.error('Lỗi khi thêm nhân viên');
            } finally {
                setIsCreating(false);
            }
        },
        [fetchEmployees]
    );

    const handleUpdateEmployee = useCallback(
        async (id: string, data: UpdateEmployeeData) => {
            setIsUpdating(true);
            try {
                await updateEmployee(id, {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    role: data.role,
                });
                toast.success('Cập nhật nhân viên thành công');
                setIsEditModalOpen(false);
                setSelectedEmployee(null);
                fetchEmployees(currentPage);
            } catch (error) {
                console.error('Error updating employee:', error);
                toast.error('Lỗi khi cập nhật nhân viên');
            } finally {
                setIsUpdating(false);
            }
        },
        [fetchEmployees, currentPage]
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
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhân viên</h1>
                        <p className="text-gray-600 mt-2">Danh sách và quản lý thông tin nhân viên hệ thống</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Thêm nhân viên
                    </button>
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
                <EmployeesTable
                    employees={employees}
                    loading={loading}
                    onViewDetail={handleViewDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getRoleBadgeColor={getRoleBadgeColor}
                />

                {/* Pagination */}
                {employees.length > 0 && (
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
            <EmployeeDetailModal
                employee={selectedEmployee}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedEmployee(null);
                }}
            />

            {/* Create Modal */}
            <CreateEmployeeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateEmployee}
                loading={isCreating}
            />

            {/* Edit Modal */}
            <EditEmployeeModal
                employee={selectedEmployee}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedEmployee(null);
                }}
                onSubmit={handleUpdateEmployee}
                loading={isUpdating}
            />
        </div>
    );
}