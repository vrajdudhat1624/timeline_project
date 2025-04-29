"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface GanttChartProps {
  data: any[]
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
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
    } else {
      newExpanded.add(projectId)
    }
    setExpandedProjects(newExpanded)
  }

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    const isDarkTheme = theme === "dark"
    const textColor = isDarkTheme ? "#e1e1e6" : "#1a1a1a"
    const gridColor = isDarkTheme ? "#333" : "#ddd"

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const margin = { top: 40, right: 40, bottom: 40, left: 200 }
    const width = (svgRef.current.clientWidth - margin.left - margin.right) * zoomLevel
    const rowHeight = 30

    // Flatten data based on expanded state
    const flattenedData = []

    data.forEach((project) => {
      flattenedData.push({
        id: project.id,
        type: "project",
        expanded: expandedProjects.has(project.id),
      })

      if (expandedProjects.has(project.id)) {
        project.data.forEach((task) => {
          flattenedData.push({
            id: `${project.id}-${task.id}`,
            parentId: project.id,
            ...task,
            expanded: expandedTasks.has(`${project.id}-${task.id}`),
          })

          if (expandedTasks.has(`${project.id}-${task.id}`) && task.subtasks) {
            task.subtasks.forEach((subtask) => {
              flattenedData.push({
                id: `${project.id}-${task.id}-${subtask.id}`,
                parentId: `${project.id}-${task.id}`,
                ...subtask,
              })
            })
          }
        })
      }
    })

    const height = flattenedData.length * rowHeight

    // Find min and max dates
    const allDates = flattenedData.filter((d) => d.start && d.end).flatMap((d) => [d.start, d.end])

    const minDate = d3.min(allDates) || new Date(2023, 0, 1)
    const maxDate = d3.max(allDates) || new Date(2023, 11, 31)

    // Add a month buffer on each side
    const startDate = new Date(minDate)
    startDate.setMonth(startDate.getMonth() - 1)

    const endDate = new Date(maxDate)
    endDate.setMonth(endDate.getMonth() + 1)

    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width])

    const yScale = d3
      .scaleBand()
      .domain(flattenedData.map((d) => d.id))
      .range([0, height])
      .padding(0.2)

    // Create color scale
    const colorScale = d3.scaleOrdinal().domain(["project", "task", "subtask"]).range(["#3b82f6", "#10b981", "#8b5cf6"])

    // Add grid lines
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%b %Y"))

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", textColor)
      .style("text-anchor", "middle")

    // Add vertical grid lines
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

    // Add bars for each item
    flattenedData.forEach((d, i) => {
      if (!d.start || !d.end) return

      const barHeight = yScale.bandwidth()
      const y = yScale(d.id)

      // Add row background
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", width)
        .attr("height", barHeight)
        .attr("fill", i % 2 === 0 ? (isDarkTheme ? "#1a1a1a" : "#f9fafb") : "transparent")

      // Add the bar
      const bar = svg
        .append("rect")
        .attr("x", xScale(d.start))
        .attr("y", y)
        .attr("width", xScale(d.end) - xScale(d.start))
        .attr("height", barHeight)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", colorScale(d.type))
        .attr("opacity", 0.8)
        .on("mouseover", function (event) {
          d3.select(this).transition().duration(200).attr("opacity", 1)

          // Show tooltip
          toast({
            title: d.id.split("-").pop(),
            description: `${d3.timeFormat("%b %d, %Y")(d.start)} - ${d3.timeFormat("%b %d, %Y")(d.end)}`,
            duration: 2000,
          })
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).attr("opacity", 0.8)
        })

      // Add progress bar if available
      if (d.progress) {
        svg
          .append("rect")
          .attr("x", xScale(d.start))
          .attr("y", y)
          .attr("width", (xScale(d.end) - xScale(d.start)) * (d.progress / 100))
          .attr("height", barHeight)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill", d3.color(colorScale(d.type)).darker(0.8))
      }
    })

    // Add labels
    flattenedData.forEach((d) => {
      const y = yScale(d.id) + yScale.bandwidth() / 2

      // Indentation based on hierarchy level
      let indent = 0
      if (d.parentId) {
        if (d.parentId.split("-").length > 1) {
          indent = 40 // Subtask
        } else {
          indent = 20 // Task
        }
      }

      // Add expand/collapse icon for projects and tasks with subtasks
      if (d.type === "project" || (d.type === "task" && d.subtasks)) {
        const isExpanded = d.type === "project" ? expandedProjects.has(d.id) : expandedTasks.has(d.id)

        svg
          .append("text")
          .attr("x", -margin.left + 5 + indent - 15)
          .attr("y", y + 5)
          .attr("fill", textColor)
          .attr("class", "cursor-pointer")
          .text(isExpanded ? "▼" : "►")
          .style("font-size", "12px")
          .on("click", () => {
            if (d.type === "project") {
              toggleProject(d.id)
            } else {
              toggleTask(d.id)
            }
          })
      }

      // Add label
      svg
        .append("text")
        .attr("x", -margin.left + 5 + indent)
        .attr("y", y + 5)
        .attr("fill", textColor)
        .text(d.id.split("-").pop())
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
