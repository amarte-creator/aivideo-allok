'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/site-header'
import Image from 'next/image'
import { 
  Play, 
  CheckCircle, 
  MessageSquare, 
  Upload, 
  Send,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Upload & Preview",
      description: "Upload your AI-generated video and preview it in a branded interface",
      icon: <Upload size={24} />,
      color: "text-lime-400"
    },
    {
      title: "Client Review",
      description: "Share a secure link with your client to review the video",
      icon: <Play size={24} />,
      color: "text-lime-400"
    },
    {
      title: "Feedback System",
      description: "Clients can leave timestamped comments and feedback",
      icon: <MessageSquare size={24} />,
      color: "text-lime-400"
    },
    {
      title: "One-Click Approval",
      description: "Clients approve with a single '✅ All OK' button",
      icon: <CheckCircle size={24} />,
      color: "text-lime-400"
    },
    {
      title: "Auto-Publish",
      description: "Automatically publishes to YouTube, TikTok, or your preferred platform",
      icon: <Send size={24} />,
      color: "text-lime-400"
    }
  ]

  const features = [
    {
      title: "🎬 Video Preview",
      description: "High-quality video player with full controls and timestamped feedback",
      details: ["Custom branded player", "Fullscreen support", "Seek controls", "Volume control"]
    },
    {
      title: "💬 Smart Feedback",
      description: "Timestamped comments and feedback system",
      details: ["Add comments at specific moments", "Optional feedback", "Comment history", "Real-time updates"]
    },
    {
      title: "⚡ One-Click Approval",
      description: "Simple approval process with instant publishing",
      details: ["Single approval button", "Automatic status updates", "Email notifications", "Progress tracking"]
    },
    {
      title: "🚀 Auto-Publishing",
      description: "Automatic publishing to multiple platforms",
      details: ["YouTube integration", "TikTok support", "Instagram ready", "Custom hosting"]
    },
    {
      title: "📧 Smart Notifications",
      description: "Beautiful email notifications for every step",
      details: ["Branded email templates", "Approval notifications", "Publishing confirmations", "Status updates"]
    },
    {
      title: "📊 Admin Dashboard",
      description: "Complete video management and analytics",
      details: ["Upload management", "Client tracking", "Status monitoring", "Bulk operations"]
    }
  ]

  return (
    <main className="min-h-[100dvh] text-white">
      <SiteHeader />
      <section className="relative isolate overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-14 sm:py-20">
            <div className="mb-5 flex items-center gap-2">
              <Image src="/icons/skitbit-white.svg" alt="Allok logo" width={32} height={32} className="h-8 w-8" />
              <p className="text-sm uppercase tracking-[0.25em] text-lime-300/80">allok</p>
            </div>
            <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">FRICTIONLESS</span>
              <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">APPROVAL WORKFLOW</span>
            </h1>
            <p className="mt-4 text-center text-base text-neutral-300 sm:text-lg max-w-3xl">
              Streamline your video approval process with AI-generated content. 
              Clients review, approve with one click, and videos publish automatically.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300">
                <a href="/admin/videos" target="_blank" rel="noopener noreferrer">
                  Get Started
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <a href="#workflow">See How It Works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <div id="workflow" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Workflow Steps */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card 
                    className={`liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center transition-all duration-300 cursor-pointer hover:shadow-lg ${
                      currentStep === index ? 'ring-2 ring-lime-400' : ''
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`mx-auto mb-4 ${step.color}`}>
                      {step.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-white">{step.title}</h3>
                    <p className="text-sm text-neutral-300">{step.description}</p>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="text-neutral-400" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Step Details */}
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl mt-8 p-8">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/10 border border-white/20`}>
                  <div className={steps[currentStep].color}>
                    {steps[currentStep].icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{steps[currentStep].title}</h3>
                <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
                  {steps[currentStep].description}
                </p>
              </div>
            </Card>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-neutral-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-neutral-400">
                        <CheckCircle size={16} className="text-lime-400 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-16">
            <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Built With Modern Tech
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Next.js', description: 'React Framework' },
                { name: 'Supabase', description: 'Database & Auth' },
                { name: 'Shadcn/UI', description: 'UI Components' },
                { name: 'Resend', description: 'Email Service' },
                { name: 'YouTube API', description: 'Auto Publishing' },
                { name: 'Tailwind CSS', description: 'Styling' },
                { name: 'TypeScript', description: 'Type Safety' },
                { name: 'Vercel', description: 'Deployment' }
              ].map((tech, index) => (
                <Card key={index} className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-lime-400 mb-1">{tech.name}</h4>
                  <p className="text-sm text-neutral-400">{tech.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl p-12">
              <div className="mb-6 flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-lime-400 text-lime-400" />
                ))}
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Streamline Your Workflow?</h2>
              <p className="text-xl mb-8 text-neutral-300">
                Get started with the frictionless approval workflow today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full bg-lime-400 text-black hover:bg-lime-300 font-medium px-8 py-3"
                  onClick={() => window.open('/admin/videos', '_blank')}
                >
                  View Admin Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent px-8 py-3"
                  onClick={() => window.open('/admin/login', '_blank')}
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}
