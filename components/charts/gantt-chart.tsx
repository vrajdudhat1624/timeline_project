"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Subtask {
  id: string
  start: Date
  end: Date
  progress?: number
}

interface Task {
  id: string
  start: Date
  end: Date
  progress?: number
  subtasks?: Subtask[]
}

interface Project {
  id: string
  data: Task[]
}

interface GanttChartProps {
  data: Project[]
}

type FlattenedItem =
  | {
      id: string
      type: "project"
      expanded: boolean
    }
  | {
      id: string
      parentId: string
      type: "task"
      start: Date
      end: Date
      progress?: number
      expanded: boolean
      subtasks?: Subtask[]
    }
  | {
      id: string
      parentId: string
      type: "subtask"
      start: Date
      end: Date
      progress?: number
    }

export function GanttChart({ data }: GanttChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [zoomLevel, setZoomLevel] = useState(1)

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects)
    newExpanded.has(projectId) ? newExpanded.delete(projectId) : newExpanded.add(projectId)
    setExpandedProjects(newExpanded)
  }

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    newExpanded.has(taskId) ? newExpanded.delete(taskId) : newExpanded.add(taskId)
    setExpandedTasks(newExpanded)
  }

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    const isDarkTheme = theme === "dark"
    const textColor = isDarkTheme ? "#e1e1e6" : "#1a1a1a"
    const gridColor = isDarkTheme ? "#333" : "#ddd"

    d3.select(svgRef.current).selectAll("*").remove()

    const margin = { top: 40, right: 40, bottom: 40, left: 200 }
    const width = (svgRef.current.clientWidth - margin.left - margin.right) * zoomLevel
    const rowHeight = 30

    const flattenedData: FlattenedItem[] = []

    data.forEach((project) => {
      flattenedData.push({
        id: project.id,
        type: "project",
        expanded: expandedProjects.has(project.id),
      })

      if (expandedProjects.has(project.id)) {
        project.data.forEach((task) => {
          const taskId = `${project.id}-${task.id}`

          flattenedData.push({
            id: taskId,
            parentId: project.id,
            type: "task",
            start: task.start,
            end: task.end,
            progress: task.progress,
            expanded: expandedTasks.has(taskId),
            subtasks: task.subtasks,
          })

          if (expandedTasks.has(taskId) && task.subtasks) {
            task.subtasks.forEach((subtask) => {
              flattenedData.push({
                id: `${taskId}-${subtask.id}`,
                parentId: taskId,
                type: "subtask",
                start: subtask.start,
                end: subtask.end,
                progress: subtask.progress,
              })
            })
          }
        })
      }
    })

    const height = flattenedData.length * rowHeight

    const allDates = flattenedData
      .filter((d) => "start" in d && "end" in d)
      .flatMap((d) => [(d as any).start, (d as any).end]) as Date[]

    const minDate = d3.min(allDates) || new Date(2023, 0, 1)
    const maxDate = d3.max(allDates) || new Date(2023, 11, 31)

    const startDate = new Date(minDate)
    startDate.setMonth(startDate.getMonth() - 1)

    const endDate = new Date(maxDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width])
    const yScale = d3.scaleBand().domain(flattenedData.map((d) => d.id)).range([0, height]).padding(0.2)

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(["project", "task", "subtask"])
      .range(["#3b82f6", "#10b981", "#8b5cf6"])

    // X-axis with tick formatter fix (Line 164)
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(d3.timeMonth)
          .tickFormat((d) => d3.timeFormat("%b %Y")(d as Date))
      )
      .selectAll("text")
      .attr("fill", textColor)

    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(xScale.ticks(d3.timeMonth))
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.3)

    flattenedData.forEach((d, i) => {
      const y = yScale(d.id)!
      const barHeight = yScale.bandwidth()

      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", width)
        .attr("height", barHeight)
        .attr("fill", i % 2 === 0 ? (isDarkTheme ? "#1a1a1a" : "#f9fafb") : "transparent")

      if ("start" in d && "end" in d) {
        svg
          .append("rect")
          .attr("x", xScale(d.start))
          .attr("y", y)
          .attr("width", xScale(d.end) - xScale(d.start))
          .attr("height", barHeight)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill", colorScale(d.type))
          .attr("opacity", 0.8)
          .on("mouseover", function () {
            d3.select(this).transition().duration(200).attr("opacity", 1)
            toast({
              title: (d.id as string).split("-").pop() ?? d.id,
              description: `${d3.timeFormat("%b %d, %Y")(d.start)} - ${d3.timeFormat("%b %d, %Y")(d.end)}`,
              duration: 2000,
            })
          })
          .on("mouseout", function () {
            d3.select(this).transition().duration(200).attr("opacity", 0.8)
          })

        if (d.progress) {
          svg
            .append("rect")
            .attr("x", xScale(d.start))
            .attr("y", y)
            .attr("width", (xScale(d.end) - xScale(d.start)) * (d.progress / 100))
            .attr("height", barHeight)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr(
              "fill",
              d3.color(colorScale(d.type))?.darker(0.8).toString() ?? colorScale(d.type)
            )
        }
      }

      const indent = d.type === "task" ? 20 : d.type === "subtask" ? 40 : 0
      const labelY = y + barHeight / 2 + 5

      if (d.type === "project" || (d.type === "task" && d.subtasks)) {
        const isExpanded = d.type === "project" ? expandedProjects.has(d.id) : expandedTasks.has(d.id)

        svg
          .append("text")
          .attr("x", -margin.left + 5 + indent - 15)
          .attr("y", labelY)
          .attr("fill", textColor)
          .attr("class", "cursor-pointer")
          .text(isExpanded ? "▼" : "►")
          .style("font-size", "12px")
          .on("click", () => {
            d.type === "project" ? toggleProject(d.id) : toggleTask(d.id)
          })
      }

      // Line 257 fix
      svg
        .append("text")
        .attr("x", -margin.left + 5 + indent)
        .attr("y", labelY)
        .attr("fill", textColor)
        .text((d.id as string).split("-").pop() ?? d.id)
        .style("font-size", "12px")
    })
  }, [data, theme, expandedProjects, expandedTasks, zoomLevel, toast])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex-1 overflow-auto">
        <svg ref={svgRef} className="h-full w-full" style={{ minHeight: "400px" }} />
      </div>
    </div>
  )
}
