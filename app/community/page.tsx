"use client"

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search, MapPin, Calendar, User, Filter, Eye,
  TrendingUp, AlertTriangle, CheckCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcshueykyqdkbrlydymr.supabase.co'
const categories = ['All Categories', 'Potholes', 'Garbage Dumps', 'Stray Animals', 'Broken Street Lights', 'Open Manholes', 'Damaged Infrastructure']
const statuses = ['All Status', 'pending', 'verified', 'resolved']
const priorities = ['All Priority', 'low', 'medium', 'high']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500'
    case 'verified': return 'bg-blue-500'
    case 'resolved': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return Clock
    case 'verified': return Eye
    case 'resolved': return CheckCircle
    default: return AlertTriangle
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950'
    case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
    case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950'
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
  }
}

export default function CommunityPage() {
  const [communityReports, setCommunityReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const [searchCity, setSearchCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedPriority, setSelectedPriority] = useState('All Priority')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching community reports:', error)
        setCommunityReports([])
      } else {
        // Format reports with proper image URLs
        const formattedReports = (data || []).map(report => {
          let imageUrl = null;
          if (report.image_path) {
            if (report.image_path.startsWith('http')) {
              imageUrl = report.image_path;
            } else {
              const supabaseStorageUrl = `${supabaseUrl}/storage/v1/object/public/`;
              imageUrl = `${supabaseStorageUrl}${report.image_path}`;
            }
          }
          return {
            ...report,
            image: imageUrl,
            date: new Date(report.created_at).toISOString().split('T')[0],
          };
        });
        setCommunityReports(formattedReports)
      }
      setLoading(false)
    }
    fetchReports()
  }, [])

  // Get unique cities for suggestions
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(communityReports.map(report => report.city))).sort()
  }, [communityReports])

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = communityReports.filter(report => {
      // FIXED: Correct boolean check for city filter!
      const cityMatch = searchCity === '' || report.city?.toLowerCase().includes(searchCity.toLowerCase())
      const categoryMatch = selectedCategory === 'All Categories' || report.category === selectedCategory
      const statusMatch = selectedStatus === 'All Status' || report.status === selectedStatus
      const priorityMatch = selectedPriority === 'All Priority' || report.priority === selectedPriority
      return cityMatch && categoryMatch && statusMatch && priorityMatch
    })

    // Sort reports
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'votes':
          return b.votes - a.votes
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
        default:
          return 0
      }
    })

    return filtered
  }, [searchCity, selectedCategory, selectedStatus, selectedPriority, sortBy, communityReports])

  // Get statistics
  const stats = useMemo(() => {
    const total = filteredReports.length
    const pending = filteredReports.filter(r => r.status === 'pending').length
    const verified = filteredReports.filter(r => r.status === 'verified').length
    const resolved = filteredReports.filter(r => r.status === 'resolved').length
    const totalVotes = filteredReports.reduce((sum, r) => sum + r.votes, 0)

    return { total, pending, verified, resolved, totalVotes }
  }, [filteredReports])

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Community Reports
          </h1>
          <p className="text-muted-foreground">
            Explore and discover urban issues reported by citizens across different cities
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filter Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                {/* City Search */}
                <div className="xl:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by city name..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {searchCity && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Available cities: {uniqueCities.join(', ')}
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'All Status' ? status : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority === 'All Priority' ? priority : priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="votes">Most Voted</SelectItem>
                    <SelectItem value="priority">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-government-yellow">{stats.totalVotes}</div>
              <div className="text-xs text-muted-foreground">Total Votes</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => {
              const StatusIcon = getStatusIcon(report.status)
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <img
                        src={report.image || 'https://images.pexels.com/photos/1108305/pexels-photo-1108305.jpeg'}
                        alt={report.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1108305/pexels-photo-1108305.jpeg';
                        }}
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                        <div className="flex items-center space-x-1 bg-white/90 dark:bg-black/90 px-2 py-1 rounded-full">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></span>
                          <StatusIcon className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                          {report.title}
                        </h3>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {report.description}
                      </p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="font-medium text-primary">{report.city}</span>
                          <span className="mx-1">•</span>
                          <span>{report.location}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="w-3 h-3 mr-1" />
                          <span>by {report.reporter}</span>
                          <span className="mx-1">•</span>
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{report.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {report.category}
                        </span>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{report.votes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{report.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-full text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more reports.
              </p>
              <Button
                onClick={() => {
                  setSearchCity('')
                  setSelectedCategory('All Categories')
                  setSelectedStatus('All Status')
                  setSelectedPriority('All Priority')
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>

        {/* Load More Button (for future pagination) */}
        {filteredReports.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button variant="outline" size="lg">
              Load More Reports
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
