# 🛡️ RBAC Configuration Tool

A full-stack Role-Based Access Control (RBAC) configuration tool built with Next.js, Express.js, TypeScript, and Google Gemini AI for natural language processing.

## ✨ Features

### 🔐 Core RBAC Features
- **User Authentication** - Secure login system with JWT tokens
- **Permission Management** - Create, read, update, delete permissions
- **Role Management** - Create, read, update, delete roles
- **Role-Permission Assignment** - Connect roles with permissions
- **User-Role Assignment** - Assign roles to users

### 🤖 AI-Powered Features
- **Natural Language Processing** - Use plain English to manage RBAC
- **Google Gemini AI Integration** - Intelligent command understanding
- **Smart Command Parsing** - Automatic conversion of natural language to RBAC operations

### 🎨 Modern UI/UX
- **Professional Animations** - Smooth transitions and micro-interactions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Glass Morphism** - Modern glass-like UI elements
- **Interactive Components** - Hover effects, loading states, and feedback
- **Color-Coded Actions** - Green for success, red for delete, purple for AI

## 🏗️ Architecture

```
gur/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/       # Utilities and types
│   │   └── types/     # TypeScript interfaces
│   └── package.json
├── backend/           # Express.js + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── types/     # TypeScript interfaces
│   │   └── lib/       # Database and utilities
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini AI API key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd rbac-configuration-tool
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/rbac_tool?schema=public"

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here
```

Initialize database:
```bash
npm run db:setup
npm run db:seed
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Default login: `admin@example.com` / `admin123`

## 🤖 AI Natural Language Commands

The AI-powered interface understands natural language commands:

### Create Permissions
- "Create a permission called publish content"
- "Add permission for editing posts"
- "Create permission 'delete users' with description 'Remove user accounts'"

### Create Roles
- "Create role editor"
- "Add admin role"
- "Create role moderator with description Content moderation"

### Assign Permissions
- "Give editor permission to delete posts"
- "Assign publish content to admin role"
- "Let moderators edit comments"

### List Information
- "Show all permissions"
- "List roles"
- "Display current permissions"

## 🛠️ Development

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:setup     # Initialize database
npm run db:seed      # Seed with sample data
npm run db:reset     # Reset database
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 Project Structure

### Frontend (`/frontend`)
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn-like UI** components
- **Lucide React** icons
- **Professional animations** and micro-interactions

### Backend (`/backend`)
- **Express.js** REST API
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT** authentication
- **Google Gemini AI** integration
- **Helmet** security middleware

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Permissions
- `GET /api/permissions` - List all permissions
- `POST /api/permissions` - Create permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

### Roles
- `GET /api/roles` - List all roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### RBAC Management
- `GET /api/rbac/assignments` - Get role-permission assignments
- `POST /api/rbac/assign` - Assign permission to role
- `DELETE /api/rbac/assign` - Remove permission from role
- `POST /api/rbac/nlp` - Natural language processing

## 🎨 UI Components

### Core Components
- **Button** - Multiple variants (primary, success, danger, warning, info, purple)
- **Input** - Focus effects and validation
- **Card** - Glass morphism design
- **Dialog** - Modal components
- **Loading** - Skeleton and spinner components

### Animations
- **Fade In/Out** - Smooth transitions
- **Slide In** - Directional animations
- **Scale** - Hover and click effects
- **Pulse** - Loading and success states
- **Shimmer** - Loading effects
- **Bounce** - Interactive feedback

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs encryption
- **CORS Protection** - Cross-origin security
- **Helmet Middleware** - Security headers
- **Input Validation** - Request sanitization
- **Rate Limiting** - API protection

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Add environment variables

### Railway/Heroku (Backend)
1. Connect GitHub repository
2. Set build command: `cd backend && npm run build`
3. Set start command: `cd backend && npm start`
4. Add environment variables

### Database
- **Supabase** (recommended)
- **Railway PostgreSQL**
- **Heroku Postgres**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Vercel** for deployment platform
- **Google** for Gemini AI
- **Prisma** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ for secure and scalable RBAC management** 