"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Wallet, CheckCircle } from "lucide-react"
import { type Bounty, BountyStatus, formatAddress, formatTimeAgo } from "@/lib/web3"

interface BountyCardProps {
  bounty: Bounty
  account: string
  onClaim?: (bountyId: number) => void
  onComplete?: (bountyId: number) => void
  onApprove?: (bountyId: number) => void
  actionLoading?: boolean
}

export function BountyCard({
  bounty,
  account,
  onClaim,
  onComplete,
  onApprove,
  actionLoading = false,
}: BountyCardProps) {
  const getStatusBadge = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.Open:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Open
          </Badge>
        )
      case BountyStatus.Claimed:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Claimed
          </Badge>
        )
      case BountyStatus.Completed:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Completed
          </Badge>
        )
      case BountyStatus.Approved:
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Approved
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const canClaimBounty = () => {
    return bounty.status === BountyStatus.Open && bounty.poster.toLowerCase() !== account.toLowerCase()
  }

  const canCompleteBounty = () => {
    return bounty.status === BountyStatus.Claimed && bounty.worker.toLowerCase() === account.toLowerCase()
  }

  const canApproveBounty = () => {
    return bounty.status === BountyStatus.Completed && bounty.poster.toLowerCase() === account.toLowerCase()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{bounty.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Posted by {formatAddress(bounty.poster)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(bounty.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(bounty.status)}
            <div className="flex items-center gap-1 text-lg font-semibold">
              <Wallet className="h-5 w-5" />
              <span>{bounty.reward} ETH</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-base leading-relaxed">{bounty.description}</CardDescription>

        {bounty.worker !== "0x0000000000000000000000000000000000000000" && (
          <>
            <Separator />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>Claimed by {formatAddress(bounty.worker)}</span>
            </div>
          </>
        )}

        <div className="flex items-center gap-3 pt-2">
          {canClaimBounty() && onClaim && (
            <Button
              onClick={() => onClaim(bounty.id)}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? "Claiming..." : "Claim Bounty"}
            </Button>
          )}

          {canCompleteBounty() && onComplete && (
            <Button onClick={() => onComplete(bounty.id)} disabled={actionLoading} variant="outline">
              {actionLoading ? "Submitting..." : "Mark Complete"}
            </Button>
          )}

          {canApproveBounty() && onApprove && (
            <Button
              onClick={() => onApprove(bounty.id)}
              disabled={actionLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {actionLoading ? "Approving..." : "Approve & Pay"}
            </Button>
          )}

          {bounty.poster.toLowerCase() === account.toLowerCase() && (
            <Badge variant="outline" className="ml-auto">
              Your Bounty
            </Badge>
          )}

          {bounty.worker.toLowerCase() === account.toLowerCase() &&
            bounty.worker !== "0x0000000000000000000000000000000000000000" && (
              <Badge variant="outline" className="ml-auto">
                Your Work
              </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
