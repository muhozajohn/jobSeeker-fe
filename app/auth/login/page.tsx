"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormik } from "formik";
import { loginValidation } from "@/utils/validation";
import { FormError } from "@/utils/FormError";

// Redux
import {
  loginUser,
  selectAuthError,
  selectUserRole,
  selectIsAuthenticated,
} from "@/lib/redux/slices/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on role when authentication state changes
  useEffect(() => {
    if (isAuthenticated && userRole) {
      switch (userRole) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'RECRUITER':
          router.push('/dashboard/recruiter');
          break;
        case 'WORKER':
          router.push('/');
          break;
        default:
          router.push('/');
      }
    }
  }, [isAuthenticated, userRole, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await dispatch(loginUser(values));
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-orange-400 hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your JobConnect account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="!py-6"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                />
                <FormError formik={formik} name="email"  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    className="!py-6"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                  />
                  <FormError formik={formik} name="password" />
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
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-orange-400 hover:text-orange-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-orange-400 hover:text-orange-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}