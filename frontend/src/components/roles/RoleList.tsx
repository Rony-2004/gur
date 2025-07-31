'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { mockAPI } from '@/lib/mockData'
import { Role } from '@/types'
import { Plus, Edit, Trash2 } from 'lucide-react'

export function RoleList() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      const data = await mockAPI.getRoles()
      setRoles(data)
    } catch (error) {
      console.error('Error loading roles:', error)
    }
  }

  const handleCreate = async () => {
    try {
      await mockAPI.createRole(formData)
      setIsCreateDialogOpen(false)
      setFormData({ name: '' })
      loadRoles()
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  const handleEdit = async () => {
    if (!editingRole) return
    try {
      await mockAPI.updateRole(editingRole.id, formData)
      setIsEditDialogOpen(false)
      setEditingRole(null)
      setFormData({ name: '' })
      loadRoles()
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await mockAPI.deleteRole(id)
        loadRoles()
      } catch (error) {
        console.error('Error deleting role:', error)
      }
    }
  }

  const openEditDialog = (role: Role) => {
    setEditingRole(role)
    setFormData({ name: role.name })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Roles</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(role.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(role)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(role.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Content Editor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Content Editor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 