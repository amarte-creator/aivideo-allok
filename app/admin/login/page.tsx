'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SiteHeader } from '@/components/site-header'
import Image from 'next/image'
import { Eye, EyeOff, Lock, Mail, Shield, Zap, BarChart3, Users, Settings, FileVideo } from 'lucide-react'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Check credentials
    if (email === 'hi@allok.fun' && password === '5801100Tja') {
      // Store auth state in localStorage
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminEmail', email)
      
      // Redirect to admin dashboard
      setTimeout(() => {
        setIsLoading(false)
        window.location.href = '/admin/videos'
      }, 1000)
    } else {
      // Show error
      setTimeout(() => {
        setIsLoading(false)
        alert('Invalid credentials. Please try again.')
      }, 1000)
    }
  }

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      
      <section className="relative isolate overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-14 sm:py-20">
            <div className="mb-5 flex items-center gap-2">
              <Image src="/icons/skitbit-white.svg" alt="Allok logo" width={32} height={32} className="h-8 w-8" />
              <p className="text-sm uppercase tracking-[0.25em] text-lime-300/80">allok admin</p>
            </div>
            
            <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">WELCOME TO</span>
              <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">ALLOK ADMIN</span>
            </h1>
            
            <p className="mt-4 text-center text-base text-neutral-300 sm:text-lg max-w-2xl">
              Manage your website content, pricing, and settings from one central dashboard.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-4">
                <Shield className="text-lime-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
              <p className="text-neutral-300 text-sm">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hi@allok.fun"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-neutral-400 focus:border-lime-400 focus:ring-lime-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-neutral-400 focus:border-lime-400 focus:ring-lime-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-lime-400 text-black hover:bg-lime-300 font-medium py-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Zap size={20} />
                    <span>Sign In to Dashboard</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-neutral-400 mb-4">
                  Secure admin access with enterprise-grade authentication
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
                  <div className="flex items-center space-x-1">
                    <Shield size={14} />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock size={14} />
                    <span>2FA Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Dashboard Preview */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-white mb-8">Dashboard Preview</h3>
            
            {/* Mock Dashboard Interface */}
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="space-y-6">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">Video Management Dashboard</h4>
                    <p className="text-sm text-neutral-300">Monitor and manage your video approval workflow</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileVideo className="text-lime-400" size={20} />
                      <span className="text-sm text-neutral-300">Total Videos</span>
                    </div>
                    <div className="text-2xl font-bold text-white">24</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="text-lime-400" size={20} />
                      <span className="text-sm text-neutral-300">Active Clients</span>
                    </div>
                    <div className="text-2xl font-bold text-white">12</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="text-lime-400" size={20} />
                      <span className="text-sm text-neutral-300">Approval Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-white">94%</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="text-lime-400" size={20} />
                      <span className="text-sm text-neutral-300">Published</span>
                    </div>
                    <div className="text-2xl font-bold text-white">18</div>
                  </div>
                </div>

                {/* Recent Videos Table Preview */}
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h5 className="text-lg font-semibold text-white">Recent Videos</h5>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center">
                            <FileVideo className="text-lime-400" size={16} />
                          </div>
                          <div>
                            <div className="text-white font-medium">Brand Campaign Video</div>
                            <div className="text-sm text-neutral-400">Client: Acme Corp</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Published</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center">
                            <FileVideo className="text-lime-400" size={16} />
                          </div>
                          <div>
                            <div className="text-white font-medium">Product Demo</div>
                            <div className="text-sm text-neutral-400">Client: TechStart</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">In Review</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center">
                            <FileVideo className="text-lime-400" size={16} />
                          </div>
                          <div>
                            <div className="text-white font-medium">Social Media Ad</div>
                            <div className="text-sm text-neutral-400">Client: Fashion Brand</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Draft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-lime-400 text-black hover:bg-lime-300 rounded-full">
                    <FileVideo size={16} className="mr-2" />
                    Upload New Video
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                    <Users size={16} className="mr-2" />
                    Manage Clients
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Admin Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-4">
                <Zap className="text-lime-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Video Management</h3>
              <p className="text-sm text-neutral-300">
                Upload, organize, and track all your video content
              </p>
            </Card>

            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-4">
                <Shield className="text-lime-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Client Access</h3>
              <p className="text-sm text-neutral-300">
                Generate secure review links for client approval
              </p>
            </Card>

            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 mb-4">
                <BarChart3 className="text-lime-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
              <p className="text-sm text-neutral-300">
                Monitor approval rates and publishing status
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}