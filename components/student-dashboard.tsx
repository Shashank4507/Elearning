"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoCard } from "./video-card"
import { WatchHistoryTable } from "./watch-history-table"
import { ContinueWatching } from "./continue-watching"
import { PlayCircle, Clock, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

interface StudentDashboardProps {
  studentId: string
  studentName: string
}

export function StudentDashboard({ studentId, studentName }: StudentDashboardProps) {
  const [videos, setVideos] = useState<any[]>([])
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [stats, setStats] = useState({ totalWatched: 0, completed: 0, totalHours: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, historyRes] = await Promise.all([
          fetch(`/api/videos`),
          fetch(`/api/watch-history?studentId=${studentId}`),
        ])

        const videosData = await videosRes.json()
        const historyData = await historyRes.json()

        setVideos(videosData)
        setWatchHistory(historyData)

        // Calculate stats
        const completed = historyData.filter((h: any) => h.completed).length
        const totalHours = historyData.reduce((sum: number, h: any) => sum + h.duration, 0) / 3600

        setStats({
          totalWatched: historyData.length,
          completed,
          totalHours: Math.round(totalHours * 10) / 10,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Continue Watching Section */}
      <ContinueWatching studentId={studentId} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Videos Watched</p>
              <p className="text-3xl font-bold">{stats.totalWatched}</p>
            </div>
            <PlayCircle className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Hours Watched</p>
              <p className="text-3xl font-bold">{stats.totalHours}h</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
              <p className="text-3xl font-bold">
                {stats.totalWatched > 0 ? Math.round((stats.completed / stats.totalWatched) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Available Videos</TabsTrigger>
          <TabsTrigger value="history">Watch History</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                id={video._id}
                title={video.title}
                thumbnail={video.thumbnail || "/video-thumbnail.png"}
                duration={video.duration}
                views={video.views}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Watch History</h3>
            {watchHistory.length > 0 ? (
              <WatchHistoryTable data={watchHistory} />
            ) : (
              <p className="text-muted-foreground text-center py-8">No watch history yet</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Link href="/analytics">
          <Button>View Full Analytics</Button>
        </Link>
      </div>
    </div>
  )
}
