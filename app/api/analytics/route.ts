import { getWatchHistoryCollection, getVideosCollection } from "@/lib/collections"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 })
    }

    const watchHistory = await getWatchHistoryCollection()
    const videos = await getVideosCollection()

    // Get all watch history for student
    const history = await watchHistory.find({ studentId: new ObjectId(studentId) }).toArray()

    // Calculate statistics
    const totalMinutes = Math.round(history.reduce((sum, h) => sum + h.duration, 0) / 60)

    const videosCompleted = history.filter((h) => h.completed).length

    // Calculate current streak (consecutive days watching)
    const uniqueDays = new Set(history.map((h) => new Date(h.watchedAt).toDateString()))
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      if (uniqueDays.has(date.toDateString())) {
        currentStreak++
      } else if (i > 0) {
        break
      }
    }

    // Calculate average completion rate
    const averageCompletion =
      history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.progress, 0) / history.length) : 0

    // Get weekly watch data (last 7 days)
    const weekData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      const dayMinutes = history
        .filter((h) => {
          const hDate = new Date(h.watchedAt)
          hDate.setHours(0, 0, 0, 0)
          return hDate.getTime() === date.getTime()
        })
        .reduce((sum, h) => sum + Math.floor(h.duration / 60), 0)

      return { day: dayName, minutes: dayMinutes }
    })

    // Get category data (mock - based on video titles)
    const videoTitles = await videos.find({ _id: { $in: history.map((h) => h.videoId) } }).toArray()

    const categoryMap = new Map<string, { count: number; completion: number }>()

    videoTitles.forEach((video) => {
      const category = video.title.split(" ")[0]
      const watchCount = history.filter((h) => h.videoId.equals(video._id))
      const avgCompletion =
        watchCount.length > 0 ? Math.round(watchCount.reduce((sum, h) => sum + h.progress, 0) / watchCount.length) : 0

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, completion: 0 })
      }
      const curr = categoryMap.get(category)!
      curr.count++
      curr.completion = avgCompletion
    })

    const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      completion: data.completion,
    }))

    return NextResponse.json({
      stats: {
        totalMinutes,
        videosCompleted,
        currentStreak,
        averageCompletion,
      },
      weekData: weekData.reverse(),
      categoryData: categoryData.slice(0, 5),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
