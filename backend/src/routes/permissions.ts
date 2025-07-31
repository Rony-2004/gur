import { Router } from 'express'
import { databaseService } from '../services/databaseService'

const router = Router()

// Get all permissions
router.get('/', async (req, res) => {
  try {
    const permissions = await databaseService.getAllPermissions()
    res.json({
      success: true,
      data: permissions
    })
  } catch (error) {
    console.error('Get permissions error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get permission by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const permission = await databaseService.getPermissionById(id)
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      })
    }

    res.json({
      success: true,
      data: permission
    })
  } catch (error) {
    console.error('Get permission error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Create new permission
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Permission name is required'
      })
    }

    const permission = await databaseService.createPermission({
      name,
      description
    })

    res.status(201).json({
      success: true,
      data: permission
    })
  } catch (error) {
    console.error('Create permission error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Permission with this name already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update permission
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Permission name is required'
      })
    }

    const permission = await databaseService.updatePermission(id, {
      name,
      description
    })

    res.json({
      success: true,
      data: permission
    })
  } catch (error) {
    console.error('Update permission error:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      })
    }
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Permission with this name already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Delete permission
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await databaseService.deletePermission(id)

    res.json({
      success: true,
      message: 'Permission deleted successfully'
    })
  } catch (error) {
    console.error('Delete permission error:', error)
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 