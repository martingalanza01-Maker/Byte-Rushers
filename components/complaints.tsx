"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import {
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  MapPin,
  CalendarIcon,
  Eye,
  Edit,
  UserCheck,
  History,
  X,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"

interface ComplaintsProps {
  user: any
  onNavigate: (page: string) => void
}

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  resident: string
  date: string
  location: string
  assignedTo?: string
  updatedAt?: string
  history: Array<{
    date: string
    action: string
    user: string
    comment?: string
  }>
}

export function Complaints({ user, onNavigate }: ComplaintsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  const [newStatus, setNewStatus] = useState("")
  const [updateComment, setUpdateComment] = useState("")
  const [assignedStaff, setAssignedStaff] = useState("")

  const isStaff = user?.role === "Staff"

  const [complaints, setComplaints] = useState<Complaint[]>([
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
      assignedTo: "Maria Santos",
      updatedAt: "2024-01-15",
      history: [
        { date: "2024-01-14", action: "Complaint Filed", user: "Juan Dela Cruz" },
        { date: "2024-01-15", action: "Assigned to Staff", user: "Admin", comment: "Assigned to maintenance team" },
        { date: "2024-01-15", action: "Status Updated", user: "Maria Santos", comment: "Investigation started" },
      ],
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
      assignedTo: "Pedro Rodriguez",
      updatedAt: "2024-01-12",
      history: [
        { date: "2024-01-10", action: "Complaint Filed", user: "Maria Santos" },
        { date: "2024-01-11", action: "Assigned to Staff", user: "Admin" },
        {
          date: "2024-01-12",
          action: "Status Updated",
          user: "Pedro Rodriguez",
          comment: "Issue resolved through mediation",
        },
      ],
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
      history: [{ date: "2024-01-16", action: "Complaint Filed", user: "Anonymous" }],
    },
    {
      id: "COMP-2024-004",
      title: "Pothole on Road",
      description: "Large pothole causing traffic issues and potential accidents",
      category: "Infrastructure",
      status: "In Progress",
      priority: "High",
      resident: "Carlos Mendoza",
      date: "2024-01-18",
      location: "Greenpark Avenue",
      assignedTo: "Ana Dela Cruz",
      updatedAt: "2024-01-19",
      history: [
        { date: "2024-01-18", action: "Complaint Filed", user: "Carlos Mendoza" },
        { date: "2024-01-19", action: "Assigned to Staff", user: "Admin" },
        { date: "2024-01-19", action: "Status Updated", user: "Ana Dela Cruz", comment: "Repair work scheduled" },
      ],
    },
  ])

  const staffMembers = ["Maria Santos", "Pedro Rodriguez", "Ana Dela Cruz", "Carlos Mendoza", "Sofia Garcia"]

  const statusOptions = ["New", "Under Investigation", "In Progress", "Resolved", "Closed"]
  const priorityOptions = ["Low", "Medium", "High", "Critical"]
  const categoryOptions = [
    "Infrastructure",
    "Public Disturbance",
    "Environmental",
    "Safety & Security",
    "Public Services",
    "Traffic & Transportation",
    "Health & Sanitation",
    "Others",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Under Investigation":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-orange-100 text-orange-800"
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
      case "Critical":
        return "bg-red-100 text-red-800"
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
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
      case "Closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  // Filter complaints based on search and filters
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter

    const matchesDate =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(complaint.date) >= dateRange.from && new Date(complaint.date) <= dateRange.to)

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate
  })

  // Filter by tab
  const getComplaintsByStatus = (status: string) => {
    if (status === "all") return filteredComplaints
    return filteredComplaints.filter((complaint) => complaint.status === status)
  }

  const handleStatusUpdate = () => {
    if (!selectedComplaint || !newStatus) return

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          status: newStatus,
          updatedAt: new Date().toISOString().split("T")[0],
          history: [
            ...complaint.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: "Status Updated",
              user: user.name || "Staff",
              comment: updateComment || `Status changed to ${newStatus}`,
            },
          ],
        }
      }
      return complaint
    })

    setComplaints(updatedComplaints)
    setUpdateDialogOpen(false)
    setNewStatus("")
    setUpdateComment("")
    toast({
      title: "Status Updated",
      description: `Complaint ${selectedComplaint.id} status updated to ${newStatus}`,
    })
  }

  const handleAssignStaff = () => {
    if (!selectedComplaint || !assignedStaff) return

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          assignedTo: assignedStaff,
          updatedAt: new Date().toISOString().split("T")[0],
          history: [
            ...complaint.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: "Assigned to Staff",
              user: user.name || "Admin",
              comment: `Assigned to ${assignedStaff}`,
            },
          ],
        }
      }
      return complaint
    })

    setComplaints(updatedComplaints)
    setAssignDialogOpen(false)
    setAssignedStaff("")
    toast({
      title: "Staff Assigned",
      description: `Complaint ${selectedComplaint.id} assigned to ${assignedStaff}`,
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setCategoryFilter("all")
    setDateRange({})
  }

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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{isStaff ? "Manual Entry" : "File Complaint"}</span>
          </Button>
        </div>
      </div>

      {/* Search and Advanced Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filters Display */}
          {(searchTerm ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            categoryFilter !== "all" ||
            dateRange.from) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm font-medium text-gray-500">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary">
                  Search: {searchTerm}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">
                  Status: {statusFilter}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStatusFilter("all")} />
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary">
                  Priority: {priorityFilter}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setPriorityFilter("all")} />
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary">
                  Category: {categoryFilter}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setCategoryFilter("all")} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complaints Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({filteredComplaints.length})</TabsTrigger>
          <TabsTrigger value="New">New ({getComplaintsByStatus("New").length})</TabsTrigger>
          <TabsTrigger value="Under Investigation">
            Investigating ({getComplaintsByStatus("Under Investigation").length})
          </TabsTrigger>
          <TabsTrigger value="In Progress">In Progress ({getComplaintsByStatus("In Progress").length})</TabsTrigger>
          <TabsTrigger value="Resolved">Resolved ({getComplaintsByStatus("Resolved").length})</TabsTrigger>
          <TabsTrigger value="Closed">Closed ({getComplaintsByStatus("Closed").length})</TabsTrigger>
        </TabsList>

        {/* All Complaints */}
        <TabsContent value="all" className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              isStaff={isStaff}
              onUpdate={setSelectedComplaint}
              onUpdateDialog={setUpdateDialogOpen}
              onDetailsDialog={setDetailsDialogOpen}
              onAssignDialog={setAssignDialogOpen}
              onHistoryDialog={setHistoryDialogOpen}
            />
          ))}
        </TabsContent>

        {/* Status-specific tabs */}
        {statusOptions.map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {getComplaintsByStatus(status).map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                isStaff={isStaff}
                onUpdate={setSelectedComplaint}
                onUpdateDialog={setUpdateDialogOpen}
                onDetailsDialog={setDetailsDialogOpen}
                onAssignDialog={setAssignDialogOpen}
                onHistoryDialog={setHistoryDialogOpen}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* No Results */}
      {filteredComplaints.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "No complaints have been filed yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>Update the status of complaint {selectedComplaint?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comment">Update Comment (Optional)</Label>
              <Textarea
                id="comment"
                value={updateComment}
                onChange={(e) => setUpdateComment(e.target.value)}
                placeholder="Add a comment about this status update..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!newStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Staff Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Staff Member</DialogTitle>
            <DialogDescription>Assign a staff member to handle complaint {selectedComplaint?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="staff">Staff Member</Label>
              <Select value={assignedStaff} onValueChange={setAssignedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignStaff} disabled={!assignedStaff}>
              Assign Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint Details - {selectedComplaint?.id}</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {getStatusIcon(selectedComplaint.status)}
                    <span className="ml-1">{selectedComplaint.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <Badge className={getPriorityColor(selectedComplaint.priority)}>{selectedComplaint.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <p>{selectedComplaint.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date Filed</Label>
                  <p>{new Date(selectedComplaint.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Resident</Label>
                  <p>{selectedComplaint.resident}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                  <p>{selectedComplaint.assignedTo || "Unassigned"}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="mt-1">{selectedComplaint.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Location</Label>
                <p className="mt-1">{selectedComplaint.location}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complaint History - {selectedComplaint?.id}</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedComplaint.history.map((entry, index) => (
                <div key={index} className="flex space-x-4 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{entry.action}</h4>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">By: {entry.user}</p>
                    {entry.comment && <p className="text-sm text-gray-700 mt-1">{entry.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Complaint Card Component
function ComplaintCard({
  complaint,
  isStaff,
  onUpdate,
  onUpdateDialog,
  onDetailsDialog,
  onAssignDialog,
  onHistoryDialog,
}: {
  complaint: Complaint
  isStaff: boolean
  onUpdate: (complaint: Complaint) => void
  onUpdateDialog: (open: boolean) => void
  onDetailsDialog: (open: boolean) => void
  onAssignDialog: (open: boolean) => void
  onHistoryDialog: (open: boolean) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Under Investigation":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-orange-100 text-orange-800"
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
      case "Critical":
        return "bg-red-100 text-red-800"
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
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
      case "Closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
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
              {complaint.assignedTo && (
                <Badge variant="secondary">
                  <User className="h-3 w-3 mr-1" />
                  {complaint.assignedTo}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{complaint.description}</p>

        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location:
            </span>
            <p>{complaint.location}</p>
          </div>
          <div>
            <span className="font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Date Filed:
            </span>
            <p>{new Date(complaint.date).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium">Category:</span>
            <p>{complaint.category}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onUpdate(complaint)
              onDetailsDialog(true)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onUpdate(complaint)
              onHistoryDialog(true)
            }}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>

          {isStaff && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onUpdate(complaint)
                  onUpdateDialog(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onUpdate(complaint)
                  onAssignDialog(true)
                }}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </>
          )}

          {!isStaff && complaint.status !== "Resolved" && complaint.status !== "Closed" && (
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Update
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
