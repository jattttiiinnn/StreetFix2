"use client"

import { useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';  
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, AlertCircle, Clock, CheckCircle, AlertTriangle, User, BarChart2, MoreHorizontal, RefreshCw, FileText, MapPin } from 'lucide-react';

type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  category: string;
  reporter_id: string;
  created_at: string;
  updated_at: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  address: string;
  images?: string[];
}

interface Reporter {
  id: string;
  email: string;
  count: number;
}

interface DashboardData {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  inProgressIssues: number;
  categories: { name: string; count: number; color: string }[];
  weeklyTrend: { name: string; reports: number; resolved: number }[];
  recentIssues: Report[];
  topReporters: Reporter[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const getStatusBadgeVariant = (status: ReportStatus) => {
  switch (status) {
    case 'resolved': return 'default';
    case 'in_progress': return 'secondary';
    case 'pending': return 'outline';
    case 'rejected': return 'destructive';
    default: return 'outline';
  }
};

const getPriorityBadgeVariant = (priority: ReportPriority) => {
  switch (priority) {
    case 'critical': return 'destructive';
    case 'high': return 'default';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
};

const getStatusIcon = (status: ReportStatus) => {
  switch (status) {
    case 'resolved': return <CheckCircle className="h-4 w-4 mr-1" />;
    case 'in_progress': return <Clock className="h-4 w-4 mr-1" />;
    case 'pending': return <AlertCircle className="h-4 w-4 mr-1" />;
    case 'rejected': return <AlertTriangle className="h-4 w-4 mr-1" />;
    default: return null;
  }
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  // Debug: Log component mount and state changes
  useEffect(() => {
    console.log('AdminPage mounted');
    return () => console.log('AdminPage unmounted');
  }, []);
  
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);
  
  useEffect(() => {
    console.log('Data state changed:', data);
  }, [data]);
  
  useEffect(() => {
    console.log('Error state changed:', error);
  }, [error]);

  const filteredReports = useMemo(() => {
    if (!data) return [];
    
    return data.recentIssues.filter(report => {
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
      const matchesSearch = searchQuery === '' || 
        (report.title + ' ' + report.description + ' ' + report.category)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [data, statusFilter, priorityFilter, searchQuery]);

  const stats = useMemo(() => {
    if (!data) return [];
    
    return [
      { 
        title: 'Total Reports', 
        value: data.totalIssues, 
        icon: <BarChart2 className="h-5 w-5" />,
        description: 'Total reports received',
        trend: '+12% from last month'
      },
      { 
        title: 'Resolved', 
        value: data.resolvedIssues, 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        description: 'Issues resolved',
        trend: `+${Math.round((data.resolvedIssues / data.totalIssues) * 100)}% of total`
      },
      { 
        title: 'In Progress', 
        value: data.inProgressIssues, 
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        description: 'Currently being addressed',
        trend: `${data.topReporters.length} active reporters`
      },
      { 
        title: 'Pending', 
        value: data.pendingIssues, 
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        description: 'Awaiting action',
        trend: data.pendingIssues > 0 ? 'Needs attention' : 'All clear'
      }
    ];
  }, [data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');

      // 1. Check user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        console.log('No active session, redirecting to signin');
        router.push('/signin');
        return;
      }
      setUser(session.user);

      // 2. Fetch reports
      console.log('Fetching reports...');
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
        throw reportsError;
      }

      console.log(`Fetched ${reportsData?.length || 0} reports`);
      
      if (!reportsData || reportsData.length === 0) {
        console.log('No reports found, initializing with empty data');
        setData({
          totalIssues: 0,
          resolvedIssues: 0,
          pendingIssues: 0,
          inProgressIssues: 0,
          categories: [],
          weeklyTrend: [],
          recentIssues: [],
          topReporters: []
        });
        return;
      }

      // 3. Fetch user data for reporters
      const reporterIds = Array.from(new Set(reportsData.map(report => report.reporter_id)));
      console.log('Fetching user data for reporters:', reporterIds);
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', reporterIds);
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        // Continue with empty users data
      }

      // 4. Process data
      const statusCounts = reportsData.reduce((acc: Record<string, number>, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});

      const categoryCounts = reportsData.reduce((acc: Record<string, number>, report) => {
        if (report.category) {
          acc[report.category] = (acc[report.category] || 0) + 1;
        }
        return acc;
      }, {});

      const reporterCounts = reportsData.reduce((acc: Record<string, number>, report) => {
        acc[report.reporter_id] = (acc[report.reporter_id] || 0) + 1;
        return acc;
      }, {});

      const topReporters = Object.entries(reporterCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({
          id,
          email: usersData?.find(u => u.id === id)?.email || 'Anonymous',
          count
        }));

      // Generate weekly trend data (last 7 days)
      const now = new Date();
      const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        // For demo purposes - in a real app, you'd query the actual data
        const reports = Math.floor(Math.random() * 20) + 5;
        const resolved = Math.floor(reports * (0.6 + Math.random() * 0.3));
        return { name: dayName, reports, resolved };
      });

      const categories = Object.entries(categoryCounts).map(([name, count], index) => ({
        name,
        count,
        color: COLORS[index % COLORS.length]
      }));

      // 5. Update state with processed data
      const dashboardData = {
        totalIssues: reportsData.length,
        resolvedIssues: statusCounts['resolved'] || 0,
        pendingIssues: statusCounts['pending'] || 0,
        inProgressIssues: (statusCounts['assigned'] || 0) + (statusCounts['in_progress'] || 0),
        categories,
        weeklyTrend,
        recentIssues: reportsData.slice(0, 5),
        topReporters
      };

      console.log('Dashboard data:', dashboardData);
      setData(dashboardData);

    } catch (error) {
      console.error('Error in fetchData:', error);
      // Set an error state that will be shown to the user
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Setting up realtime subscription');
    
    // Initial data fetch
    fetchData().catch(err => {
      console.error('Initial data fetch failed:', err);
      setError('Failed to load dashboard data. ' + (err.message || 'Please try again.'));
    });

    // Set up realtime subscription
    const channel = supabase
      .channel('realtime reports')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('Realtime update received:', payload);
        fetchData().catch(err => {
          console.error('Realtime update failed:', err);
          setError('Failed to refresh data. ' + (err.message || 'Please refresh the page.'));
        });
      })
      .subscribe((status, err) => {
        if (err) {
          console.error('Realtime subscription error:', err);
          setError('Realtime updates unavailable. Data may be outdated.');
        } else {
          console.log('Realtime subscription status:', status);
        }
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel).catch(err => {
        console.error('Error removing channel:', err);
      });
    };
  }, [supabase, router]);

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md p-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">
            {loading ? 'Loading Dashboard...' : 'Unable to load dashboard data'}
          </h2>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm text-left">
              <p className="font-medium">Error details:</p>
              <p className="mt-1">{error}</p>
            </div>
          )}
          
          <p className="text-muted-foreground">
            {loading 
              ? 'Please wait while we load your dashboard...'
              : 'There was an error loading the dashboard data. This could be due to network issues or insufficient permissions.'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Button 
              onClick={() => {
                setError(null);
                fetchData();
              }} 
              className="w-full sm:w-auto"
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Try Again'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Go to Home
            </Button>
          </div>
          
          {!loading && (
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">If the problem persists, please:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Check your internet connection</li>
                <li>Verify you have the correct permissions</li>
                <li>Check the browser console for detailed error messages (Press F12)</li>
                <li>Contact support if the issue continues</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back, {user?.email?.split('@')[0] || 'Admin'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline">
              <span>Export Reports</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="h-5 w-5 text-muted-foreground">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports by title, description, or category..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={priorityFilter} 
                onValueChange={setPriorityFilter}
                disabled={loading}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setSearchQuery('');
                  }}
                  disabled={loading}
                >
                  <span>Clear filters</span>
                </Button>
              )}
            </div>
          </div>
          
          {loading && (
            <div className="text-sm text-muted-foreground flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading reports...
            </div>
          )}
          
          {!loading && (statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredReports.length} {filteredReports.length === 1 ? 'result' : 'results'} 
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              {priorityFilter !== 'all' && ` with priority "${priorityFilter}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                {loading ? 'Loading...' : `${filteredReports.length} ${filteredReports.length === 1 ? 'report' : 'reports'} found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  ))
                ) : filteredReports.length > 0 ? (
                  // Reports list
                  filteredReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => {
                        // TODO: Navigate to report details
                        console.log('View report:', report.id);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-base">
                            {report.title || 'Untitled Report'}
                          </h3>
                          {report.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {report.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Badge 
                              variant={getStatusBadgeVariant(report.status)}
                              className="flex items-center gap-1"
                            >
                              {getStatusIcon(report.status)}
                              {report.status.replace('_', ' ')}
                            </Badge>
                            <Badge 
                              variant={getPriorityBadgeVariant(report.priority)}
                              className="capitalize"
                            >
                              {report.priority}
                            </Badge>
                            {report.category && (
                              <Badge variant="outline" className="text-xs">
                                {report.category}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(report.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          {report.address && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{report.address}</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Show report actions menu
                            console.log('Show actions for report:', report.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // No reports found
                  <div className="text-center py-12 space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">No reports found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'No reports have been submitted yet'}
                      </p>
                    </div>
                    {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => {
                          setStatusFilter('all');
                          setPriorityFilter('all');
                          setSearchQuery('');
                        }}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Reporters */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Reporters</CardTitle>
                <CardDescription>Most active community members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topReporters.map((reporter, index) => (
                    <div key={reporter.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {reporter.email || 'Anonymous'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reporter.count} {reporter.count === 1 ? 'report' : 'reports'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.categories.map((category, index) => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.count}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{
                            width: `${(category.count / data.totalIssues) * 100}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
