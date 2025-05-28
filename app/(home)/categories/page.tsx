import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const Categories = () => {
      const jobCategories = [
    { name: "Teachers", count: 245, icon: "👨‍🏫" },
    { name: "Cleaners", count: 189, icon: "🧹" },
    { name: "Housemaids", count: 156, icon: "🏠" },
    { name: "Security Guards", count: 98, icon: "🛡️" },
    { name: "Cooks", count: 134, icon: "👨‍🍳" },
    { name: "Drivers", count: 112, icon: "🚗" },
    { name: "Nurses", count: 87, icon: "🩺" },
    { name: "Technicians", count: 76, icon: "🛠️" },
    { name: "Accountants", count: 65, icon: "📊" },
    { name: "Sales Representatives", count: 54, icon: "📞" },
    { name: "Customer Service", count: 43, icon: "💬" },
    { name: "IT Specialists", count: 32, icon: "💻" },
    { name: "Others", count: 67, icon: "💼" },
  ]
  return (
    <div>
        {/* Job Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Job Categories</h2>
            <p className="text-lg text-gray-600">Find opportunities across various industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {jobCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <Badge variant="secondary">{category.count} jobs</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Categories
