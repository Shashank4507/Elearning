"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface YouTubePlayerProps {
  videoId: string
  videoUrl: string
  title: string
  studentId: string
  totalDuration: number
  startTime?: number
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function YouTubePlayer({ videoId, videoUrl, title, studentId, totalDuration, startTime = 0 }: YouTubePlayerProps) {
  const [progress, setProgress] = useState((startTime / totalDuration) * 100)
  const [watchTime, setWatchTime] = useState(startTime)
  const [showResumeNotice, setShowResumeNotice] = useState(startTime > 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const youtubeId = getYouTubeVideoId(videoUrl)
  
  // Format duration for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  // Hide resume notice after 5 seconds
  useEffect(() => {
    if (showResumeNotice) {
      const timer = setTimeout(() => setShowResumeNotice(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showResumeNotice])

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  // Initialize YouTube player
  useEffect(() => {
    if (!youtubeId || !containerRef.current) return

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            start: Math.floor(startTime),
          },
          events: {
            onStateChange: (event: any) => {
              // YT.PlayerState.PLAYING = 1
              // YT.PlayerState.PAUSED = 2
              // YT.PlayerState.ENDED = 0
              setIsPlaying(event.data === 1)
            },
          },
        })
      }
    }

    if (window.YT) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }
  }, [youtubeId, startTime])

  // Track watch time only when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const currentTime = playerRef.current.getCurrentTime()
          setWatchTime(currentTime)
          
          const newProgress = (currentTime / totalDuration) * 100
          setProgress(Math.min(newProgress, 100))
          
          // Save progress every 30 seconds
          if (Math.floor(currentTime) % 30 === 0) {
            saveProgress(currentTime, newProgress)
          }
        }
      }, 1000) // Check every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, totalDuration])

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (watchTime > 0) {
        saveProgress(watchTime, progress)
      }
    }
  }, [])

  const saveProgress = async (duration: number, progressPercent: number) => {
    try {
      await fetch("/api/watch-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          videoId,
          duration: Math.floor(duration),
          totalDuration,
          completed: progressPercent >= 90,
        }),
      })
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  if (!youtubeId) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Invalid YouTube URL</p>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative bg-black aspect-video">
        {/* YouTube Player Container */}
        <div 
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Resume Notice */}
        {showResumeNotice && startTime > 0 && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 z-10">
            <p className="text-sm font-medium">
              Resuming from {Math.floor(startTime / 60)}:{String(Math.floor(startTime % 60)).padStart(2, '0')}
            </p>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex items-center justify-between">
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Watch Progress</p>
              {isPlaying && (
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Playing
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% Complete • {formatTime(Math.floor(watchTime))} watched
              {startTime > 0 && " • Resumed from last position"}
            </p>
            <p className="text-xs text-muted-foreground italic">
              Progress tracks only when video is playing • Auto-saved every 30 seconds
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
