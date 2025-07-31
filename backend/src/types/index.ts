export interface Permission {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role_id?: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
}

export interface AssignPermissionRequest {
  role_id: string;
  permission_id: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 