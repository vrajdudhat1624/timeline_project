"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface RiskProject {
  id: string
  name: string
  progress: number
  daysLeft: number
  issue: string
}

const riskProjects: RiskProject[] = [
  {
    id: "1",
    name: "Website Redesign",
    progress: 45,
    daysLeft: 3,
    issue: "Resource shortage",
  },
  {
    id: "2",
    name: "Product Launch",
    progress: 60,
    daysLeft: 5,
    issue: "Pending approvals",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    progress: 30,
    daysLeft: 2,
    issue: "Budget constraints",
  },
]

interface AtRiskProjectsProps {
  onViewAll?: () => void
  limit?: number
}

export function AtRiskProjects({ onViewAll, limit = 3 }: AtRiskProjectsProps) {
  const displayProjects = limit ? riskProjects.slice(0, limit) : riskProjects

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">At Risk Projects</CardTitle>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProjects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{project.name}</p>
                <div className="flex items-center text-amber-500 gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{project.daysLeft} days left</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={project.progress} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground">{project.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground">{project.issue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

