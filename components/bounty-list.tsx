"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { web3Service, type Bounty, BountyStatus } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"

interface BountyListProps {
  account: string
}

export function BountyList({ account }: BountyListProps) {
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadBounties()
  }, [])

  const loadBounties = async () => {
    try {
      const allBounties = await web3Service.getAllBounties()
      setBounties(allBounties)
    } catch (error) {
      console.error("Error loading bounties:", error)
      toast({
        title: "Error",
        description: "Failed to load bounties",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClaimBounty = async (bountyId: number) => {
    setActionLoading(bountyId)
    try {
      const result = await web3Service.claimBounty(bountyId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Bounty claimed successfully!",
        })
        await loadBounties()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to claim bounty",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim bounty",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleCompleteBounty = async (bountyId: number) => {
    setActionLoading(bountyId)
    try {
      const result = await web3Service.completeBounty(bountyId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Bounty marked as completed!",
        })
        await loadBounties()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to complete bounty",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete bounty",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleApproveBounty = async (bountyId: number) => {
    setActionLoading(bountyId)
    try {
      const result = await web3Service.approveBounty(bountyId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Bounty approved and payment sent!",
        })
        await loadBounties()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve bounty",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve bounty",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

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

  const canClaimBounty = (bounty: Bounty) => {
    return bounty.status === BountyStatus.Open && bounty.poster.toLowerCase() !== account.toLowerCase()
  }

  const canCompleteBounty = (bounty: Bounty) => {
    return bounty.status === BountyStatus.Claimed && bounty.worker.toLowerCase() === account.toLowerCase()
  }

  const canApproveBounty = (bounty: Bounty) => {
    return bounty.status === BountyStatus.Completed && bounty.poster.toLowerCase() === account.toLowerCase()
  }

  const mockBounties = [
    {
      id: 1,
      title: "Fix Smart Contract Bug",
      description: "Resolve major smart contract bug that causes all Bounty Board...",
      reward: "0.5",
      status: BountyStatus.Open,
      poster: "0x1234...5678",
      worker: "0x0000000000000000000000000000000000000000",
      createdAt: Date.now() - 172800000, // 2 days ago
      category: "Rent Bounty",
    },
    {
      id: 2,
      title: "Design DApp UI",
      description: "Improve smart contract and the frontend all Bounty Board...",
      reward: "0.5",
      status: BountyStatus.Open,
      poster: "0x1234...5678",
      worker: "0x0000000000000000000000000000000000000000",
      createdAt: Date.now() - 172800000,
      category: "Rent Bounty",
    },
    {
      id: 3,
      title: "Write Article on Web3",
      description: "Improve smart contract and the frontend all Bounty Board...",
      reward: "0.5",
      status: BountyStatus.Open,
      poster: "0x1234...5678",
      worker: "0x0000000000000000000000000000000000000000",
      createdAt: Date.now() - 172800000,
      category: "Thrift Bounty",
    },
    {
      id: 4,
      title: "Design Contract Bots",
      description: "Improve smart contract and the frontend all Bounty Board...",
      reward: "0.5",
      status: BountyStatus.Open,
      poster: "0x1234...5678",
      worker: "0x0000000000000000000000000000000000000000",
      createdAt: Date.now() - 172800000,
      category: "Rent Bounty",
    },
    {
      id: 5,
      title: "Bodgn Mippl",
      description: "Improve smart contract and the frontend all Bounty Board...",
      reward: "0.5",
      status: BountyStatus.Open,
      poster: "0x1234...5678",
      worker: "0x0000000000000000000000000000000000000000",
      createdAt: Date.now() - 172800000,
      category: "Rent Bounty",
    },
    {
      id: 6,
      title: "Write Article on Web3",
      description: "Improve smart contract and the frontend all Bounty Board...",
      reward: "0.5",
      status: BountyStatus.Completed,
      poster: "0x1234...5678",
      worker: "0x9876...4321",
      createdAt: Date.now() - 172800000,
      category: "Thrift Bounty",
    },
  ]

  const filteredBounties = mockBounties.filter((bounty) => {
    if (activeTab === "all") return true
    if (activeTab === "open") return bounty.status === BountyStatus.Open
    if (activeTab === "completed") return bounty.status === BountyStatus.Completed
    return true
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (bounties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-2 h-2 bg-blue-500 rounded-full mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">No bounties found</h3>
          <p className="text-muted-foreground text-center">
            Be the first to post a bounty and start building the community!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Available Bounties</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bounties..." className="pl-10 w-64 bg-input/50 border-border/50" />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              All
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Open
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Expiring Soon
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBounties.map((bounty) => (
              <Card key={bounty.id} className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-foreground text-sm">{bounty.title}</h3>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold text-sm">{bounty.reward} ETH</div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{bounty.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">{bounty.category}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2 days left</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
