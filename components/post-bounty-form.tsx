"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { web3Service } from "@/lib/web3"
import { useToast } from "@/hooks/use-toast"

interface PostBountyFormProps {
  account: string
}

export function PostBountyForm({ account }: PostBountyFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reward, setReward] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !reward.trim() || !category.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const rewardNum = Number.parseFloat(reward)
    if (isNaN(rewardNum) || rewardNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid reward amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await web3Service.postBounty(title.trim(), description.trim(), reward, category)

      if (result.success) {
        toast({
          title: "Success",
          description: "Bounty posted successfully!",
        })
        // Reset form
        setTitle("")
        setDescription("")
        setReward("")
        setCategory("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post bounty",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post bounty",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/50 bg-card/50 backdrop-blur-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Plus className="h-5 w-5" />
          Post a New Bounty, Earn ETH
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-muted-foreground">
              Bounty Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Build a React Component"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="bg-input/50 border-border/50 text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-muted-foreground">
              Bounty Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a clear description of your bounty..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-input/50 border-border/50 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward" className="text-sm text-muted-foreground">
              Reward Amount (ETH)
            </Label>
            <Input
              id="reward"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.01"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="bg-input/50 border-border/50 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm text-muted-foreground">
              Deadline
            </Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>⏰ 2 Months</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm text-muted-foreground">
              Category
            </Label>
            <Input
              id="category"
              placeholder="Category (e.g., dev, community)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-input/50 border-border/50 text-sm"
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            {loading ? "Posting Bounty..." : "Post Bounty"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
