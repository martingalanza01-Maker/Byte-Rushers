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
  FileText,
  User,
  CalendarIcon,
  Eye,
  Edit,
  UserCheck,
  History,
  X,
  RefreshCw,
  QrCode,
  Download,
  Copy,
} from "lucide-react"
import { format } from "date-fns"

interface DocumentRequestProps {
  user: any
  onNavigate: (page: string) => void
}

interface DocumentRequest {
  id: string
  type: string
  purpose: string
  status: string
  priority: string
  resident: string
  date: string
  assignedTo?: string
  updatedAt?: string
  pickupCode?: string
  qrCode?: string
  history: Array<{
    date: string
    action: string
    user: string
    comment?: string
  }>
}

export function DocumentRequest({ user, onNavigate }: DocumentRequestProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  const [newStatus, setNewStatus] = useState("")
  const [updateComment, setUpdateComment] = useState("")
  const [assignedStaff, setAssignedStaff] = useState("")

  const isStaff = user?.role === "Staff"

  const [requests, setRequests] = useState<DocumentRequest[]>([
    {
      id: "DOC-2024-001",
      type: "Barangay Clearance",
      purpose: "Employment Requirements",
      status: "Under Review",
      priority: "Normal",
      resident: "Juan Dela Cruz",
      date: "2024-01-14",
      assignedTo: "Maria Santos",
      updatedAt: "2024-01-15",
      history: [
        { date: "2024-01-14", action: "Request Submitted", user: "Juan Dela Cruz" },
        { date: "2024-01-15", action: "Assigned to Staff", user: "Admin", comment: "Assigned for processing" },
        { date: "2024-01-15", action: "Status Updated", user: "Maria Santos", comment: "Under review" },
      ],
    },
    {
      id: "DOC-2024-002",
      type: "Certificate of Residency",
      purpose: "School Enrollment",
      status: "Ready for Pickup",
      priority: "Normal",
      resident: "Maria Santos",
      date: "2024-01-10",
      assignedTo: "Pedro Rodriguez",
      updatedAt: "2024-01-12",
      pickupCode: "PICKUP-2024-002",
      qrCode: "QR-2024-002",
      history: [
        { date: "2024-01-10", action: "Request Submitted", user: "Maria Santos" },
        { date: "2024-01-11", action: "Assigned to Staff", user: "Admin" },
        { date: "2024-01-12", action: "Status Updated", user: "Pedro Rodriguez", comment: "Document ready for pickup" },
      ],
    },
    {
      id: "DOC-2024-003",
      type: "Business Permit",
      purpose: "New Business Registration",
      status: "Processing",
      priority: "High",
      resident: "Carlos Mendoza",
      date: "2024-01-16",
      assignedTo: "Ana Dela Cruz",
      updatedAt: "2024-01-17",
      history: [
        { date: "2024-01-16", action: "Request Submitted", user: "Carlos Mendoza" },
        { date: "2024-01-17", action: "Assigned to Staff", user: "Admin" },
        { date: "2024-01-17", action: "Status Updated", user: "Ana Dela Cruz", comment: "Processing requirements" },
      ],
    },
    {
      id: "DOC-2024-004",
      type: "Barangay ID",
      purpose: "Personal Identification",
      status: "Completed",
      priority: "Normal",
      resident: "Sofia Garcia",
      date: "2024-01-08",
      assignedTo: "Maria Santos",
      updatedAt: "2024-01-10",
      pickupCode: "PICKUP-2024-004",
      qrCode: "QR-2024-004",
      history: [
        { date: "2024-01-08", action: "Request Submitted", user: "Sofia Garcia" },
        { date: "2024-01-09", action: "Assigned to Staff", user: "Admin" },
        {
          date: "2024-01-10",
          action: "Status Updated",
          user: "Maria Santos",
          comment: "Document completed and picked up",
        },
      ],
    },
  ])

  const staffMembers = ["Maria Santos", "Pedro Rodriguez", "Ana Dela Cruz", "Carlos Mendoza", "Sofia Garcia"]

  const statusOptions = ["Pending", "Under Review", "Processing", "Ready for Pickup", "Completed", "Rejected"]
  const typeOptions = [
    "Barangay Clearance",
    "Certificate of Residency",
    "Business Permit",
    "Barangay ID",
    "Certificate of Indigency",
    "Cedula",
    "Building Permit",
    "Others",
  ]
  const priorityOptions = ["Normal", "High", "Urgent"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800"
      case "Under Review":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Ready for Pickup":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-emerald-100 text-emerald-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Under Review":
        return <AlertCircle className="h-4 w-4" />
      case "Processing":
        return <Clock className="h-4 w-4" />
      case "Ready for Pickup":
        return <CheckCircle className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Rejected":
        return <X className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Filter requests based on search and filters
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type === typeFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter

    const matchesDate =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(request.date) >= dateRange.from && new Date(request.date) <= dateRange.to)

    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDate
  })

  // Filter by tab
  const getRequestsByStatus = (status: string) => {
    if (status === "all") return filteredRequests
    return filteredRequests.filter((request) => request.status === status)
  }

  const generatePickupCode = () => {
    return `PICKUP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  }

  const generateQRCode = () => {
    return `QR-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  }

  const handleStatusUpdate = () => {
    if (!selectedRequest || !newStatus) return

    const updatedRequests = requests.map((request) => {
      if (request.id === selectedRequest.id) {
        const updatedRequest = {
          ...request,
          status: newStatus,
          updatedAt: new Date().toISOString().split("T")[0],
          history: [
            ...request.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: "Status Updated",
              user: user.name || "Staff",
              comment: updateComment || `Status changed to ${newStatus}`,
            },
          ],
        }

        // Generate pickup code and QR code when status is "Ready for Pickup"
        if (newStatus === "Ready for Pickup" && !request.pickupCode) {
          updatedRequest.pickupCode = generatePickupCode()
          updatedRequest.qrCode = generateQRCode()
        }

        return updatedRequest
      }
      return request
    })

    setRequests(updatedRequests)
    setUpdateDialogOpen(false)
    setNewStatus("")
    setUpdateComment("")
    toast({
      title: "Status Updated",
      description: `Request ${selectedRequest.id} status updated to ${newStatus}`,
    })
  }

  const handleAssignStaff = () => {
    if (!selectedRequest || !assignedStaff) return

    const updatedRequests = requests.map((request) => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          assignedTo: assignedStaff,
          updatedAt: new Date().toISOString().split("T")[0],
          history: [
            ...request.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: "Assigned to Staff",
              user: user.name || "Admin",
              comment: `Assigned to ${assignedStaff}`,
            },
          ],
        }
      }
      return request
    })

    setRequests(updatedRequests)
    setAssignDialogOpen(false)
    setAssignedStaff("")
    toast({
      title: "Staff Assigned",
      description: `Request ${selectedRequest.id} assigned to ${assignedStaff}`,
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setPriorityFilter("all")
    setDateRange({})
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Code copied successfully",
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isStaff ? "Document Request Management" : "My Document Requests"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isStaff
              ? "Process and manage resident document requests"
              : "Track your document requests and request new documents"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{isStaff ? "Manual Entry" : "Request Document"}</span>
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
                placeholder="Search requests..."
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

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
            typeFilter !== "all" ||
            priorityFilter !== "all" ||
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
              {typeFilter !== "all" && (
                <Badge variant="secondary">
                  Type: {typeFilter}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setTypeFilter("all")} />
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary">
                  Priority: {priorityFilter}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setPriorityFilter("all")} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Request Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="Pending">Pending ({getRequestsByStatus("Pending").length})</TabsTrigger>
          <TabsTrigger value="Under Review">Review ({getRequestsByStatus("Under Review").length})</TabsTrigger>
          <TabsTrigger value="Processing">Processing ({getRequestsByStatus("Processing").length})</TabsTrigger>
          <TabsTrigger value="Ready for Pickup">Ready ({getRequestsByStatus("Ready for Pickup").length})</TabsTrigger>
          <TabsTrigger value="Completed">Completed ({getRequestsByStatus("Completed").length})</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected ({getRequestsByStatus("Rejected").length})</TabsTrigger>
        </TabsList>

        {/* All Requests */}
        <TabsContent value="all" className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              isStaff={isStaff}
              onUpdate={setSelectedRequest}
              onUpdateDialog={setUpdateDialogOpen}
              onDetailsDialog={setDetailsDialogOpen}
              onAssignDialog={setAssignDialogOpen}
              onHistoryDialog={setHistoryDialogOpen}
              onQrDialog={setQrDialogOpen}
            />
          ))}
        </TabsContent>

        {/* Status-specific tabs */}
        {statusOptions.map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {getRequestsByStatus(status).map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                isStaff={isStaff}
                onUpdate={setSelectedRequest}
                onUpdateDialog={setUpdateDialogOpen}
                onDetailsDialog={setDetailsDialogOpen}
                onAssignDialog={setAssignDialogOpen}
                onHistoryDialog={setHistoryDialogOpen}
                onQrDialog={setQrDialogOpen}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* No Results */}
      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "No document requests have been submitted yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>Update the status of request {selectedRequest?.id}</DialogDescription>
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
            <DialogDescription>Assign a staff member to process request {selectedRequest?.id}</DialogDescription>
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
            <DialogTitle>Request Details - {selectedRequest?.id}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1">{selectedRequest.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>{selectedRequest.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Document Type</Label>
                  <p>{selectedRequest.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date Requested</Label>
                  <p>{new Date(selectedRequest.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Resident</Label>
                  <p>{selectedRequest.resident}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Assigned To</Label>
                  <p>{selectedRequest.assignedTo || "Unassigned"}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Purpose</Label>
                <p className="mt-1">{selectedRequest.purpose}</p>
              </div>
              {selectedRequest.pickupCode && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Pickup Code</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded">{selectedRequest.pickupCode}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(selectedRequest.pickupCode!)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request History - {selectedRequest?.id}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedRequest.history.map((entry, index) => (
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

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code - {selectedRequest?.id}</DialogTitle>
            <DialogDescription>QR code for document pickup verification</DialogDescription>
          </DialogHeader>
          {selectedRequest && selectedRequest.qrCode && (
            <div className="text-center space-y-4">
              <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">QR Code: {selectedRequest.qrCode}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Present this QR code for document pickup</p>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedRequest.qrCode!)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Request Card Component
function RequestCard({
  request,
  isStaff,
  onUpdate,
  onUpdateDialog,
  onDetailsDialog,
  onAssignDialog,
  onHistoryDialog,
  onQrDialog,
}: {
  request: DocumentRequest
  isStaff: boolean
  onUpdate: (request: DocumentRequest) => void
  onUpdateDialog: (open: boolean) => void
  onDetailsDialog: (open: boolean) => void
  onAssignDialog: (open: boolean) => void
  onHistoryDialog: (open: boolean) => void
  onQrDialog: (open: boolean) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800"
      case "Under Review":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Ready for Pickup":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-emerald-100 text-emerald-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Under Review":
        return <AlertCircle className="h-4 w-4" />
      case "Processing":
        return <Clock className="h-4 w-4" />
      case "Ready for Pickup":
        return <CheckCircle className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Rejected":
        return <X className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{request.type}</CardTitle>
            <CardDescription className="mb-3">
              ID: {request.id} • {request.resident}
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(request.status)}>
                {getStatusIcon(request.status)}
                <span className="ml-1">{request.status}</span>
              </Badge>
              <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
              <Badge variant="outline">{request.type}</Badge>
              {request.assignedTo && (
                <Badge variant="secondary">
                  <User className="h-3 w-3 mr-1" />
                  {request.assignedTo}
                </Badge>
              )}
              {request.pickupCode && (
                <Badge variant="outline" className="bg-green-50">
                  <QrCode className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">Purpose: {request.purpose}</p>

        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Date Requested:
            </span>
            <p>{new Date(request.date).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium">Document Type:</span>
            <p>{request.type}</p>
          </div>
          <div>
            <span className="font-medium">Priority:</span>
            <p>{request.priority}</p>
          </div>
        </div>

        {request.pickupCode && (
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-800">Pickup Code:</p>
                <code className="text-green-700">{request.pickupCode}</code>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onUpdate(request)
                  onQrDialog(true)
                }}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onUpdate(request)
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
              onUpdate(request)
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
                  onUpdate(request)
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
                  onUpdate(request)
                  onAssignDialog(true)
                }}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </>
          )}

          {!isStaff && request.status !== "Completed" && request.status !== "Rejected" && (
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Add Documents
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
