import { ApiResponse } from '../types/type';
import axiosClient from './axioisClient';

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
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

export const getEmployees = async (
  params?: {
    page?: number;
    size?: number;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  }
): Promise<PageableResponse<UserResponse>> => {
  try {
    const response = await axiosClient.get<PageableResponse<UserResponse>>(
      '/admin/employees',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một nhân viên
 * @param id - ID của nhân viên
 * @returns Thông tin chi tiết nhân viên
 */
export const getEmployeeById = async (id: string): Promise<UserResponse> => {
  try {
    const response = await axiosClient.get<UserResponse>(`/admin/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
};

/**
 * Tạo nhân viên mới
 * @param data - Dữ liệu nhân viên
 * @returns Thông tin nhân viên vừa tạo
 */
export const createEmployee = async (data: Object): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await axiosClient.post<ApiResponse<UserResponse>>('/admin/employee', data);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin nhân viên
 * @param id - ID của nhân viên
 * @param data - Dữ liệu cần cập nhật
 * @returns Thông tin nhân viên sau khi cập nhật
 */
export const updateEmployee = async (
  id: string,
  data: Partial<UserResponse>
): Promise<UserResponse> => {
  try {
    const response = await axiosClient.put<UserResponse>(
      `/admin/updateEmployee/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

/**
 * Xóa nhân viên
 * @param id - ID của nhân viên
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await axiosClient.delete(`/admin/employee/${id}`);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

/**
 * Tìm kiếm nhân viên theo từ khóa
 * @param query - Từ khóa tìm kiếm
 * @returns Danh sách nhân viên phù hợp
 */
export const searchEmployees = async (
  query: string,
  page: number = 0,
  size: number = 10
): Promise<PageableResponse<UserResponse>> => {
  try {
    const response = await axiosClient.get<PageableResponse<UserResponse>>(
      '/admin/employees',
      {
        params: {
          name: query,
          email: query,
          phone: query,
          page,
          size
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching employees:', error);
    throw error;
  }
};