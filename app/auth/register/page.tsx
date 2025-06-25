"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useFormik } from "formik";
import { FormError } from "@/utils/FormError";
import { useRouter } from "next/navigation";
import { recruiterValidation } from "@/utils/validation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "@/lib/redux/slices/auth/auth.slice";
import { createRecruiter } from "@/lib/redux/slices/recruiter/recruiterSlice";

// Define the RecruiterType enum to match your Prisma schema
enum RecruiterType {
  COMPANY = "COMPANY",
  GROUP = "GROUP",
  INDIVIDUAL = "INDIVIDUAL"
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on role when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userRole) {
      switch (userRole) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "RECRUITER":
          router.push("/dashboard/recruiter");
          break;
        case "WORKER":
          router.push("/dashboard/worker");
          break;
        default:
          router.push("/");
      }
    }
  }, [isAuthenticated, userRole, router]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyName: "",
      type: "",
      description: "",
      location: "",
      website: "",
      agreeToTerms: false,
    },
    validationSchema: recruiterValidation,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const { agreeToTerms, confirmPassword, ...payload } = values;
        const resultAction = await dispatch(createRecruiter(payload));
        if (createRecruiter.fulfilled.match(resultAction)) {
          // Registration successful, redirect to login
          router.push("/auth/login");
          formik.resetForm();
        }
      } catch (error) {
        formik.setErrors({ email: "Registration failed. Please try again." });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Recruiter Account</CardTitle>
            <CardDescription>
              Join JobConnect as a recruiter and start hiring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {formik.errors.email && formik.touched.email && (
                <Alert variant="destructive">
                  <AlertDescription>{formik.errors.email}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      className="!py-6"
                      placeholder="John"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                    />
                    <FormError formik={formik} name="firstName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      className="!py-6"
                      placeholder="Doe"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                    />
                    <FormError formik={formik} name="lastName" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="!py-6"
                    placeholder="john@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="email" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="!py-6"
                    placeholder="+1 (555) 123-4567"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="phone" />
                </div>
              </div>

              {/* Recruiter Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recruiter Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Recruiter Type</Label>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onValueChange={(value) => formik.setFieldValue("type", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="!py-6">
                      <SelectValue placeholder="Select recruiter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RecruiterType.COMPANY}>
                        Company Recruiter
                      </SelectItem>
                      <SelectItem value={RecruiterType.GROUP}>
                        Group/Agency Recruiter
                      </SelectItem>
                      <SelectItem value={RecruiterType.INDIVIDUAL}>
                        Individual Recruiter
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormError formik={formik} name="type" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company/Organization Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    className="!py-6"
                    placeholder="Acme Corporation"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="companyName" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    className="!py-6"
                    placeholder="New York, NY"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="location" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    className="!py-6"
                    placeholder="https://www.company.com"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="website" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="min-h-[100px]"
                    placeholder="Tell us about your company and what you're looking for..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="description" />
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      className="!py-6"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormError formik={formik} name="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      className="!py-6"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormError formik={formik} name="confirmPassword" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formik.values.agreeToTerms}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("agreeToTerms", checked)
                  }
                  onBlur={formik.handleBlur}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <FormError formik={formik} name="agreeToTerms" />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Recruiter Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}