'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PermissionList } from '@/components/permissions/PermissionList'
import { RoleList } from '@/components/roles/RoleList'
import { RolePermissionManager } from '@/components/rbac/RolePermissionManager'
import { NaturalLanguageInput } from '@/components/nlp/NaturalLanguageInput'
import { User, Shield, Users, Link, Sparkles, LogOut } from 'lucide-react'
import { mockAPI } from '@/lib/mockData'

interface DashboardProps {
  user: User
  onLogout: () => void
}

type TabType = 'permissions' | 'roles' | 'assignments' | 'nlp'

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('permissions')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    try {
      await mockAPI.logout()
      onLogout()
    } catch (error) {
      console.error('Error logging out:', error)
      onLogout()
    }
  }

  const tabs = [
    { id: 'permissions' as TabType, label: 'Permissions', icon: Shield },
    { id: 'roles' as TabType, label: 'Roles', icon: Users },
    { id: 'assignments' as TabType, label: 'Role-Permission Assignment', icon: Link },
    { id: 'nlp' as TabType, label: 'Natural Language', icon: Sparkles },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-professional border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center animate-slide-in-left">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 hover-scale">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                RBAC Configuration Tool
              </h1>
            </div>
            <div className="flex items-center space-x-4 animate-slide-in-right">
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl hover-lift">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 nav-item-animate animate-fade-in ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-professional-lg border border-gray-200/50 p-8 animate-scale-in">
          <div className="animate-fade-in">
            {activeTab === 'permissions' && <PermissionList />}
            {activeTab === 'roles' && <RoleList />}
            {activeTab === 'assignments' && <RolePermissionManager />}
            {activeTab === 'nlp' && <NaturalLanguageInput />}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-professional-lg hover-lift cursor-pointer">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
} 