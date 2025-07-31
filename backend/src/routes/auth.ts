import { Router } from 'express'
import { databaseService } from '../services/databaseService'

const router = Router()

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = await databaseService.authenticateUser(email, password)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = databaseService.generateToken(user)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          roleId: user.roleId
        },
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Register endpoint (optional)
router.post('/register', async (req, res) => {
  try {
    const { email, password, roleId } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Check if user already exists
    const existingUser = await databaseService.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    const user = await databaseService.createUser({
      email,
      password,
      roleId
    })

    const token = databaseService.generateToken(user)

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          roleId: user.roleId
        },
        token
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 