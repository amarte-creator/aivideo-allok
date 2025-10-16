export interface Video {
  id: string
  title: string
  description?: string
  client_id: string
  status: 'draft' | 'review' | 'approved' | 'published' | 'rejected'
  video_url: string
  thumbnail_url?: string
  duration?: number
  file_size?: number
  mime_type?: string
  feedback?: string
  approved_at?: string
  published_at?: string
  published_url?: string
  published_platform?: 'youtube' | 'tiktok' | 'instagram' | 'cloudflare' | 'direct'
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface VideoFeedback {
  id: string
  video_id: string
  client_id: string
  timestamp?: number
  comment: string
  created_at: string
}

export interface VideoVersion {
  id: string
  video_id: string
  version_number: number
  video_url: string
  changes_summary?: string
  created_at: string
}
