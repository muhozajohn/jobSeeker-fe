"use client";

import { useState, useEffect } from "react";
import WorkerProfile from "@/components/profiles/WorkerProfile";
import RecruiterProfile from "@/components/profiles/RecruiterProfile";
import AdminProfile from "@/components/profiles/AdminProfile";
import { selectAuthError, selectIsAuthenticated, selectUserRole } from "@/lib/redux/slices/auth/auth.slice";
import { useAppSelector } from "@/lib/hooks/hooks";
import { useRouter } from "next/navigation";

export default function UniversalProfilePage() {
  const router = useRouter();
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
    setLoading(false);
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Unable to determine your user role</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
       
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {userRole === "WORKER" && <WorkerProfile />}
        {userRole === "RECRUITER" && <RecruiterProfile />}
        {userRole === "ADMIN" && <AdminProfile />}
      </div>
    </div>
  );
}