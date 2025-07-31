import { Router } from 'express'
import { databaseService } from '../services/databaseService'
import { geminiService } from '../services/geminiService'

const router = Router()

// Get permissions for a specific role
router.get('/roles/:roleId/permissions', async (req, res) => {
  try {
    const { roleId } = req.params
    const permissions = await databaseService.getRolePermissions(roleId)
    
    res.json({
      success: true,
      data: permissions
    })
  } catch (error) {
    console.error('Get role permissions error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get roles for a specific permission
router.get('/permissions/:permissionId/roles', async (req, res) => {
  try {
    const { permissionId } = req.params
    const roles = await databaseService.getPermissionRoles(permissionId)
    
    res.json({
      success: true,
      data: roles
    })
  } catch (error) {
    console.error('Get permission roles error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Assign permission to role
router.post('/assign', async (req, res) => {
  try {
    const { roleId, permissionId } = req.body

    if (!roleId || !permissionId) {
      return res.status(400).json({
        success: false,
        message: 'Role ID and Permission ID are required'
      })
    }

    const rolePermission = await databaseService.assignPermissionToRole(roleId, permissionId)

    res.status(201).json({
      success: true,
      data: rolePermission,
      message: 'Permission assigned to role successfully'
    })
  } catch (error) {
    console.error('Assign permission error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Permission is already assigned to this role'
      })
    }
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role ID or permission ID'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Remove permission from role
router.delete('/roles/:roleId/permissions/:permissionId', async (req, res) => {
  try {
    const { roleId, permissionId } = req.params

    await databaseService.removePermissionFromRole(roleId, permissionId)

    res.json({
      success: true,
      message: 'Permission removed from role successfully'
    })
  } catch (error) {
    console.error('Remove permission error:', error)
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Role-permission assignment not found'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Natural Language Processing endpoint with Gemini AI
router.post('/nlp', async (req, res) => {
  try {
    const { command } = req.body

    if (!command) {
      return res.status(400).json({
        success: false,
        message: 'Command is required'
      })
    }

    // Use Gemini AI to process the command
    const result = await geminiService.processCommand(command)

    res.json({
      success: result.success,
      data: result.data,
      message: result.message,
      action: result.action,
      parsedCommand: result.parsedCommand
    })
  } catch (error) {
    console.error('NLP processing error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 