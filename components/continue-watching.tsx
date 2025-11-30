"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ContinueWatchingProps {
  studentId: string
}

interface LastWatchedVideo {
  videoId: string
  videoTitle: string
  videoThumbnail: string
  duration: number
  totalDuration: number
  progress: number
  watchedAt: Date
}

export function ContinueWatching({ studentId }: ContinueWatchingProps) {
  const [lastVideo, setLastVideo] = useState<LastWatchedVideo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLastWatched = async () => {
      try {
        const response = await fetch(`/api/watch-history/last?studentId=${studentId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.videoId) {
            setLastVideo(data)
          }
        }
      } catch (error) {
        console.error("Error fetching last watched video:", error)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchLastWatched()
    }
  }, [studentId])

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-muted rounded"></div>
      </Card>
    )
  }

  if (!lastVideo) {
    return null
  }

  const progressPercent = Math.round(lastVideo.progress)
  const remainingTime = Math.round((lastVideo.totalDuration - lastVideo.duration) / 60)
  const isNearlyComplete = progressPercent >= 90

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-bold">
          {isNearlyComplete ? "Watch Again" : "Continue Watching"}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <img
            src={lastVideo.videoThumbnail || "/video-thumbnail.png"}
            alt={lastVideo.videoTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Play className="h-12 w-12 text-white" />
          </div>
          {/* Progress bar overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {lastVideo.videoTitle}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {isNearlyComplete
                    ? "Completed"
                    : `${remainingTime} min remaining`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-blue-500">{progressPercent}%</span>
                <span>watched</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/video/${lastVideo.videoId}`} className="flex-1">
              <Button className="w-full gap-2">
                <Play className="h-4 w-4" />
                {isNearlyComplete ? "Watch Again" : "Resume"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
