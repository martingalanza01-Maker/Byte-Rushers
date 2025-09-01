"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"

interface ComplaintsProps {
  user: any
  onNavigate: (page: string) => void
}

export function Complaints({ user, onNavigate }: ComplaintsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const isStaff = user?.role === "Staff"

  const complaints = [
    {
      id: "COMP-2024-001",
      title: "Street Light Not Working",
      description: "The street light on Main Street has been out for 3 days",
      category: "Infrastructure",
      status: "Under Investigation",
      priority: "Medium",
      resident: "Juan Dela Cruz",
      date: "2024-01-14",
      location: "Main Street, Block 1",
    },
    {
      id: "COMP-2024-002",
      title: "Noise Complaint",
      description: "Loud music from neighbor's house during late hours",
      category: "Public Disturbance",
      status: "Resolved",
      priority: "Low",
      resident: "Maria Santos",
      date: "2024-01-10",
      location: "Residential Area B",
    },
    {
      id: "COMP-2024-003",
      title: "Illegal Dumping",
      description: "Garbage being dumped in the vacant lot",
      category: "Environmental",
      status: "New",
      priority: "High",
      resident: "Anonymous",
      date: "2024-01-16",
      location: "Vacant Lot, Block 3",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Under Investigation":
        return "bg-yellow-100 text-yellow-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <AlertCircle className="h-4 w-4" />
      case "Under Investigation":
        return <Clock className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isStaff ? "Complaint Management" : "My Complaints"}</h1>
          <p className="text-gray-600 mt-2">
            {isStaff ? "Review and manage resident complaints" : "Track your submitted complaints and file new ones"}
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{isStaff ? "Manual Entry" : "File Complaint"}</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="investigating">Under Investigation</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{complaint.title}</CardTitle>
                    <CardDescription className="mb-3">
                      ID: {complaint.id} • {complaint.resident}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(complaint.status)}>
                        {getStatusIcon(complaint.status)}
                        <span className="ml-1">{complaint.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      <Badge variant="outline">{complaint.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{complaint.description}</p>

                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Location:</span>
                    <p>{complaint.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date Filed:</span>
                    <p>{new Date(complaint.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p>{complaint.category}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {isStaff && (
                    <>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                      <Button variant="outline" size="sm">
                        Assign
                      </Button>
                    </>
                  )}
                  {!isStaff && complaint.status !== "Resolved" && (
                    <Button variant="outline" size="sm">
                      Add Update
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would be similar but filtered by status */}
        <TabsContent value="new">
          <div className="text-center py-8">
            <p className="text-gray-600">New complaints will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="investigating">
          <div className="text-center py-8">
            <p className="text-gray-600">Complaints under investigation will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="resolved">
          <div className="text-center py-8">
            <p className="text-gray-600">Resolved complaints will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {filteredComplaints.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms." : "No complaints have been filed yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
