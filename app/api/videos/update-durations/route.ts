import { getVideosCollection } from "@/lib/collections"
import { NextResponse } from "next/server"
import { extractYouTubeVideoId, parseISO8601Duration, getYouTubeThumbnail } from "@/lib/youtube"

/**
 * Update all videos in database with real YouTube durations
 * This is a one-time utility endpoint
 */
export async function POST() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "YOUTUBE_API_KEY not configured",
          message: "Please add YOUTUBE_API_KEY to your .env.local file"
        },
        { status: 400 }
      )
    }

    const videos = await getVideosCollection()
    const allVideos = await videos.find({}).toArray()

    const results = []

    for (const video of allVideos) {
      try {
        const videoId = extractYouTubeVideoId(video.url)
        
        if (!videoId) {
          results.push({
            _id: video._id,
            title: video.title,
            status: "error",
            message: "Invalid YouTube URL"
          })
          continue
        }

        // Fetch from YouTube Data API
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${apiKey}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          results.push({
            _id: video._id,
            title: video.title,
            status: "error",
            message: `API error: ${response.status}`
          })
          continue
        }

        const data = await response.json()

        if (!data.items || data.items.length === 0) {
          results.push({
            _id: video._id,
            title: video.title,
            status: "error",
            message: "Video not found on YouTube"
          })
          continue
        }

        const ytVideo = data.items[0]
        const duration = parseISO8601Duration(ytVideo.contentDetails.duration)
        const thumbnail = ytVideo.snippet.thumbnails.high.url

        // Update video in database
        await videos.updateOne(
          { _id: video._id },
          {
            $set: {
              duration,
              thumbnail,
              title: ytVideo.snippet.title, // Update title too
              description: ytVideo.snippet.description,
              updatedAt: new Date()
            }
          }
        )

        results.push({
          _id: video._id,
          title: video.title,
          status: "success",
          duration,
          message: `Updated to ${Math.floor(duration / 60)} min ${duration % 60} sec`
        })

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        results.push({
          _id: video._id,
          title: video.title,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    return NextResponse.json({
      success: true,
      totalVideos: allVideos.length,
      results
    })

  } catch (error) {
    console.error("Error updating video durations:", error)
    return NextResponse.json(
      { error: "Failed to update video durations" },
      { status: 500 }
    )
  }
}
