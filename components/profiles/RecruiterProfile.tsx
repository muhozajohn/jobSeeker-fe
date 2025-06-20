"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  MapPin,
  Mail,
  Briefcase,
  Globe,
  Shield,
  ArrowLeft,
  Calendar,
  Edit,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Upload,
} from "lucide-react";
import Link from "next/link";
import {
  selectRecruiters,
  getAllRecruiters,
  updateRecruiter,
} from "@/lib/redux/slices/recruiter/recruiterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { selectMyProfile, GetMe } from "@/lib/redux/slices/auth/auth.slice";
import { RecruiterResponse } from "@/types/recruiter";
import { updateUserAvatar } from "@/lib/redux/slices/auth/user.Slice";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

interface RecruiterProfile {
  id: number;
  userId: number;
  companyName: string;
  type: string;
  description: string;
  location: string;
  website: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export default function RecruiterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<RecruiterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const recruiters = useAppSelector(selectRecruiters);
  const myProfile = useAppSelector(selectMyProfile);
  const profileData = recruiters?.recruiters?.find(
    (recruiter: RecruiterResponse) => recruiter.userId === myProfile?.id
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all([dispatch(getAllRecruiters()), dispatch(GetMe())]);
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (profileData && !editedData) {
      setEditedData({
        ...profileData,
        user: {
          ...profileData.user,
          avatar:
            profileData.user.avatar === undefined
              ? null
              : profileData.user.avatar,
        },
      });
    }
  }, [profileData, editedData]);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      if (!editedData) return;

      setEditedData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [editedData]
  );

  const handleUserInputChange = useCallback(
    (field: string, value: string) => {
      if (!editedData) return;

      setEditedData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            [field]: value,
          },
        };
      });
    },
    [editedData]
  );

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editedData) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsUploading(true);
      setError(null);

      if (myProfile?.id === undefined) {
        throw new Error("User ID is missing");
      }
      await dispatch(updateUserAvatar({ id: myProfile.id, avatar: file }));

      // For demo purposes, we'll use a mock URL
      const avatarUrl = URL.createObjectURL(file);

      setEditedData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            avatar: profileData.user.avatar || avatarUrl,
          },
        };
      });
      // Refresh data after successful update
      await fetchData();
    } catch (err) {
      setError("Failed to upload avatar. Please try again.");
      console.error("Error uploading avatar:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      setIsSaving(true);
      setError(null);

      // Validation
      if (!editedData.companyName.trim()) {
        throw new Error("Company name is required");
      }
      if (
        !editedData.user.firstName.trim() ||
        !editedData.user.lastName.trim()
      ) {
        throw new Error("First name and last name are required");
      }
      if (
        !editedData.user.email.trim() ||
        !editedData.user.email.includes("@")
      ) {
        throw new Error("Valid email is required");
      }

      if (profileData?.id === undefined) {
        throw new Error("Recruiter profile ID is missing");
      }
      // Convert user.avatar null to undefined for type compatibility
      const safeEditedData = {
        ...editedData,
        user: {
          ...editedData.user,
          avatar:
            editedData.user.avatar === null
              ? undefined
              : editedData.user.avatar,
        },
      };
      await dispatch(
        updateRecruiter({ id: profileData.id, data: safeEditedData })
      );
      // Refresh data after successful update
      await fetchData();

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setEditedData({
        ...profileData,
        user: {
          ...profileData.user,
          avatar:
            profileData.user.avatar === undefined
              ? null
              : profileData.user.avatar,
        },
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="w-full flex justify-between items-center">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-orange-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
                    <Briefcase size={18} className="text-white" />
                  </div>
                  JobConnect
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profileData || !editedData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="w-full flex justify-between items-center">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-orange-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
                    <Briefcase size={18} className="text-white" />
                  </div>
                  JobConnect
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No recruiter profile found. Please create a recruiter profile
              first.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            <div className="w-full flex justify-between items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-orange-400 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
                  <Briefcase size={18} className="text-white" />
                </div>
                JobConnect
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {editedData.user.avatar ? (
                      <AvatarImage
                        src={editedData.user.avatar}
                        alt={editedData.companyName}
                      />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {getCompanyInitials(editedData.companyName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full p-2 h-10 w-10  bg-black"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 " />
                        ) : (
                          <Upload className="h-4 w-4 text-white" />
                        )}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {editedData.companyName}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {editedData.location}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {editedData.user.email}
                    </div>
                    {editedData.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        <a
                          href={
                            editedData.website.startsWith("http")
                              ? editedData.website
                              : `https://${editedData.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {editedData.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      <Check className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">150+</div>
                <div className="text-sm text-gray-600">Candidates Hired</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {editedData.type}
                </div>
                <div className="text-sm text-gray-600">Company Type</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {editedData.verified ? (
                      <Badge variant="default" className="text-base">
                        <Shield className="h-4 w-4 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-base">
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
                <CardDescription>
                  Tell candidates about your company
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Write a brief description about your company..."
                    className="min-h-[120px]"
                    maxLength={1000}
                  />
                ) : (
                  <div className="text-gray-700">
                    {editedData.description ? (
                      <p className="whitespace-pre-wrap">
                        {editedData.description}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No description provided yet.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Details about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={editedData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editedData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={editedData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="e.g., https://company.com"
                        type="url"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Company Type</Label>
                      <Input
                        id="type"
                        value={editedData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        placeholder="e.g., STARTUP, ENTERPRISE, AGENCY"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>{editedData.companyName}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        {editedData.location || "Location not specified"}
                      </span>
                    </div>
                    {editedData.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                        <a
                          href={
                            editedData.website.startsWith("http")
                              ? editedData.website
                              : `https://${editedData.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {editedData.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <div className="flex items-center">
                        <span className="mr-2">{editedData.type}</span>
                        {editedData.verified ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="outline">Not Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How candidates can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={editedData.user.firstName}
                          onChange={(e) =>
                            handleUserInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={editedData.user.lastName}
                          onChange={(e) =>
                            handleUserInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedData.user.email}
                        onChange={(e) =>
                          handleUserInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        {editedData.user.firstName} {editedData.user.lastName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>{editedData.user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        Member since {formatDate(editedData.createdAt)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
