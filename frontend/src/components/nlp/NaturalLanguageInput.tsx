'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Bot, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export function NaturalLanguageInput() {
  const [command, setCommand] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: unknown
    action?: string
  } | null>(null)

  const processCommand = async () => {
    if (!command.trim()) return

    setIsProcessing(true)
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/rbac/nlp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: data.success,
          message: data.message,
          data: data.data,
          action: data.action
        })
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to process command'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      processCommand()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
             {/* Header */}
       <div className="flex items-center space-x-3">
         <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
           <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
         </div>
         <div>
           <h2 className="text-xl sm:text-2xl font-bold text-gray-900">AI-Powered Commands</h2>
           <p className="text-sm sm:text-base text-gray-600">Use natural language to manage your RBAC system</p>
         </div>
       </div>

      {/* Main Input Card */}
      <Card className="shadow-professional-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Sparkles className="w-5 h-5" />
            Natural Language Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="nlp-input" className="block text-sm font-semibold text-gray-700 mb-3">
              Type your command in plain English
            </label>
                         <div className="flex flex-col sm:flex-row gap-3">
               <Input
                 id="nlp-input"
                 value={command}
                 onChange={(e) => setCommand(e.target.value)}
                 placeholder="e.g., Create a permission called publish content"
                 onKeyPress={handleKeyPress}
                 className="flex-1 h-12 text-base input-focus"
                 disabled={isProcessing}
               />
               <Button 
                 onClick={processCommand} 
                 disabled={isProcessing || !command.trim()}
                 loading={isProcessing}
                 variant="purple"
                 size="lg"
                 className="px-4 sm:px-8"
               >
                 {isProcessing ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     <span className="hidden sm:inline">Processing...</span>
                     <span className="sm:hidden">Processing</span>
                   </>
                 ) : (
                   <>
                     <Sparkles className="w-4 h-4 mr-2" />
                     Execute
                   </>
                 )}
               </Button>
             </div>
          </div>
          
          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-xl border-2 transition-all duration-300 animate-fade-in ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium mb-1">
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                                     <p className="text-sm whitespace-pre-wrap">{result.message}</p>
                   {(() => {
                     if (result.data && typeof result.data === 'object') {
                       return (
                         <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                           <pre className="whitespace-pre-wrap">{JSON.stringify(result.data as Record<string, unknown>, null, 2)}</pre>
                         </div>
                       )
                     }
                     return null
                   })()}
                </div>
              </div>
            </div>
          )}
          
                     {/* Example Commands */}
           <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-100">
             <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
               <Sparkles className="w-4 h-4 mr-2" />
               Example Commands
             </h3>
             <div className="grid gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-700">Create Permissions:</p>
                                 <div className="space-y-1">
                   <p className="text-sm text-gray-700">• &ldquo;Create a permission called publish content&rdquo;</p>
                   <p className="text-sm text-gray-700">• &ldquo;Add permission for editing posts&rdquo;</p>
                   <p className="text-sm text-gray-700">• &ldquo;Create permission &apos;delete users&apos; with description &apos;Remove user accounts&apos;&rdquo;</p>
                 </div>
              </div>
                             <div className="space-y-2">
                 <p className="text-sm font-medium text-purple-700">Create Roles:</p>
                 <div className="space-y-1">
                   <p className="text-sm text-gray-700">• Create role editor</p>
                   <p className="text-sm text-gray-700">• Add admin role</p>
                   <p className="text-sm text-gray-700">• Create role moderator with description Content moderation</p>
                 </div>
               </div>
               <div className="space-y-2">
                 <p className="text-sm font-medium text-purple-700">Assign Permissions:</p>
                 <div className="space-y-1">
                   <p className="text-sm text-gray-700">• Give editor permission to delete posts</p>
                   <p className="text-sm text-gray-700">• Assign publish content to admin role</p>
                   <p className="text-sm text-gray-700">• Let moderators edit comments</p>
                 </div>
               </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-700">List Information:</p>
                                 <div className="space-y-1">
                   <p className="text-sm text-gray-700">• Show all permissions</p>
                   <p className="text-sm text-gray-700">• List roles</p>
                   <p className="text-sm text-gray-700">• Display current permissions</p>
                 </div>
              </div>
            </div>
          </div>

          {/* AI Features Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Bot className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Powered by Google Gemini AI
                </p>
                <p className="text-sm text-blue-700">
                  The AI understands natural language and automatically converts your commands into RBAC operations. 
                  No need to remember specific syntax - just describe what you want to do!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 