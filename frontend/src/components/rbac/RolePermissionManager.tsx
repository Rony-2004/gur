'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockAPI } from '@/lib/mockData'
import { Role, Permission } from '@/types'
import { Check, X } from 'lucide-react'

export function RolePermissionManager() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole)
    }
  }, [selectedRole])

  const loadData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        mockAPI.getRoles(),
        mockAPI.getPermissions()
      ])
      setRoles(rolesData)
      setPermissions(permissionsData)
      if (rolesData.length > 0) {
        setSelectedRole(rolesData[0].id)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadRolePermissions = async (roleId: string) => {
    try {
      const data = await mockAPI.getRolePermissions(roleId)
      setRolePermissions(data)
    } catch (error) {
      console.error('Error loading role permissions:', error)
    }
  }

  const handleAssignPermission = async (permissionId: string) => {
    if (!selectedRole) return
    try {
      await mockAPI.assignPermissionToRole(selectedRole, permissionId)
      loadRolePermissions(selectedRole)
    } catch (error) {
      console.error('Error assigning permission:', error)
    }
  }

  const handleRemovePermission = async (permissionId: string) => {
    if (!selectedRole) return
    try {
      await mockAPI.removePermissionFromRole(selectedRole, permissionId)
      loadRolePermissions(selectedRole)
    } catch (error) {
      console.error('Error removing permission:', error)
    }
  }

  const isPermissionAssigned = (permissionId: string) => {
    return rolePermissions.some(p => p.id === permissionId)
  }

  const selectedRoleData = roles.find(r => r.id === selectedRole)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Role-Permission Management</h2>
        
        {/* Role Selector */}
        <div className="mb-6">
          <label htmlFor="role-select" className="block text-sm font-medium mb-2">Select Role</label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRoleData && (
          <Card>
            <CardHeader>
              <CardTitle>Permissions for {selectedRoleData.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {permissions.map((permission) => {
                  const isAssigned = isPermissionAssigned(permission.id)
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{permission.name}</h4>
                        {permission.description && (
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        )}
                      </div>
                      <Button
                        variant={isAssigned ? "outline" : "default"}
                        size="sm"
                        onClick={() => 
                          isAssigned 
                            ? handleRemovePermission(permission.id)
                            : handleAssignPermission(permission.id)
                        }
                      >
                        {isAssigned ? (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 