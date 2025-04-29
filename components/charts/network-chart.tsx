"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as d3 from "d3"
import { useToast } from "@/components/ui/use-toast"

interface NetworkChartProps {
  data: {
    nodes: Array<{
      id: string
      group: number
      value: number
    }>
    links: Array<{
      source: string
      target: string
      value: number
    }>
  }
}

export function NetworkChart({ data }: NetworkChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || !data.links) return

    const isDarkTheme = theme === "dark"
    const textColor = isDarkTheme ? "#e1e1e6" : "#1a1a1a"

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height])

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain([1, 2]) // 1 for employees, 2 for projects
      .range(["#3b82f6", "#10b981"])

    // Create a force simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide().radius((d) => Math.sqrt(d.value) * 2 + 10),
      )

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))

    // Create nodes
    const node = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation))
      .on("mouseover", (event, d) => {
        // Highlight connected links
        link
          .attr("stroke-opacity", (l) => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.1))
          .attr("stroke", (l) => (l.source.id === d.id || l.target.id === d.id ? "#ff9800" : "#999"))

        // Show tooltip
        toast({
          title: d.id,
          description: `Group: ${d.group === 1 ? "Employee" : "Project"}, Value: ${d.value}`,
          duration: 2000,
        })
      })
      .on("mouseout", () => {
        // Reset links
        link.attr("stroke-opacity", 0.6).attr("stroke", "#999")
      })

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d) => Math.sqrt(d.value) * 2 + 5)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", isDarkTheme ? "#000" : "#fff")
      .attr("stroke-width", 1.5)

    // Add labels to nodes
    node
      .append("text")
      .attr("x", 0)
      .attr("y", (d) => -Math.sqrt(d.value) * 2 - 7)
      .attr("text-anchor", "middle")
      .attr("fill", textColor)
      .text((d) => d.id)
      .style("font-size", "10px")
      .style("pointer-events", "none")

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node.attr("transform", (d) => `translate(${d.x},${d.y})`)
    })

    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    }

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(20, 20)`)

    const legendData = [
      { label: "Employee", color: colorScale(1) },
      { label: "Project", color: colorScale(2) },
    ]

    legendData.forEach((item, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      legendRow.append("rect").attr("width", 10).attr("height", 10).attr("fill", item.color)

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .attr("fill", textColor)
        .text(item.label)
        .style("font-size", "12px")
    })
  }, [data, theme, toast])

  return (
    <div className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" style={{ minHeight: "400px" }} />
    </div>
  )
}
