'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Play, 
  Settings, 
  Eye, 
  Upload,
  Zap
} from 'lucide-react'

export function WorkflowNav() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="text-purple-600" size={24} />
              <span className="font-bold text-lg">Allok Agency</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/demo" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600">
                <Play size={16} />
                <span>Demo</span>
              </Link>
              
              <Link href="/admin/videos" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600">
                <Settings size={16} />
                <span>Admin</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Approval Workflow
            </Badge>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/login">
                  <Eye size={16} className="mr-1" />
                  Login
                </Link>
              </Button>
              
              <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/admin/videos">
                  <Upload size={16} className="mr-1" />
                  Upload
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
