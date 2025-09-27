"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface UserDashboardProps {
  account: string
}

export function UserDashboard({ account }: UserDashboardProps) {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [account])

  const loadUserData = async () => {
    try {
      // Mock loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground">Your Bounties</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="posted" className="space-y-3">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger
              value="posted"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm"
            >
              Posted
            </TabsTrigger>
            <TabsTrigger
              value="claimed"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm"
            >
              Claimed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="space-y-2 mt-3">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No bounties posted yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create your first bounty to get started</p>
            </div>
          </TabsContent>

          <TabsContent value="claimed" className="space-y-2 mt-3">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No bounties claimed yet</p>
              <p className="text-xs text-muted-foreground mt-1">Browse available bounties to start earning</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
