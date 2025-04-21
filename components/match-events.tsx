"use client"

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MatchEventsProps {
  match: any
}

export function MatchEvents({ match }: MatchEventsProps) {
  // Combine all events and sort by time
  const allEvents = [
    ...match.scorers.map((scorer: string) => {
      const [player, time] = scorer.split(" (")
      return {
        type: "goal",
        player,
        time: time.replace(")", ""),
        team: "home",
      }
    }),
    ...match.yellowCards.map((card: string) => {
      const [player, time] = card.split(" (")
      return {
        type: "yellowCard",
        player,
        time: time.replace(")", ""),
        team: "home",
      }
    }),
    ...match.redCards.map((card: string) => {
      const [player, time] = card.split(" (")
      return {
        type: "redCard",
        player,
        time: time.replace(")", ""),
        team: "home",
      }
    }),
  ].sort((a, b) => {
    const timeA = Number.parseInt(a.time)
    const timeB = Number.parseInt(b.time)
    return timeA - timeB
  })

  // Convert time string to display format
  const formatTime = (time: string) => {
    if (time.includes("+")) {
      const [minute, added] = time.split("+")
      return `${minute}'+${added}'`
    }
    return `${time}'`
  }

  // Get icon for event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽"
      case "yellowCard":
        return "🟨"
      case "redCard":
        return "🟥"
      default:
        return "•"
    }
  }

  // Get event description
  const getEventDescription = (event: any) => {
    switch (event.type) {
      case "goal":
        return `Goal scored by ${event.player}`
      case "yellowCard":
        return `Yellow card for ${event.player}`
      case "redCard":
        return `Red card for ${event.player}`
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Match Timeline</h3>
        <div className="text-xl font-bold">{match.score ? `${match.score.home} - ${match.score.away}` : "0 - 0"}</div>
      </div>

      {allEvents.length > 0 ? (
        <Timeline>
          {allEvents.map((event, index) => (
            <TimelineItem key={index}>
              {index !== allEvents.length - 1 && <TimelineConnector />}
              <TimelineHeader>
                <TimelineIcon className="p-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                    <span>{getEventIcon(event.type)}</span>
                  </div>
                </TimelineIcon>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formatTime(event.time)}</Badge>
                  <span className="font-medium">{getEventDescription(event)}</span>
                </div>
              </TimelineHeader>
              <TimelineBody className="pl-10">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{event.player.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{event.player}</span>
                </div>
              </TimelineBody>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No match events recorded</div>
      )}
    </div>
  )
}
