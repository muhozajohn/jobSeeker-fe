import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Clock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import Categories from "./categories/page"

export default function HomePage() {


  const features = [
    {
      icon: <Users className="h-8 w-8 text-orange-400" />,
      title: "Multi-Role Platform",
      description: "Separate dashboards for admins, recruiters, and workers with tailored experiences",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-green-600" />,
      title: "Smart Job Matching",
      description: "Advanced matching algorithm connects the right workers with suitable job opportunities",
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "Work Assignment Management",
      description: "Schedule, track, and manage active work assignments with real-time updates",
    },
    {
      icon: <Star className="h-8 w-8 text-orange-400" />,
      title: "Rating & Reviews",
      description: "Build trust through transparent rating and review system for both parties",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-cyan-600" />,
      title: "Application Tracking",
      description:
        "Workers can track their job applications, and recruiters can manage incoming applications efficiently.",
    },
    {
      icon: <Clock className="h-8 w-8 text-lime-600" />,
      title: "Salary Type Options",
      description:
        "Support for hourly, daily, weekly, monthly, and yearly salary types, providing flexibility for both workers and recruiters.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Workers with
            <span className="text-orange-400"> Dream Jobs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CareBridge is the comprehensive recruitment platform that bridges the gap between skilled workers and
            recruiters across various industries including education, hospitality, security, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=worker">
              <Button size="lg" className="w-full sm:w-auto">
                Find Work <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register?role=recruiter">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Hire Workers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <Categories />

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CareBridge?</h2>
            <p className="text-lg text-gray-600">Powerful features designed for modern recruitment</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-400 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-orange-100">Active Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-orange-100">Recruiters</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-orange-100">Jobs Posted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-orange-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CareBridge Works</h2>
            <p className="text-lg text-gray-600">Simple steps to connect workers and recruiters</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and create your detailed profile with skills, experience, and preferences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Apply</h3>
              <p className="text-gray-600">
                Browse job listings or post job requirements and connect with suitable matches
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Working</h3>
              <p className="text-gray-600">Get hired and manage your work assignments through our platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of workers and recruiters who trust CareBridge for their employment needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=worker">
              <Button size="lg" className="w-full sm:w-auto">
                Join as Worker
              </Button>
            </Link>
            <Link href="/auth/register?role=recruiter">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Join as Recruiter
              </Button>
            </Link>
          </div>
        </div>
      </section>

   
    </div>
  )
}
