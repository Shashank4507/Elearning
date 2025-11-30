import type { ObjectId } from "mongodb"

export interface Student {
  _id?: ObjectId
  email: string
  name: string
  enrolledCourses: ObjectId[]
  joinedAt: Date
  lastActive: Date
}

export interface Video {
  _id?: ObjectId
  title: string
  description: string
  courseId: ObjectId
  duration: number // in seconds
  url: string
  thumbnail: string
  uploadedAt: Date
  views: number
}

export interface WatchHistory {
  _id?: ObjectId
  studentId: ObjectId
  videoId: ObjectId
  watchedAt: Date
  duration: number // seconds watched
  totalDuration: number // total video duration
  completed: boolean
  progress: number // percentage
}

export interface Course {
  _id?: ObjectId
  title: string
  description: string
  instructor: string
  videos: ObjectId[]
  createdAt: Date
  students: ObjectId[]
}
