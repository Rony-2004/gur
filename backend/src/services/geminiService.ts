import { GoogleGenerativeAI } from '@google/generative-ai'
import { databaseService } from './databaseService'

class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required in environment variables')
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }

  async processCommand(userCommand: string): Promise<{
    success: boolean
    action: string
    data?: any
    message: string
    parsedCommand?: any
  }> {
    try {
      const prompt = this.buildPrompt(userCommand)
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const parsedResponse = this.parseAIResponse(text)
      
      if (parsedResponse.action === 'create_permission') {
        return await this.handleCreatePermission(parsedResponse)
      } else if (parsedResponse.action === 'create_role') {
        return await this.handleCreateRole(parsedResponse)
      } else if (parsedResponse.action === 'assign_permission') {
        return await this.handleAssignPermission(parsedResponse)
      } else if (parsedResponse.action === 'list_permissions') {
        return await this.handleListPermissions()
      } else if (parsedResponse.action === 'list_roles') {
        return await this.handleListRoles()
      } else if (parsedResponse.action === 'unknown') {
        return {
          success: false,
          action: 'unknown',
          message: 'I could not understand that command. Please try rephrasing it.',
          parsedCommand: parsedResponse
        }
      }

      return {
        success: false,
        action: 'error',
        message: 'An error occurred while processing your command.',
        parsedCommand: parsedResponse
      }

    } catch (error) {
      console.error('Gemini AI Error:', error)
      return {
        success: false,
        action: 'error',
        message: 'Sorry, I encountered an error while processing your request. Please try again.',
      }
    }
  }

  private buildPrompt(userCommand: string): string {
    return `
You are an AI assistant for a Role-Based Access Control (RBAC) system. Your job is to understand natural language commands and convert them into structured actions.

Available actions:
1. create_permission - Create a new permission
2. create_role - Create a new role
3. assign_permission - Assign a permission to a role
4. list_permissions - List all permissions
5. list_roles - List all roles

User command: "${userCommand}"

Please respond in the following JSON format:
{
  "action": "action_name",
  "parameters": {
    // relevant parameters based on the action
  },
  "confidence": 0.95
}

Examples:
- "Create a permission called publish content" → {"action": "create_permission", "parameters": {"name": "publish_content", "description": "Permission to publish content"}, "confidence": 0.95}
- "Create role editor" → {"action": "create_role", "parameters": {"name": "editor", "description": "Editor role"}, "confidence": 0.95}
- "Give editor permission to delete posts" → {"action": "assign_permission", "parameters": {"role_name": "editor", "permission_name": "delete_posts"}, "confidence": 0.95}
- "Show all permissions" → {"action": "list_permissions", "parameters": {}, "confidence": 0.95}

Respond only with valid JSON:
`
  }

  private parseAIResponse(response: string): any {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return { action: 'unknown', parameters: {}, confidence: 0 }
      }

      const parsed = JSON.parse(jsonMatch[0])
      return {
        action: parsed.action || 'unknown',
        parameters: parsed.parameters || {},
        confidence: parsed.confidence || 0
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return { action: 'unknown', parameters: {}, confidence: 0 }
    }
  }

  private async handleCreatePermission(parsed: any): Promise<any> {
    try {
      const { name, description } = parsed.parameters
      if (!name) {
        return {
          success: false,
          action: 'create_permission',
          message: 'Permission name is required.',
          parsedCommand: parsed
        }
      }

      const permission = await databaseService.createPermission({
        name: name.toLowerCase().replace(/\s+/g, '_'),
        description: description || `Permission for ${name}`
      })

      return {
        success: true,
        action: 'create_permission',
        data: permission,
        message: `Successfully created permission "${name}"`,
        parsedCommand: parsed
      }
    } catch (error) {
      console.error('Error creating permission:', error)
      return {
        success: false,
        action: 'create_permission',
        message: 'Failed to create permission. It might already exist.',
        parsedCommand: parsed
      }
    }
  }

  private async handleCreateRole(parsed: any): Promise<any> {
    try {
      const { name, description } = parsed.parameters
      if (!name) {
        return {
          success: false,
          action: 'create_role',
          message: 'Role name is required.',
          parsedCommand: parsed
        }
      }

      const role = await databaseService.createRole({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        description: description || `${name} role`
      })

      return {
        success: true,
        action: 'create_role',
        data: role,
        message: `Successfully created role "${name}"`,
        parsedCommand: parsed
      }
    } catch (error) {
      console.error('Error creating role:', error)
      return {
        success: false,
        action: 'create_role',
        message: 'Failed to create role. It might already exist.',
        parsedCommand: parsed
      }
    }
  }

  private async handleAssignPermission(parsed: any): Promise<any> {
    try {
      const { role_name, permission_name } = parsed.parameters
      if (!role_name || !permission_name) {
        return {
          success: false,
          action: 'assign_permission',
          message: 'Both role name and permission name are required.',
          parsedCommand: parsed
        }
      }

      // Find role and permission by name
      const roles = await databaseService.getAllRoles()
      const permissions = await databaseService.getAllPermissions()

      const role = roles.find(r => r.name.toLowerCase() === role_name.toLowerCase())
      const permission = permissions.find(p => p.name.toLowerCase() === permission_name.toLowerCase())

      if (!role) {
        return {
          success: false,
          action: 'assign_permission',
          message: `Role "${role_name}" not found.`,
          parsedCommand: parsed
        }
      }

      if (!permission) {
        return {
          success: false,
          action: 'assign_permission',
          message: `Permission "${permission_name}" not found.`,
          parsedCommand: parsed
        }
      }

      await databaseService.assignPermissionToRole(role.id, permission.id)

      return {
        success: true,
        action: 'assign_permission',
        data: { role, permission },
        message: `Successfully assigned permission "${permission_name}" to role "${role_name}"`,
        parsedCommand: parsed
      }
    } catch (error) {
      console.error('Error assigning permission:', error)
      return {
        success: false,
        action: 'assign_permission',
        message: 'Failed to assign permission. It might already be assigned.',
        parsedCommand: parsed
      }
    }
  }

  private async handleListPermissions(): Promise<any> {
    try {
      const permissions = await databaseService.getAllPermissions()
      return {
        success: true,
        action: 'list_permissions',
        data: permissions,
        message: `Found ${permissions.length} permissions`,
        parsedCommand: { action: 'list_permissions', parameters: {} }
      }
    } catch (error) {
      console.error('Error listing permissions:', error)
      return {
        success: false,
        action: 'list_permissions',
        message: 'Failed to retrieve permissions.',
        parsedCommand: { action: 'list_permissions', parameters: {} }
      }
    }
  }

  private async handleListRoles(): Promise<any> {
    try {
      const roles = await databaseService.getAllRoles()
      return {
        success: true,
        action: 'list_roles',
        data: roles,
        message: `Found ${roles.length} roles`,
        parsedCommand: { action: 'list_roles', parameters: {} }
      }
    } catch (error) {
      console.error('Error listing roles:', error)
      return {
        success: false,
        action: 'list_roles',
        message: 'Failed to retrieve roles.',
        parsedCommand: { action: 'list_roles', parameters: {} }
      }
    }
  }
}

export const geminiService = new GeminiService() 