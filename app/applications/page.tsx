"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, XCircle, Calendar, MapPin, DollarSign, Eye, MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const applications = [
    {
      id: 1,
      jobTitle: "Elementary School Teacher",
      company: "Sunshine Elementary School",
      location: "Manhattan, NY",
      salary: "$45,000 - $55,000/year",
      appliedDate: "2024-01-15",
      status: "interview",
      statusDate: "2024-01-18",
      interviewDate: "2024-01-22",
      notes: "Interview scheduled for next week",
      jobType: "Full-time",
    },
    {
      id: 2,
      jobTitle: "House Cleaner - Flexible Hours",
      company: "Clean Pro Services",
      location: "Brooklyn, NY",
      salary: "$18 - $22/hour",
      appliedDate: "2024-01-14",
      status: "pending",
      statusDate: "2024-01-14",
      notes: "Application under review",
      jobType: "Part-time",
    },
    {
      id: 3,
      jobTitle: "Security Guard - Night Shift",
      company: "SecureMax Inc",
      location: "Manhattan, NY",
      salary: "$20 - $25/hour",
      appliedDate: "2024-01-12",
      status: "rejected",
      statusDate: "2024-01-16",
      notes: "Position filled by another candidate",
      jobType: "Full-time",
    },
    {
      id: 4,
      jobTitle: "Private Chef",
      company: "Elite Catering Co",
      location: "Manhattan, NY",
      salary: "$35 - $45/hour",
      appliedDate: "2024-01-11",
      status: "hired",
      statusDate: "2024-01-17",
      startDate: "2024-01-25",
      notes: "Congratulations! Start date confirmed",
      jobType: "Contract",
    },
    {
      id: 5,
      jobTitle: "Nanny for Toddler",
      company: "Johnson Family",
      location: "Brooklyn, NY",
      salary: "$16 - $20/hour",
      appliedDate: "2024-01-10",
      status: "pending",
      statusDate: "2024-01-10",
      notes: "Waiting for family to review applications",
      jobType: "Part-time",
    },
    {
      id: 6,
      jobTitle: "Substitute Teacher",
      company: "NYC Department of Education",
      location: "Queens, NY",
      salary: "$200/day",
      appliedDate: "2024-01-08",
      status: "interview",
      statusDate: "2024-01-12",
      interviewDate: "2024-01-20",
      notes: "Phone interview scheduled",
      jobType: "Contract",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "hired":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "interview":
        return <Calendar className="h-4 w-4" />
      case "hired":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true
    return app.status === statusFilter
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
      case "oldest":
        return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const getStatusCounts = () => {
    return {
      all: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      interview: applications.filter((app) => app.status === "interview").length,
      hired: applications.filter((app) => app.status === "hired").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                CareBridge
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.interview}</div>
              <div className="text-sm text-gray-600">Interview</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{statusCounts.hired}</div>
              <div className="text-sm text-gray-600">Hired</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sorting */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications ({statusCounts.all})</SelectItem>
                    <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                    <SelectItem value="interview">Interview ({statusCounts.interview})</SelectItem>
                    <SelectItem value="hired">Hired ({statusCounts.hired})</SelectItem>
                    <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="status">By Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {sortedApplications.length} of {applications.length} applications
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {sortedApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                      <Badge className={`${getStatusColor(application.status)} border`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">{application.company}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {application.salary}
                      </div>
                      <Badge variant="outline">{application.jobType}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Applied:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status Updated:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(application.statusDate).toLocaleDateString()}
                        </span>
                      </div>
                      {application.interviewDate && (
                        <div>
                          <span className="font-medium text-gray-700">Interview:</span>
                          <span className="ml-2 text-blue-600">
                            {new Date(application.interviewDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {application.startDate && (
                        <div>
                          <span className="font-medium text-gray-700">Start Date:</span>
                          <span className="ml-2 text-green-600">
                            {new Date(application.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {application.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {application.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                    {application.status === "interview" && (
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    )}
                    {(application.status === "pending" || application.status === "interview") && (
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedApplications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Clock className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4">
                {statusFilter === "all"
                  ? "You haven't applied to any jobs yet."
                  : `No applications with status "${statusFilter}".`}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
                {statusFilter !== "all" && (
                  <Button variant="outline" onClick={() => setStatusFilter("all")}>
                    View All Applications
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
