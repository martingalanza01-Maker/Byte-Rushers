"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProfileCard } from "@/components/profile-card"
import { useRouter } from "next/navigation"
import { FileText, MessageSquare, Bell, Users, Clock, CheckCircle, AlertCircle, Plus, Eye, QrCode } from "lucide-react"
import { Navbar } from "@/components/navbar"

interface DashboardStats {
  totalComplaints: number
  pendingComplaints: number
  resolvedComplaints: number
  totalDocuments: number
  pendingDocuments: number
  readyDocuments: number
  unreadAnnouncements: number
}

interface RecentActivity {
  id: string
  type: "complaint" | "document" | "announcement"
  title: string
  description: string
  date: string
  status: "pending" | "processing" | "completed" | "new"
}

export default function ResidentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    readyDocuments: 0,
    unreadAnnouncements: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)

      // Mock data - in real app, fetch from API
      setStats({
        totalComplaints: 3,
        pendingComplaints: 1,
        resolvedComplaints: 2,
        totalDocuments: 5,
        pendingDocuments: 2,
        readyDocuments: 1,
        unreadAnnouncements: 2,
      })

      setRecentActivity([
        {
          id: "1",
          type: "document",
          title: "Barangay Clearance",
          description: "Your barangay clearance is ready for pickup",
          date: "2024-01-15",
          status: "completed",
        },
        {
          id: "2",
          type: "complaint",
          title: "Street Light Issue",
          description: "Your complaint about broken street lights is being processed",
          date: "2024-01-14",
          status: "processing",
        },
        {
          id: "3",
          type: "announcement",
          title: "Community Meeting",
          description: "Monthly community meeting scheduled for next week",
          date: "2024-01-13",
          status: "new",
        },
        {
          id: "4",
          type: "document",
          title: "Certificate of Residency",
          description: "Document request submitted and under review",
          date: "2024-01-12",
          status: "pending",
        },
      ])
    }
    setIsLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-0"
      case "processing":
        return "bg-blue-100 text-blue-800 border-0"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-0"
      case "new":
        return "bg-purple-100 text-purple-800 border-0"
      default:
        return "bg-gray-100 text-gray-800 border-0"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "new":
        return <Bell className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return <MessageSquare className="h-4 w-4 text-red-500" />
      case "document":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "announcement":
        return <Bell className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to access your dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Navbar user={user} />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name?.split(" ")[0] || "Resident"}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your barangay services</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard className="sticky top-24" />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Complaints Stats */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-red-600" />
                        <span className="text-red-800">Complaints</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-0">{stats.totalComplaints}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-medium text-yellow-700">{stats.pendingComplaints}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Resolved</span>
                        <span className="font-medium text-green-700">{stats.resolvedComplaints}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push("/resident/complaints/new")}
                      className="w-full mt-4 bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      File Complaint
                    </Button>
                  </CardContent>
                </Card>

                {/* Documents Stats */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-800">Documents</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-0">{stats.totalDocuments}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending</span>
                        <span className="font-medium text-yellow-700">{stats.pendingDocuments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ready</span>
                        <span className="font-medium text-green-700">{stats.readyDocuments}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push("/resident/documents/request")}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Request Document
                    </Button>
                  </CardContent>
                </Card>

                {/* Announcements Stats */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-purple-600" />
                        <span className="text-purple-800">Updates</span>
                      </div>
                      {stats.unreadAnnouncements > 0 && (
                        <Badge className="bg-purple-100 text-purple-800 border-0">
                          {stats.unreadAnnouncements} new
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Unread</span>
                        <span className="font-medium text-purple-700">{stats.unreadAnnouncements}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">This week</span>
                        <span className="font-medium text-gray-700">5</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push("/announcements")}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Your latest interactions with barangay services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={activity.id}>
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(activity.status)}>
                                  {getStatusIcon(activity.status)}
                                  <span className="ml-1 capitalize">{activity.status}</span>
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>

                  {recentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activity</p>
                      <p className="text-sm text-gray-400">Your interactions will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Common tasks and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      onClick={() => router.push("/resident/complaints/new")}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-red-50 hover:border-red-200"
                    >
                      <MessageSquare className="h-6 w-6 text-red-600" />
                      <span className="text-sm font-medium">File Complaint</span>
                    </Button>

                    <Button
                      onClick={() => router.push("/resident/documents/request")}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <FileText className="h-6 w-6 text-blue-600" />
                      <span className="text-sm font-medium">Request Document</span>
                    </Button>

                    <Button
                      onClick={() => router.push("/announcements")}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200"
                    >
                      <Bell className="h-6 w-6 text-purple-600" />
                      <span className="text-sm font-medium">View Announcements</span>
                    </Button>

                    <Button
                      onClick={() => router.push("/resident/profile")}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200"
                    >
                      <QrCode className="h-6 w-6 text-green-600" />
                      <span className="text-sm font-medium">My QR Code</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
