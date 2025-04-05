"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "available" | "busy" | "away"
  activeProjects: number
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Project Manager",
    avatar: "AJ",
    status: "available",
    activeProjects: 3,
  },
  {
    id: "2",
    name: "Maria Garcia",
    role: "UX Designer",
    avatar: "MG",
    status: "busy",
    activeProjects: 2,
  },
  {
    id: "3",
    name: "David Kim",
    role: "Developer",
    avatar: "DK",
    status: "available",
    activeProjects: 4,
  },
  {
    id: "4",
    name: "Sarah Lee",
    role: "Marketing",
    avatar: "SL",
    status: "away",
    activeProjects: 1,
  },
]

interface TeamMembersProps {
  onViewAll?: () => void
  limit?: number
}

export function TeamMembers({ onViewAll, limit = 4 }: TeamMembersProps) {
  const displayMembers = limit ? teamMembers.slice(0, limit) : teamMembers

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Team Members</CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    member.status === "available"
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      : member.status === "busy"
                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                  }
                >
                  {member.activeProjects} projects
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

