"use client"

import { useState, useEffect } from "react"
import { BountyList } from "@/components/bounty-list"
import { PostBountyForm } from "@/components/post-bounty-form"
import { WalletConnection } from "@/components/wallet-connection"
import { ActivityFeed } from "@/components/activity-feed"
import { UserDashboard } from "@/components/user-dashboard"

export default function BountyBoard() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>("")

  useEffect(() => {
    setIsDarkMode(true)
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">Decentralized Bounty Board</h1>
            <WalletConnection
              isConnected={isConnected}
              account={account}
              onConnectionChange={setIsConnected}
              onAccountChange={setAccount}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {!isConnected ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your MetaMask wallet to start posting and claiming bounties
              </p>
              <WalletConnection
                isConnected={isConnected}
                account={account}
                onConnectionChange={setIsConnected}
                onAccountChange={setAccount}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
            {/* Left Column - Post Bounty Form */}
            <div className="lg:col-span-3">
              <PostBountyForm account={account} />
            </div>

            {/* Center Column - Available Bounties */}
            <div className="lg:col-span-6">
              <BountyList account={account} />
            </div>

            {/* Right Column - Activity Feed & User Dashboard */}
            <div className="lg:col-span-3 space-y-6">
              <ActivityFeed account={account} />
              <UserDashboard account={account} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
