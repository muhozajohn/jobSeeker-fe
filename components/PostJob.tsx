"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  Plus, X, MapPin, Clock, DollarSign, AlertCircle } from 'lucide-react'


export default function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    salaryType: "MONTHLY",
    workingHours: "",
    allowMultiple: false,
    isActive: true,
  })

  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewMode, setPreviewMode] = useState(false)

  const jobCategories = [
    { id: 1, name: "Teacher", description: "Educational services" },
    { id: 2, name: "Cleaner", description: "Cleaning services" },
    { id: 3, name: "Housemaid", description: "Domestic services" },
    { id: 4, name: "Security", description: "Security services" },
    { id: 5, name: "Cook", description: "Culinary services" },
    { id: 6, name: "Nanny", description: "Childcare services" },
    { id: 7, name: "Driver", description: "Transportation services" },
    { id: 8, name: "Nurse", description: "Healthcare services" },
    { id: 9, name: "Technician", description: "Technical services" },
    { id: 10, name: "Accountant", description: "Financial services" },
  ]

  const salaryTypes = [
    { value: "HOURLY", label: "Per Hour" },
    { value: "DAILY", label: "Per Day" },
    { value: "WEEKLY", label: "Per Week" },
    { value: "MONTHLY", label: "Per Month" },
    { value: "YEARLY", label: "Per Year" },
  ]

  const workingHoursTemplates = [
    "9:00 AM - 5:00 PM",
    "8:00 AM - 4:00 PM",
    "10:00 AM - 6:00 PM",
    "6:00 PM - 2:00 AM (Night Shift)",
    "Flexible Hours",
    "Part-time (20 hours/week)",
    "Weekend Only",
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.categoryId) newErrors.categoryId = "Category is required"
    if (!formData.description.trim()) newErrors.description = "Job description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.salary.trim()) newErrors.salary = "Salary is required"
    if (!formData.workingHours.trim()) newErrors.workingHours = "Working hours are required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // In a real app, you would submit to your API
      console.log("Job posting data:", {
        ...formData,
        skills,
        requirements: formData.requirements || "No specific requirements",
      })
      
      // Redirect to job management or show success message
      alert("Job posted successfully!")
    } catch (error) {
      console.error("Error posting job:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatSalary = (amount: string, type: string) => {
    if (!amount) return ""
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
  

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Create a detailed job posting to attract the right candidates</p>
        </div>

        {previewMode ? (
          /* Job Preview */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Preview</CardTitle>
                <Badge variant="secondary">Preview Mode</Badge>
              </div>
              <CardDescription>This is how your job posting will appear to workers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{formData.title || "Job Title"}</h2>
                    {formData.categoryId && (
                      <Badge variant="secondary">
                        {jobCategories.find((cat) => cat.id.toString() === formData.categoryId)?.name}
                      </Badge>
                    )}
                    {formData.allowMultiple && <Badge variant="outline">Multiple Workers</Badge>}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    {formData.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formData.location}
                      </div>
                    )}
                    {formData.salary && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(formData.salary, formData.salaryType)}
                      </div>
                    )}
                    {formData.workingHours && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formData.workingHours}
                      </div>
                    )}
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}

                {formData.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.requirements}</p>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Job Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="details">Job Details</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Essential details about the job position</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Elementary School Teacher"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                          <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select job category" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Manhattan, NY"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className={errors.location ? "border-red-500" : ""}
                      />
                      {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary Amount *</Label>
                        <Input
                          id="salary"
                          type="number"
                          placeholder="e.g., 45000"
                          value={formData.salary}
                          onChange={(e) => handleInputChange("salary", e.target.value)}
                          className={errors.salary ? "border-red-500" : ""}
                        />
                        {errors.salary && <p className="text-sm text-red-600">{errors.salary}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salaryType">Salary Type *</Label>
                        <Select value={formData.salaryType} onValueChange={(value) => handleInputChange("salaryType", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {salaryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Detailed information about the position</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the job responsibilities, work environment, and what you're looking for in a candidate..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                      />
                      {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workingHours">Working Hours *</Label>
                      <Select value={formData.workingHours} onValueChange={(value) => handleInputChange("workingHours", value)}>
                        <SelectTrigger className={errors.workingHours ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select working hours" />
                        </SelectTrigger>
                        <SelectContent>
                          {workingHoursTemplates.map((hours) => (
                            <SelectItem key={hours} value={hours}>
                              {hours}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.workingHours && <p className="text-sm text-red-600">{errors.workingHours}</p>}
                      <p className="text-sm text-gray-500">Or you can type custom working hours</p>
                      <Input
                        placeholder="Custom working hours (e.g., 7:00 AM - 3:00 PM)"
                        value={formData.workingHours}
                        onChange={(e) => handleInputChange("workingHours", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowMultiple"
                        checked={formData.allowMultiple}
                        onCheckedChange={(checked) => handleInputChange("allowMultiple", checked as boolean)}
                      />
                      <Label htmlFor="allowMultiple" className="text-sm">
                        Allow multiple workers for this job
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements & Skills</CardTitle>
                    <CardDescription>Specify what you're looking for in candidates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Job Requirements</Label>
                      <Textarea
                        id="requirements"
                        placeholder="List the qualifications, experience, certifications, or other requirements..."
                        value={formData.requirements}
                        onChange={(e) => handleInputChange("requirements", e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Required Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-sm">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        />
                        <Button type="button" onClick={addSkill} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                />
                <Label htmlFor="isActive" className="text-sm">
                  Publish job immediately
                </Label>
              </div>

              <div className="flex space-x-3">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Success/Error Messages */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the errors above before submitting the job posting.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
