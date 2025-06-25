"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, MapPin, Clock, DollarSign, AlertCircle } from "lucide-react";
import { useFormik } from "formik";
import { jobValidation } from "@/utils/validation";
import { FormError } from "@/utils/FormError";
import { selectJobCategories, getJobCategories } from "@/lib/redux/slices/JobCategories/JobCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { createJob } from "@/lib/redux/slices/jobs/jobsSlice";
import { CreateJobDto } from "@/types/jobs";
import { selectRecruiters , getAllRecruiters } from "@/lib/redux/slices/recruiter/recruiterSlice";
import { GetMe , selectMyProfile } from "@/lib/redux/slices/auth/auth.slice";
import { RecruiterResponse } from "@/types/recruiter";

interface PostJobProps {
  closeModal?: () => void;
  onSubmit?: (values: CreateJobDto) => void;
  isEditMode?: boolean;
  initialValues?: CreateJobDto; 
}

export default function PostJob({ 
  closeModal, 
  onSubmit,
  isEditMode = false,
  initialValues 
}: PostJobProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const dispatch = useAppDispatch();
  const jobCategories = useAppSelector(selectJobCategories);

  const recruiters = useAppSelector(selectRecruiters);
  const myProfile = useAppSelector(selectMyProfile);
  const profileData = recruiters?.recruiters?.find((recruiter: RecruiterResponse) => recruiter.userId === myProfile?.id);
  const recruiterId = profileData?.id ? Number(profileData.id) : undefined;

  useEffect(() => {
    try {
      dispatch(getJobCategories());
      dispatch(getAllRecruiters());
      dispatch(GetMe());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const salaryTypes = [
    { value: "HOURLY", label: "Per Hour" },
    { value: "DAILY", label: "Per Day" },
    { value: "WEEKLY", label: "Per Week" },
    { value: "MONTHLY", label: "Per Month" },
    { value: "YEARLY", label: "Per Year" },
  ];

  const workingHoursTemplates = [
    "9:00 AM - 5:00 PM",
    "8:00 AM - 4:00 PM",
    "10:00 AM - 6:00 PM",
    "6:00 PM - 2:00 AM (Night Shift)",
    "Flexible Hours",
    "Part-time (20 hours/week)",
    "Weekend Only",
  ];

const formik = useFormik({
  initialValues: isEditMode && initialValues ? 
    {
      ...initialValues,
      categoryId: initialValues.categoryId.toString(), // Keep as string for form
      salary: initialValues.salary.toString(),
      recruiterId: Number(initialValues.recruiterId), // Ensure it's a number
    } : {
      title: "",
      categoryId: "",
      recruiterId: recruiterId || 0, // Default to 0 if undefined, will be set when recruiterId is available
      description: "",
      requirements: "",
      location: "",
      salary: "",
      salaryType: "MONTHLY",
      workingHours: "",
      allowMultiple: false,
      isActive: true,
    },
    validationSchema: jobValidation,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const jobData = {
          ...values,
          skills: skills, 
          categoryId: Number(values.categoryId),
          salary: Number(values.salary),
          recruiterId: Number(values.recruiterId), // Ensure recruiterId is sent as number
        };
        
        if (isEditMode && onSubmit) {
          await onSubmit(jobData);
        } else {
          const resultAction = await dispatch(createJob(jobData));
          if (createJob.fulfilled.match(resultAction)) {
            formik.resetForm();
            setSkills([]);
            setNewSkill("");
            if (closeModal) closeModal();
          }
        }
      } catch (error) {
        console.error("Error posting job:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Update recruiterId when it becomes available
  useEffect(() => {
    if (recruiterId && !isEditMode) {
      formik.setFieldValue("recruiterId", recruiterId);
    }
  }, [recruiterId, isEditMode]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const formatSalary = (amount: string, type: string) => {
    if (!amount) return "";
    const formatMap = {
      HOURLY: `$${amount}/hr`,
      DAILY: `$${amount}/day`,
      WEEKLY: `$${amount}/week`,
      MONTHLY: `$${amount.toLocaleString()}/month`,
      YEARLY: `$${amount.toLocaleString()}/year`,
    };
    return formatMap[type as keyof typeof formatMap] || `$${amount}`;
  };

  // Show loading or error state if recruiterId is not available
  if (!recruiterId && !isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading Recruiter Profile
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch your recruiter information...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Edit Job" : "Post a New Job"}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? "Update your job posting details" 
              : "Create a detailed job posting to attract the right candidates"
            }
          </p>
        </div>

        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit Job" : "Preview Job"}
          </Button>
        </div>

        {previewMode ? (
          /* Job Preview */
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Preview</CardTitle>
                <Badge variant="secondary">Preview Mode</Badge>
              </div>
              <CardDescription>
                This is how your job posting will appear to workers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {formik.values.title || "Job Title"}
                    </h2>
                    {formik.values.categoryId && (
                      <Badge variant="secondary">
                        {
                          jobCategories.find(
                            (cat) => cat.id.toString() === formik.values.categoryId
                          )?.name
                        }
                      </Badge>
                    )}
                    {formik.values.allowMultiple && (
                      <Badge variant="outline">Multiple Workers</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    {formik.values.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formik.values.location}
                      </div>
                    )}
                    {formik.values.salary && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(formik.values.salary, formik.values.salaryType)}
                      </div>
                    )}
                    {formik.values.workingHours && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formik.values.workingHours}
                      </div>
                    )}
                  </div>
                </div>

                {formik.values.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Job Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formik.values.description}
                    </p>
                  </div>
                )}

                {formik.values.requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Requirements
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {formik.values.requirements}
                    </p>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Required Skills
                    </h3>
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
          <form onSubmit={formik.handleSubmit} className="space-y-8">
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
                    <CardDescription>
                      Essential details about the job position
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., Elementary School Teacher"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={isLoading}
                        />
                        <FormError formik={formik} name="title" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="categoryId">Category *</Label>
                        <Select
                          value={formik.values.categoryId}
                          onValueChange={(value) =>
                            formik.setFieldValue("categoryId", value)
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select job category" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormError formik={formik} name="categoryId" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Manhattan, NY"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                      />
                      <FormError formik={formik} name="location" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary Amount *</Label>
                        <Input
                          id="salary"
                          name="salary"
                          type="number"
                          placeholder="e.g., 45000"
                          value={formik.values.salary}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={isLoading}
                        />
                        <FormError formik={formik} name="salary" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salaryType">Salary Type *</Label>
                        <Select
                          value={formik.values.salaryType}
                          onValueChange={(value) =>
                            formik.setFieldValue("salaryType", value)
                          }
                          disabled={isLoading}
                        >
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
                        <FormError formik={formik} name="salaryType" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>
                      Detailed information about the position
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the job responsibilities, work environment, and what you're looking for in a candidate..."
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="min-h-[120px]"
                        disabled={isLoading}
                      />
                      <FormError formik={formik} name="description" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workingHours">Working Hours *</Label>
                      <Select
                        value={formik.values.workingHours}
                        onValueChange={(value) =>
                          formik.setFieldValue("workingHours", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
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
                      <FormError formik={formik} name="workingHours" />
                      <p className="text-sm text-gray-500">
                        Or you can type custom working hours
                      </p>
                      <Input
                        placeholder="Custom working hours (e.g., 7:00 AM - 3:00 PM)"
                        value={formik.values.workingHours}
                        onChange={(e) =>
                          formik.setFieldValue("workingHours", e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowMultiple"
                        checked={formik.values.allowMultiple}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("allowMultiple", checked as boolean)
                        }
                        disabled={isLoading}
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
                    <CardDescription>
                      Specify what you're looking for in candidates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Job Requirements</Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        placeholder="List the qualifications, experience, certifications, or other requirements..."
                        value={formik.values.requirements}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="min-h-[100px]"
                        disabled={isLoading}
                      />
                      <FormError formik={formik} name="requirements" />
                    </div>

                    <div className="space-y-2">
                      <Label>Required Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                              disabled={isLoading}
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
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addSkill())
                          }
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          onClick={addSkill}
                          variant="outline"
                          disabled={isLoading}
                        >
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
                  checked={formik.values.isActive}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("isActive", checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="isActive" className="text-sm">
                  Publish job immediately
                </Label>
              </div>

              <div className="flex space-x-3">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? "Updating..." : "Posting..."}
                    </span>
                  ) : isEditMode ? "Update Job" : "Post Job"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Form Validation Errors Alert */}
        {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the errors above before submitting the job posting.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}