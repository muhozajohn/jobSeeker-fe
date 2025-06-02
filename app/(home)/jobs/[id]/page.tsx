"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  Upload,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params?.id

  const [isApplying, setIsApplying] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    expectedSalary: "",
    availableStartDate: "",
    additionalInfo: "",
  })

  // Mock job data - in a real app, this would be fetched based on the jobId
  const job = {
    id: Number.parseInt(jobId as string) || 1,
    title: "Elementary School Teacher",
    category: { name: "Teacher", id: 1 },
    description: `We are seeking a passionate and dedicated Elementary School Teacher to join our team at Sunshine Elementary School. The ideal candidate will have experience working with children ages 6-11 and a strong commitment to fostering a positive learning environment.

Key Responsibilities:
• Develop and implement engaging lesson plans aligned with curriculum standards
• Create a supportive and inclusive classroom environment
• Assess student progress and provide constructive feedback
• Collaborate with parents, colleagues, and administrators
• Participate in school events and professional development activities
• Maintain accurate records of student attendance and academic performance

We offer a collaborative work environment, competitive compensation, and opportunities for professional growth. Join our team and make a difference in young students' lives!`,
    requirements: `Required Qualifications:
• Bachelor's degree in Education or related field
• Valid teaching certification/license
• 2+ years of elementary teaching experience
• Strong classroom management skills
• Excellent communication and interpersonal skills
• Proficiency in educational technology and digital tools
• CPR and First Aid certification preferred

Preferred Qualifications:
• Master's degree in Education
• Experience with diverse student populations
• Bilingual capabilities (English/Spanish)
• Knowledge of special education practices`,
    location: "Manhattan, NY",
    salary: 45000,
    salaryType: "YEARLY",
    workingHours: "8:00 AM - 3:00 PM",
    isActive: true,
    allowMultiple: false,
    urgent: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    expiresAt: "2024-02-15T10:00:00Z",
    recruiter: {
      id: 1,
      user: {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@sunshineelementary.edu",
        phone: "+1 (555) 123-4567",
        avatar: null,
      },
      companyName: "Sunshine Elementary School",
      type: "COMPANY",
      description:
        "A leading elementary school committed to providing quality education and fostering student growth in a nurturing environment.",
      location: "Manhattan, NY",
      website: "https://sunshineelementary.edu",
      verified: true,
    },
    applications: [
      { id: 1, status: "PENDING" },
      { id: 2, status: "PENDING" },
      { id: 3, status: "ACCEPTED" },
    ],
    skills: [
      "Teaching",
      "Classroom Management",
      "Curriculum Development",
      "Student Assessment",
      "Educational Technology",
    ],
    benefits: [
      "Health Insurance",
      "Dental Coverage",
      "Vision Insurance",
      "Retirement Plan (403b)",
      "Paid Time Off",
      "Professional Development",
      "Tuition Reimbursement",
    ],
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

  const handleInputChange = (field: string, value: string) => {
    setApplicationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleApply = async () => {
    setIsApplying(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Application submitted:", {
        jobId: job.id,
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

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const applicantCount = job.applications.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                JobConnect
              </Link>
            </div>
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
                    <p className="text-lg text-gray-600 mb-4">{job.recruiter.companyName}</p>

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
                            Submit your application for this position at {job.recruiter.companyName}
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
                                placeholder="e.g., $45,000"
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {job.skills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
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

              <TabsContent value="company" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {job.recruiter.companyName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={job.recruiter.user.avatar || "/placeholder.svg?height=64&width=64"} />
                        <AvatarFallback className="text-lg">
                          <Building className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{job.recruiter.companyName}</h3>
                          {job.recruiter.verified && (
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.recruiter.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.recruiter.location}
                          </div>
                          {job.recruiter.website && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-1" />
                              <a href={job.recruiter.website} className="text-blue-600 hover:underline">
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {job.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
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
                  <span className="text-sm text-gray-900">Full-time</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Experience Level</span>
                  <span className="text-sm text-gray-900">Mid-level</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Posted</span>
                  <span className="text-sm text-gray-900">{daysAgo} days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Expires</span>
                  <span className="text-sm text-gray-900">{new Date(job.expiresAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Applications</span>
                  <span className="text-sm text-gray-900">{applicantCount} received</span>
                </div>
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
                  <span className="text-sm text-gray-700">{job.recruiter.user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{job.recruiter.user.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{job.recruiter.companyName}</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Middle School Teacher</h4>
                    <p className="text-xs text-gray-600">Brooklyn Academy</p>
                    <p className="text-xs text-gray-500">$42,000/year • Brooklyn, NY</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Substitute Teacher</h4>
                    <p className="text-xs text-gray-600">NYC Department of Education</p>
                    <p className="text-xs text-gray-500">$200/day • Various locations</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">Private Tutor</h4>
                    <p className="text-xs text-gray-600">EduCare Services</p>
                    <p className="text-xs text-gray-500">$30/hour • Manhattan, NY</p>
                  </div>
                </div>
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="w-full">
                    View More Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
