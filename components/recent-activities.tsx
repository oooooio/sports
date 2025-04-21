import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type RecentActivitiesProps = {
  type: "training" | "match"
}

export function RecentActivities({ type }: RecentActivitiesProps) {
  // Mock data
  const trainingActivities = [
    {
      id: 1,
      title: "Basic Fitness Training",
      date: "2023-03-15",
      attendance: "18/20",
      coach: "Coach Lee",
    },
    {
      id: 2,
      title: "Tactical Coordination Training",
      date: "2023-03-13",
      attendance: "20/20",
      coach: "Coach Wang",
    },
    {
      id: 3,
      title: "Shooting Skills Training",
      date: "2023-03-10",
      attendance: "19/20",
      coach: "Coach Zhang",
    },
  ]

  const matchActivities = [
    {
      id: 1,
      title: "vs Beijing Team",
      date: "2023-03-05",
      result: "Win 3-1",
      location: "Home",
    },
    {
      id: 2,
      title: "vs Shanghai Team",
      date: "2023-02-25",
      result: "Loss 1-2",
      location: "Away",
    },
  ]

  const activities = type === "training" ? trainingActivities : matchActivities

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{type === "training" ? "T" : "M"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{activity.date}</span>
              {type === "training" ? (
                <>
                  <span>•</span>
                  <span>Attendance: {activity.attendance}</span>
                  <span>•</span>
                  <span>Coach: {activity.coach}</span>
                </>
              ) : (
                <>
                  <span>•</span>
                  <span>{activity.result}</span>
                  <span>•</span>
                  <span>{activity.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
