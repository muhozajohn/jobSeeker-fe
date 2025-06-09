"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logoutUser } from "@/lib/redux/slices/auth/auth.slice";
import {
  selectRecruiter,
  getRecruiterByUserId,
} from "@/lib/redux/slices/recruiter/recruiterSlice";
import { RecruiterResponse } from "@/types/recruiter";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  Building,
  UserCheck,
  FileText,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, UserInfo } from "@/utils/auth";
import { selectMyJobs, getMyJobs } from "@/lib/redux/slices/jobs/jobsSlice";
import PostJob from "@/components/PostJob";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userD, setUser] = useState<UserInfo | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showWorkersDialog, setShowWorkersDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const recruiterData = useAppSelector(selectRecruiter) as RecruiterResponse;
  const activeJobs = useAppSelector(selectMyJobs);

  useEffect(() => {
    if (isClient && userD) {
      const fetchData = async () => {
        setIsFetching(true);
        try {
          await dispatch(getRecruiterByUserId(Number(userD.id)));
          await dispatch(getMyJobs());
        } catch (error) {
          console.log(error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [dispatch, isClient, userD]);

  const stats = {
    activeJobs: 8,
    totalApplications: 156,
    pendingApplications: 23,
    acceptedApplications: 45,
    activeAssignments: 12,
    completedAssignments: 89,
    totalSpent: 45000,
    averageRating: 4.6,
  };

  const recentApplications = [
    {
      id: 1,
      job: { title: "Elementary School Teacher", id: 1 },
      worker: {
        user: { firstName: "John", lastName: "Doe", avatar: null },
        experience: "5+ years in education",
        skills: "Teaching, Classroom Management",
      },
      status: "PENDING",
      appliedAt: "2024-01-18T10:00:00Z",
      message: "I'm excited about this teaching opportunity...",
    },
    {
      id: 2,
      job: { title: "House Cleaner - Flexible Schedule", id: 2 },
      worker: {
        user: { firstName: "Maria", lastName: "Garcia", avatar: null },
        experience: "3 years residential cleaning",
        skills: "Deep cleaning, Organization",
      },
      status: "PENDING",
      appliedAt: "2024-01-18T14:30:00Z",
      message: "Available for flexible scheduling...",
    },
    {
      id: 3,
      job: { title: "Security Guard - Night Shift", id: 3 },
      worker: {
        user: { firstName: "David", lastName: "Wilson", avatar: null },
        experience: "7 years security experience",
        skills: "Surveillance, Emergency Response",
      },
      status: "ACCEPTED",
      appliedAt: "2024-01-17T16:45:00Z",
      message: "Experienced in night security operations...",
    },
  ];

  const activeAssignments = [
    {
      id: 1,
      job: { title: "Morning House Cleaning", category: { name: "Cleaner" } },
      worker: { user: { firstName: "Maria", lastName: "Garcia" } },
      workDate: "2024-01-20T00:00:00Z",
      startTime: "2024-01-20T08:00:00Z",
      endTime: "2024-01-20T12:00:00Z",
      status: "ACTIVE",
      notes: "Regular weekly cleaning service",
    },
    {
      id: 2,
      job: { title: "After School Teaching", category: { name: "Teacher" } },
      worker: { user: { firstName: "John", lastName: "Doe" } },
      workDate: "2024-01-22T00:00:00Z",
      startTime: "2024-01-22T15:00:00Z",
      endTime: "2024-01-22T17:00:00Z",
      status: "ACTIVE",
      notes: "Math tutoring session",
    },
  ];

  const workers = [
    {
      id: 1,
      user: {
        firstName: "John",
        lastName: "Doe",
        avatar: null,
        email: "john.doe@example.com"
      },
      skills: ["Teaching", "Classroom Management"],
      experience: "5+ years",
      rating: 4.8,
      jobsCompleted: 12
    },
    {
      id: 2,
      user: {
        firstName: "Maria",
        lastName: "Garcia",
        avatar: null,
        email: "maria.g@example.com"
      },
      skills: ["Cleaning", "Organization"],
      experience: "3 years",
      rating: 4.5,
      jobsCompleted: 8
    },
    {
      id: 3,
      user: {
        firstName: "David",
        lastName: "Wilson",
        avatar: null,
        email: "david.w@example.com"
      },
      skills: ["Security", "Surveillance"],
      experience: "7 years",
      rating: 4.9,
      jobsCompleted: 15
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4" />;
      case "REJECTED":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatSalary = (amount: number, type: string) => {
    const formatMap = {
      HOURLY: `$${amount}/hr`,
      DAILY: `$${amount}/day`,
      WEEKLY: `$${amount}/week`,
      MONTHLY: `$${amount.toLocaleString()}/month`,
      YEARLY: `$${amount.toLocaleString()}/year`,
    };
    return formatMap[type as keyof typeof formatMap] || `$${amount}`;
  };

  const getRecruiterTypeIcon = (type: string) => {
    switch (type) {
      case "COMPANY":
        return <Building className="h-4 w-4" />;
      case "GROUP":
        return <Users className="h-4 w-4" />;
      case "INDIVIDUAL":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  // Skeleton loader for job cards
  const JobCardSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-[200px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-9 w-[70px]" />
        <Skeleton className="h-9 w-[70px]" />
      </div>
    </div>
  );

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
                <div className="flex items-center space-x-1">
                  {getRecruiterTypeIcon(recruiterData?.type)}
                  <span>Recruiter</span>
                </div>
              </Badge>
              {recruiterData?.verified && (
                <Badge variant="default" className="ml-2 bg-green-600">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src={recruiterData?.user?.avatar} />
                <AvatarFallback>
                  {recruiterData?.user?.firstName[0]}
                  {recruiterData?.user?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-300 !hover:text-red-400"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                {isLoggingOut ? (
                  <span className="flex items-center">
                    <LogOut className="h-4 w-4" />
                    Logging out...
                  </span>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            <b>
              {" "}
              {recruiterData?.user?.firstName} {recruiterData?.user?.lastName}!
              👋
            </b>
          </h1>
          <p className="text-gray-600">
            Manage your job postings and track applications for{" "}
            <i className=" font-semibold ">{recruiterData?.companyName}</i>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeJobs}
              </div>
              <p className="text-xs text-muted-foreground">Currently hiring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Applications
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingApplications}
              </div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Workers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeAssignments}
              </div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Spend
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${stats.totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="jobs">Job Posts</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="assignments">Work Assignments</TabsTrigger>
                <TabsTrigger value="workers">Workers</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Active Job Posts</CardTitle>
                      <CardDescription>
                        Manage your current job listings
                      </CardDescription>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Post New Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Post a New Job</DialogTitle>
                        </DialogHeader>
                         <PostJob closeModal={() => setIsOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isFetching ? (
                        // Show skeleton loaders while loading
                        <>
                          <JobCardSkeleton />
                          <JobCardSkeleton />
                          <JobCardSkeleton />
                        </>
                      ) : activeJobs.length > 0 ? (
                        activeJobs.map((job) => (
                          <div
                            key={job.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {job.title}
                                </h3>
                                <Badge variant="secondary">
                                  {job.category.name}
                                </Badge>
                                {job.allowMultiple && (
                                  <Badge variant="outline">
                                    Multiple Workers
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {formatSalary(job.salary, job.salaryType)}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {job.workingHours}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm">Edit</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No active jobs found</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="mt-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Post Your First Job
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Post a New Job</DialogTitle>
                              </DialogHeader>
                              <PostJob />
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                      Review and manage worker applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplications.map((application) => (
                        <div
                          key={application.id}
                          className="flex items-start justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={
                                  application.worker.user.avatar ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                              />
                              <AvatarFallback>
                                {application.worker.user.firstName[0]}
                                {application.worker.user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {application.worker.user.firstName}{" "}
                                {application.worker.user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {application.job.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {application.worker.experience}
                              </p>
                              <p className="text-sm text-gray-500">
                                {application.worker.skills}
                              </p>
                              {application.message && (
                                <p className="text-sm text-gray-700 mt-2 italic">
                                  "{application.message}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge
                              className={getStatusColor(application.status)}
                            >
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(application.status)}
                                <span>{application.status.toLowerCase()}</span>
                              </div>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                application.appliedAt
                              ).toLocaleDateString()}
                            </span>
                            {application.status === "PENDING" && (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Reject
                                </Button>
                                <Button size="sm">Accept</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Work Assignments</CardTitle>
                    <CardDescription>
                      Monitor ongoing work assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {assignment.job.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Worker: {assignment.worker.user.firstName}{" "}
                              {assignment.worker.user.lastName}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(
                                assignment.workDate
                              ).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              {new Date(
                                assignment.startTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(assignment.endTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                {assignment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="workers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Work Assignments</CardTitle>
                    <CardDescription>
                      Monitor ongoing work assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {assignment.job.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Worker: {assignment.worker.user.firstName}{" "}
                              {assignment.worker.user.lastName}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(
                                assignment.workDate
                              ).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              {new Date(
                                assignment.startTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(assignment.endTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                            {assignment.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                {assignment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Post a New Job</DialogTitle>
                    </DialogHeader>
                    <PostJob />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showWorkersDialog} onOpenChange={setShowWorkersDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Workers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Available Workers</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {workers.map((worker) => (
                        <div key={worker.id} className="flex items-start p-4 border rounded-lg">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={worker.user.avatar || undefined} />
                            <AvatarFallback>
                              {worker.user.firstName[0]}{worker.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {worker.user.firstName} {worker.user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{worker.user.email}</p>
                            <div className="flex items-center mt-1 text-sm">
                              <span className="text-yellow-600">★ {worker.rating}</span>
                              <span className="mx-2">•</span>
                              <span>{worker.jobsCompleted} jobs completed</span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Skills:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {worker.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button size="sm">View Profile</Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900">
                    {recruiterData?.companyName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {recruiterData?.type} Recruiter
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {recruiterData?.description}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {recruiterData?.location}
                </div>
                {recruiterData?.website && (
                  <div className="text-sm">
                    <a
                      href={recruiterData?.website}
                      className="text-blue-600 hover:underline"
                    >
                      {recruiterData?.website}
                    </a>
                  </div>
                )}
                <Button className="w-full" variant="outline" size="sm">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

           
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">New application received</div>
                  <div className="text-gray-600">
                    Elementary School Teacher position
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Worker assignment completed</div>
                  <div className="text-gray-600">
                    House cleaning by Maria Garcia
                  </div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Job post published</div>
                  <div className="text-gray-600">
                    Security Guard - Night Shift
                  </div>
                  <div className="text-xs text-gray-500">3 days ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}