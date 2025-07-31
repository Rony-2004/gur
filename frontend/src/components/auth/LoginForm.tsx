'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockAPI } from '@/lib/mockData'
import { User } from '@/types'

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await mockAPI.login(email, password)
      onLogin(user)
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Login Card */}
      <div className={`relative z-10 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Card className="w-full max-w-md shadow-professional-lg border-0 bg-white/90 backdrop-blur-sm hover-lift">
          <CardHeader className="text-center pb-6 animate-fade-in">
            {/* Animated Logo */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 animate-scale-in hover-scale">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <CardTitle className="text-3xl font-bold gradient-text animate-fade-in" style={{ animationDelay: '0.2s' }}>
              RBAC Configuration Tool
            </CardTitle>
            <CardDescription className="text-gray-600 mt-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Sign in to manage roles and permissions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.8s' }}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 input-focus"
                  required
                />
              </div>
              
              <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '1s' }}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 input-focus"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 animate-error">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
                loading={isLoading}
                variant="default"
                size="xl"
                animate
                style={{ animationDelay: '1.2s' }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 animate-fade-in" style={{ animationDelay: '1.4s' }}>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Demo credentials
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium w-16">Email:</span>
                  <code className="bg-white px-2 py-1 rounded text-blue-600">admin@example.com</code>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-16">Password:</span>
                  <code className="bg-white px-2 py-1 rounded text-blue-600">admin123</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 