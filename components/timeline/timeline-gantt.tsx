"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Task {
  id: string
  name: string
  project: string
  assignee: {
    name: string
    avatar: string
  }
  startDate: Date
  endDate: Date
  progress: number
  dependencies: string[]
}

// Sample tasks
const tasks: Task[] = [
  {
    id: "1",
    name: "Research & Planning",
    project: "Website Redesign",
    assignee: {
      name: "Alex Johnson",
      avatar: "AJ",
    },
    startDate: new Date(2023, 10, 1),
    endDate: new Date(2023, 10, 7),
    progress: 100,
    dependencies: [],
  },
  {
    id: "2",
    name: "Design Homepage",
    project: "Website Redesign",
    assignee: {
      name: "Maria Garcia",
      avatar: "MG",
    },
    startDate: new Date(2023, 10, 8),
    endDate: new Date(2023, 10, 14),
    progress: 75,
    dependencies: ["1"],
  },
  {
    id: "3",
    name: "Develop Backend",
    project: "Website Redesign",
    assignee: {
      name: "David Kim",
      avatar: "DK",
    },
    startDate: new Date(2023, 10, 8),
    endDate: new Date(2023, 10, 21),
    progress: 45,
    dependencies: ["1"],
  },
  {
    id: "4",
    name: "Frontend Implementation",
    project: "Website Redesign",
    assignee: {
      name: "Sarah Lee",
      avatar: "SL",
    },
    startDate: new Date(2023, 10, 15),
    endDate: new Date(2023, 10, 28),
    progress: 20,
    dependencies: ["2"],
  },
  {
    id: "5",
    name: "Testing & QA",
    project: "Website Redesign",
    assignee: {
      name: "James Wilson",
      avatar: "JW",
    },
    startDate: new Date(2023, 10, 22),
    endDate: new Date(2023, 11, 5),
    progress: 0,
    dependencies: ["3", "4"],
  },
]

// Generate dates for the gantt chart
const generateDates = () => {
  const dates = []
  const startDate = new Date(2023, 10, 1) // November 1, 2023

  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }

  return dates
}

export function TimelineGantt() {
  const [dates] = useState(generateDates())

  // Get the start of the first week
  const firstDate = dates[0]
  const firstWeekStart = new Date(firstDate)
  firstWeekStart.setDate(firstDate.getDate() - firstDate.getDay())

  // Group dates by week
  const weeks = []
  let currentWeek = []
  let currentWeekStart = new Date(firstWeekStart)

  for (const date of dates) {
    if (date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push({
        start: new Date(currentWeekStart),
        dates: [...currentWeek],
      })
      currentWeek = []
      currentWeekStart = new Date(date)
    }
    currentWeek.push(date)
  }

  if (currentWeek.length > 0) {
    weeks.push({
      start: new Date(currentWeekStart),
      dates: [...currentWeek],
    })
  }

  // Check if a task is active on a specific date
  const isTaskActiveOnDate = (task: Task, date: Date) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    taskStart.setHours(0, 0, 0, 0)
    taskEnd.setHours(0, 0, 0, 0)

    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    return checkDate >= taskStart && checkDate <= taskEnd
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Format week for display
  const formatWeek = (start: Date) => {
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Task</TableHead>
            <TableHead className="w-[150px]">Assignee</TableHead>
            {weeks.map((week, index) => (
              <TableHead key={index} colSpan={7} className="text-center border-l">
                {formatWeek(week.start)}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            <TableHead></TableHead>
            <TableHead></TableHead>
            {weeks.map((week) =>
              week.dates.map((date, dateIndex) => (
                <TableHead key={dateIndex} className="p-0 text-center w-8">
                  <div className="text-xs py-1">{date.getDate()}</div>
                </TableHead>
              )),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <div>{task.name}</div>
                <div className="text-xs text-muted-foreground">{task.project}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </TableCell>
              {weeks.map((week) =>
                week.dates.map((date, dateIndex) => (
                  <TableCell key={dateIndex} className="p-0 relative">
                    {isTaskActiveOnDate(task, date) && (
                      <div
                        className={`absolute inset-0 m-[2px] rounded-sm ${
                          task.progress === 100
                            ? "bg-green-500/20 dark:bg-green-500/30"
                            : task.progress > 0
                              ? "bg-blue-500/20 dark:bg-blue-500/30"
                              : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <div
                          className={`h-full rounded-sm ${
                            task.progress === 100 ? "bg-green-500/40" : "bg-blue-500/40"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                  </TableCell>
                )),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

