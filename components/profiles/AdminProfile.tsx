"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { selectMyProfile, GetMe } from "@/lib/redux/slices/auth/auth.slice";
import {
  updateUser,
  fetchUsers,
  selectUsers,
} from "@/lib/redux/slices/auth/user.Slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit,
  Check,
  X,
  ArrowLeft,
  Lock,
  Activity,
  Loader2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { CreateUserDto, User as UserType } from "@/types/users";
import { formatDate } from "@/utils/formartDate";


export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<CreateUserDto>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();
  const myProfile = useAppSelector(selectMyProfile);
  const users = useAppSelector(selectUsers);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const profileData = users?.find((user: UserType) => user.id === myProfile?.id);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        dispatch(fetchUsers()),
        dispatch(GetMe())
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (field: keyof CreateUserDto, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      Object.entries(editedData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === 'boolean' ? String(value) : value);
        }
      });

      if (file) {
        formData.append("avatar", file);
      }

      if (profileData?.id) {
        await dispatch(
          updateUser({
            id: profileData.id,
            userData: editedData,
            avatar: file ?? undefined,
          })
        );
        
        // Refresh data after successful update
        await fetchData();
        
        setIsEditing(false);
        setEditedData({});
        setFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (profileData) {
      if (!isEditing) {
        setEditedData({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
        });
      } else {
        setFile(null);
        setPreviewUrl(null);
      }
      setIsEditing(!isEditing);
    }
  };

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-orange-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              Admin Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="Preview" />
                  ) : profileData.avatar ? (
                    <AvatarImage
                      src={profileData.avatar}
                      alt={`${profileData.firstName}'s avatar`}
                    />
                  ) : (
                    <AvatarFallback className="text-lg bg-gray-100">
                      {profileData.firstName?.[0]}
                      {profileData.lastName?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <div className="mt-2">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 transition-colors" title="Change Avatar">
                        <Upload  className="text-lg" />
                        {/* <span>Change Avatar</span> */}
                      </div>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {file && (
                      <p className="mt-1 text-sm text-gray-500">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <div className="flex items-center mt-1 flex-wrap gap-2">
                    <Badge
                      variant={
                        profileData.role === "ADMIN" ? "default" : "secondary"
                      }
                    >
                      {profileData.role}
                    </Badge>
                    <Badge
                      variant={profileData.isActive ? "default" : "destructive"}
                    >
                      {profileData.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 gap-2 sm:gap-0">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {profileData.email}
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {profileData.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEditToggle}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={handleEditToggle}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: users.length ||0, label: "Users Managed", color: "blue" },
                { value: "156", label: "Total Listings", color: "green" },
                { value: "89%", label: "System Health", color: "purple" },
                { value: "3.2K", label: "Monthly Visits", color: "orange" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-${stat.color}-50 rounded-lg`}
                >
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your admin profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editedData.firstName || ""}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editedData.lastName || ""}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1234567890"
                      disabled={isSaving}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    <span>
                      {profileData.firstName} {profileData.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    <span>
                      Member since {formatDate(profileData.createdAt)}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your admin account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3 sm:gap-0">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-gray-500">
                      Last changed 3 months ago
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isEditing}
                >
                  Change Password
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3 sm:gap-0">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Account Activity</div>
                    <div className="text-sm text-gray-500">
                      Last login: 2 hours ago
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={isEditing}
                >
                  View Logs
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3 sm:gap-0">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <div className="font-medium">Admin Privileges</div>
                    <div className="text-sm text-gray-500">
                      Full system access
                    </div>
                  </div>
                </div>
                <Badge variant="default">{profileData.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}