"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, FileText, Clock, CheckCircle, QrCode, DollarSign, Calendar, XCircle } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface DocumentRequestProps {
  user: any
  onNavigate: (page: string) => void
}

type DocRow = {
  id: string
  rawId: string
  type: string
  resident: string
  status: string
  requestDate: string
  completedDate?: string | null
  fee?: number | null
  purpose?: string
  qrCode?: boolean
  fileUrl?: string
  /** NEW: optional remarks field surfaced from API */
  remarks?: string
}

export function DocumentRequest({ user, onNavigate }: DocumentRequestProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [documentRequests, setDocumentRequests] = useState<DocRow[]>([])

  // NEW: remarks modal state
  const [remarksOpen, setRemarksOpen] = useState(false)
  const [remarksText, setRemarksText] = useState("")
  const [remarksTargetId, setRemarksTargetId] = useState<string | null>(null)

  const isStaff = user?.role === "Staff"

  // ---- helpers ----
  const mapStatus = (stRaw: string) => {
    const st = (stRaw || "").toLowerCase()
    return st === "pending" ? "Processing"
      : st === "ready" ? "Ready for Pickup"
        : st === "completed" ? "Completed"
          : st === "cancelled" ? "Cancelled"
            : stRaw || "Processing"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-yellow-100 text-yellow-800"
      case "Ready for Pickup": return "bg-blue-100 text-blue-800"
      case "Completed": return "bg-green-100 text-green-800"
      case "Cancelled": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock className="h-4 w-4" />
      case "Ready for Pickup": return <Plus className="h-4 w-4" />
      case "Completed": return <CheckCircle className="h-4 w-4" />
      case "Cancelled": return <XCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  function shape(s: any): DocRow {
    const status = mapStatus(s.status)
    return {
      id: String(s.documentReqId || s.id),
      rawId: String(s.id),
      type: s.documentType || "Document",
      resident: s.name || s.requestorName || "Unknown",
      status,
      requestDate: (s.createdAt || "").slice(0, 10),
      completedDate: status === "Completed" ? (s.updatedAt || "").slice(0, 10) : null,
      fee: s.fee ?? null,
      purpose: s.purpose || s.reason || "",
      qrCode: true,
      fileUrl: s.fileUrl || s.evidenceUrl,
      // NEW: carry remarks from backend if present
      remarks: s.remarks || "",
    }
  }

  async function reloadDocs() {
    const data = await apiFetch("/submissions")
    const docs = (Array.isArray(data) ? data : [])
      .filter((s: any) => (s.submissionType || "").toLowerCase() === "document")
      .map(shape)
    setDocumentRequests(docs)
  }

  useEffect(() => {
    let mounted = true
      ; (async () => { if (mounted) await reloadDocs() })()
    return () => { mounted = false }
  }, [])

  async function markReady(rawId: string) {
    await apiFetch(`/submissions/${rawId}/status`, {
      method: "POST",
      body: JSON.stringify({ status: "ready" }),
    })
    await reloadDocs()
  }

  async function cancelRequest(rawId: string) {
    await apiFetch(`/submissions/${rawId}/status`, {
      method: "POST",
      body: JSON.stringify({ status: "cancelled" }),
    })
    await reloadDocs()
  }

  async function downloadQr(rawId: string) {
    const res = await fetch(`/api/submissions/${rawId}/qr`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Document-${rawId}-QR.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function downloadProof(urlPath?: string, id?: string) {
    if (!urlPath) return
    const res = await fetch(`/api${urlPath}`)
    const blob = await res.blob()
    const a = document.createElement("a")
    const linkUrl = URL.createObjectURL(blob)
    a.href = linkUrl
    a.download = `Proof-of-Residency-${id || "document"}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(linkUrl)
  }

  // NEW: remarks modal helpers
  function openRemarks(id: string, current: string = "") {
    setRemarksTargetId(id)
    setRemarksText(current || "")
    setRemarksOpen(true)
  }

  async function saveRemarks() {
    if (!remarksTargetId) return
    await apiFetch(`/submissions/${remarksTargetId}/remarks`, {
      method: "POST",
      body: JSON.stringify({ remarks: remarksText }),
    })
    setRemarksOpen(false)
    setRemarksTargetId(null)
    setRemarksText("")
    await reloadDocs()
  }

  // ---- derived lists & filter ----
  const filteredRequests = useMemo(() => {
    const q = (searchTerm || "").toLowerCase()
    return documentRequests.filter((r) =>
      (r.type || "").toLowerCase().includes(q) ||
      (r.resident || "").toLowerCase().includes(q) ||
      String(r.id || "").toLowerCase().includes(q)
    )
  }, [documentRequests, searchTerm])

  const processingRequests = useMemo(
    () => documentRequests.filter(r => (r.status || "").toLowerCase().includes("processing")),
    [documentRequests]
  )
  const readyRequests = useMemo(
    () => documentRequests.filter(r => (r.status || "").toLowerCase().includes("ready")),
    [documentRequests]
  )
  const completedRequests = useMemo(
    () => documentRequests.filter(r => (r.status || "").toLowerCase().includes("completed")),
    [documentRequests]
  )

  const cancelledRequests = useMemo(
    () => documentRequests.filter(r => (r.status || "").toLowerCase().includes("cancelled")),
    [documentRequests]
  )

  // ---- card renderer (keep function pattern; do NOT convert to JSX component) ----
  const RequestCard = (
    request: DocRow,
    { showReadyButton = false, showCancelButton = false }: { showReadyButton?: boolean; showCancelButton?: boolean } = {}
  ) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{request.type}</CardTitle>
            <CardDescription className="mb-3">
              ID: {request.id} • {request.resident}
            </CardDescription>
            <Badge className={getStatusColor(request.status)}>
              {getStatusIcon(request.status)}
              <span className="ml-1">{request.status}</span>
            </Badge>
            {request.remarks && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>Remarks:</strong> {request.remarks}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <div>
              <span className="font-medium">Requested:</span>
              <p>{new Date(request.requestDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <div>
              <span className="font-medium">Fee:</span>
              <p>₱{request.fee}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <div>
              <span className="font-medium">Purpose:</span>
              <p>{request.purpose}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {request.qrCode && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 bg-transparent"
              onClick={() => downloadQr(request.rawId)}
            >
              <QrCode className="h-3 w-3" />
              <span>QR Code</span>
            </Button>
          )}

          {request.fileUrl && (
            <Button size="sm" onClick={() => downloadProof(request.fileUrl, request.id)}>
              Download Proof of Residency
            </Button>
          )}

          {showReadyButton && (
            <Button size="sm" onClick={() => markReady(request.rawId)}>
              Ready for pickup
            </Button>
          )}

          {showCancelButton && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => cancelRequest(request.rawId)}
            >
              Cancel
            </Button>
          )}

          {/* NEW: Add remarks visible only when showCancelButton is true (Processing) */}
          {
            <Button size="sm" onClick={() => openRemarks(request.rawId, request.remarks || "")}>
              Add remarks
            </Button>
          }

          {isStaff && (
            <>
              <Button variant="outline" size="sm">Process</Button>
              <Button variant="outline" size="sm">Generate QR</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // ---- render ----
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Requests</h1>
          <p className="text-gray-600 mt-2">Track and manage document requests</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="processing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* keep function call form (not JSX component) */}
          {filteredRequests.map((r) => RequestCard(r))}
        </TabsContent>

        {/* Processing (pending) — show Cancel + Add remarks */}
        <TabsContent value="processing" className="space-y-4">
          {processingRequests.map((r) => RequestCard(r, { showCancelButton: true, showReadyButton: true }))}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {readyRequests.map((r) => RequestCard(r, { showCancelButton: true }))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRequests.map((r) => RequestCard(r))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledRequests.map((r) => RequestCard(r))}
        </TabsContent>
      </Tabs>

      {/* Remarks Modal */}
      <Dialog open={remarksOpen} onOpenChange={setRemarksOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Remarks</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              placeholder="Enter remarks..."
              value={remarksText}
              onChange={(e) => setRemarksText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setRemarksOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={saveRemarks}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
