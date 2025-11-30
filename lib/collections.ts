import clientPromise from "./mongodb"

export async function getStudentsCollection() {
  const client = await clientPromise
  return client.db("elearning").collection("students")
}

export async function getVideosCollection() {
  const client = await clientPromise
  return client.db("elearning").collection("videos")
}

export async function getWatchHistoryCollection() {
  const client = await clientPromise
  return client.db("elearning").collection("watchHistory")
}

export async function getCoursesCollection() {
  const client = await clientPromise
  return client.db("elearning").collection("courses")
}
