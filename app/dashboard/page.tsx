"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would get the user role from your auth context/session
    // For demo purposes, we'll redirect to worker dashboard
    // You can change this to test different dashboards

    const role = "worker" // This would come from your auth system
    setUserRole(role)

    switch (role) {
      case "admin":
        router.push("/dashboard/admin")
        break
      case "recruiter":
        router.push("/dashboard/recruiter")
        break
      case "worker":
      default:
        router.push("/dashboard/worker")
        break
    }
  }, [router])

  // Mock data
  const stats = {
    worker: {
      applications: 12,
      interviews: 3,
      activeJobs: 1,
      earnings: 2450,
    },
    recruiter: {
      jobPosts: 8,
      applications: 45,
      hired: 12,
      activeJobs: 5,
    },
  }

  const recentApplications = [
    {
      id: 1,
      jobTitle: "Elementary School Teacher",
      company: "Sunshine Elementary",
      location: "New York, NY",
      appliedDate: "2024-01-15",
      status: "interview",
      salary: "$45,000 - $55,000",
    },
    {
      id: 2,
      jobTitle: "House Cleaner",
      company: "Clean Pro Services",
      location: "Brooklyn, NY",
      appliedDate: "2024-01-14",
      status: "pending",
      salary: "$18/hour",
    },
    {
      id: 3,
      jobTitle: "Security Guard",
      company: "SecureMax Inc",
      location: "Manhattan, NY",
      appliedDate: "2024-01-12",
      status: "rejected",
      salary: "$20/hour",
    },
  ]

  const upcomingSchedule = [
    {
      id: 1,
      title: "Interview - Teaching Position",
      company: "Sunshine Elementary",
      date: "2024-01-20",
      time: "10:00 AM",
      type: "interview",
    },
    {
      id: 2,
      title: "Work Assignment - House Cleaning",
      company: "Johnson Family",
      date: "2024-01-22",
      time: "9:00 AM",
      type: "work",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "hired":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "interview":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      case "hired":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                JobConnect
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
          <p className="text-gray-600">
            {userRole === "worker"
              ? "Here's what's happening with your job search"
              : "Here's an overview of your recruitment activities"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userRole === "worker" ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.worker.applications}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.worker.interviews}</div>
                  <p className="text-xs text-muted-foreground">+1 scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.worker.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">Current assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.worker.earnings}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Posts</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recruiter.jobPosts}</div>
                  <p className="text-xs text-muted-foreground">Active listings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recruiter.applications}</div>
                  <p className="text-xs text-muted-foreground">Total received</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hired</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recruiter.hired}</div>
                  <p className="text-xs text-muted-foreground">Successful hires</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recruiter.activeJobs}</div>
                  <p className="text-xs text-muted-foreground">Currently hiring</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="applications">
                  {userRole === "worker" ? "My Applications" : "Recent Applications"}
                </TabsTrigger>
                <TabsTrigger value="jobs">{userRole === "worker" ? "Recommended Jobs" : "My Job Posts"}</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Track the status of your job applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplications.map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{application.jobTitle}</h3>
                            <p className="text-sm text-gray-600">{application.company}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {application.location}
                              <span className="mx-2">•</span>
                              {application.salary}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span className="capitalize">{application.status}</span>
                              </div>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Applied {new Date(application.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{userRole === "worker" ? "Recommended for You" : "Your Job Posts"}</CardTitle>
                    <CardDescription>
                      {userRole === "worker"
                        ? "Jobs that match your skills and preferences"
                        : "Manage your active job listings"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">Private Tutor - Mathematics</h3>
                            <p className="text-sm text-gray-600">EduCare Services</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              Queens, NY
                              <span className="mx-2">•</span>
                              $25-30/hour
                            </div>
                          </div>
                          <Button size="sm">{userRole === "worker" ? "Apply" : "View"}</Button>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">Weekend House Cleaner</h3>
                            <p className="text-sm text-gray-600">Premium Home Services</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              Manhattan, NY
                              <span className="mx-2">•</span>
                              $22/hour
                            </div>
                          </div>
                          <Button size="sm">{userRole === "worker" ? "Apply" : "View"}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Your interviews and work assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedule.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            item.type === "interview" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.company}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()} at {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userRole === "worker" ? (
                  <>
                    <Button className="w-full" variant="outline">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" variant="outline">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Candidates
                    </Button>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
