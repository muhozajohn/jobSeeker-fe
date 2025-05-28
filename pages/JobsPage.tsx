"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, DollarSign, Filter, Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [salaryRange, setSalaryRange] = useState("")
  const [jobType, setJobType] = useState("")
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const jobCategories = ["Teacher", "Cleaner", "Housemaid", "Security", "Cook", "Nanny", "Driver", "Gardener"]

  const locations = ["New York, NY", "Brooklyn, NY", "Queens, NY", "Manhattan, NY", "Bronx, NY", "Staten Island, NY"]

  const jobs = [
    {
      id: 1,
      title: "Elementary School Teacher",
      company: "Sunshine Elementary School",
      location: "Manhattan, NY",
      salary: "$45,000 - $55,000/year",
      type: "Full-time",
      category: "Teacher",
      description:
        "We are seeking a passionate elementary school teacher to join our team. The ideal candidate will have experience working with children ages 6-11.",
      requirements: ["Bachelor's degree in Education", "Teaching certification", "2+ years experience"],
      postedDate: "2024-01-15",
      applicants: 23,
      urgent: false,
    },
    {
      id: 2,
      title: "House Cleaner - Flexible Hours",
      company: "Clean Pro Services",
      location: "Brooklyn, NY",
      salary: "$18 - $22/hour",
      type: "Part-time",
      category: "Cleaner",
      description: "Join our team of professional house cleaners. Flexible scheduling available to fit your lifestyle.",
      requirements: ["Reliable transportation", "Attention to detail", "Physical stamina"],
      postedDate: "2024-01-14",
      applicants: 15,
      urgent: true,
    },
    {
      id: 3,
      title: "Live-in Housemaid",
      company: "Private Family",
      location: "Queens, NY",
      salary: "$2,800 - $3,200/month",
      type: "Full-time",
      category: "Housemaid",
      description: "Seeking a dedicated live-in housemaid for a family of four. Room and board provided.",
      requirements: ["Previous housekeeping experience", "References required", "English speaking"],
      postedDate: "2024-01-13",
      applicants: 31,
      urgent: false,
    },
    {
      id: 4,
      title: "Night Security Guard",
      company: "SecureMax Inc",
      location: "Manhattan, NY",
      salary: "$20 - $25/hour",
      type: "Full-time",
      category: "Security",
      description:
        "We need a reliable night security guard for our commercial building. Must be available for overnight shifts.",
      requirements: ["Security license", "Clean background check", "Previous security experience"],
      postedDate: "2024-01-12",
      applicants: 8,
      urgent: true,
    },
    {
      id: 5,
      title: "Private Chef",
      company: "Elite Catering Co",
      location: "Manhattan, NY",
      salary: "$35 - $45/hour",
      type: "Contract",
      category: "Cook",
      description:
        "Looking for an experienced private chef to prepare meals for high-end clients. Must be creative and professional.",
      requirements: ["Culinary degree or equivalent", "5+ years experience", "Food safety certification"],
      postedDate: "2024-01-11",
      applicants: 12,
      urgent: false,
    },
    {
      id: 6,
      title: "Nanny for Toddler",
      company: "Johnson Family",
      location: "Brooklyn, NY",
      salary: "$16 - $20/hour",
      type: "Part-time",
      category: "Nanny",
      description: "Caring family seeks a nurturing nanny for our 2-year-old. Must be patient, energetic, and loving.",
      requirements: ["Childcare experience", "CPR certified", "Non-smoker"],
      postedDate: "2024-01-10",
      applicants: 27,
      urgent: false,
    },
  ]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || job.category === selectedCategory
    const matchesLocation = !selectedLocation || job.location === selectedLocation

    return matchesSearch && matchesCategory && matchesLocation
  })

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
  
      <div className="max-w-7xl mx-auto py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and preferences</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs or companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter Button */}
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{filteredJobs.length} Jobs Found</h2>
            <p className="text-gray-600">{searchQuery && `Results for "${searchQuery}"`}</p>
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="salary-high">Highest Salary</SelectItem>
              <SelectItem value="salary-low">Lowest Salary</SelectItem>
              <SelectItem value="relevance">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {job.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{job.company}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <Badge variant="secondary">{job.category}</Badge>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3 ml-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </Button>

                    <div className="flex flex-col space-y-2">
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" className="w-full">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all available positions.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                  setSelectedLocation("")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
