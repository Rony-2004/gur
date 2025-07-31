import { execSync } from 'child_process'
import { databaseService } from '../src/services/databaseService'

async function setup() {
  console.log('🚀 Setting up RBAC Configuration Tool...')
  
  try {
    // Generate Prisma client
    console.log('📦 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    // Run database migrations
    console.log('🗄️ Running database migrations...')
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })
    
    // Initialize database with default data
    console.log('🔧 Initializing database with default data...')
    await databaseService.initializeDatabase()
    
    console.log('✅ Setup completed successfully!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Copy env.example to .env and update DATABASE_URL')
    console.log('2. Run: npm run dev')
    console.log('3. Access the application at http://localhost:3000')
    console.log('')
    console.log('🔐 Default credentials:')
    console.log('Email: admin@example.com')
    console.log('Password: admin123')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setup() 