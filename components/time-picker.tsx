"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimePicker({ value, onChange, placeholder = "Select time", className }: TimePickerProps) {
  const [hours, setHours] = React.useState<string>(value ? value.split(":")[0] : "")
  const [minutes, setMinutes] = React.useState<string>(value ? value.split(":")[1] : "")
  const [period, setPeriod] = React.useState<string>(
    value ? (Number.parseInt(value.split(":")[0]) >= 12 ? "PM" : "AM") : "AM",
  )

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value
    if (
      newHours === "" ||
      (/^\d+$/.test(newHours) && Number.parseInt(newHours) >= 1 && Number.parseInt(newHours) <= 12)
    ) {
      setHours(newHours)
      updateTime(newHours, minutes, period)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value
    if (
      newMinutes === "" ||
      (/^\d+$/.test(newMinutes) && Number.parseInt(newMinutes) >= 0 && Number.parseInt(newMinutes) <= 59)
    ) {
      setMinutes(newMinutes)
      updateTime(hours, newMinutes, period)
    }
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    updateTime(hours, minutes, newPeriod)
  }

  const updateTime = (h: string, m: string, p: string) => {
    if (h && m) {
      let hour = Number.parseInt(h)
      if (p === "PM" && hour < 12) hour += 12
      if (p === "AM" && hour === 12) hour = 0
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = m.padStart(2, "0")
      onChange(`${formattedHour}:${formattedMinute}`)
    } else {
      onChange("")
    }
  }

  const displayTime = value ? `${hours || ""}:${minutes || ""} ${period}` : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex items-center space-x-2">
          <div className="grid gap-1">
            <div className="text-xs font-medium">Hours</div>
            <Input value={hours} onChange={handleHoursChange} className="w-16" placeholder="HH" maxLength={2} />
          </div>
          <div className="text-xl">:</div>
          <div className="grid gap-1">
            <div className="text-xs font-medium">Minutes</div>
            <Input value={minutes} onChange={handleMinutesChange} className="w-16" placeholder="MM" maxLength={2} />
          </div>
          <div className="grid gap-1">
            <div className="text-xs font-medium">Period</div>
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-16">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
