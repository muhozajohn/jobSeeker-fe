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
  GraduationCap,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Experienced teacher with 5+ years in elementary education. Passionate about creating engaging learning environments for children.",
    availability: "Full-time",
    hourlyRate: "25",
    skills: ["Teaching", "Classroom Management", "Curriculum Development", "Child Psychology"],
    languages: ["English", "Spanish"],
    experience: [
      {
        id: 1,
        title: "Elementary Teacher",
        company: "Sunshine Elementary",
        duration: "2020 - Present",
        description: "Teaching 3rd grade students, developing lesson plans, and managing classroom activities.",
      },
      {
        id: 2,
        title: "Substitute Teacher",
        company: "NYC Department of Education",
        duration: "2018 - 2020",
        description: "Provided substitute teaching services across multiple schools and grade levels.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Education",
        school: "New York University",
        year: "2018",
        description: "Major in Elementary Education with focus on Mathematics and Science",
      },
    ],
    certifications: [
      {
        id: 1,
        name: "Teaching License - Elementary Education",
        issuer: "New York State Education Department",
        year: "2018",
      },
      {
        id: 2,
        name: "CPR/First Aid Certification",
        issuer: "American Red Cross",
        year: "2023",
      },
    ],
  })

  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  const handleInputChange = (field: string, value: string) => {
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

  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }))
      setNewLanguage("")
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      languages: prev.languages.filter((language) => language !== languageToRemove),
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
                    {profileData.firstName[0]}
                    {profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profileData.location}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {profileData.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {profileData.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
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
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-gray-600">Jobs Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Write a brief description about yourself..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.bio}</p>
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
                            value={profileData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
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
                          {profileData.firstName} {profileData.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{profileData.phone}</span>
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
                          value={profileData.availability}
                          onValueChange={(value) => handleInputChange("availability", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={profileData.hourlyRate}
                          onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{profileData.availability}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-3 text-gray-400" />
                        <span>${profileData.hourlyRate}/hour</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Your professional background</CardDescription>
                  </div>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profileData.experience.map((exp) => (
                    <div key={exp.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-600">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Your educational background</CardDescription>
                  </div>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.education.map((edu) => (
                    <div key={edu.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-green-600">{edu.school}</p>
                        <p className="text-sm text-gray-500 mb-2">{edu.year}</p>
                        <p className="text-gray-700">{edu.description}</p>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Certifications</CardTitle>
                    <CardDescription>Professional certifications and licenses</CardDescription>
                  </div>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-purple-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Highlight your key competencies</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>Languages you can communicate in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages.map((language) => (
                      <Badge key={language} variant="outline" className="text-sm">
                        {language}
                        {isEditing && (
                          <button
                            onClick={() => removeLanguage(language)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a language..."
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                      />
                      <Button onClick={addLanguage}>Add</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>What employers say about your work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">4.8</div>
                      <div className="flex items-center justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">23 reviews</div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: rating === 5 ? "70%" : rating === 4 ? "20%" : "5%" }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5 ? "16" : rating === 4 ? "5" : "2"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>SM</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">Sarah Miller</div>
                            <div className="text-sm text-gray-600">Sunshine Elementary</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">
                        "John was an excellent substitute teacher. He connected well with the students and maintained a
                        positive classroom environment. Highly recommended!"
                      </p>
                      <div className="text-sm text-gray-500">2 weeks ago</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>MJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">Michael Johnson</div>
                            <div className="text-sm text-gray-600">Private Family</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">
                        "Professional, reliable, and great with kids. John helped our daughter with her homework and was
                        always punctual. We'll definitely hire him again."
                      </p>
                      <div className="text-sm text-gray-500">1 month ago</div>
                    </div>
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
