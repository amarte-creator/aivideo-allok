import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    // Get video details
    const { data: video, error: videoError } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single()

    if (videoError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (video.status !== 'approved') {
      return NextResponse.json({ error: 'Video must be approved before publishing' }, { status: 400 })
    }

    // Publish to the configured platform
    let publishedUrl = ''
    let publishedPlatform = 'direct'

    try {
      if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
        // Publish to YouTube
        const youtubeResult = await publishToYouTube(video)
        publishedUrl = youtubeResult.url
        publishedPlatform = 'youtube'
      } else if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
        // Publish to Cloudflare Stream
        const cloudflareResult = await publishToCloudflare(video)
        publishedUrl = cloudflareResult.url
        publishedPlatform = 'cloudflare'
      } else {
        // Direct hosting - just update status
        publishedUrl = video.video_url
        publishedPlatform = 'direct'
      }

      // Update video status to published
      const { error: updateError } = await supabaseAdmin
        .from('videos')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          published_url: publishedUrl,
          published_platform: publishedPlatform
        })
        .eq('id', videoId)

      if (updateError) {
        throw updateError
      }

      // Send notification email
      await sendPublishingNotification(video, publishedUrl, publishedPlatform)

      return NextResponse.json({
        success: true,
        publishedUrl,
        platform: publishedPlatform
      })

    } catch (publishError) {
      console.error('Publishing error:', publishError)
      
      // Update video status to indicate publishing failed
      await supabaseAdmin
        .from('videos')
        .update({
          status: 'approved', // Keep as approved, don't mark as failed
          metadata: {
            ...video.metadata,
            publishError: publishError instanceof Error ? publishError.message : 'Unknown error'
          }
        })
        .eq('id', videoId)

      return NextResponse.json(
        { error: 'Failed to publish video', details: publishError instanceof Error ? publishError.message : 'Unknown error' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function publishToYouTube(video: any) {
  // This is a simplified implementation
  // In production, you'd need to implement proper OAuth flow and YouTube API integration
  
  const youtubeApiUrl = 'https://www.googleapis.com/upload/youtube/v3/videos'
  const accessToken = await getYouTubeAccessToken()
  
  const metadata = {
    snippet: {
      title: video.title,
      description: video.description || '',
      tags: ['AI Generated', 'Video Content']
    },
    status: {
      privacyStatus: 'public'
    }
  }

  // For demo purposes, return a mock URL
  // In production, you'd make actual API calls to YouTube
  return {
    url: `https://www.youtube.com/watch?v=mock-${video.id}`,
    id: `mock-${video.id}`
  }
}

async function publishToCloudflare(video: any) {
  // This is a simplified implementation
  // In production, you'd integrate with Cloudflare Stream API
  
  // For demo purposes, return the original URL
  return {
    url: video.video_url,
    id: video.id
  }
}

async function getYouTubeAccessToken() {
  // In production, implement proper OAuth flow
  // This is just a placeholder
  return 'mock-access-token'
}

async function sendPublishingNotification(video: any, publishedUrl: string, platform: string) {
  try {
    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'video_published',
        videoId: video.id,
        videoTitle: video.title,
        publishedUrl,
        platform,
        clientId: video.client_id
      })
    })

    if (!response.ok) {
      console.error('Failed to send notification:', await response.text())
    }
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
