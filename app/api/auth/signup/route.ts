import { getStudentsCollection } from "@/lib/collections"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const students = await getStudentsCollection()

    // Check if user already exists
    const existingStudent = await students.findOne({ email })
    if (existingStudent) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new student
    const result = await students.insertOne({
      name,
      email,
      password: hashedPassword,
      enrolledCourses: [],
      createdAt: new Date(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      studentId: result.insertedId,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
