"use client";
import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { formatDate } from "@/utils/formartDate";
import { getUserFromToken, UserInfo } from "@/utils/auth";
import { logoutUser } from "@/lib/redux/slices/auth/auth.slice";
import {
  selectRecruiter,
  getRecruiterByUserId,
} from "@/lib/redux/slices/recruiter/recruiterSlice";
import {
  selectMyJobs,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobById,
} from "@/lib/redux/slices/jobs/jobsSlice";
import { RecruiterResponse } from "@/types/recruiter";
import { JobResponse, UpdateJobDto } from "@/types/jobs";
import { selectWorkers , getWorkers } from "@/lib/redux/slices/worker/workerSlice";

// Components
import PostJob from "@/components/PostJob";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
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
  Trash2,
  Pencil,
} from "lucide-react";
import { formatSalary } from "@/utils/formaSalary";
import {
  selectApplications,
  getApplications,
} from "@/lib/redux/slices/applications/applicationSlice";
import { Application } from "@/types/application/application";
import {
  getWorkAssignmentsByRecruiter,
  selectRecruiterAssignments,
} from "@/lib/redux/slices/assignments/assignmentSlice";
import { WorkAssignmentResponse } from "@/types/workerAssignment/assignment";
import { Worker } from "@/types/worker";
import WorkerCard from "@/components/WorkerCard";




const RecruiterDashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userD, setUser] = useState<UserInfo | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showWorkersDialog, setShowWorkersDialog] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const recruiterData = useAppSelector(selectRecruiter) as RecruiterResponse;
  const recentApplications = useAppSelector(selectApplications) as Application[];
  const activeAssignments = useAppSelector(selectRecruiterAssignments) as WorkAssignmentResponse[];

  const activeJobs = useAppSelector(selectMyJobs);
  const workers = useAppSelector(selectWorkers) ;


   // Calculate stats based on available data
  const stats = {
    activeJobs: activeJobs.length,
    totalApplications: recentApplications.length,
    pendingApplications: recentApplications.filter(app => app.status === "PENDING").length,
    acceptedApplications: recentApplications.filter(app => app.status === "ACCEPTED").length,
    activeAssignments: activeAssignments.filter(a => a.status === "ACTIVE").length,
    completedAssignments: activeAssignments.filter(a => a.status === "COMPLETED").length,
    totalSpent: activeAssignments.reduce((total, assignment) => {
      // Calculate total spent based on assignments
      // This is a placeholder - adjust based on your actual payment data structure
      return total + (assignment.job.salary || 0);
    }, 0),
    // averageRating: recruiterData?.rating || 0, // Assuming recruiter has a rating field
  };


  // Initialize user data and client state
  useEffect(() => {
    setIsClient(true);
    const userData = getUserFromToken();
    setUser(userData);
  }, []);

  useEffect(() => {
    if (isClient && userD) {
      const fetchData = async () => {
        setIsFetching(true);
        try {
          // First get recruiter data and wait for it to complete
          await dispatch(getWorkers()).unwrap();
          const recruiterAction = await dispatch(
            getRecruiterByUserId(Number(userD.id))
          );
          const recruiter = recruiterAction.payload as RecruiterResponse;

          // Then get other data that depends on recruiter
          await Promise.all([
            dispatch(getMyJobs()),
            dispatch(getApplications()),
            dispatch(getWorkAssignmentsByRecruiter(Number(recruiter.id))),
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [dispatch, isClient, userD]);

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

  const handleViewJob = async (jobId: number) => {
    try {
      const job = await dispatch(getJobById(jobId)).unwrap();
      setSelectedJob(job);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching job:", error);
    }
  };

  const handleUpdateJob = async (jobData: UpdateJobDto) => {
    try {
      await dispatch(updateJob({ id: selectedJob.id, data: jobData })).unwrap();
      await dispatch(getMyJobs());
      setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteJob(selectedJob.id)).unwrap();
      await dispatch(getMyJobs());
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper functions
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

  // Modal components
  const EditJobModal = () => (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedJob && (
          <PostJob
            onSubmit={handleUpdateJob}
            isEditMode={true}
            initialValues={{
              ...selectedJob,
              salary: selectedJob.salary.toString(),
              categoryId: selectedJob.category.id.toString(),
            }}
            closeModal={() => setIsEditModalOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );

  const ViewJobModal = () => (
    <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
      <DialogContent className="sm:max-w-2xl">
        {selectedJob && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedJob.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Badge variant="secondary">{selectedJob.category.name}</Badge>
                {selectedJob.allowMultiple && (
                  <Badge variant="outline">Multiple Workers</Badge>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>
                    {formatSalary(selectedJob.salary, selectedJob.salaryType)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{selectedJob.workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Posted {formatDate(selectedJob.createdAt)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Job Description</h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requirements
                    .split(",")
                    .map((req: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-sm">
                        {req.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
              <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the job
            posting and all related applications.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteJob}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
            Welcome back,{" "}
            <span className="text-blue-600">
              {recruiterData?.user?.firstName} {recruiterData?.user?.lastName}!
              👋
            </span>
          </h1>
          <p className="text-gray-600">
            Manage your job postings and track applications for{" "}
            <span className="font-semibold">{recruiterData?.companyName}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
            description="Currently hiring"
            color="text-blue-600"
          />
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            description="Need review"
            color="text-yellow-600"
          />
          <StatsCard
            title="Active Workers"
            value={stats.activeAssignments}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Currently working"
            color="text-green-600"
          />
          <StatsCard
            title="Monthly Spend"
            value={`${stats.totalSpent.toLocaleString()} Frw`}
            icon={`FRW`}
            description="This month"
            color="text-purple-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <DashboardTabs
              activeJobs={activeJobs}
              recentApplications={recentApplications}
              activeAssignments={activeAssignments}
              workers={workers}
              isFetching={isFetching}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              handleViewJob={handleViewJob}
              setSelectedJob={setSelectedJob}
              setIsViewModalOpen={setIsViewModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              JobCardSkeleton={JobCardSkeleton}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActionsCard
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              showWorkersDialog={showWorkersDialog}
              setShowWorkersDialog={setShowWorkersDialog}
              workers={workers}
            />

            <CompanyProfileCard recruiterData={recruiterData} />

            <RecentActivityCard />
          </div>
        </div>

        {/* Modals */}
        {selectedJob && (
          <>
            <EditJobModal />
            <ViewJobModal />
            <DeleteConfirmationDialog />
          </>
        )}
      </div>
    </div>
  );
};

// Sub-components for better organization
const StatsCard = ({
  title,
  value,
  icon,
  description,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const DashboardTabs = ({
  activeJobs,
  recentApplications,
  activeAssignments,
  workers,
  isFetching,
  isOpen,
  setIsOpen,
  handleViewJob,
  setSelectedJob,
  setIsViewModalOpen,
  setIsEditModalOpen,
  setIsDeleteDialogOpen,
  JobCardSkeleton,
  getStatusColor,
  getStatusIcon,
}: {
  activeJobs: JobResponse[];
  recentApplications: Application[];
  activeAssignments: WorkAssignmentResponse[];
  workers: Worker[];
  isFetching: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleViewJob: (jobId: number) => Promise<void>;
  setSelectedJob: (job: JobResponse) => void;
  setIsViewModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  JobCardSkeleton: () => JSX.Element;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
}) => (
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
            <CardDescription>Manage your current job listings</CardDescription>
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
              <>
                <JobCardSkeleton />
                <JobCardSkeleton />
                <JobCardSkeleton />
              </>
            ) : activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  handleViewJob={handleViewJob}
                  setSelectedJob={setSelectedJob}
                  setIsViewModalOpen={setIsViewModalOpen}
                  setIsEditModalOpen={setIsEditModalOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                />
              ))
            ) : (
              <NoJobsFound setIsOpen={setIsOpen} />
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
              <ApplicationCard
                key={application.id}
                application={application}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="assignments" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Work Assignments</CardTitle>
          <CardDescription>Monitor ongoing work assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          ) : activeAssignments.length > 0 ? (
            <div className="space-y-4">
              {activeAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No active work assignments found
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="workers" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Workers</CardTitle>
          <CardDescription>Manage your current workforce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

const JobCard = ({
  job,
  handleViewJob,
  setSelectedJob,
  setIsViewModalOpen,
  setIsEditModalOpen,
  setIsDeleteDialogOpen,
}: {
  job: JobResponse;
  handleViewJob: (jobId: number) => Promise<void>;
  setSelectedJob: (job: JobResponse) => void;
  setIsViewModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-semibold text-gray-900">{job.title}</h3>
        <Badge variant="secondary">{job.category.name}</Badge>
        {job.allowMultiple && <Badge variant="outline">Multiple Workers</Badge>}
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
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setSelectedJob(job);
          setIsViewModalOpen(true);
        }}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      <Button
        size="sm"
        onClick={() => {
          setSelectedJob(job);
          setIsEditModalOpen(true);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          setSelectedJob(job);
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const NoJobsFound = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => (
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
);

const ApplicationCard = ({
  application,
  getStatusColor,
  getStatusIcon,
}: {
  application: Application;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
}) => (
  <div className="flex items-start justify-between p-4 border rounded-lg">
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage
          src={
            application.worker?.avatar || "/placeholder.svg?height=40&width=40"
          }
        />
        <AvatarFallback>
          {application.worker.firstName[0]}
          {application.worker.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">
          {application.worker.firstName} {application.worker.lastName}
        </h3>
        <p className="text-sm text-gray-600">{application.job.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          {application.job.category.name} | {application.job.location}
        </p>
        <p className="text-sm text-gray-500">
          {application.job.description} |{" "}
        </p>
        {application.message && (
          <p className="text-sm text-gray-700 mt-2 italic">
            "{application.message}"
          </p>
        )}
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
);

const AssignmentCard = ({
  assignment,
}: {
  assignment: WorkAssignmentResponse;
}) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900">{assignment.job.title}</h3>
      <p className="text-sm text-gray-600">
        Worker: {assignment.worker.firstName} {assignment.worker.lastName}
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
      <Badge
        className="mt-2"
        variant={assignment.status === "ACTIVE" ? "default" : "secondary"}
      >
        {assignment.status}
      </Badge>
      {assignment.notes && (
        <p className="text-sm text-gray-600 mt-1">{assignment.notes}</p>
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
);


const QuickActionsCard = ({
  isOpen,
  setIsOpen,
  showWorkersDialog,
  setShowWorkersDialog,
  workers,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  showWorkersDialog: boolean;
  setShowWorkersDialog: (open: boolean) => void;
  workers: Worker[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            {workers.map((worker:Worker) => (
              <WorkerCard key={worker.id} worker={worker} />
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
);

const CompanyProfileCard = ({
  recruiterData,
}: {
  recruiterData: RecruiterResponse;
}) => (
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
      <div className="text-sm text-gray-600">{recruiterData?.description}</div>
      <div className="flex items-center text-sm text-gray-500">
        <MapPin className="h-4 w-4 mr-1" />
        {recruiterData?.location}
      </div>
      {recruiterData?.website && (
        <div className="text-sm">
          <a
            href={recruiterData?.website}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
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
);

const RecentActivityCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="text-sm">
        <div className="font-medium">New application received</div>
        <div className="text-gray-600">Elementary School Teacher position</div>
        <div className="text-xs text-gray-500">2 hours ago</div>
      </div>
      <div className="text-sm">
        <div className="font-medium">Worker assignment completed</div>
        <div className="text-gray-600">House cleaning by Maria Garcia</div>
        <div className="text-xs text-gray-500">1 day ago</div>
      </div>
      <div className="text-sm">
        <div className="font-medium">Job post published</div>
        <div className="text-gray-600">Security Guard - Night Shift</div>
        <div className="text-xs text-gray-500">3 days ago</div>
      </div>
    </CardContent>
  </Card>
);

export default RecruiterDashboard;
