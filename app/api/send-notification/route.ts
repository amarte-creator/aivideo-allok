import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { type, videoId, videoTitle, publishedUrl, platform, clientId } = await request.json()

    if (!type || !videoId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let emailData

    switch (type) {
      case 'video_published':
        emailData = {
          subject: '🎉 Your Video Has Been Published!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Video Published!</h1>
              </div>
              
              <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Great news!</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Your video "<strong>${videoTitle}</strong>" has been successfully published to <strong>${platform}</strong>!
                </p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
                  <p style="margin: 0; color: #4b5563;">
                    <strong>Video Title:</strong> ${videoTitle}<br>
                    <strong>Platform:</strong> ${platform}<br>
                    <strong>Published:</strong> ${new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${publishedUrl}" 
                     style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                    View Your Video
                  </a>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                  <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
                    This email was sent because your video was approved and published automatically.<br>
                    If you have any questions, please contact our support team.
                  </p>
                </div>
              </div>
            </div>
          `
        }
        break

      case 'video_approved':
        emailData = {
          subject: '✅ Video Approved - Publishing Soon',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">✅ Video Approved!</h1>
              </div>
              
              <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Thank you for your approval!</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Your video "<strong>${videoTitle}</strong>" has been approved and is now being published automatically.
                </p>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <p style="margin: 0; color: #166534;">
                    <strong>Status:</strong> Publishing in progress...<br>
                    <strong>Expected completion:</strong> Within 5-10 minutes
                  </p>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  You'll receive another email once the video is live and ready to view.
                </p>
              </div>
            </div>
          `
        }
        break

      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
    }

    // Get client email from Supabase
    const { data: client } = await supabaseAdmin
      .from('auth.users')
      .select('email')
      .eq('id', clientId)
      .single()

    if (!client?.email) {
      console.error('Client email not found for ID:', clientId)
      return NextResponse.json({ error: 'Client email not found' }, { status: 404 })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Allok Agency <noreply@allok-agency.com>',
      to: [client.email],
      subject: emailData.subject,
      html: emailData.html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, emailId: data?.id })

  } catch (error) {
    console.error('Notification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
