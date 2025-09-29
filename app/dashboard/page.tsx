"use client"

import { motion } from 'framer-motion'
import { Award, Bell, Calendar, CheckCircle, Clock, MapPin, Star, TrendingUp, Upload, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Get the Supabase URL from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcshueykyqdkbrlydymr.supabase.co'


interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'verified' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  image_path: string | null;
  location: string;
  address: string;
  reporter_id: string;
  confidence: number;
  created_at: string;
  updated_at: string;
  image?: string | null;
  date?: string;
  tokens?: number;
}

interface Badge {
  name: string;
  icon: any;
  earned: boolean;
  description: string;
}

export default function DashboardPage() {
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userTokens, setUserTokens] = useState(0);
  const supabase = createClientComponentClient();
  const [badges, setBadges] = useState<Badge[]>([
    { name: 'First Reporter', icon: Star, earned: false, description: 'Submitted your first report' },
    { name: 'Community Hero', icon: Users, earned: false, description: 'Helped resolve 10+ issues' },
    { name: 'Eagle Eye', icon: Zap, earned: false, description: 'Report 50+ verified issues' },
    { name: 'City Guardian', icon: Award, earned: false, description: 'Top 10 reporter this month' }
  ]);

  // Update badges based on user reports
  useEffect(() => {
    if (userReports.length > 0) {
      const resolvedCount = userReports.filter(r => r.status === 'resolved').length;
      
      setBadges(prev => prev.map(badge => {
        if (badge.name === 'First Reporter' && userReports.length > 0) {
          return { ...badge, earned: true };
        }
        if (badge.name === 'Community Hero' && resolvedCount >= 10) {
          return { ...badge, earned: true };
        }
        return badge;
      }));
    }
  }, [userReports]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUserReports([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch user's token count from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profile) {
          setUserTokens(profile.points || 0);
        }
        
        // Fetch only reports submitted by the current user
        const { data: reports, error } = await supabase
          .from('reports')
          .select('*')
          .eq('reporter_id', user.id)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        // Format reports with image paths and dates
        const formattedReports = (reports || []).map(report => {
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
            tokens: 50 // All submitted reports now earn 50 tokens immediately
          };
        });
        // If the user has no reports, add one example report to showcase the UI
        let finalReports = formattedReports;
        if (finalReports.length === 0) {
          const demoReport: Report = {
            id: 'demo-1',
            title: 'Pothole on Main Street',
            description: 'Large pothole causing traffic slowdowns near the intersection. Needs urgent attention.',
            category: 'Potholes',
            status: 'verified',
            priority: 'medium',
            image_path: 'https://images.pexels.com/photos/1108305/pexels-photo-1108305.jpeg',
            location: 'Main St, Downtown District',
            address: '123 Main St, Downtown District',
            reporter_id: 'demo-user',
            confidence: 0.9,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          finalReports = [
            {
              ...demoReport,
              image: demoReport.image_path,
              date: new Date(demoReport.created_at).toISOString().split('T')[0],
              tokens: 50,
            } as Report & { image?: string | null; date?: string; tokens?: number },
          ];
        }
        setUserReports(finalReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
    
    // Set up a subscription to listen for changes to the reports table
    const channel = supabase
      .channel('reports_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reports' }, 
        (payload) => {
          console.log('Reports table changed:', payload);
          // Refresh the reports when changes occur
          fetchReports();
        }
      ) 
      .subscribe();
      
    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'verified': return 'bg-blue-500';
    case 'resolved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Under Review';
    case 'verified': return 'Verified';
    case 'resolved': return 'Resolved';
    case 'rejected': return 'Rejected';
    default: return 'Unknown';
  }
};

  const totalTokens = userTokens // Use actual tokens from database
  const resolvedReports = userReports.filter(report => report.status === 'resolved').length
  const pendingReports = userReports.filter(report => report.status === 'pending').length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            My Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your reports, rewards, and community impact
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold">{userReports.length}</p>
                  </div>
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{resolvedReports}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingReports}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tokens Earned</p>
                    <p className="text-2xl font-bold text-government-yellow">{totalTokens}</p>
                  </div>
                  <Award className="w-8 h-8 text-government-yellow" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Reports */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>My Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {report.image && (
                        <img
                          src={report.image}
                          alt={report.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(report.status)} ${report.status === 'pending' ? 'animate-pulse' : ''}`}></span>
                          <span className="text-xs text-muted-foreground">{getStatusText(report.status)}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{report.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-government-yellow">
                          +{report.tokens} UT
                        </p>
                        <p className="text-xs text-muted-foreground">{report.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rewards Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-government-yellow/10 to-orange-500/10 border-government-yellow/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-government-yellow" />
                    Reward Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                      className="text-4xl font-bold text-government-yellow mb-2"
                    >
                      {totalTokens}
                    </motion.div>
                    <p className="text-sm text-muted-foreground mb-4">Urban Tokens (UT)</p>
                    <Button className="w-full bg-government-yellow hover:bg-government-yellow/90 text-white">
                      Redeem Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        badge.earned 
                          ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' 
                          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-60'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        badge.earned ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        <badge.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Report New Issue
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Issue Map
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}