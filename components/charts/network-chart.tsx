"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as d3 from "d3"
import { useToast } from "@/components/ui/use-toast"

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string
  group: number
  value: number
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum
  target: string | NodeDatum
  value: number
}

interface NetworkChartProps {
  data: {
    nodes: NodeDatum[]
    links: LinkDatum[]
  }
}

export function NetworkChart({ data }: NetworkChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    if (!svgRef.current || !data?.nodes?.length || !data?.links?.length) return

    const isDarkTheme = theme === "dark"
    const textColor = isDarkTheme ? "#e1e1e6" : "#1a1a1a"

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    svg.attr("viewBox", `0 0 ${width} ${height}`)

    const colorScale = d3
      .scaleOrdinal<number, string>()
      .domain([1, 2])
      .range(["#3b82f6", "#10b981"])

    const simulation = d3
      .forceSimulation<NodeDatum>(data.nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(data.links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<NodeDatum>().radius((d) => Math.sqrt(d.value) * 2 + 10)
      )

    // Drag handlers
    function drag(simulation: d3.Simulation<NodeDatum, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGGElement, NodeDatum, NodeDatum>) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: d3.D3DragEvent<SVGGElement, NodeDatum, NodeDatum>) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event: d3.D3DragEvent<SVGGElement, NodeDatum, NodeDatum>) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3
        .drag<SVGGElement, NodeDatum>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    }

    // Links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value))

    // Nodes
    const node = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation) as any) // fix for TypeScript call compatibility
      .on("mouseover", (event, d) => {
        link
          .attr("stroke-opacity", (l) =>
            (typeof l.source === "object" && l.source.id === d.id) ||
            (typeof l.target === "object" && l.target.id === d.id)
              ? 1
              : 0.1
          )
          .attr("stroke", (l) =>
            (typeof l.source === "object" && l.source.id === d.id) ||
            (typeof l.target === "object" && l.target.id === d.id)
              ? "#ff9800"
              : "#999"
          )

        toast({
          title: d.id,
          description: `Group: ${d.group === 1 ? "Employee" : "Project"}, Value: ${d.value}`,
          duration: 2000,
        })
      })
      .on("mouseout", () => {
        link.attr("stroke-opacity", 0.6).attr("stroke", "#999")
      })

    // Circles
    node
      .append("circle")
      .attr("r", (d) => Math.sqrt(d.value) * 2 + 5)
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", isDarkTheme ? "#000" : "#fff")
      .attr("stroke-width", 1.5)

    // Labels
    node
      .append("text")
      .attr("x", 0)
      .attr("y", (d) => -Math.sqrt(d.value) * 2 - 7)
      .attr("text-anchor", "middle")
      .attr("fill", textColor)
      .text((d) => d.id)
      .style("font-size", "10px")
      .style("pointer-events", "none")

    // Tick updates
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (typeof d.source === "object" ? d.source.x! : 0))
        .attr("y1", (d) => (typeof d.source === "object" ? d.source.y! : 0))
        .attr("x2", (d) => (typeof d.target === "object" ? d.target.x! : 0))
        .attr("y2", (d) => (typeof d.target === "object" ? d.target.y! : 0))

      node.attr("transform", (d) => `translate(${d.x},${d.y})`)
    })

    // Legend
    const legend = svg.append("g").attr("transform", `translate(20, 20)`)

    const legendData = [
      { label: "Employee", color: colorScale(1) },
      { label: "Project", color: colorScale(2) },
    ]

    legendData.forEach((item, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`)
      row.append("rect").attr("width", 10).attr("height", 10).attr("fill", item.color)
      row
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
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
