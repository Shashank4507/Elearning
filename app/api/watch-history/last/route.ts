import { getWatchHistoryCollection, getVideosCollection } from "@/lib/collections"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const studentId = searchParams.get("studentId")

    if (!studentId || !ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: "Invalid studentId" }, { status: 400 })
    }

    const watchHistory = await getWatchHistoryCollection()
    
    // Get the most recent watch history entry that's not completed
    const lastIncomplete = await watchHistory
      .find({ 
        studentId: new ObjectId(studentId),
        completed: false,
        progress: { $lt: 90 }
      })
      .sort({ watchedAt: -1 })
      .limit(1)
      .toArray()

    // If no incomplete video, get the most recent one (even if completed)
    let lastWatched = lastIncomplete[0]
    
    if (!lastWatched) {
      const anyRecent = await watchHistory
        .find({ studentId: new ObjectId(studentId) })
        .sort({ watchedAt: -1 })
        .limit(1)
        .toArray()
      
      lastWatched = anyRecent[0]
    }

    if (!lastWatched) {
      return NextResponse.json({ videoId: null })
    }

    // Get video details
    const videos = await getVideosCollection()
    const video = await videos.findOne({ _id: lastWatched.videoId })

    if (!video) {
      return NextResponse.json({ videoId: null })
    }

    return NextResponse.json({
      videoId: video._id.toString(),
      videoTitle: video.title,
      videoThumbnail: video.thumbnail,
      duration: lastWatched.duration,
      totalDuration: lastWatched.totalDuration,
      progress: lastWatched.progress,
      watchedAt: lastWatched.watchedAt,
    })
  } catch (error) {
    console.error("Error fetching last watched video:", error)
    return NextResponse.json({ error: "Failed to fetch last watched video" }, { status: 500 })
  }
}
