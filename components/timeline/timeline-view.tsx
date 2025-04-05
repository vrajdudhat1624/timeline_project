"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface TimelineEvent {
  id: string
  projectId: string
  projectName: string
  task: string
  assignee: {
    name: string
    avatar: string
  }
  startDate: Date
  endDate: Date
  status: "not-started" | "in-progress" | "completed"
}

// Generate dates for the next 14 days
const generateDates = () => {
  const dates = []
  const today = new Date()

  for (let i = -7; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  return dates
}

// Sample timeline events
const generateEvents = (): TimelineEvent[] => {
  const today = new Date()

  return [
    {
      id: "1",
      projectId: "website",
      projectName: "Website Redesign",
      task: "Design Homepage",
      assignee: {
        name: "Maria Garcia",
        avatar: "MG",
      },
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      status: "in-progress",
    },
    {
      id: "2",
      projectId: "website",
      projectName: "Website Redesign",
      task: "Develop Backend",
      assignee: {
        name: "David Kim",
        avatar: "DK",
      },
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
      status: "in-progress",
    },
    {
      id: "3",
      projectId: "mobile",
      projectName: "Mobile App",
      task: "UI Design",
      assignee: {
        name: "Maria Garcia",
        avatar: "MG",
      },
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      status: "not-started",
    },
    {
      id: "4",
      projectId: "marketing",
      projectName: "Marketing Campaign",
      task: "Content Creation",
      assignee: {
        name: "Sarah Lee",
        avatar: "SL",
      },
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      status: "completed",
    },
    {
      id: "5",
      projectId: "marketing",
      projectName: "Marketing Campaign",
      task: "Social Media Posts",
      assignee: {
        name: "Sarah Lee",
        avatar: "SL",
      },
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      status: "in-progress",
    },
  ]
}

export function TimelineView() {
  const [dates] = useState(generateDates())
  const [events] = useState(generateEvents())
  const [currentPage, setCurrentPage] = useState(0)

  // Check if an event should be displayed on a specific date
  const isEventOnDate = (event: TimelineEvent, date: Date) => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate)

    eventStart.setHours(0, 0, 0, 0)
    eventEnd.setHours(0, 0, 0, 0)

    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    return checkDate >= eventStart && checkDate <= eventEnd
  }

  // Get status color
  const getStatusColor = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "not-started":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
      case "completed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
      default:
        return ""
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    const isToday = checkDate.getTime() === today.getTime()

    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(0)}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {/* Date headers */}
        <div className="grid grid-cols-7 border-b">
          {dates.slice(0, 7).map((date, index) => {
            const { day, weekday, isToday } = formatDate(date)
            return (
              <div key={index} className={`p-2 text-center ${isToday ? "bg-primary/10" : ""}`}>
                <div className="text-xs text-muted-foreground">{weekday}</div>
                <div className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</div>
              </div>
            )
          })}
        </div>

        {/* Timeline events */}
        <div className="min-h-[400px] relative">
          {events.map((event) => (
            <div key={event.id} className="relative">
              {dates.slice(0, 7).map((date, dateIndex) => {
                if (isEventOnDate(event, date)) {
                  // Determine if this is the start date
                  const isStartDate =
                    date.getDate() === event.startDate.getDate() &&
                    date.getMonth() === event.startDate.getMonth() &&
                    date.getFullYear() === event.startDate.getFullYear()

                  // Only render the event on its start date
                  if (isStartDate) {
                    // Calculate duration in days
                    const durationDays =
                      Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

                    // Limit to visible days
                    const visibleDays = Math.min(durationDays, 7 - dateIndex)

                    return (
                      <div
                        key={`${event.id}-${dateIndex}`}
                        className={`absolute p-2 border rounded-md ${getStatusColor(event.status)}`}
                        style={{
                          left: `${(dateIndex / 7) * 100}%`,
                          width: `${(visibleDays / 7) * 100}%`,
                          top: `${events.indexOf(event) * 80 + 10}px`,
                          height: "70px",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{event.task}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {event.projectName}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-2 gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">{event.assignee.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{event.assignee.name}</span>
                        </div>
                      </div>
                    )
                  }
                }
                return null
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

