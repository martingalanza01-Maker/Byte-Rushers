"use client"

import { Complaints } from "@/components/complaints"
import { Navbar } from "@/components/navbar"

export default function StaffComplaintsPage() {
  const user = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@manggahan.gov.ph",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Staff" as const,
    position: "Barangay Secretary",
    hall: "Napico Hall",
    employeeId: "EMP-2024-001",
  }

  const handleNavigation = (page: string) => {
    // Handle navigation if needed
    console.log("Navigate to:", page)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white">
      <Navbar user={user} />
      <div className="pt-20">
        <Complaints user={user} onNavigate={handleNavigation} />
      </div>
    </div>
  )
}
