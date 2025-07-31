'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { mockAPI } from '@/lib/mockData'
import { Permission } from '@/types'
import { Plus, Edit, Search, Shield, CheckCircle, XCircle } from 'lucide-react'

export function PermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [newPermission, setNewPermission] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      setIsLoading(true)
      const data = await mockAPI.getPermissions()
      setPermissions(data)
    } catch (error) {
      console.error('Error loading permissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newPermission.name.trim()) return

    try {
      setIsSubmitting(true)
      const created = await mockAPI.createPermission(newPermission)
      setPermissions([...permissions, created])
      setNewPermission({ name: '', description: '' })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating permission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editingPermission || !editingPermission.name.trim()) return

    try {
      setIsSubmitting(true)
      const updated = await mockAPI.updatePermission(editingPermission.id, editingPermission)
      setPermissions(permissions.map(p => p.id === updated.id ? updated : p))
      setEditingPermission(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating permission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return

    try {
      await mockAPI.deletePermission(id)
      setPermissions(permissions.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting permission:', error)
    }
  }

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Permissions</h2>
            <p className="text-gray-600">Manage system permissions and access controls</p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          variant="default"
          size="lg"
          animate
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Permission
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 input-focus"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-professional animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg loading-skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded loading-skeleton"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 loading-skeleton"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded loading-skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions List */}
      {!isLoading && (
        <div className="grid gap-4">
          {filteredPermissions.length === 0 ? (
            <Card className="text-center py-12 animate-fade-in">
              <CardContent>
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No permissions found' : 'No permissions yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first permission to get started'}
                </p>
                                 {!searchTerm && (
                   <Button
                     onClick={() => setIsCreateDialogOpen(true)}
                     variant="default"
                     animate
                   >
                     <Plus className="w-4 h-4 mr-2" />
                     Create Permission
                   </Button>
                 )}
              </CardContent>
            </Card>
          ) : (
            filteredPermissions.map((permission, index) => (
              <Card key={permission.id} className="card-animate animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{permission.name}</h3>
                        <p className="text-gray-600">{permission.description || 'No description provided'}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Created {new Date(permission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                                             <Button
                         variant="info"
                         size="sm"
                         onClick={() => {
                           setEditingPermission(permission)
                           setIsEditDialogOpen(true)
                         }}
                         className="success-cursor"
                       >
                         <CheckCircle className="w-4 h-4" />
                       </Button>
                       <Button
                         variant="destructive"
                         size="sm"
                         onClick={() => handleDelete(permission.id)}
                         className="delete-cursor"
                       >
                         <XCircle className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Create New Permission</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                value={newPermission.name}
                onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                placeholder="Enter permission name"
                className="input-focus"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Input
                value={newPermission.description}
                onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
                placeholder="Enter permission description"
                className="input-focus"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
                         <Button
               onClick={handleCreate}
               disabled={isSubmitting || !newPermission.name.trim()}
               loading={isSubmitting}
               variant="success"
             >
               Create Permission
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-blue-600" />
              <span>Edit Permission</span>
            </DialogTitle>
          </DialogHeader>
          {editingPermission && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    value={editingPermission.name}
                    onChange={(e) => setEditingPermission({ ...editingPermission, name: e.target.value })}
                    className="input-focus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Input
                    value={editingPermission.description || ''}
                    onChange={(e) => setEditingPermission({ ...editingPermission, description: e.target.value })}
                    className="input-focus"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                                 <Button
                   onClick={handleEdit}
                   disabled={isSubmitting || !editingPermission.name.trim()}
                   loading={isSubmitting}
                   variant="info"
                 >
                   Update Permission
                 </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 