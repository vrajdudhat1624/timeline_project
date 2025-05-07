"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as d3 from "d3"
import { useToast } from "@/components/ui/use-toast"

interface DataPoint {
  x: string
  y: number
}

interface Series {
  id: string
  data: DataPoint[]
}

interface BumpChartProps {
  data: Series[]
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

    const svgEl = svgRef.current
    const container = d3.select(svgEl)

    // Clear previous chart
    container.selectAll("*").remove()

    const margin = { top: 40, right: 150, bottom: 40, left: 60 }
    const width = svgEl.clientWidth - margin.left - margin.right
    const height = svgEl.clientHeight - margin.top - margin.bottom

    const svg = container
      .attr("viewBox", `0 0 ${svgEl.clientWidth} ${svgEl.clientHeight}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Extract unique time periods
    const allXValues = Array.from(new Set(data.flatMap((d) => d.data.map((item) => item.x))))

    // X and Y scales
    const xScale = d3.scalePoint<string>().domain(allXValues).range([0, width]).padding(0.5)

    const maxRank = Math.max(...data.flatMap((d) => d.data.map((item) => item.y)))
    const yScale = d3.scaleLinear().domain([1, maxRank]).range([0, height])

    // Color scale
    const colorScale = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => d.id))
      .range(d3.schemeCategory10)

    // Grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(maxRank))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.3)
      .attr("stroke-dasharray", "3,3")

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", textColor)
      .style("text-anchor", "middle")

    // Y-axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale).ticks(maxRank))
      .selectAll("text")
      .attr("fill", textColor)

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("fill", textColor)
      .attr("text-anchor", "middle")
      .text("Rank")

    // Line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.x)!)
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Lines and dots
    data.forEach((series) => {
      const group = svg.append("g")

      // Line path
      group
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("stroke", colorScale(series.id))
        .attr("stroke-width", 2.5)
        .attr("d", line)

      // Circles
      group
        .selectAll("circle")
        .data(series.data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x)!)
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 6)
        .attr("fill", colorScale(series.id))
        .attr("stroke", isDarkTheme ? "#000" : "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function (event, d) {
          d3.select(this).transition().duration(200).attr("r", 8)

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

    // Legend
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
        .style("font-size", "12px")
        .text(series.id)
    })
  }, [data, theme, toast])

  return (
    <div className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full overflow-visible" style={{ minHeight: "400px" }} />
    </div>
  )
}
