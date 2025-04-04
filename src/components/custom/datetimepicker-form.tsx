"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export default function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [selectedTab, setSelectedTab] = React.useState<"date" | "time">("date")

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) {
        setDate(undefined)
        return
      }

      const currentDate = date ? new Date(date) : new Date()

      if (selectedTab === "date") {
        currentDate.setFullYear(selectedDate.getFullYear())
        currentDate.setMonth(selectedDate.getMonth())
        currentDate.setDate(selectedDate.getDate())
      }

      setDate(currentDate)
    },
    [date, setDate, selectedTab],
  )

  const handleTimeChange = React.useCallback(
    (type: "hours" | "minutes", value: string) => {
      if (!date) {
        const newDate = new Date()
        if (type === "hours") {
          newDate.setHours(Number.parseInt(value))
        } else {
          newDate.setMinutes(Number.parseInt(value))
        }
        setDate(newDate)
        return
      }

      const newDate = new Date(date)
      if (type === "hours") {
        newDate.setHours(Number.parseInt(value))
      } else {
        newDate.setMinutes(Number.parseInt(value))
      }
      setDate(newDate)
    },
    [date, setDate],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPp") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "date" | "time")}>
          <div className="flex items-center justify-between px-3 pt-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Date</span>
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="date" className="p-3">
            <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
          </TabsContent>
          <TabsContent value="time" className="p-3">
            <div className="flex items-center gap-2">
              <div className="grid gap-1 text-center">
                <div className="text-sm font-medium">Hours</div>
                <Select
                  value={date ? date.getHours().toString() : undefined}
                  onValueChange={(value) => handleTimeChange("hours", value)}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xl">:</div>
              <div className="grid gap-1 text-center">
                <div className="text-sm font-medium">Minutes</div>
                <Select
                  value={date ? date.getMinutes().toString() : undefined}
                  onValueChange={(value) => handleTimeChange("minutes", value)}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

