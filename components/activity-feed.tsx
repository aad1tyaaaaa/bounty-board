"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ActivityFeedProps {
  account: string
}

interface ActivityItem {
  id: string
  user: string
  action: string
  bounty: string
  reward?: string
  timestamp: string
  avatar: string
}

export function ActivityFeed({ account }: ActivityFeedProps) {
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      user: "UserX",
      action: "posted for 0.1 ETH bounty",
      bounty: "",
      timestamp: "1 hour",
      avatar: "UX",
    },
    {
      id: "2",
      user: "UserY",
      action: "joined bounty for 0.1 ETH",
      bounty: "Rent bounty",
      timestamp: "1 hour",
      avatar: "UY",
    },
    {
      id: "3",
      user: "UserZ",
      action: "assigned fast bounty bounty",
      bounty: "font bounty",
      timestamp: "1 hour",
      avatar: "UZ",
    },
    {
      id: "4",
      user: "BountyX",
      action: "assigned for bounty",
      bounty: "example 0.1 ETH",
      timestamp: "1 hour",
      avatar: "BX",
    },
    {
      id: "5",
      user: "BountyY",
      action: "Smart Contract Audit completed by UserZ",
      bounty: "",
      timestamp: "1 hour",
      avatar: "BY",
    },
  ]

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-muted">
                  <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{activity.user}</span> {activity.action}
                    {activity.bounty && <span className="text-foreground"> {activity.bounty}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
