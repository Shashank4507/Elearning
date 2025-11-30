import { getVideosCollection } from "@/lib/collections"
import { NextResponse } from "next/server"
import { getDurationByTitle, formatDuration } from "@/lib/duration-parser"

/**
 * Update all videos with manual durations
 * No YouTube API key needed!
 */
async function updateDurations() {
  try {
    const videos = await getVideosCollection()
    const allVideos = await videos.find({}).toArray()

    const results = []

    for (const video of allVideos) {
      try {
        // Get duration based on video title
        const duration = getDurationByTitle(video.title)

        // Update video in database
        await videos.updateOne(
          { _id: video._id },
          {
            $set: {
              duration,
              updatedAt: new Date()
            }
          }
        )

        results.push({
          _id: video._id,
          title: video.title,
          status: "success",
          duration,
          formatted: formatDuration(duration),
          message: `Updated to ${formatDuration(duration)}`
        })

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

// Support both GET and POST methods
export async function GET() {
  return updateDurations()
}

export async function POST() {
  return updateDurations()
}
