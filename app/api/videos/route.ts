import { getVideosCollection } from "@/lib/collections"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const courseId = searchParams.get("courseId")

    const videos = await getVideosCollection()
    const query = courseId ? { courseId: new ObjectId(courseId) } : {}

    const results = await videos.find(query).sort({ uploadedAt: -1 }).toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, courseId, duration, url, thumbnail } = await req.json()

    if (!title || !courseId || !duration || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const videosCollection = await getVideosCollection()
    const result = await videosCollection.insertOne({
      title,
      description,
      courseId: new ObjectId(courseId),
      duration,
      url,
      thumbnail,
      uploadedAt: new Date(),
      views: 0,
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
