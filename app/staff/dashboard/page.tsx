"use client"

import { useRouter } from "next/navigation"

import { apiFetch } from "@/lib/api"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Brain,
  Shield,
  Star,
  Zap,
  Target,
  Award,
  BarChart3,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import Image from "next/image"

export default function StaffDashboard() {
  const [user] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@manggahan.gov.ph",
    avatar: "/placeholder.svg?height=40&width=40",
    type: "staff" as const,
    position: "Barangay Secretary",
    hall: "Napico Hall",
    employeeId: "EMP-2024-001",
  })

  const [stats, setStats] = useState({
    totalResidents: 0,
    pendingRequests: 0,
    completedToday: 0,
    activeComplaints: 0,
    documentsProcessed: 0,
    responseTime: 0,
  })

  const [recentTasks] = useState([
    {
      id: 1,
      type: "document",
      title: "Barangay Clearance - Maria Santos",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-16",
      description: "Employment requirement - urgent processing needed",
    },
    {
      id: 2,
      type: "complaint",
      title: "Street Light Repair - Block 5",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-01-18",
      description: "Maintenance team assigned, work in progress",
    },
    {
      id: 3,
      type: "verification",
      title: "Document Verification - QR Code",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-15",
      description: "Certificate authenticity verified successfully",
    },
  ])

  const [quickActions] = useState([
    {
      title: "ML Analytics",
      description: "AI-powered insights and predictions",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      link: "/staff/ml-analytics",
      featured: true,
    },
    {
      title: "Verify Documents",
      description: "QR code verification system",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      link: "/staff/documents/verify",
      featured: true,
    },
    {
      title: "Process Requests",
      description: "Handle resident document requests",
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      link: "/staff/requests",
      featured: false,
    },
    {
      title: "Manage Complaints",
      description: "Review and resolve complaints",
      icon: MessageSquare,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
      link: "/staff/complaints",
      featured: false,
    },
  ])

  // Animate stats on load
  
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await apiFetch('/auth/me');
        if (cancelled) return;
        if (!me?.authenticated) { router.replace('/'); return; }
        const t = String(me.user?.type || 'resident').toLowerCase();
        if (t !== 'staff') { router.replace('/resident/dashboard'); return; }
      } catch { router.replace('/'); }
    })();
    return () => { cancelled = true; };
  }, []);

useEffect(() => {
    const targetStats = {
      totalResidents: 15420,
      pendingRequests: 23,
      completedToday: 47,
      activeComplaints: 12,
      documentsProcessed: 156,
      responseTime: 2.4,
    }

    const animateStats = () => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps

        setStats({
          totalResidents: Math.floor(targetStats.totalResidents * progress),
          pendingRequests: Math.floor(targetStats.pendingRequests * progress),
          completedToday: Math.floor(targetStats.completedToday * progress),
          activeComplaints: Math.floor(targetStats.activeComplaints * progress),
          documentsProcessed: Math.floor(targetStats.documentsProcessed * progress),
          responseTime: Math.round(targetStats.responseTime * progress * 10) / 10,
        })

        if (step >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)
    }

    animateStats()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
      case "low":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
      case "in-progress":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
      <Navbar user={user} />

      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-yellow-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-yellow-500/90"></div>
              <div className="relative z-10">
                {/* Logo Section */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full p-2 animate-float">
                    <Image
                      src="/images/logo_manggahan.png"
                      alt="Barangay Manggahan Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center w-full md:text-left md:w-auto">
                    <h1 className="text-3xl font-bold mb-2">Good morning, {user.name}! 🌅</h1>
                    <p className="text-blue-100 text-lg mb-2">
                      {user.position} • {user.hall}
                    </p>
                    <p className="text-blue-100">Ready to serve the community today</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center animate-float">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.totalResidents.toLocaleString()}</div>
                    <div className="text-sm text-blue-100">Total Residents</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                    <div className="text-sm text-blue-100">Pending</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.completedToday}</div>
                    <div className="text-sm text-blue-100">Completed Today</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.activeComplaints}</div>
                    <div className="text-sm text-blue-100">Active Issues</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.documentsProcessed}</div>
                    <div className="text-sm text-blue-100">Documents</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.responseTime}h</div>
                    <div className="text-sm text-blue-100">Avg Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Staff Tools</h2>
              <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-0">
                <Brain className="h-3 w-3 mr-1" />
                AI-Enhanced
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={index} href={action.link}>
                    <Card className="border-0 shadow-lg card-hover bg-gradient-to-br from-white to-gray-50 h-full relative">
                      {action.featured && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border-0 shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 animate-float`}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Tasks & Workflow */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-blue-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span>Today's Tasks</span>
                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0">
                      {recentTasks.length} items
                    </Badge>
                  </CardTitle>
                  <CardDescription>Manage your daily workflow and priorities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm card-hover"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(task.status)}`}
                          >
                            {getStatusIcon(task.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-800 truncate">{task.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getPriorityColor(task.priority)} border-0 text-xs`}>
                                {task.priority} priority
                              </Badge>
                              <Badge className={`${getStatusColor(task.status)} border-0 text-xs`}>
                                {task.status.replace("-", " ")}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                      <Activity className="h-4 w-4 mr-2" />
                      View All Tasks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Performance & Tools */}
            <div className="space-y-6">
              {/* Performance Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-green-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span>Performance</span>
                  </CardTitle>
                  <CardDescription>Your efficiency metrics this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Task Completion Rate</span>
                      <span className="text-sm font-bold text-green-600">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Response Time</span>
                      <span className="text-sm font-bold text-blue-600">Excellent</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <div className="text-lg font-bold text-green-700">156</div>
                      <div className="text-xs text-green-600">Documents Processed</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-lg font-bold text-blue-700">2.4h</div>
                      <div className="text-xs text-blue-600">Avg Response Time</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 pt-4 border-t border-green-200">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Top Performer This Month</span>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-purple-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <span>AI Insights</span>
                  </CardTitle>
                  <CardDescription>Smart recommendations for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800 text-sm">Priority Alert</h4>
                        <p className="text-xs text-purple-600 mt-1">
                          Block 5 area shows 78% complaint risk. Consider proactive measures.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 text-sm">Demand Forecast</h4>
                        <p className="text-xs text-blue-600 mt-1">
                          Document requests expected to increase by 23% this week.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href="/staff/ml-analytics">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg">
                      <Brain className="h-4 w-4 mr-2" />
                      View Full Analytics
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Tools */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-yellow-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span>Quick Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    Verify QR Code
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Generate Document
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <AlertTriangle className="h-4 w-4 mr-3" />
                    Emergency Alert
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Resident Lookup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
