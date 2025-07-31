import { Permission, Role, RolePermission, User } from '@/types'

// Mock data storage
export let permissions: Permission[] = [
  {
    id: '1',
    name: 'can_edit_articles',
    description: 'Ability to edit articles',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'can_delete_users',
    description: 'Ability to delete users',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'can_view_dashboard',
    description: 'Ability to view dashboard',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'can_publish_content',
    description: 'Ability to publish content',
    created_at: new Date().toISOString()
  }
]

export let roles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Content Editor',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Support Agent',
    created_at: new Date().toISOString()
  }
]

export let rolePermissions: RolePermission[] = [
  { role_id: '1', permission_id: '1' },
  { role_id: '1', permission_id: '2' },
  { role_id: '1', permission_id: '3' },
  { role_id: '1', permission_id: '4' },
  { role_id: '2', permission_id: '1' },
  { role_id: '2', permission_id: '3' },
  { role_id: '2', permission_id: '4' },
  { role_id: '3', permission_id: '3' }
]

export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    role_id: '1'
  }
]

// Mock API functions
export const mockAPI = {
  // Permission operations
  getPermissions: () => Promise.resolve(permissions),
  createPermission: (permission: Omit<Permission, 'id' | 'created_at'>) => {
    const newPermission: Permission = {
      ...permission,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    permissions.push(newPermission)
    return Promise.resolve(newPermission)
  },
  updatePermission: (id: string, updates: Partial<Permission>) => {
    const index = permissions.findIndex(p => p.id === id)
    if (index !== -1) {
      permissions[index] = { ...permissions[index], ...updates }
      return Promise.resolve(permissions[index])
    }
    return Promise.reject(new Error('Permission not found'))
  },
  deletePermission: (id: string) => {
    permissions = permissions.filter(p => p.id !== id)
    rolePermissions = rolePermissions.filter(rp => rp.permission_id !== id)
    return Promise.resolve()
  },

  // Role operations
  getRoles: () => Promise.resolve(roles),
  createRole: (role: Omit<Role, 'id' | 'created_at'>) => {
    const newRole: Role = {
      ...role,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    roles.push(newRole)
    return Promise.resolve(newRole)
  },
  updateRole: (id: string, updates: Partial<Role>) => {
    const index = roles.findIndex(r => r.id === id)
    if (index !== -1) {
      roles[index] = { ...roles[index], ...updates }
      return Promise.resolve(roles[index])
    }
    return Promise.reject(new Error('Role not found'))
  },
  deleteRole: (id: string) => {
    roles = roles.filter(r => r.id !== id)
    rolePermissions = rolePermissions.filter(rp => rp.role_id !== id)
    return Promise.resolve()
  },

  // Role-Permission operations
  getRolePermissions: (roleId: string) => {
    const permissionIds = rolePermissions
      .filter(rp => rp.role_id === roleId)
      .map(rp => rp.permission_id)
    return Promise.resolve(permissions.filter(p => permissionIds.includes(p.id)))
  },
  assignPermissionToRole: (roleId: string, permissionId: string) => {
    const exists = rolePermissions.some(rp => rp.role_id === roleId && rp.permission_id === permissionId)
    if (!exists) {
      rolePermissions.push({ role_id: roleId, permission_id: permissionId })
    }
    return Promise.resolve()
  },
  removePermissionFromRole: (roleId: string, permissionId: string) => {
    rolePermissions = rolePermissions.filter(
      rp => !(rp.role_id === roleId && rp.permission_id === permissionId)
    )
    return Promise.resolve()
  },

  // Authentication
  login: (email: string, password: string) => {
    if (email === 'admin@example.com' && password === 'admin123') {
      return Promise.resolve(users[0])
    }
    return Promise.reject(new Error('Invalid credentials'))
  },
  logout: () => Promise.resolve()
} 