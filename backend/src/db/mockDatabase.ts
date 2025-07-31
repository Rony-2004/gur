import { Permission, Role, RolePermission, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory database storage
class MockDatabase {
  private permissions: Permission[] = [
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
  ];

  private roles: Role[] = [
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
  ];

  private rolePermissions: RolePermission[] = [
    { role_id: '1', permission_id: '1' },
    { role_id: '1', permission_id: '2' },
    { role_id: '1', permission_id: '3' },
    { role_id: '1', permission_id: '4' },
    { role_id: '2', permission_id: '1' },
    { role_id: '2', permission_id: '3' },
    { role_id: '2', permission_id: '4' },
    { role_id: '3', permission_id: '3' }
  ];

  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
      role_id: '1',
      created_at: new Date().toISOString()
    }
  ];

  // Permission methods
  async getPermissions(): Promise<Permission[]> {
    return [...this.permissions];
  }

  async getPermissionById(id: string): Promise<Permission | null> {
    return this.permissions.find(p => p.id === id) || null;
  }

  async createPermission(permission: Omit<Permission, 'id' | 'created_at'>): Promise<Permission> {
    const newPermission: Permission = {
      ...permission,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    this.permissions.push(newPermission);
    return newPermission;
  }

  async updatePermission(id: string, updates: Partial<Permission>): Promise<Permission | null> {
    const index = this.permissions.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.permissions[index] = { ...this.permissions[index], ...updates };
    return this.permissions[index];
  }

  async deletePermission(id: string): Promise<boolean> {
    const index = this.permissions.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.permissions.splice(index, 1);
    // Remove related role permissions
    this.rolePermissions = this.rolePermissions.filter(rp => rp.permission_id !== id);
    return true;
  }

  // Role methods
  async getRoles(): Promise<Role[]> {
    return [...this.roles];
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.roles.find(r => r.id === id) || null;
  }

  async createRole(role: Omit<Role, 'id' | 'created_at'>): Promise<Role> {
    const newRole: Role = {
      ...role,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    this.roles.push(newRole);
    return newRole;
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<Role | null> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.roles[index] = { ...this.roles[index], ...updates };
    return this.roles[index];
  }

  async deleteRole(id: string): Promise<boolean> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.roles.splice(index, 1);
    // Remove related role permissions
    this.rolePermissions = this.rolePermissions.filter(rp => rp.role_id !== id);
    return true;
  }

  // Role-Permission methods
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const permissionIds = this.rolePermissions
      .filter(rp => rp.role_id === roleId)
      .map(rp => rp.permission_id);
    return this.permissions.filter(p => permissionIds.includes(p.id));
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<boolean> {
    const exists = this.rolePermissions.some(rp => 
      rp.role_id === roleId && rp.permission_id === permissionId
    );
    if (exists) return false;
    
    this.rolePermissions.push({ role_id: roleId, permission_id: permissionId });
    return true;
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<boolean> {
    const index = this.rolePermissions.findIndex(rp => 
      rp.role_id === roleId && rp.permission_id === permissionId
    );
    if (index === -1) return false;
    
    this.rolePermissions.splice(index, 1);
    return true;
  }

  // User methods
  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const db = new MockDatabase(); 