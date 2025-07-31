import { Router } from 'express'
import { databaseService } from '../services/databaseService'

const router = Router()

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await databaseService.getAllRoles()
    res.json({
      success: true,
      data: roles
    })
  } catch (error) {
    console.error('Get roles error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const role = await databaseService.getRoleById(id)
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }

    res.json({
      success: true,
      data: role
    })
  } catch (error) {
    console.error('Get role error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Create new role
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      })
    }

    const role = await databaseService.createRole({
      name,
      description
    })

    res.status(201).json({
      success: true,
      data: role
    })
  } catch (error) {
    console.error('Create role error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update role
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      })
    }

    const role = await databaseService.updateRole(id, {
      name,
      description
    })

    res.json({
      success: true,
      data: role
    })
  } catch (error) {
    console.error('Update role error:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await databaseService.deleteRole(id)

    res.json({
      success: true,
      message: 'Role deleted successfully'
    })
  } catch (error) {
    console.error('Delete role error:', error)
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 