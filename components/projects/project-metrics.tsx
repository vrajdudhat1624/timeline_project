"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, CheckCircle, Clock, AlertTriangle, Users, TrendingUp } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
}

function MetricCard({ title, value, icon, description, trend, onClick }: MetricCardProps) {
  return (
    <Card className={onClick ? "cursor-pointer transition-colors hover:bg-accent/50" : ""} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{description}</p>
      </CardContent>
    </Card>
  )
}

interface ProjectMetricsProps {
  onMetricClick?: (view: string) => void
}

export function ProjectMetrics({ onMetricClick }: ProjectMetricsProps) {
  const metrics = [
    {
      title: "Total Projects",
      value: 42,
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      description: "All projects in the system",
      trend: { value: 12, isPositive: true },
      key: "total",
    },
    {
      title: "Active Projects",
      value: 28,
      icon: <Clock className="h-5 w-5 text-primary" />,
      description: "Currently in progress",
      trend: { value: 8, isPositive: true },
      key: "active",
    },
    {
      title: "Completed",
      value: 14,
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      description: "Successfully delivered",
      trend: { value: 5, isPositive: true },
      key: "completed",
    },
    {
      title: "At Risk",
      value: 3,
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      description: "Require immediate attention",
      trend: { value: 2, isPositive: false },
      key: "at-risk",
    },
    {
      title: "Team Members",
      value: 18,
      icon: <Users className="h-5 w-5 text-primary" />,
      description: "Active contributors",
      key: "team",
    },
    {
      title: "Utilization",
      value: "87%",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      description: "Resource allocation",
      trend: { value: 3, isPositive: true },
      key: "utilization",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          description={metric.description}
          trend={metric.trend}
          onClick={onMetricClick ? () => onMetricClick(metric.key) : undefined}
        />
      ))}
    </div>
  )
}

