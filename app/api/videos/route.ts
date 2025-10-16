import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ videos: data })

  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      client_id,
      video_url,
      thumbnail_url,
      duration,
      file_size,
      mime_type,
      metadata = {}
    } = body

    if (!title || !video_url || !client_id) {
      return NextResponse.json(
        { error: 'Title, video_url, and client_id are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert({
        title,
        description,
        client_id,
        video_url,
        thumbnail_url,
        duration,
        file_size,
        mime_type,
        metadata,
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ video: data }, { status: 201 })

  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}
