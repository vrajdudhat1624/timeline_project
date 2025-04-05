"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter, ZoomIn, ZoomOut } from "lucide-react"
import { format } from "date-fns"

export function TimelineFilters() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex flex-wrap gap-2">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="website">Website Redesign</SelectItem>
          <SelectItem value="mobile">Mobile App</SelectItem>
          <SelectItem value="marketing">Marketing Campaign</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Team Members" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Team Members</SelectItem>
          <SelectItem value="alex">Alex Johnson</SelectItem>
          <SelectItem value="maria">Maria Garcia</SelectItem>
          <SelectItem value="david">David Kim</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date range</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <div className="flex gap-1">
        <Button variant="outline" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

