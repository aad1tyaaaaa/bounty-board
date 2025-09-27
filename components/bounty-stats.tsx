"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Wallet, CheckCircle } from "lucide-react"
import { web3Service, BountyStatus } from "@/lib/web3"

interface BountyStatsProps {
  account?: string
}

export function BountyStats({ account }: BountyStatsProps) {
  const [stats, setStats] = useState({
    totalBounties: 0,
    openBounties: 0,
    totalRewards: "0",
    completedBounties: 0,
    userPosted: 0,
    userClaimed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [account])

  const loadStats = async () => {
    try {
      const bounties = await web3Service.getAllBounties()

      const totalBounties = bounties.length
      const openBounties = bounties.filter((b) => b.status === BountyStatus.Open).length
      const completedBounties = bounties.filter((b) => b.status === BountyStatus.Approved).length
      const totalRewards = bounties.reduce((sum, b) => sum + Number.parseFloat(b.reward), 0).toFixed(2)

      let userPosted = 0
      let userClaimed = 0

      if (account) {
        userPosted = bounties.filter((b) => b.poster.toLowerCase() === account.toLowerCase()).length
        userClaimed = bounties.filter(
          (b) =>
            b.worker.toLowerCase() === account.toLowerCase() &&
            b.worker !== "0x0000000000000000000000000000000000000000",
        ).length
      }

      setStats({
        totalBounties,
        openBounties,
        totalRewards,
        completedBounties,
        userPosted,
        userClaimed,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bounties</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBounties}</div>
          <p className="text-xs text-muted-foreground">All bounties posted</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Bounties</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.openBounties}</div>
          <p className="text-xs text-muted-foreground">Available to claim</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRewards} ETH</div>
          <p className="text-xs text-muted-foreground">In all bounties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.completedBounties}</div>
          <p className="text-xs text-muted-foreground">Successfully finished</p>
        </CardContent>
      </Card>

      {account && (
        <>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bounties Posted</span>
                <Badge variant="outline">{stats.userPosted}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bounties Claimed</span>
                <Badge variant="outline">{stats.userClaimed}</Badge>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
