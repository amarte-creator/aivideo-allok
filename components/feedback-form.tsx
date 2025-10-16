'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { MessageSquare, Send, Clock } from 'lucide-react'

interface FeedbackFormProps {
  onSubmit: (feedback: { comment: string; timestamp?: number }) => void
  currentTime?: number
  disabled?: boolean
}

export function FeedbackForm({ onSubmit, currentTime = 0, disabled = false }: FeedbackFormProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        comment: comment.trim(),
        timestamp: currentTime > 0 ? currentTime : undefined
      })
      setComment('')
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MessageSquare size={20} className="text-purple-600" />
          <h3 className="font-semibold">Leave Feedback</h3>
          {currentTime > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock size={14} />
              <span>{formatTime(currentTime)}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about the video... (optional)"
            className="min-h-[100px] resize-none"
            disabled={disabled || isSubmitting}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!comment.trim() || disabled || isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send size={16} />
                  <span>Add Feedback</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
