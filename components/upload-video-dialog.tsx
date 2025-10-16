'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, X, Check } from 'lucide-react'

interface UploadVideoDialogProps {
  onVideoUploaded?: (video: any) => void
}

export function UploadVideoDialog({ onVideoUploaded }: UploadVideoDialogProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    video_url: '',
    thumbnail_url: ''
  })
  const [dragActive, setDragActive] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.video_url || !formData.client_id) {
      alert('Please fill in all required fields')
      return
    }

    setUploading(true)
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create video')
      }

      const { video } = await response.json()
      onVideoUploaded?.(video)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        client_id: '',
        video_url: '',
        thumbnail_url: ''
      })
      setOpen(false)
      
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Failed to upload video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      // In a real implementation, you would upload to your storage service
      // For now, we'll simulate the upload
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval)
            setUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // Simulate getting a video URL
      setTimeout(() => {
        const mockVideoUrl = URL.createObjectURL(file)
        setFormData(prev => ({ ...prev, video_url: mockVideoUrl }))
        clearInterval(uploadInterval)
        setUploadProgress(100)
        setUploading(false)
      }, 2000)

    } catch (error) {
      console.error('Error uploading file:', error)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        handleFileUpload(file)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Upload size={20} className="mr-2" />
          Upload Video
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>Video File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                  </div>
                </div>
              ) : formData.video_url ? (
                <div className="space-y-2">
                  <Check className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="text-sm text-green-600">Video uploaded successfully!</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                  >
                    <X size={16} className="mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Drag and drop your video file here, or{' '}
                      <label className="text-purple-600 cursor-pointer hover:underline">
                        browse files
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                          }}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports MP4, MOV, AVI, and other video formats
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client_id">Client ID *</Label>
              <Input
                id="client_id"
                value={formData.client_id}
                onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                placeholder="Enter client ID"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter video description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL *</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="Enter video URL (if not uploading file)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
              placeholder="Enter thumbnail URL (optional)"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || !formData.title || !formData.video_url || !formData.client_id}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {uploading ? 'Uploading...' : 'Create Video'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
