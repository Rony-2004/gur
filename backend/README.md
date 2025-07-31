# RBAC Configuration Tool - Backend

A robust backend API for the RBAC (Role-Based Access Control) Configuration Tool built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Role Management** - CRUD operations for roles
- **Permission Management** - CRUD operations for permissions
- **Role-Permission Assignment** - Connect roles to permissions
- **Natural Language Processing** - AI-powered command processing
- **Database Integration** - PostgreSQL with Prisma ORM
- **Type Safety** - Full TypeScript support
- **Security** - Helmet.js security headers, CORS protection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet.js, CORS

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** on your system
2. **Create a database**:
   ```sql
   CREATE DATABASE rbac_tool;
   ```

### Option 2: Supabase (Recommended)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your database connection string from Settings > Database

### Option 3: Railway, PlanetScale, or other cloud providers

Use any PostgreSQL-compatible database service.

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```

4. **Update the `.env` file** with your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rbac_tool?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run the setup script**:
   ```bash
   npm run setup
   ```

   This will:
   - Generate Prisma client
   - Run database migrations
   - Seed the database with default data

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Management

### Available Scripts

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database (⚠️ Destructive)
npm run db:reset

# Open Prisma Studio (Database GUI)
npm run db:studio

# Seed database with default data
npm run db:seed
```

### Database Schema

The application uses the following Prisma schema:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  roleId    String?
  role      Role?    @relation(fields: [roleId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique
  description String?
  users       User[]
  permissions RolePermission[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model Permission {
  id          String           @id @default(cuid())
  name        String           @unique
  description String?
  roles       RolePermission[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model RolePermission {
  id           String     @id @default(cuid())
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  createdAt    DateTime   @default(now())

  @@unique([roleId, permissionId])
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Permissions
- `GET /api/permissions` - Get all permissions
- `GET /api/permissions/:id` - Get permission by ID
- `POST /api/permissions` - Create new permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### RBAC Management
- `GET /api/rbac/roles/:roleId/permissions` - Get permissions for a role
- `GET /api/rbac/permissions/:permissionId/roles` - Get roles for a permission
- `POST /api/rbac/assign` - Assign permission to role
- `DELETE /api/rbac/roles/:roleId/permissions/:permissionId` - Remove permission from role
- `POST /api/rbac/nlp` - Natural language processing

### Health Check
- `GET /health` - API health status

## 🤖 Natural Language Commands

The NLP endpoint supports the following commands:

- `"Create permission 'edit_posts' with description 'Edit blog posts'"`
- `"Create role 'Editor' with description 'Content editor'"`
- `"Assign permission 'edit_posts' to role 'Editor'"`
- `"List permissions"`
- `"List roles"`

## 🔑 Default Credentials

After running the setup script, you can login with:

- **Email**: `admin@example.com`
- **Password**: `admin123`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configurable cross-origin requests
- **Security Headers**: Helmet.js protection
- **Input Validation**: Request validation and sanitization
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 🚀 Deployment

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Railway
1. Connect your repository to Railway
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, please open an issue in the repository or contact the development team. 