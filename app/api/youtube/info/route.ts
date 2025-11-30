import { NextRequest, NextResponse } from "next/server"
import { extractYouTubeVideoId, parseISO8601Duration, getYouTubeThumbnail } from "@/lib/youtube"

/**
 * Fetch YouTube video information including duration
 * Requires YOUTUBE_API_KEY in environment variables
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const videoUrl = searchParams.get("url")

    if (!videoUrl) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 })
    }

    const videoId = extractYouTubeVideoId(videoUrl)
    
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    // Check if YouTube API key is configured
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      // Fallback: Return basic info without API
      console.warn("YOUTUBE_API_KEY not configured. Returning basic info.")
      
      return NextResponse.json({
        videoId,
        title: "YouTube Video", // Placeholder
        duration: 600, // Default 10 minutes
        thumbnail: getYouTubeThumbnail(videoUrl, 'high'),
        description: "",
        channelTitle: "",
        viewCount: 0,
        warning: "YouTube API key not configured. Using default duration."
      })
    }

    // Fetch from YouTube Data API
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${apiKey}`
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const video = data.items[0]
    const duration = parseISO8601Duration(video.contentDetails.duration)

    return NextResponse.json({
      videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
      duration, // in seconds
      viewCount: parseInt(video.statistics.viewCount || "0", 10),
      publishedAt: video.snippet.publishedAt,
    })
  } catch (error) {
    console.error("Error fetching YouTube info:", error)
    return NextResponse.json(
      { error: "Failed to fetch video information" },
      { status: 500 }
    )
  }
}
