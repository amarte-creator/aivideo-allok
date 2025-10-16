'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { VideoPlayer } from '@/components/video-player'
import { FeedbackForm } from '@/components/feedback-form'
import { ApprovalActions } from '@/components/approval-actions'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Video, VideoFeedback } from '@/lib/types'
import { Clock, User, Calendar, FileVideo } from 'lucide-react'

export default function VideoReviewPage() {
  const params = useParams()
  const videoId = params.id as string
  
  const [video, setVideo] = useState<Video | null>(null)
  const [feedback, setFeedback] = useState<VideoFeedback[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (videoId) {
      fetchVideo()
      fetchFeedback()
    }
  }, [videoId])

  const fetchVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()

      if (error) throw error
      setVideo(data)
    } catch (error) {
      console.error('Error fetching video:', error)
      setError('Video not found or access denied')
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('video_feedback')
        .select('*')
        .eq('video_id', videoId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setFeedback(data || [])
    } catch (error) {
      console.error('Error fetching feedback:', error)
    }
  }

  const handleFeedbackSubmit = async (newFeedback: { comment: string; timestamp?: number }) => {
    try {
      const { data, error } = await supabase
        .from('video_feedback')
        .insert({
          video_id: videoId,
          comment: newFeedback.comment,
          timestamp: newFeedback.timestamp
        })
        .select()
        .single()

      if (error) throw error
      setFeedback([...feedback, data])
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  }

  const handleApprove = async () => {
    try {
      // Update video status to approved
      const { error: updateError } = await supabase
        .from('videos')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', videoId)

      if (updateError) throw updateError

      // Trigger auto-publishing
      const response = await fetch('/api/publish-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      })

      if (!response.ok) {
        throw new Error('Failed to trigger publishing')
      }

      // Refresh video data
      fetchVideo()
    } catch (error) {
      console.error('Error approving video:', error)
      throw error
    }
  }

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ status: 'rejected' })
        .eq('id', videoId)

      if (error) throw error
      fetchVideo()
    } catch (error) {
      console.error('Error rejecting video:', error)
      throw error
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500'
      case 'review': return 'bg-blue-500'
      case 'approved': return 'bg-green-500'
      case 'published': return 'bg-purple-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Not Found</h1>
          <p className="text-gray-600">{error || 'The video you\'re looking for doesn\'t exist or you don\'t have access to it.'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>
              <Badge className={`${getStatusColor(video.status)} text-white`}>
                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
              </Badge>
            </div>
            
            {video.description && (
              <p className="text-gray-600 mb-4">{video.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FileVideo size={16} />
                <span>{video.duration ? formatDuration(video.duration) : 'Unknown duration'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Created {formatDate(video.created_at)}</span>
              </div>
              {video.approved_at && (
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>Approved {formatDate(video.approved_at)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer
                src={video.video_url}
                poster={video.thumbnail_url}
                onTimeUpdate={setCurrentTime}
                className="aspect-video"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Feedback Form */}
              <FeedbackForm
                onSubmit={handleFeedbackSubmit}
                currentTime={currentTime}
                disabled={video.status === 'approved' || video.status === 'published'}
              />

              {/* Approval Actions */}
              <ApprovalActions
                onApprove={handleApprove}
                onReject={handleReject}
                status={video.status}
                disabled={video.status === 'approved' || video.status === 'published'}
              />

              {/* Existing Feedback */}
              {feedback.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Feedback History</h3>
                  <div className="space-y-3">
                    {feedback.map((item) => (
                      <div key={item.id} className="border-l-2 border-purple-200 pl-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {item.timestamp ? formatDuration(item.timestamp) : 'General'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Published Info */}
              {video.status === 'published' && video.published_url && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Published Successfully</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Your video has been published to {video.published_platform}.
                  </p>
                  <a
                    href={video.published_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View Published Video →
                  </a>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
