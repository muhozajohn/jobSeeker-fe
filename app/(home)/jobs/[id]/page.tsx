"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Briefcase,
  Building,
  Mail,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  Upload,
  FileText,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { JobResponse } from "@/types/jobs"
import { getJobById, selectCurrentJob } from "@/lib/redux/slices/jobs/jobsSlice"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks"


export default function JobDetailPage() {
  const params = useParams()
  const jobId = params?.id
  const dispatch = useAppDispatch()
  const job = useAppSelector(selectCurrentJob) as JobResponse

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    expectedSalary: "",
    availableStartDate: "",
    additionalInfo: "",
  })

  useEffect(() => {
    if (jobId) {
      setIsLoading(true)
      setError(null)
      
      dispatch(getJobById(Number(jobId)))
        .unwrap()
        .then(() => {
          setIsLoading(false)
        })
        .catch((err) => {
          setError(err.message || "Failed to load job details")
          setIsLoading(false)
        })
    }
  }, [jobId, dispatch])

  const formatSalary = (amount: number, type: string) => {
    const formatMap = {
      HOURLY: `$${amount.toLocaleString()}/hr`,
      DAILY: `$${amount.toLocaleString()}/day`,
      WEEKLY: `$${amount.toLocaleString()}/week`,
      MONTHLY: `$${amount.toLocaleString()}/month`,
      YEARLY: `$${amount.toLocaleString()}/year`,
    }
    return formatMap[type as keyof typeof formatMap] || `$${amount.toLocaleString()}`
  }

  const handleInputChange = (field: string, value: string) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Application submitted:", {
        jobId: job?.id,
        ...applicationData,
      })

      setApplicationSubmitted(true)
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setIsApplying(false)
    }
  }

  const toggleSaveJob = () => {
    setIsSaved(!isSaved)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The job you're looking for doesn't exist."}</p>
          <Link href="/jobs">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const applicantCount = job.applications?.length || 0
  const fullName = `${job.recruiter.firstName} ${job.recruiter.lastName}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={toggleSaveJob}>
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 mr-2 text-blue-600" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                      <Badge variant="secondary">{job.category.name}</Badge>
                      {job.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-4">{fullName}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {applicantCount} applicants
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted {daysAgo} days ago
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Apply Section */}
                {!applicationSubmitted ? (
                  <div className="flex space-x-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" className="flex-1">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                          <DialogDescription>
                            Submit your application for this position with {fullName}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter *</Label>
                            <Textarea
                              id="coverLetter"
                              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                              value={applicationData.coverLetter}
                              onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                              className="min-h-[120px]"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expectedSalary">Expected Salary</Label>
                              <Input
                                id="expectedSalary"
                                placeholder={`e.g., ${formatSalary(job.salary, job.salaryType)}`}
                                value={applicationData.expectedSalary}
                                onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="availableStartDate">Available Start Date</Label>
                              <Input
                                id="availableStartDate"
                                type="date"
                                value={applicationData.availableStartDate}
                                onChange={(e) => handleInputChange("availableStartDate", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="additionalInfo">Additional Information</Label>
                            <Textarea
                              id="additionalInfo"
                              placeholder="Any additional information you'd like to share..."
                              value={applicationData.additionalInfo}
                              onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label>Resume & Documents</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">
                                Upload your resume and any supporting documents
                              </p>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Choose Files
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogTrigger>
                            <Button onClick={handleApply} disabled={isApplying || !applicationData.coverLetter.trim()}>
                              {isApplying ? "Submitting..." : "Submit Application"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your application has been submitted successfully! The employer will review your application and
                      get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Job Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div>
                        {/* <h3 className="text-xl font-semibold mb-1">{fullName}</h3> */}
                        <p className="text-gray-600 font-semibold mb-2">Job Category: {job.category.name}</p>
                        <p className="text-gray-600 mb-2">{job.category.description}</p>
                    </div>
                    <div className="prose max-w-none mt-2">
                      <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>
                      
                  </CardContent>
                </Card>

                {job.skills && job.skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements & Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recruiter" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Recruiter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {job.recruiter.firstName.charAt(0)}{job.recruiter.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{fullName}</h3>
                        {/* <p className="text-gray-600 mb-2">Job Category: {job.category.name}</p> */}
                        {/* <p className="text-gray-600 mb-2">{job.category.description}</p> */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span>{job.recruiter.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Job Type</span>
                  <span className="text-sm text-gray-900">{job.allowMultiple ? "Multiple positions" : "Single position"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className="text-sm text-gray-900">{job.isActive ? "Active" : "Inactive"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Posted</span>
                  <span className="text-sm text-gray-900">{daysAgo} days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Updated</span>
                  <span className="text-sm text-gray-900">{new Date(job.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Applications</span>
                  <span className="text-sm text-gray-900">{applicantCount} received</span>
                </div>
                {job.workAssignments && job.workAssignments.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Work Assignments</span>
                    <span className="text-sm text-gray-900">{job.workAssignments.length} active</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{job.recruiter.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{fullName}</span>
                </div>
              </CardContent>
            </Card>

            {/* Work Assignments (if any) */}
            {job.workAssignments && job.workAssignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {job.workAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={assignment.status === "ACTIVE" ? "default" : "secondary"}>
                          {assignment.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(assignment.workDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(assignment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(assignment.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {assignment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{assignment.notes}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}