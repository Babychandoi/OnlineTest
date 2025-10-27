
import axiosClient from './axioisClient';

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isPremium: boolean;
  startPremiumDate?: string;
  endPremiumDate?: string;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Lấy danh sách users với bộ lọc và phân trang
 * @param params - Tham số query gồm: page, size, name, email, phone, role, isPremium
 * @returns Danh sách users được phân trang
 */
export const getUsers = async (
  params?: {
    page?: number;
    size?: number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    isPremium?: boolean;
  }
): Promise<PageableResponse<UserResponse>> => {
  try {
    const response = await axiosClient.get<PageableResponse<UserResponse>>(
      '/admin/users',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một user
 * @param id - ID của user
 * @returns Thông tin chi tiết user
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const response = await axiosClient.get<UserResponse>(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin user
 * @param id - ID của user
 * @param data - Dữ liệu cần cập nhật
 * @returns Thông tin user sau khi cập nhật
 */
export const updateUser = async (
  id: string,
  data: Partial<UserResponse>
): Promise<UserResponse> => {
  try {
    const response = await axiosClient.put<UserResponse>(
      `/admin/updateUser/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Xóa user
 * @param id - ID của user
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await axiosClient.delete(`/admin/user/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};