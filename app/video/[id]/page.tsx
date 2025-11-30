"use client"

import { useParams, useRouter } from "next/navigation"
import { YouTubePlayer } from "@/components/youtube-player"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface VideoDetails {
  _id: string
  title: string
  description: string
  url: string
  duration: number
  views: number
}

export default function VideoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const videoId = params.id as string
  const [video, setVideo] = useState<VideoDetails | null>(null)
  const [lastWatchedPosition, setLastWatchedPosition] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return

      try {
        // Fetch video details
        const videoResponse = await fetch(`/api/videos/${videoId}`)
        
        if (videoResponse.ok) {
          const videoData = await videoResponse.json()
          setVideo(videoData)

          // Fetch last watched position for this video
          const historyResponse = await fetch(
            `/api/watch-history?studentId=${session.user.id}`
          )
          
          if (historyResponse.ok) {
            const historyData = await historyResponse.json()
            const thisVideoHistory = historyData.find(
              (h: any) => h.videoId.toString() === videoId
            )
            
            if (thisVideoHistory && !thisVideoHistory.completed) {
              setLastWatchedPosition(thisVideoHistory.duration)
            }
          }
        } else {
          setVideo(null)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setVideo(null)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchData()
    }
  }, [videoId, session])

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Video Player */}
        <YouTubePlayer
          videoId={videoId}
          videoUrl={video.url}
          title={video.title}
          studentId={session.user.id}
          totalDuration={video.duration}
          startTime={lastWatchedPosition}
        />

        {/* Video Description */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-2">{video.title}</h2>
          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <span>{video.views} views</span>
            <span>{Math.floor(video.duration / 60)} minutes</span>
          </div>
          <p className="text-muted-foreground">{video.description}</p>
        </Card>
      </div>
    </div>
  )
}
