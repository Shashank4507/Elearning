"use client"

import { StudentDashboard } from "@/components/student-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Home, LayoutDashboard, Settings, LogOut, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      setLoading(false)
    }
  }, [status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } lg:block border-r bg-background/50 backdrop-blur transition-all`}
        >
          <div className="flex h-16 items-center gap-3 border-b px-6">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg">ELearn</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="Search courses" className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="default" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2"
              onClick={() => toast.info("My Courses feature coming soon!")}
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2"
              onClick={() => toast.info("Downloads feature coming soon!")}
            >
              <Home className="h-4 w-4" />
              Downloads
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2"
              onClick={() => toast.info("Settings feature coming soon!")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mb-4"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold">Welcome back, {session.user?.name}!</h1>
              <p className="text-muted-foreground">Track your learning progress and watch videos</p>
            </div>
          </div>

          {/* Student Dashboard Component */}
          <StudentDashboard studentId={session.user?.id || ""} studentName={session.user?.name || "Student"} />
        </main>
      </div>
    </div>
  )
}
