import { Card } from "@/components/ui/card"
import { TrendingUp, Clock, BookOpen, Target } from "lucide-react"

interface AnalyticsSummaryProps {
  stats: {
    totalMinutes: number
    videosCompleted: number
    currentStreak: number
    averageCompletion: number
  }
}

export function AnalyticsSummary({ stats }: AnalyticsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Minutes</p>
            <p className="text-2xl font-bold">{stats.totalMinutes}</p>
            <p className="text-xs text-muted-foreground mt-1">hours watched</p>
          </div>
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold">{stats.videosCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1">videos</p>
          </div>
          <BookOpen className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-500" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Completion</p>
            <p className="text-2xl font-bold">{stats.averageCompletion}%</p>
            <p className="text-xs text-muted-foreground mt-1">rate</p>
          </div>
          <Target className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
    </div>
  )
}
