import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, Role, Permission, RolePermission } from '@prisma/client'

export interface CreateUserData {
  email: string
  password: string
  roleId?: string
}

export interface CreateRoleData {
  name: string
  description?: string
}

export interface CreatePermissionData {
  name: string
  description?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UserWithRole extends User {
  role?: Role | null
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[]
}

export interface PermissionWithRoles extends Permission {
  roles: Role[]
}

class DatabaseService {
  // User operations
  async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId
      }
    })
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  async getUserById(id: string): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true }
    })
  }

  async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    const updateData: any = { ...data }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10)
    }
    return prisma.user.update({
      where: { id },
      data: updateData
    })
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    })
  }

  async getAllUsers(): Promise<UserWithRole[]> {
    return prisma.user.findMany({
      include: { role: true }
    })
  }

  // Authentication
  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email)
    if (!user) return null

    const isValidPassword = await bcrypt.compare(password, user.password)
    return isValidPassword ? user : null
  }

  generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )
  }

  // Role operations
  async createRole(data: CreateRoleData): Promise<Role> {
    // Check if role with same name already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive' // Case-insensitive comparison
        }
      }
    })

    if (existingRole) {
      throw new Error(`Role "${data.name}" already exists`)
    }

    return prisma.role.create({
      data
    })
  }

  async getRoleById(id: string): Promise<RoleWithPermissions | null> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
    
    if (!role) return null
    
    return {
      ...role,
      permissions: role.permissions.map(rp => rp.permission)
    }
  }

  async updateRole(id: string, data: Partial<CreateRoleData>): Promise<Role> {
    return prisma.role.update({
      where: { id },
      data
    })
  }

  async deleteRole(id: string): Promise<Role> {
    return prisma.role.delete({
      where: { id }
    })
  }

  async getAllRoles(): Promise<RoleWithPermissions[]> {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })
    
    return roles.map(role => ({
      ...role,
      permissions: role.permissions.map(rp => rp.permission)
    }))
  }

  // Permission operations
  async createPermission(data: CreatePermissionData): Promise<Permission> {
    // Check if permission with same name already exists
    const existingPermission = await prisma.permission.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive' // Case-insensitive comparison
        }
      }
    })

    if (existingPermission) {
      throw new Error(`Permission "${data.name}" already exists`)
    }

    return prisma.permission.create({
      data
    })
  }

  async getPermissionById(id: string): Promise<PermissionWithRoles | null> {
    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    if (!permission) return null
    
    return {
      ...permission,
      roles: permission.roles.map(rp => rp.role)
    }
  }

  async updatePermission(id: string, data: Partial<CreatePermissionData>): Promise<Permission> {
    return prisma.permission.update({
      where: { id },
      data
    })
  }

  async deletePermission(id: string): Promise<Permission> {
    return prisma.permission.delete({
      where: { id }
    })
  }

  async getAllPermissions(): Promise<PermissionWithRoles[]> {
    const permissions = await prisma.permission.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })
    
    return permissions.map(permission => ({
      ...permission,
      roles: permission.roles.map(rp => rp.role)
    }))
  }

  // Role-Permission operations
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
    // Check if assignment already exists
    const existingAssignment = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    })

    if (existingAssignment) {
      throw new Error('Permission is already assigned to this role')
    }

    return prisma.rolePermission.create({
      data: {
        roleId,
        permissionId
      }
    })
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<RolePermission> {
    return prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    })
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true }
    })
    return rolePermissions.map(rp => rp.permission)
  }

  async getPermissionRoles(permissionId: string): Promise<Role[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { permissionId },
      include: { role: true }
    })
    return rolePermissions.map(rp => rp.role)
  }

  // Initialize database with default data
  async initializeDatabase(): Promise<void> {
    // Check if admin user exists
    const adminUser = await this.getUserByEmail('admin@example.com')
    if (!adminUser) {
      // Create admin role
      const adminRole = await this.createRole({
        name: 'Admin',
        description: 'Administrator with full access'
      })

      // Create admin user
      await this.createUser({
        email: 'admin@example.com',
        password: 'admin123',
        roleId: adminRole.id
      })

      // Create default permissions
      const permissions = await Promise.all([
        this.createPermission({ name: 'read_users', description: 'Read user data' }),
        this.createPermission({ name: 'write_users', description: 'Create and update users' }),
        this.createPermission({ name: 'delete_users', description: 'Delete users' }),
        this.createPermission({ name: 'read_roles', description: 'Read role data' }),
        this.createPermission({ name: 'write_roles', description: 'Create and update roles' }),
        this.createPermission({ name: 'delete_roles', description: 'Delete roles' }),
        this.createPermission({ name: 'read_permissions', description: 'Read permission data' }),
        this.createPermission({ name: 'write_permissions', description: 'Create and update permissions' }),
        this.createPermission({ name: 'delete_permissions', description: 'Delete permissions' }),
        this.createPermission({ name: 'assign_permissions', description: 'Assign permissions to roles' })
      ])

      // Assign all permissions to admin role
      for (const permission of permissions) {
        await this.assignPermissionToRole(adminRole.id, permission.id)
      }

      console.log('Database initialized with default data')
    }
  }
}

export const databaseService = new DatabaseService() 