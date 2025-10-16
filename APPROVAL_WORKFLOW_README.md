# 🎬 Frictionless Video Approval Workflow

A complete video approval system that allows clients to review, provide feedback, and approve videos with one click, triggering automatic publishing to social platforms.

## ✨ Features

### 🎥 Client Review Experience
- **Video Preview**: High-quality video player with controls and fullscreen support
- **Timestamped Feedback**: Add comments at specific moments in the video
- **One-Click Approval**: Simple "✅ All OK" button to approve and publish
- **Status Tracking**: Real-time status updates (draft → review → approved → published)

### 🔧 Admin Dashboard
- **Video Management**: Upload, organize, and track all videos
- **Client Management**: Manage client access and video assignments
- **Analytics**: View approval rates, publishing status, and feedback
- **Bulk Operations**: Manage multiple videos efficiently

### 🚀 Auto-Publishing
- **Multi-Platform Support**: YouTube, TikTok, Instagram, Cloudflare Stream
- **Smart Scheduling**: Automatic publishing based on optimal times
- **Metadata Management**: Auto-generated titles, descriptions, and tags
- **Error Handling**: Robust error handling with retry mechanisms

### 📧 Notifications
- **Email Notifications**: Beautiful HTML emails for approval and publishing
- **Real-time Updates**: Instant notifications via email and dashboard
- **Custom Templates**: Branded email templates with your company styling

## 🏗️ Architecture

```
Frontend (Next.js + Shadcn/UI)
├── Video Review Page (/review/[id])
├── Admin Dashboard (/admin/videos)
├── Video Player Component
├── Feedback System
└── Approval Actions

Backend (Next.js API Routes)
├── Video Management API
├── Publishing API (YouTube, TikTok, etc.)
├── Notification System (Resend)
└── Database Operations

Database (Supabase)
├── Videos Table
├── Video Feedback Table
├── Video Versions Table
└── User Authentication
```

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend for email notifications
RESEND_API_KEY=your_resend_api_key

# YouTube API for auto-publishing
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REFRESH_TOKEN=your_youtube_refresh_token
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the migration:
```sql
-- Copy and run the contents of supabase/migrations/001_create_videos_table.sql
-- in your Supabase SQL editor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📱 Usage

### For Clients

1. **Receive Review Link**: Get a unique link like `yoursite.com/review/video-123`
2. **Watch Video**: Use the built-in player with full controls
3. **Leave Feedback**: Add timestamped comments (optional)
4. **Approve**: Click "✅ All OK" to approve and auto-publish

### For Admins

1. **Upload Videos**: Use the admin dashboard to upload new videos
2. **Assign Clients**: Set client IDs for each video
3. **Monitor Progress**: Track approval status and publishing progress
4. **Manage Feedback**: Review client comments and respond if needed

## 🔗 API Endpoints

### Video Management
- `GET /api/videos` - List all videos (with filtering)
- `POST /api/videos` - Create new video
- `GET /api/videos/[id]` - Get specific video
- `PUT /api/videos/[id]` - Update video
- `DELETE /api/videos/[id]` - Delete video

### Publishing & Notifications
- `POST /api/publish-video` - Trigger video publishing
- `POST /api/send-notification` - Send email notifications

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.ts`
- Modify email templates in `/app/api/send-notification/route.ts`
- Customize the video player styling in `/components/video-player.tsx`

### Publishing Platforms
- Add new platforms in `/app/api/publish-video/route.ts`
- Implement platform-specific logic for each service
- Update the UI to show platform options

### Email Templates
- Modify notification templates in `/app/api/send-notification/route.ts`
- Add your company branding and styling
- Customize email content for different notification types

## 🔧 Configuration

### YouTube API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Set up refresh token flow

### Resend Email Setup
1. Sign up at [Resend](https://resend.com/)
2. Verify your domain
3. Get your API key
4. Update environment variables

### Supabase Setup
1. Create project at [Supabase](https://supabase.com/)
2. Run database migrations
3. Set up Row Level Security policies
4. Configure authentication (optional)

## 📊 Database Schema

### Videos Table
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID,
  status TEXT CHECK (status IN ('draft', 'review', 'approved', 'published', 'rejected')),
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER,
  feedback TEXT,
  approved_at TIMESTAMP,
  published_at TIMESTAMP,
  published_url TEXT,
  published_platform TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Video Feedback Table
```sql
CREATE TABLE video_feedback (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  client_id UUID,
  timestamp DECIMAL(10,3),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Good for full-stack apps
- **DigitalOcean**: VPS deployment

## 🔒 Security

- **Row Level Security**: Supabase RLS policies protect client data
- **API Authentication**: Secure API routes with proper validation
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Proper CORS settings for production

## 🐛 Troubleshooting

### Common Issues

1. **Video not loading**: Check video URL and CORS settings
2. **Email not sending**: Verify Resend API key and domain
3. **YouTube upload failing**: Check OAuth credentials and API quotas
4. **Database connection issues**: Verify Supabase credentials

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## 📈 Performance Optimization

- **Video Streaming**: Use CDN for video delivery
- **Image Optimization**: Optimize thumbnails with Next.js Image
- **Database Indexing**: Proper indexes on frequently queried columns
- **Caching**: Implement Redis for session and data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies.**
