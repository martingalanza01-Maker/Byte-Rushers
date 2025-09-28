"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar, MapPin, Search, Filter, ChevronRight, Users, Clock, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterHall, setFilterHall] = useState("all")
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await apiFetch("/auth/me");
        const ok = me && !me.error && (me.user || me.email || me.id);
        if (!cancelled) setIsAuthed(!!ok);
      } catch {
        if (!cancelled) setIsAuthed(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  const announcements = [
    {
      id: 1,
      title: "Community Health Program - Free Medical Checkup",
      content: "Join us for a free medical checkup and health consultation. Available services include blood pressure monitoring, diabetes screening, and general health assessment.",
      category: "Health",
      hall: "Napico Hall",
      date: "2024-01-15",
      time: "8:00 AM - 5:00 PM",
      priority: "high",
      attendees: 150,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Barangay Assembly Meeting - January 2024",
      content: "Monthly barangay assembly to discuss community issues, budget allocation, and upcoming projects. All residents are encouraged to attend.",
      category: "Meeting",
      hall: "Manggahan Proper Hall",
      date: "2024-01-20",
      time: "2:00 PM - 5:00 PM",
      priority: "medium",
      attendees: 200,
      status: "upcoming"
    },
    {
      id: 3,
      title: "Street Cleaning and Beautification Drive",
      content: "Community-wide cleaning activity to maintain cleanliness and beautify our neighborhood. Bring your own cleaning materials and join us!",
      category: "Community",
      hall: "Greenpark Hall",
      date: "2024-01-22",
      time: "6:00 AM - 10:00 AM",
      priority: "medium",
      attendees: 80,
      status: "upcoming"
    },
    {
      id: 4,
      title: "Senior Citizens' Monthly Pension Distribution",
      content: "Monthly pension distribution for qualified senior citizens. Please bring valid IDs and pension booklets.",
      category: "Social Services",
      hall: "Karangalan Hall",
      date: "2024-01-25",
      time: "9:00 AM - 3:00 PM",
      priority: "high",
      attendees: 300,
      status: "upcoming"
    },
    {
      id: 5,
      title: "Youth Skills Training Program Registration",
      content: "Registration is now open for our youth skills training program covering computer literacy, entrepreneurship, and vocational skills.",
      category: "Education",
      hall: "All Halls",
      date: "2024-01-10",
      time: "8:00 AM - 5:00 PM",
      priority: "medium",
      attendees: 120,
      status: "ongoing"
    }
  ]

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || announcement.category === filterCategory
    const matchesHall = filterHall === "all" || announcement.hall === filterHall
    
    return matchesSearch && matchesCategory && matchesHall
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800"
      case "ongoing": return "bg-green-100 text-green-800"
      case "completed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Barangay Announcements</h1>
                <p className="text-gray-600">Stay updated with community news and events</p>
              </div>
            </div>
            <Link href={isAuthed ? "/resident/dashboard" : "/"}>
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Announcements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Social Services">Social Services</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterHall} onValueChange={setFilterHall}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hall" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Halls</SelectItem>
                  <SelectItem value="Napico Hall">Napico Hall</SelectItem>
                  <SelectItem value="Greenpark Hall">Greenpark Hall</SelectItem>
                  <SelectItem value="Karangalan Hall">Karangalan Hall</SelectItem>
                  <SelectItem value="Manggahan Proper Hall">Manggahan Proper Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                  <p className="text-sm text-gray-600">Total Announcements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {announcements.filter(a => a.status === "upcoming").length}
                  </p>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {announcements.filter(a => a.status === "ongoing").length}
                  </p>
                  <p className="text-sm text-gray-600">Ongoing Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {announcements.filter(a => a.priority === "high").length}
                  </p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(announcement.status)}>
                          {announcement.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">{announcement.content}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(announcement.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{announcement.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{announcement.hall}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Users className="h-4 w-4" />
                        <span>{announcement.attendees} expected</span>
                      </div>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Posted by Barangay Administration
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Emergency Notice */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Emergency Announcements</h3>
                <p className="text-red-800 text-sm">
                  For urgent announcements and emergency alerts, please follow our official social media accounts 
                  or contact your barangay hall directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
