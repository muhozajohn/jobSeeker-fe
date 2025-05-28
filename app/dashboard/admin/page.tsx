"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  MessageSquare,
  Building,
  UserCheck,
  Search,
  Shield,
  Settings,
  BarChart3,
  Ban,
  Verified,
} from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/utils/formartDate"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState("all")

  // Mock data based on Prisma schema
  const adminData = {
    user: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@jobconnect.com",
      avatar: null,
    },
  }

  const platformStats = {
    totalUsers: 15420,
    activeWorkers: 8950,
    activeRecruiters: 2340,
    totalJobs: 3450,
    activeJobs: 1230,
    totalApplications: 45600,
    pendingApplications: 890,
    activeAssignments: 2340,
    completedAssignments: 12500,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
  }

  const recentUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      role: "WORKER",
      isActive: true,
      createdAt: "2024-01-18T10:00:00Z",
      worker: {
        location: "New York, NY",
        available: true,
      },
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@company.com",
      role: "RECRUITER",
      isActive: true,
      createdAt: "2024-01-17T14:30:00Z",
      recruiter: {
        companyName: "Elite Services Inc",
        type: "COMPANY",
        verified: true,
      },
    },
    {
      id: 3,
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@email.com",
      role: "WORKER",
      isActive: true,
      createdAt: "2024-01-16T09:15:00Z",
      worker: {
        location: "Brooklyn, NY",
        available: true,
      },
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Wilson",
      email: "david@security.com",
      role: "RECRUITER",
      isActive: false,
      createdAt: "2024-01-15T16:45:00Z",
      recruiter: {
        companyName: "SecureMax Inc",
        type: "COMPANY",
        verified: false,
      },
    },
  ]

  const jobCategories = [
    { id: 1, name: "Teacher", jobCount: 450, description: "Educational services" },
    { id: 2, name: "Cleaner", jobCount: 380, description: "Cleaning services" },
    { id: 3, name: "Housemaid", jobCount: 290, description: "Domestic services" },
    { id: 4, name: "Security", jobCount: 220, description: "Security services" },
    { id: 5, name: "Cook", jobCount: 180, description: "Culinary services" },
    { id: 6, name: "Nanny", jobCount: 160, description: "Childcare services" },
  ]

  const recentJobs = [
    {
      id: 1,
      title: "Elementary School Teacher",
      category: { name: "Teacher" },
      recruiter: {
        user: { firstName: "Sarah", lastName: "Johnson" },
        companyName: "Elite Services Inc",
      },
      salary: 45000,
      salaryType: "YEARLY",
      location: "Manhattan, NY",
      isActive: true,
      createdAt: "2024-01-18T10:00:00Z",
      applications: [{ id: 1 }, { id: 2 }, { id: 3 }],
    },
    {
      id: 2,
      title: "House Cleaner - Flexible Schedule",
      category: { name: "Cleaner" },
      recruiter: {
        user: { firstName: "Michael", lastName: "Brown" },
        companyName: "Clean Pro Services",
      },
      salary: 20,
      salaryType: "HOURLY",
      location: "Brooklyn, NY",
      isActive: true,
      createdAt: "2024-01-17T14:30:00Z",
      applications: [{ id: 4 }, { id: 5 }],
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "High Application Volume",
      message: "Teacher category has 50+ pending applications",
      timestamp: "2024-01-18T10:00:00Z",
    },
    {
      id: 2,
      type: "info",
      title: "New Recruiter Registration",
      message: "Elite Services Inc requires verification",
      timestamp: "2024-01-18T09:30:00Z",
    },
    {
      id: 3,
      type: "error",
      title: "Payment Issue",
      message: "Failed payment for job posting #1234",
      timestamp: "2024-01-18T08:45:00Z",
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800"
      case "RECRUITER":
        return "bg-blue-100 text-blue-800"
      case "WORKER":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />
      case "RECRUITER":
        return <Building className="h-4 w-4" />
      case "WORKER":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const filteredUsers = recentUsers.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = userFilter === "all" || user.role === userFilter
    return matchesSearch && matchesFilter
  })

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
              <Badge variant="default" className="ml-3 bg-purple-600">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </div>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src={adminData.user.avatar || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>
                  {adminData.user.firstName[0]}
                  {adminData.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the JobConnect platform</p>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(alert.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{platformStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{platformStats.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{platformStats.activeJobs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Currently hiring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{platformStats.pendingApplications}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${platformStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Platform earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage platform users and their accounts</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Select value={userFilter} onValueChange={setUserFilter}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="WORKER">Workers</SelectItem>
                            <SelectItem value="RECRUITER">Recruiters</SelectItem>
                            <SelectItem value="ADMIN">Admins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getRoleColor(user.role)}>
                                  <div className="flex items-center space-x-1">
                                    {getRoleIcon(user.role)}
                                    <span>{user.role.toLowerCase()}</span>
                                  </div>
                                </Badge>
                                {user.role === "RECRUITER" && user.recruiter?.verified && (
                                  <Badge variant="default" className="bg-green-600">
                                    <Verified className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <Badge variant={user.isActive ? "default" : "secondary"}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              {user.role === "RECRUITER" && user.recruiter?.companyName && (
                                <p className="text-xs text-gray-500 mt-1">{user.recruiter.companyName}</p>
                              )}
                              {user.role === "WORKER" && user.worker?.location && (
                                <p className="text-xs text-gray-500 mt-1">{user.worker.location}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            {!user.isActive ? (
                              <Button size="sm" variant="default">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            ) : (
                              <Button size="sm" variant="destructive">
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )}
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
                    <CardTitle>Job Management</CardTitle>
                    <CardDescription>Monitor and manage job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{job.title}</h3>
                              <Badge variant="secondary">{job.category.name}</Badge>
                              <Badge variant={job.isActive ? "default" : "secondary"}>
                                {job.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Posted by: {job.recruiter.user.firstName} {job.recruiter.user.lastName}
                              {job.recruiter.companyName && ` (${job.recruiter.companyName})`}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />${job.salary.toLocaleString()}/
                                {job.salaryType.toLowerCase()}
                              </div>
                              <span>{job.applications.length} applications</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Job Categories</CardTitle>
                        <CardDescription>Manage job categories and their settings</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobCategories.map((category) => (
                        <div key={category.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <Badge variant="secondary">{category.jobCount} jobs</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Analytics</CardTitle>
                    <CardDescription>Key metrics and performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">User Growth</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Workers</span>
                            <span className="font-medium">{platformStats.activeWorkers.toLocaleString()}</span>
                          </div>
                          <Progress value={75} />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Recruiters</span>
                            <span className="font-medium">{platformStats.activeRecruiters.toLocaleString()}</span>
                          </div>
                          <Progress value={25} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Job Activity</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Active Jobs</span>
                            <span className="font-medium">{platformStats.activeJobs.toLocaleString()}</span>
                          </div>
                          <Progress value={60} />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Completed Assignments</span>
                            <span className="font-medium">{platformStats.completedAssignments.toLocaleString()}</span>
                          </div>
                          <Progress value={85} />
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
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full" variant="outline">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Review Jobs
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-sm text-green-600">99.9%</span>
                </div>
                <Progress value={99.9} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-green-600">120ms</span>
                </div>
                <Progress value={85} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Satisfaction</span>
                  <span className="text-sm text-green-600">4.7/5</span>
                </div>
                <Progress value={94} />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">New user registration</div>
                  <div className="text-gray-600">John Doe joined as Worker</div>
                  <div className="text-xs text-gray-500">5 minutes ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Job post approved</div>
                  <div className="text-gray-600">Elementary School Teacher position</div>
                  <div className="text-xs text-gray-500">15 minutes ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Payment processed</div>
                  <div className="text-gray-600">$250 for job posting fees</div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">User verification</div>
                  <div className="text-gray-600">Elite Services Inc verified</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
