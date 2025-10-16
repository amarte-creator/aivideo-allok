-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'rejected')),
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  mime_type TEXT,
  feedback TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  published_url TEXT,
  published_platform TEXT CHECK (published_platform IN ('youtube', 'tiktok', 'instagram', 'cloudflare', 'direct')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table for timestamped comments
CREATE TABLE IF NOT EXISTS video_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id),
  timestamp DECIMAL(10,3), -- seconds into video
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video versions table for revision tracking
CREATE TABLE IF NOT EXISTS video_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  video_url TEXT NOT NULL,
  changes_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for videos
CREATE POLICY "Users can view their own videos" ON videos
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can update their own videos" ON videos
  FOR UPDATE USING (auth.uid() = client_id);

-- Create policies for video_feedback
CREATE POLICY "Users can view feedback for their videos" ON video_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM videos 
      WHERE videos.id = video_feedback.video_id 
      AND videos.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can add feedback to their videos" ON video_feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos 
      WHERE videos.id = video_feedback.video_id 
      AND videos.client_id = auth.uid()
    )
  );

-- Create policies for video_versions
CREATE POLICY "Users can view versions of their videos" ON video_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM videos 
      WHERE videos.id = video_versions.video_id 
      AND videos.client_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_client_id ON videos(client_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at);
CREATE INDEX IF NOT EXISTS idx_video_feedback_video_id ON video_feedback(video_id);
CREATE INDEX IF NOT EXISTS idx_video_versions_video_id ON video_versions(video_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for videos table
CREATE TRIGGER update_videos_updated_at 
  BEFORE UPDATE ON videos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
