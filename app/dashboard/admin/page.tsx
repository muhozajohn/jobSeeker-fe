"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  Plus,
  Building,
  UserCheck,
  Search,
  Shield,
  Ban,
  Loader2,
  LogOut,
  LucideTrash,
  LucidePencil,
} from "lucide-react";
import Link from "next/link";
// import { formatDate } from "@/utils/formartDate";
import { logoutUser } from "@/lib/redux/slices/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import {
  selectUsers,
  fetchUsers,
  fetchWorkers,
  fetchRecruiters,
  selectUsersTotalCount,
  selectWorkers,
  selectRecruiters,
  createUser,
  updateUser,
  toggleUserStatus,
} from "@/lib/redux/slices/auth/user.Slice";
import { GetMe, selectMyProfile } from "@/lib/redux/slices/auth/auth.slice";
import { getJobs, selectJobs } from "@/lib/redux/slices/jobs/jobsSlice";
import {
  selectJobCategories,
  getJobCategories,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory,
} from "@/lib/redux/slices/JobCategories/JobCategoriesSlice";
import { CreateUserDto, UpdateUserDto, User } from "@/types/users";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCategory } from "@/types/JobCategories";
import { JobCategoryModal } from "@/components/JobCategoryModal";
import {
  getApplications,
  selectApplications,
} from "@/lib/redux/slices/applications/applicationSlice";
import {
  getWorkAssignments,
  selectWorkerAssignments,
} from "@/lib/redux/slices/assignments/assignmentSlice";
import { UserFormModal } from "@/components/UserFormModal";
import ProfileModal from "@/components/ProfileModal";
import {
  getConnectionRequests,
  selectConnectionRequests,
  updateConnectionRequestStatus,
} from "@/lib/redux/slices/notoficationSlice";
import { ConnectionRequest } from "@/types/notification";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("WORKER");
  const [isMounted, setIsMounted] = useState(false);

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const handleCreateUser = async (
    values: CreateUserDto | UpdateUserDto,
    avatar?: File
  ) => {
    setIsCreatingUser(true);
    try {
      if ("password" in values) {
        const userData = values as CreateUserDto;
        const resultAction = await dispatch(createUser({ userData, avatar }));

        if (createUser.fulfilled.match(resultAction)) {
          await dispatch(fetchUsers());
          return; // Success - modal will close
        }

        // If we get here, there was an error
        throw new Error(
          (resultAction.payload as string) || "Failed to create user"
        );
      } else {
        throw new Error("Invalid data for user creation: missing password.");
      }
    } catch (error) {
      throw error; // Re-throw to keep modal open
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleUpdateUser = async (
    userData: UpdateUserDto,
    avatar?: File,
    userId?: number
  ) => {
    setIsUpdatingUser(true);
    try {
      if (typeof userId === "number") {
        const resultAction = await dispatch(
          updateUser({ id: userId, userData, avatar })
        );

        if (updateUser.fulfilled.match(resultAction)) {
          await dispatch(fetchUsers());
          return; // Success - modal will close
        }
      } else {
        throw new Error("User ID is required for updating a user.");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const myProfile = useAppSelector(selectMyProfile);
  const recentUsers = useAppSelector(selectUsers);
  const [isLoading, setIsLoading] = useState(true);
  const counts = useAppSelector(selectUsersTotalCount);
  const workers = useAppSelector(selectWorkers);
  const recruiters = useAppSelector(selectRecruiters);
  const jobCategories = useAppSelector(selectJobCategories);
  const recentJobs = useAppSelector(selectJobs);
  const Applications = useAppSelector(selectApplications);
  const assignment = useAppSelector(selectWorkerAssignments);
  const data = useAppSelector(selectConnectionRequests) || [];

  const adminData = recentUsers?.find(
    (user: User) => user.id === myProfile?.id
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleApproveRequest = (id: number) => {
    dispatch(
      updateConnectionRequestStatus({
        id,
        data: {
          status: "APPROVED",
          adminNotes:
            "This connection is approved. You may proceed to contact the worker.",
        },
      })
    );
    dispatch(getConnectionRequests());
  };

  const handleRejectRequest = (id: number) => {
    dispatch(
      updateConnectionRequestStatus({
        id,
        data: {
          status: "REJECTED",
          adminNotes: "This request has been rejected due to unmet criteria.",
        },
      })
    );
    dispatch(getConnectionRequests());
  };

  const handleCancelRequest = (id: number) => {
    dispatch(
      updateConnectionRequestStatus({
        id,
        data: {
          status: "CANCELLED",
          adminNotes: "The request has been cancelled by the administrator.",
        },
      })
    );
    dispatch(getConnectionRequests());
  };

  // Initialize data -
  const fetchData = useCallback(async () => {
    if (!isMounted) return;

    try {
      setIsLoading(true);
      const params = {
        includeRelations: true,
      };
      // await Promise.all([
      dispatch(fetchUsers(params));
      dispatch(fetchRecruiters());
      dispatch(getJobCategories());
      dispatch(getConnectionRequests());
      dispatch(fetchWorkers());
      dispatch(GetMe());
      dispatch(getWorkAssignments());
      dispatch(getApplications());
      dispatch(getJobs());
      // ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, isMounted]);

  // Handle client-side mounting and data fetching
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
  }, [fetchData, isMounted]);

  // Calculate real stats from fetched data
  const platformStats = {
    totalUsers: counts || 0,
    activeWorkers: workers?.filter((w) => w.isActive).length || 0,
    activeRecruiters: recruiters?.filter((r) => r.isActive).length || 0,
    activeJobs: recentJobs?.filter((j) => j.isActive).length || 0,
    totalJobs: recentJobs?.length || 0,
    totalApplications: Applications.length || 0,
    pendingApplications:
      Applications?.filter((r) => r.status === "PENDING").length || 0,
    activeAssignments: assignment?.filter((r) => r.status).length || 0,
    completedAssignments: 10,
    totalRevenue: assignment?.filter((r) => r.job.salary).length || 0,
    monthlyGrowth: 12.5,
  };

  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(
    null
  );

  // Update the handleSuccess function to handle both create and update
  const handleSuccess = async (
    values: { name: string; description: string },
    id?: number
  ) => {
    try {
      if (id) {
        await dispatch(updateJobCategory({ id, data: { ...values } }));
      } else {
        await dispatch(createJobCategory(values));
      }
      // Refresh categories after operation
      dispatch(getJobCategories());
    } catch (error) {
      console.log(error);
    }
  };

  // Add a function to handle deletion
  const handleDeleteCategory = async (id: number) => {
    try {
      await dispatch(deleteJobCategory(id));
      dispatch(getJobCategories());
    } catch (error) {
      console.log(error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "RECRUITER":
        return "bg-blue-100 text-blue-800";
      case "WORKER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "RECRUITER":
        return <Building className="h-4 w-4" />;
      case "WORKER":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const filteredUsers =
    recentUsers?.filter((user) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = userFilter === "all" || user.role === userFilter;
      return matchesSearch && matchesFilter;
    }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-96 rounded-lg" />
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
                CareBridge
              </Link>
              <Badge variant="default" className="ml-3 bg-purple-600">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </div>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={
                    adminData && "avatar" in adminData && adminData.avatar
                      ? adminData.avatar
                      : "/placeholder.svg?height=32&width=32"
                  }
                />
                <AvatarFallback>
                  {adminData && "firstName" in adminData
                    ? adminData.firstName?.[0]
                    : ""}
                  {adminData && "lastName" in adminData
                    ? adminData.lastName?.[0]
                    : ""}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                className="bg-red-300 hover:bg-red-400 hover:text-white"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                {isLoggingOut ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
            Welcome back, {adminData?.firstName}{" "}
            {adminData?.lastName || "Admin"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with CareBridge today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {platformStats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{platformStats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {platformStats.activeJobs.toLocaleString()}
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
                {platformStats.pendingApplications}
              </div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${platformStats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Platform earnings</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="requests">All requested Worker</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {/* <TabsTrigger value="claims">Claims</TabsTrigger> */}
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage platform users and their accounts
                    </CardDescription>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="WORKER">Workers</SelectItem>
                        <SelectItem value="RECRUITER">Recruiters</SelectItem>
                        <SelectItem value="ADMIN">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <UserFormModal
                      onSubmit={handleCreateUser}
                      isLoading={isCreatingUser}
                    >
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </UserFormModal>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {recentUsers?.length === 0
                      ? "No users found"
                      : "Loading users..."}
                  </div>
                ) : (
                  <div className=" gap-1 grid grid-cols-1 md:grid-cols-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatar ?? undefined} />
                            <AvatarFallback>
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getRoleColor(
                                  user.role
                                )}`}
                              >
                                <span className="flex items-center gap-1">
                                  {getRoleIcon(user.role)}
                                  {user.role}
                                </span>
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                {user.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <UserFormModal
                            user={{
                              ...user,
                              avatar:
                                user.avatar === null ? undefined : user.avatar,
                            }}
                            onSubmit={(userData, avatar) =>
                              handleUpdateUser(userData, avatar, user.id)
                            }
                            isLoading={isUpdatingUser}
                          >
                            <Button variant="outline" size="sm">
                              <LucidePencil className="h-3 w-3" />
                            </Button>
                          </UserFormModal>
                          <Button
                            variant={user.isActive ? "destructive" : "outline"}
                            className={`flex items-center gap-1 ${
                              user.isActive
                                ? "border-red-400 bg-red-600 hover:bg-red-700 text-white"
                                : "text-green-600 border-green-600 hover:bg-green-50"
                            }`}
                            size="sm"
                            onClick={async () => {
                              try {
                                await dispatch(toggleUserStatus(user.id));
                                dispatch(fetchUsers());
                              } catch (error) {
                                console.error(
                                  "Failed to toggle user status",
                                  error
                                );
                              }
                            }}
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3" />
                              </>
                            )}
                          </Button>

                          {user.role === "WORKER" &&
                            (user.worker ? (
                              <Button
                                variant={
                                  user.worker ? "outline" : "outline"
                                }
                                className={`flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50 `}
                                size="sm"
                              >
                                Profile <CheckCircle className="h-3 w-3" />
                              </Button>
                            ) : (
                              <ProfileModal userId={user.id} />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>
                  Monitor and manage job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No recent jobs found
                  </div>
                ) : (
                  <div className="gap-1 grid grid-cols-1 md:grid-cols-2">
                    {recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <Badge variant="secondary">
                              {job.category.name}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Posted by: {job.recruiter.firstName}{" "}
                            {job.recruiter.lastName}
                            {job.category.name && ` (${job.recruiter.email})`}
                          </p>
                          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mt-1">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />$
                              {job.salary.toLocaleString()}/
                              {job.salaryType.toLowerCase()}
                            </div>
                            <span>
                              {job?.applications?.length} applications
                            </span>
                          </div>
                        </div>

                        <Badge variant={job.isActive ? "default" : "secondary"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Job Categories</CardTitle>
                    <CardDescription>
                      Manage job categories and their settings
                    </CardDescription>
                  </div>

                  <JobCategoryModal
                    onSuccess={handleSuccess}
                    category={editingCategory}
                    mode={editingCategory ? "edit" : "create"}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobCategories.map((category: JobCategory, index: number) => (
                    <div
                      key={category.id || index}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCategory(category)}
                          >
                            <LucidePencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <LucideTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
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
                <CardDescription>
                  Key metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      User Growth
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Workers</span>
                        <span className="font-medium">
                          {platformStats.activeWorkers.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (platformStats.activeWorkers /
                            platformStats.totalUsers) *
                          100
                        }
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Recruiters</span>
                        <span className="font-medium">
                          {platformStats.activeRecruiters.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (platformStats.activeRecruiters /
                            platformStats.totalUsers) *
                          100
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Job Activity
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Jobs</span>
                        <span className="font-medium">
                          {platformStats.activeJobs.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (platformStats.activeJobs / platformStats.totalJobs) *
                          100
                        }
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed Assignments</span>
                        <span className="font-medium">
                          {platformStats.completedAssignments.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (platformStats.completedAssignments /
                            (platformStats.completedAssignments +
                              platformStats.activeAssignments)) *
                          100
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="claims" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Claims Management</CardTitle>
                    <CardDescription>
                      Review and resolve user claims and disputes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Claims</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      View Pending
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Example claim item - replace with actual data */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Payment Dispute</h3>
                        <p className="text-sm text-gray-600">
                          Job #12345 - Web Development
                        </p>
                      </div>
                      <Badge variant="destructive">Pending</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Claimant</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span>John Doe (Worker)</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Respondent</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>AC</AvatarFallback>
                          </Avatar>
                          <span>Acme Corp (Recruiter)</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">$1,250.00</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="mt-1">
                        Worker claims payment was not received for completed
                        work on the e-commerce website project. Recruiter states
                        payment was sent but provides no transaction proof.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Request Evidence
                      </Button>
                      <Button variant="destructive" size="sm">
                        Reject Claim
                      </Button>
                      <Button size="sm">Approve Claim</Button>
                    </div>
                  </div>

                  {/* Second example claim */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Work Quality Dispute</h3>
                        <p className="text-sm text-gray-600">
                          Job #12346 - Mobile App
                        </p>
                      </div>
                      <Badge variant="secondary">Resolved</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Claimant</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>AC</AvatarFallback>
                          </Avatar>
                          <span>Acme Corp (Recruiter)</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Respondent</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          <span>Sarah Miller (Worker)</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resolution</p>
                        <p className="font-medium">Partial Refund (30%)</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Resolution Notes</p>
                      <p className="mt-1">
                        After reviewing the work and communications, it was
                        determined that 70% of the work met requirements. Worker
                        agreed to partial refund.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Connection Requests</CardTitle>
                    <CardDescription>
                      Review and approve connection requests between recruiters
                      and workers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.map((request: ConnectionRequest) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={
                                request.recruiter.user.avatar ||
                                "/placeholder-user.jpg"
                              }
                            />
                            <AvatarFallback>
                              {request.recruiter.user.firstName.charAt(0)}
                              {request.recruiter.user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">
                              {request.recruiter.user.firstName}{" "}
                              {request.recruiter.user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {request.recruiter.user.email}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="font-medium">Company:</span>{" "}
                              {request.recruiter.companyName}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {request.status === "PENDING" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="h-10 px-4 py-2"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {request.status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Requested Worker
                          </p>
                          <p className="mt-1">
                            {request.worker.user.firstName}{" "}
                            {request.worker.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.worker.user.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Worker Skills</p>
                          <p className="mt-1">{request.worker.skills}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Request Status
                          </p>
                          <p className="mt-1 capitalize">
                            {request.status.toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Requested
                          </p>
                          <p className="text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Recruiter Message
                        </p>
                        <p className="mt-1 p-3 bg-gray-50 rounded-md">
                          {request.message}
                        </p>
                        {request.adminNotes && (
                          <>
                            <p className="text-sm text-gray-500 mt-2">
                              Admin Notes
                            </p>
                            <p className="mt-1 p-3 bg-blue-50 rounded-md">
                              {request.adminNotes}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
