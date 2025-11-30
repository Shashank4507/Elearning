"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"

interface VideoPlayerProps {
  videoId: string
  videoUrl: string
  title: string
  studentId: string
  totalDuration: number
}

export function VideoPlayer({ videoId, videoUrl, title, studentId, totalDuration }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [loading, setLoading] = useState(false)

  // Save watch history on unmount or every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        saveProgress()
      }
    }, 30000) // Save every 30 seconds

    return () => clearInterval(interval)
  }, [isPlaying, currentTime, videoId])

  // Save progress on video end
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      saveProgress()
    }

    video.addEventListener("ended", handleEnded)
    return () => video.removeEventListener("ended", handleEnded)
  }, [videoId])

  const saveProgress = async () => {
    try {
      await fetch("/api/watch-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          videoId,
          duration: Math.floor(currentTime),
          totalDuration,
          completed: progress >= 90,
        }),
      })
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const duration = videoRef.current.duration
      setCurrentTime(current)
      setProgress((current / duration) * 100)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (Number.parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
      setProgress(Number.parseFloat(e.target.value))
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + seconds)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full bg-black overflow-hidden">
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setLoading(false)}
          className="w-full h-full"
        />

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">Loading...</div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
          />

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <Button size="sm" variant="ghost" onClick={handlePlayPause} className="hover:bg-white/20">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              {/* Skip Buttons */}
              <Button size="sm" variant="ghost" onClick={() => skip(-10)} className="hover:bg-white/20">
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button size="sm" variant="ghost" onClick={() => skip(10)} className="hover:bg-white/20">
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Volume Control */}
              <div className="flex items-center gap-1 ml-2">
                <Button size="sm" variant="ghost" onClick={toggleMute} className="hover:bg-white/20">
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Time Display */}
              <div className="ml-4 text-sm text-white font-mono">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </div>
            </div>

            {/* Fullscreen */}
            <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="hover:bg-white/20">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Watch Progress</p>
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% Complete</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
