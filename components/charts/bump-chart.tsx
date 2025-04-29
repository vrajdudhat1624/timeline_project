"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as d3 from "d3"
import { useToast } from "@/components/ui/use-toast"

interface BumpChartProps {
  data: any[]
}

export function BumpChart({ data }: BumpChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    const isDarkTheme = theme === "dark"
    const textColor = isDarkTheme ? "#e1e1e6" : "#1a1a1a"
    const gridColor = isDarkTheme ? "#333" : "#ddd"

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const margin = { top: 40, right: 150, bottom: 40, left: 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Extract all unique x values (time periods)
    const allXValues = Array.from(new Set(data.flatMap((d) => d.data.map((item) => item.x))))

    // Create scales
    const xScale = d3.scalePoint().domain(allXValues).range([0, width]).padding(0.5)

    const yScale = d3
      .scaleLinear()
      .domain([1, Math.max(...data.flatMap((d) => d.data.map((item) => item.y)))])
      .range([height, 0])
      .nice()

    // Create color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.id))
      .range(d3.schemeCategory10)

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.3)
      .attr("stroke-dasharray", "3,3")

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", textColor)
      .style("text-anchor", "middle")

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").attr("fill", textColor)

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("fill", textColor)
      .attr("text-anchor", "middle")
      .text("Rank")

    // Create line generator
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Add lines
    data.forEach((series) => {
      // Add the line
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("stroke", colorScale(series.id))
        .attr("stroke-width", 3)
        .attr("d", line)

      // Add circles at each data point
      svg
        .selectAll(`.circle-${series.id.replace(/\s+/g, "-")}`)
        .data(series.data)
        .enter()
        .append("circle")
        .attr("class", `circle-${series.id.replace(/\s+/g, "-")}`)
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 6)
        .attr("fill", colorScale(series.id))
        .attr("stroke", isDarkTheme ? "#000" : "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
          d3.select(this).transition().duration(200).attr("r", 8)

          // Show tooltip
          toast({
            title: series.id,
            description: `Period: ${d.x}, Rank: ${d.y}`,
            duration: 2000,
          })
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).attr("r", 6)
        })
    })

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${width + 20}, 0)`)

    data.forEach((series, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      legendRow.append("rect").attr("width", 10).attr("height", 10).attr("fill", colorScale(series.id))

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .attr("fill", textColor)
        .text(series.id)
    })
  }, [data, theme, toast])

  return (
    <div className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full overflow-visible" style={{ minHeight: "400px" }} />
    </div>
  )
}
