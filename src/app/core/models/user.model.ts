export interface User {
  id?: number;
  username?: string;
  phoneNumber?: string;
  email?: string;
  isTeacher?: boolean;
  createdAt?: string;
  updatedAt?: string;
  jwt?: string;
  refreshToken?: string;
}
