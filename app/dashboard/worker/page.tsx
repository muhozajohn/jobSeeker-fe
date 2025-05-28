"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Bell,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  User,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function WorkerDashboard() {
  // Mock data based on Prisma schema
  const workerData = {
    id: 1,
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      avatar: null,
    },
    location: "New York, NY",
    experience: "5+ years in education and tutoring",
    skills: "Teaching, Classroom Management, Curriculum Development, Child Psychology",
    available: true,
  }

  const stats = {
    totalApplications: 15,
    pendingApplications: 4,
    acceptedApplications: 3,
    activeAssignments: 2,
    completedAssignments: 8,
    totalEarnings: 3250,
    averageRating: 4.8,
    profileCompletion: 85,
  }

  const recentApplications = [
    {
      id: 1,
      job: {
        title: "Elementary School Teacher",
        category: { name: "Teacher" },
        salary: 45000,
        salaryType: "YEARLY",
        location: "Manhattan, NY",
      },
      status: "PENDING",
      appliedAt: "2024-01-15T10:00:00Z",
      message: "I'm excited about this opportunity...",
    },
    {
      id: 2,
      job: {
        title: "House Cleaner - Flexible Hours",
        category: { name: "Cleaner" },
        salary: 20,
        salaryType: "HOURLY",
        location: "Brooklyn, NY",
      },
      status: "ACCEPTED",
      appliedAt: "2024-01-14T14:30:00Z",
      message: "Available for flexible scheduling",
    },
    {
      id: 3,
      job: {
        title: "Private Security Guard",
        category: { name: "Security" },
        salary: 25,
        salaryType: "HOURLY",
        location: "Queens, NY",
      },
      status: "REJECTED",
      appliedAt: "2024-01-12T09:15:00Z",
      message: "Experienced in residential security",
    },
  ]

  const activeAssignments = [
    {
      id: 1,
      job: {
        title: "Morning House Cleaning",
        category: { name: "Cleaner" },
        recruiter: { user: { firstName: "Sarah", lastName: "Johnson" } },
      },
      workDate: "2024-01-20T00:00:00Z",
      startTime: "2024-01-20T08:00:00Z",
      endTime: "2024-01-20T12:00:00Z",
      status: "ACTIVE",
      notes: "Regular weekly cleaning",
    },
    {
      id: 2,
      job: {
        title: "After School Tutoring",
        category: { name: "Teacher" },
        recruiter: { user: { firstName: "Michael", lastName: "Brown" } },
      },
      workDate: "2024-01-22T00:00:00Z",
      startTime: "2024-01-22T15:00:00Z",
      endTime: "2024-01-22T17:00:00Z",
      status: "ACTIVE",
      notes: "Math tutoring for 8th grader",
    },
  ]

  const upcomingAssignments = [
    {
      id: 3,
      job: {
        title: "Weekend Security Shift",
        category: { name: "Security" },
        recruiter: { user: { firstName: "David", lastName: "Wilson" } },
      },
      workDate: "2024-01-21T00:00:00Z",
      startTime: "2024-01-21T18:00:00Z",
      endTime: "2024-01-22T06:00:00Z",
      status: "ACTIVE",
      notes: "Night shift at office building",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatSalary = (amount: number, type: string) => {
    const formatMap = {
      HOURLY: `$${amount}/hr`,
      DAILY: `$${amount}/day`,
      WEEKLY: `$${amount}/week`,
      MONTHLY: `$${amount.toLocaleString()}/month`,
      YEARLY: `$${amount.toLocaleString()}/year`,
    }
    return formatMap[type as keyof typeof formatMap] || `$${amount}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
               <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-orange-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              JobConnect
            </Link>
              <Badge variant="secondary" className="ml-3">
                Worker
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src={workerData.user.avatar || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>
                  {workerData.user.firstName[0]}
                  {workerData.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {workerData.user.firstName}! 👋</h1>
          <p className="text-gray-600">Here's your work activity and upcoming assignments</p>
        </div>

        {/* Profile Completion Alert */}
        {stats.profileCompletion < 100 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-orange-900">Complete your profile</h3>
                    <p className="text-sm text-orange-700">
                      Your profile is {stats.profileCompletion}% complete. Complete it to get more job opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={stats.profileCompletion} className="w-24" />
                  <Link href="/profile">
                    <Button size="sm">Complete</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeAssignments}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${stats.totalEarnings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="assignments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assignments">Work Assignments</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>

              <TabsContent value="assignments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Assignments</CardTitle>
                    <CardDescription>Your current work assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{assignment.job.title}</h3>
                            <p className="text-sm text-gray-600">
                              {assignment.job.recruiter.user.firstName} {assignment.job.recruiter.user.lastName}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(assignment.workDate).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              {new Date(assignment.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(assignment.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            {assignment.notes && <p className="text-sm text-gray-600 mt-1">{assignment.notes}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assignments</CardTitle>
                    <CardDescription>Your scheduled work for the coming days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{assignment.job.title}</h3>
                            <p className="text-sm text-gray-600">
                              {assignment.job.recruiter.user.firstName} {assignment.job.recruiter.user.lastName}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(assignment.workDate).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              {new Date(assignment.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(assignment.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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
                            <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                            <p className="text-sm text-gray-600">{application.job.category.name}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {application.job.location}
                              <span className="mx-2">•</span>
                              {formatSalary(application.job.salary, application.job.salaryType)}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span>{application.status.toLowerCase()}</span>
                              </div>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="earnings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Overview</CardTitle>
                    <CardDescription>Your income and payment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">${stats.totalEarnings}</div>
                        <div className="text-sm text-gray-600">This Month</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.completedAssignments}</div>
                        <div className="text-sm text-gray-600">Completed Jobs</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          ${(stats.totalEarnings / stats.completedAssignments).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-600">Avg per Job</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">House Cleaning - Johnson Family</span>
                        <span className="text-green-600 font-semibold">+$160</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Tutoring Session - Math</span>
                        <span className="text-green-600 font-semibold">+$50</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">Security Shift - Office Building</span>
                        <span className="text-green-600 font-semibold">+$200</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/jobs">
                  <Button className="w-full" variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
                <Link href="/applications">
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                </Link>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Your work statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-gray-600">95%</span>
                </div>
                <Progress value={95} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">On-time Rate</span>
                  <span className="text-sm text-gray-600">98%</span>
                </div>
                <Progress value={98} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Client Satisfaction</span>
                  <span className="text-sm text-gray-600">4.8/5</span>
                </div>
                <Progress value={96} />
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Sarah Johnson</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">"Excellent work! Very reliable and thorough."</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Michael Brown</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">"Great tutor! My son's grades improved significantly."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
