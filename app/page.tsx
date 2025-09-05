"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Upload, Zap, Award, Camera, MapPin, Users, CheckCircle, ArrowRight, Eye, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Camera,
    title: 'Upload & Report',
    description: 'Take a photo of any urban issue and upload it instantly',
    color: 'text-blue-500'
  },
  {
    icon: Zap,
    title: 'AI Analysis',
    description: 'Our AI automatically categorizes and validates your report',
    color: 'text-purple-500'
  },
  {
    icon: Award,
    title: 'Earn Rewards',
    description: 'Get tokens for verified reports and redeem for benefits',
    color: 'text-green-500'
  }
]

const stats = [
  { number: '50K+', label: 'Issues Reported', icon: Upload },
  { number: '25K+', label: 'Active Citizens', icon: Users },
  { number: '95%', label: 'Resolution Rate', icon: CheckCircle },
  { number: '48hr', label: 'Avg Response Time', icon: TrendingUp }
]

const issueTypes = [
  { name: 'Potholes', count: '12,432', color: 'bg-red-500', progress: 75 },
  { name: 'Garbage Dumps', count: '8,921', color: 'bg-orange-500', progress: 60 },
  { name: 'Stray Animals', count: '5,678', color: 'bg-yellow-500', progress: 45 },
  { name: 'Damaged Infrastructure', count: '3,456', color: 'bg-blue-500', progress: 30 },
  { name: 'Open Manholes', count: '2,134', color: 'bg-purple-500', progress: 20 },
  { name: 'Other Issues', count: '4,321', color: 'bg-green-500', progress: 35 }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-government-blue via-blue-800 to-government-green">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Report, Reward,{' '}
                <span className="gradient-text">
                  Rebuild
                </span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-lg">
                Smarter Cities Start With You. Help build better communities through AI-powered 
                issue reporting and earn rewards for making a difference.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="xl"
                  className="group bg-gradient-to-r from-government-yellow to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/report">
                    <Upload className="w-5 h-5 mr-2" />
                    Report an Issue Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className=" bg-white dark:bg-black dark:text-white border-white/20 hover:bg-white/20"
                >
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass border-white/20 p-8">
                <CardContent className="space-y-4 p-0">
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white font-semibold">AI-Powered Analysis</p>
                      <p className="text-gray-500 dark:text-blue-100 text-sm">Instant issue verification</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white font-semibold">GPS Tracking</p>
                      <p className="text-gray-500 dark:text-blue-100 text-sm">Precise location mapping</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="w-12 h-12 bg-government-yellow rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white font-semibold">Reward System</p>
                      <p className="text-gray-500 dark:text-blue-100 text-sm">Earn tokens for reports</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-muted-foreground mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Three simple steps to make your city better
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="relative p-8 shadow-lg glow group cursor-pointer">
                  <CardContent className="text-center p-0">
                    <motion.div 
                      className="flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Issues We Track
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Comprehensive coverage of urban challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issueTypes.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${issue.color}`}></div>
                        <h3 className="font-semibold">
                          {issue.name}
                        </h3>
                      </div>
                      <span className="text-2xl font-bold text-muted-foreground">
                        {issue.count}
                      </span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${issue.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${issue.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-government-green">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens who are already helping build smarter, cleaner cities. 
              Start reporting today and earn rewards for your contributions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="group bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/report">
                  <Camera className="w-5 h-5 mr-2" />
                  Start Reporting
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="glass dark:text-white border-white/20 hover:bg-white/20"
              >
                <Link href="/dashboard">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}