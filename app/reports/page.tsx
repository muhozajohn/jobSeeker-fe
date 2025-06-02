"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Download, FileText, CalendarIcon, Filter, BarChart3, PieChart, TrendingUp, Users, Briefcase, DollarSign, Clock, Eye, Mail, Printer } from 'lucide-react'
import Link from "next/link"
import { format } from "date-fns"

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    {
      id: "recruitment-summary",
      name: "Recruitment Summary",
      description: "Overview of all recruitment activities",
      icon: <Users className="h-5 w-5" />,
      category: "overview",
    },
    {
      id: "job-performance",
      name: "Job Performance Report",
      description: "Detailed analysis of job posting performance",
      icon: <Briefcase className="h-5 w-5" />,
      category: "jobs",
    },
    {
      id: "financial-report",
      name: "Financial Report",
      description: "Spending analysis and cost per hire metrics",
      icon: <DollarSign className="h-5 w-5" />,
      category: "financial",
    },
    {
      id: "worker-analytics",
      name: "Worker Analytics",
      description: "Performance and satisfaction metrics for hired workers",
      icon: <TrendingUp className="h-5 w-5" />,
      category: "workers",
    },
    {
      id: "time-to-hire",
      name: "Time to Hire Report",
      description: "Analysis of hiring timelines and bottlenecks",
      icon: <Clock className="h-5 w-5" />,
      category: "efficiency",
    },
    {
      id: "category-breakdown",
      name: "Category Breakdown",
      description: "Performance comparison across job categories",
      icon: <PieChart className="h-5 w-5" />,
      category: "categories",
    },
  ]

  const jobCategories = ["Teacher", "Cleaner", "Housemaid", "Security", "Cook", "Nanny", "Driver", "Nurse"]

  const recentReports = [
    {
      id: 1,
      name: "Monthly Recruitment Summary - December 2023",
      type: "Recruitment Summary",
      generatedAt: "2024-01-01T10:00:00Z",
      format: "PDF",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "Q4 Financial Report",
      type: "Financial Report",
      generatedAt: "2023-12-31T15:30:00Z",
      format: "Excel",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Job Performance Analysis - November",
      type: "Job Performance Report",
      generatedAt: "2023-12-01T09:15:00Z",
      format: "PDF",
      size: "3.1 MB",
    },
  ]

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleGenerateReport = async () => {
    if (!selectedReport) return

    setIsGenerating(true)
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      // In a real app, you would call your API to generate the report
      console.log("Generating report:", {
        reportType: selectedReport,
        dateRange,
        categories: selectedCategories,
        format: reportFormat,
      })
      
      alert("Report generated successfully!")
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard/recruiter" className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <Link href="/" className="text-2xl font-bold text-blue-600">
                JobConnect
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate detailed reports and insights for your recruitment activities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Report Generation */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">Generate Report</TabsTrigger>
                <TabsTrigger value="recent">Recent Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate New Report</CardTitle>
                    <CardDescription>Create custom reports based on your recruitment data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Report Type Selection */}
                    <div className="space-y-3">
                      <Label>Select Report Type</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {reportTypes.map((report) => (
                          <div
                            key={report.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedReport === report.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedReport(report.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">{report.icon}</div>
                              <div>
                                <h3 className="font-medium text-gray-900">{report.name}</h3>
                                <p className="text-sm text-gray-600">{report.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date Range Selection */}
                    <div className="space-y-3">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? format(dateRange.from, "PPP") : "Start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-3">
                      <Label>Job Categories (Optional)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {jobCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryToggle(category)}
                            />
                            <Label htmlFor={category} className="text-sm">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCategories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Report Format */}
                    <div className="space-y-3">
                      <Label>Report Format</Label>
                      <Select value={reportFormat} onValueChange={setReportFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV File</SelectItem>
                          <SelectItem value="html">HTML Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={handleGenerateReport}
                      disabled={!selectedReport || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Previously generated reports and downloads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{report.name}</h3>
                              <p className="text-sm text-gray-600">{report.type}</p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                <span>Generated {new Date(report.generatedAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{report.format}</span>
                                <span>•</span>
                                <span>{report.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Quick Actions & Templates */}
          <div className="space-y-6">
            {/* Quick Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Templates</CardTitle>
                <CardDescription>Pre-configured report templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Monthly Summary
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <PieChart className="h-4 w-4 mr-2" />
                  Quarterly Review
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance Dashboard
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Cost Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Report Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Report Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Custom Filters
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </CardContent>
            </Card>

            {/* Report Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Reports Generated</span>
                  <span className="text-sm text-gray-600">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">This Month</span>
                  <span className="text-sm text-gray-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Most Popular</span>
                  <span className="text-sm text-gray-600">Recruitment Summary</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Generated</span>
                  <span className="text-sm text-gray-600">2 days ago</span>
                </div>
              </CardContent>
            </Card>

            {/* Help & Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips & Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">💡 <strong>Pro Tip:</strong> Use date ranges to compare performance across different periods.</p>
                  <p className="mb-2">📊 <strong>Best Practice:</strong> Generate monthly reports to track your recruitment trends.</p>
                  <p>🎯 <strong>Insight:</strong> Category breakdown reports help identify your most successful job types.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
