export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isPremium: boolean;
}