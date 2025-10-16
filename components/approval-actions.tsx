'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ApprovalActionsProps {
  onApprove: () => Promise<void>
  onReject: () => Promise<void>
  status: 'draft' | 'review' | 'approved' | 'published' | 'rejected'
  disabled?: boolean
}

export function ApprovalActions({ onApprove, onReject, status, disabled = false }: ApprovalActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = async () => {
    setIsProcessing(true)
    setAction('approve')
    try {
      await onApprove()
    } catch (error) {
      console.error('Error approving video:', error)
    } finally {
      setIsProcessing(false)
      setAction(null)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    setAction('reject')
    try {
      await onReject()
    } catch (error) {
      console.error('Error rejecting video:', error)
    } finally {
      setIsProcessing(false)
      setAction(null)
    }
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle size={20} className="text-green-600" />,
          text: 'Approved',
          description: 'This video has been approved and will be published automatically.',
          color: 'text-green-600'
        }
      case 'published':
        return {
          icon: <CheckCircle size={20} className="text-blue-600" />,
          text: 'Published',
          description: 'This video has been published successfully.',
          color: 'text-blue-600'
        }
      case 'rejected':
        return {
          icon: <XCircle size={20} className="text-red-600" />,
          text: 'Rejected',
          description: 'This video has been rejected. Please review and resubmit.',
          color: 'text-red-600'
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()

  if (statusInfo) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div>
            <h3 className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.text}
            </h3>
            <p className="text-sm text-gray-600">
              {statusInfo.description}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center">
          <AlertCircle size={24} className="mx-auto text-purple-600 mb-2" />
          <h3 className="font-semibold text-lg">Ready to Approve?</h3>
          <p className="text-sm text-gray-600">
            Review the video above and click "All OK" to approve and publish automatically.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={handleApprove}
            disabled={disabled || isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing && action === 'approve' ? (
              <div className="flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Approving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>✅ All OK</span>
              </div>
            )}
          </Button>
          
          <Button
            onClick={handleReject}
            disabled={disabled || isProcessing}
            variant="outline"
            className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
          >
            {isProcessing && action === 'reject' ? (
              <div className="flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin" />
                <span>Rejecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <XCircle size={16} />
                <span>Reject</span>
              </div>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Once approved, the video will be automatically published to your chosen platform.
        </div>
      </div>
    </Card>
  )
}
