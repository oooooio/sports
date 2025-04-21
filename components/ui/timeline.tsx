import * as React from "react"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-4", className)} {...props} />,
)
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("relative pl-8", className)} {...props} />,
)
TimelineItem.displayName = "TimelineItem"

const TimelineConnector = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute left-3.5 top-8 h-full w-px -translate-x-1/2 bg-border", className)}
      {...props}
    />
  ),
)
TimelineConnector.displayName = "TimelineConnector"

const TimelineHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />,
)
TimelineHeader.displayName = "TimelineHeader"

const TimelineIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute left-0 flex h-7 w-7 items-center justify-center rounded-full bg-background", className)}
      {...props}
    />
  ),
)
TimelineIcon.displayName = "TimelineIcon"

const TimelineBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("pt-2", className)} {...props} />,
)
TimelineBody.displayName = "TimelineBody"

const TimelineTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm font-semibold", className)} {...props} />,
)
TimelineTitle.displayName = "TimelineTitle"

const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm", className)} {...props} />,
)
TimelineContent.displayName = "TimelineContent"

const TimelineDot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("absolute left-0 top-0 flex h-7 w-7 items-center justify-center", className)}
      {...props}
    />
  ),
)
TimelineDot.displayName = "TimelineDot"

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  TimelineTitle,
  TimelineContent,
  TimelineDot,
}
