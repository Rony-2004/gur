export interface Permission {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Role {
  id: string
  name: string
  created_at: string
}

export interface RolePermission {
  role_id: string
  permission_id: string
}

export interface User {
  id: string
  email: string
  role_id?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
} 