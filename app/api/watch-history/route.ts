import { getWatchHistoryCollection, getVideosCollection } from "@/lib/collections"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { studentId, videoId, duration, totalDuration, completed } = await req.json()

    if (!studentId || !videoId || duration === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const watchHistory = await getWatchHistoryCollection()
    const progress = (duration / totalDuration) * 100
    const isCompleted = completed || progress >= 90

    // Use updateOne with upsert to update existing record or create new one
    const result = await watchHistory.updateOne(
      {
        studentId: new ObjectId(studentId),
        videoId: new ObjectId(videoId),
      },
      {
        $set: {
          watchedAt: new Date(),
          duration,
          totalDuration,
          completed: isCompleted,
          progress,
        },
        $setOnInsert: {
          studentId: new ObjectId(studentId),
          videoId: new ObjectId(videoId),
          firstWatchedAt: new Date(),
        },
      },
      { upsert: true }
    )

    // Update video view count only on first watch
    if (result.upsertedCount > 0) {
      const videos = await getVideosCollection()
      await videos.updateOne({ _id: new ObjectId(videoId) }, { $inc: { views: 1 } })
    }

    return NextResponse.json({ success: true, upsertedId: result.upsertedId })
  } catch (error) {
    console.error("Error saving watch history:", error)
    return NextResponse.json({ error: "Failed to save watch history" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 })
    }

    const watchHistory = await getWatchHistoryCollection()
    const videos = await getVideosCollection()
    
    // Get watch history
    const history = await watchHistory
      .find({ studentId: new ObjectId(studentId) })
      .sort({ watchedAt: -1 })
      .toArray()

    // Populate video details for each history entry
    const historyWithVideos = await Promise.all(
      history.map(async (entry) => {
        const video = await videos.findOne({ _id: entry.videoId })
        return {
          ...entry,
          videoTitle: video?.title || "Unknown Video",
          videoThumbnail: video?.thumbnail || "",
          videoUrl: video?.url || "",
        }
      })
    )

    return NextResponse.json(historyWithVideos)
  } catch (error) {
    console.error("Error fetching watch history:", error)
    return NextResponse.json({ error: "Failed to fetch watch history" }, { status: 500 })
  }
}
