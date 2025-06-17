"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Plus,
  X,
  Upload,
  ArrowLeft,
  Briefcase,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function WorkerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    id: 1,
    userId: 1,
    location: "New York, USA",
    experience: "5 years of experience in web development",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    resume: "https://example.com/resumes/john-doe.pdf",
    available: true,
    user: {
      id: 1,
      email: "worker@example.com",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://example.com/resumes/john-doe.pdf"
    }
  })

  const [newSkill, setNewSkill] = useState("")

  const handleInputChange = (field: string, value: string | boolean | { id: number; email: string; firstName: string; lastName: string; avatar: string }) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving profile data:", profileData)
    setIsEditing(false)
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
              <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4">
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
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">
                    {profileData.user.firstName[0]}
                    {profileData.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.user.firstName} {profileData.user.lastName}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profileData.location}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {profileData.user.email}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      <a href={profileData.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Resume
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{profileData.skills.length}</div>
                <div className="text-sm text-gray-600">Skills</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {profileData.available ? "Available" : "Not Available"}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">New York</div>
                <div className="text-sm text-gray-600">Location</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>Tell potential employers about yourself</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Write about your experience..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.experience}</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.user.firstName}
                            onChange={(e) => handleInputChange("user", {
                              ...profileData.user,
                              firstName: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.user.lastName}
                            onChange={(e) => handleInputChange("user", {
                              ...profileData.user,
                              lastName: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.user.email}
                          onChange={(e) => handleInputChange("user", {
                            ...profileData.user,
                            email: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        <span>
                          {profileData.user.firstName} {profileData.user.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{profileData.user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{profileData.location}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Select
                          value={profileData.available ? "Available" : "Not Available"}
                          onValueChange={(value) => handleInputChange("available", value === "Available")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Not Available">Not Available</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="resume">Resume URL</Label>
                        <Input
                          id="resume"
                          value={profileData.resume}
                          onChange={(e) => handleInputChange("resume", e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{profileData.available ? "Available for work" : "Not currently available"}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-3 text-gray-400" />
                        <a href={profileData.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Resume
                        </a>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Your technical skills and competencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                        {isEditing && (
                          <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-500 hover:text-gray-700">
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill}>Add</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
                <CardDescription>Your work history and background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900">Web Developer</h3>
                    <p className="text-blue-600">Various Companies</p>
                    <p className="text-sm text-gray-500 mb-2">5+ years</p>
                    <p className="text-gray-700">
                      {profileData.experience}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}