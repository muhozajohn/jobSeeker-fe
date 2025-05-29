"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { 
  GraduationCap, 
  Brush, 
  Home, 
  Shield, 
  ChefHat, 
  Car, 
  Stethoscope, 
  Wrench, 
  Calculator, 
  Phone, 
  MessageCircle, 
  Laptop, 
  Briefcase,
  Users,
  Hammer,
  Paintbrush,
  Camera,
  Music,
  TrendingUp,
  Globe
} from 'lucide-react'

import { 
  selectJobCategories, 
  getJobCategories, 
  selectJobCategoriesLoading 
} from '@/lib/redux/slices/JobCategories/JobCategoriesSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hooks'

const Categories = () => {
  const dispatch = useAppDispatch();
  const jobCategories = useAppSelector(selectJobCategories);
  const loading = useAppSelector(selectJobCategoriesLoading);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(getJobCategories())
      } catch (error) {
        console.error('Failed to fetch job categories:', error)
      }
    }
    fetchCategories()
  }, [dispatch])

  // Icon mapping function based on category name
  const getIconForCategory = (categoryName : string) => {
    const name = categoryName.toLowerCase();
    
    if (name.includes('teacher') || name.includes('education') || name.includes('tutor')) {
      return <GraduationCap className="w-8 h-8" />
    }
    if (name.includes('clean') || name.includes('janitor')) {
      return <Brush className="w-8 h-8" />
    }
    if (name.includes('housemaid') || name.includes('domestic') || name.includes('housekeeper')) {
      return <Home className="w-8 h-8" />
    }
    if (name.includes('security') || name.includes('guard')) {
      return <Shield className="w-8 h-8" />
    }
    if (name.includes('cook') || name.includes('chef') || name.includes('kitchen')) {
      return <ChefHat className="w-8 h-8" />
    }
    if (name.includes('driver') || name.includes('transport') || name.includes('delivery')) {
      return <Car className="w-8 h-8" />
    }
    if (name.includes('nurse') || name.includes('medical') || name.includes('healthcare')) {
      return <Stethoscope className="w-8 h-8" />
    }
    if (name.includes('technician') || name.includes('mechanic') || name.includes('repair')) {
      return <Wrench className="w-8 h-8" />
    }
    if (name.includes('accountant') || name.includes('finance') || name.includes('accounting')) {
      return <Calculator className="w-8 h-8" />
    }
    if (name.includes('sales') || name.includes('representative')) {
      return <Phone className="w-8 h-8" />
    }
    if (name.includes('customer') || name.includes('service') || name.includes('support')) {
      return <MessageCircle className="w-8 h-8" />
    }
    if (name.includes('it') || name.includes('computer') || name.includes('software') || name.includes('developer')) {
      return <Laptop className="w-8 h-8" />
    }
    if (name.includes('construction') || name.includes('builder') || name.includes('contractor')) {
      return <Hammer className="w-8 h-8" />
    }
    if (name.includes('design') || name.includes('graphic') || name.includes('creative')) {
      return <Paintbrush className="w-8 h-8" />
    }
    if (name.includes('photographer') || name.includes('photography')) {
      return <Camera className="w-8 h-8" />
    }
    if (name.includes('music') || name.includes('entertainment')) {
      return <Music className="w-8 h-8" />
    }
    if (name.includes('marketing') || name.includes('advertising')) {
      return <TrendingUp className="w-8 h-8" />
    }
    if (name.includes('management') || name.includes('manager')) {
      return <Users className="w-8 h-8" />
    }
    if (name.includes('international') || name.includes('translator')) {
      return <Globe className="w-8 h-8" />
    }
    
    // Default icon for unknown categories
    return <Briefcase className="w-8 h-8" />
  }

  // Calculate job count (you might need to fetch this from another API endpoint)
  const getJobCount = (categoryId:number) => {
    // This is a placeholder - you should replace this with actual job count logic
    // You might need to fetch job counts from your API or calculate them
    return Math.floor(Math.random() * 200) + 10; // Random number for demo
  }

  // Skeleton component for loading state
  const CategorySkeleton = () => (
    <Card className="text-center">
      <CardContent className="p-6">
        <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
      </CardContent>
    </Card>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Briefcase className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Available</h3>
      <p className="text-gray-600 mb-4">
        We're currently updating our job categories. Please check back later.
      </p>
      <button 
        onClick={() => dispatch(getJobCategories())}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
      >
        Refresh Categories
      </button>
    </div>
  )

  return (
    <div>
      {/* Job Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Job Categories</h2>
            <p className="text-lg text-gray-600">Find opportunities across various industries</p>
          </div>
          
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          ) : jobCategories && jobCategories.length > 0 ? (
            // Categories data
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {jobCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <CardContent className="p-6">
                    <div className="text-blue-600 mb-3 flex justify-center">
                      {getIconForCategory(category.name)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {getJobCount(category.id)} jobs
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Empty state
            <EmptyState />
          )}
        </div>
      </section>
    </div>
  )
}

export default Categories