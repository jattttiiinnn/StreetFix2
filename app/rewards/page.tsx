"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Gift, ShoppingCart, Ticket, Coffee, Car, Home, Zap, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const rewardOptions = [
  {
    id: 1,
    title: 'Coffee Shop Voucher',
    description: '50% off at participating cafes',
    cost: 100,
    icon: Coffee,
    category: 'Food & Drink',
    available: 45,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 2,
    title: 'Public Transport Pass',
    description: 'Free weekly bus/metro pass',
    cost: 250,
    icon: Car,
    category: 'Transportation',
    available: 20,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    title: 'Municipal Services Discount',
    description: '25% off utility bills',
    cost: 500,
    icon: Home,
    category: 'Utilities',
    available: 10,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    title: 'Event Tickets',
    description: 'Free tickets to city events',
    cost: 150,
    icon: Ticket,
    category: 'Entertainment',
    available: 30,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 5,
    title: 'Shopping Voucher',
    description: '$25 gift card for local stores',
    cost: 300,
    icon: ShoppingCart,
    category: 'Shopping',
    available: 25,
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 6,
    title: 'Premium Features',
    description: 'Unlock advanced app features',
    cost: 200,
    icon: Zap,
    category: 'Digital',
    available: 100,
    color: 'from-indigo-500 to-purple-500'
  }
]

const recentRedemptions = [
  { item: 'Coffee Shop Voucher', date: '2024-01-20', tokens: 100 },
  { item: 'Event Tickets', date: '2024-01-18', tokens: 150 },
  { item: 'Premium Features', date: '2024-01-15', tokens: 200 }
]

export default function RewardsPage() {
  const [userTokens] = useState(425)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<typeof rewardOptions[0] | null>(null)

  const categories = ['all', 'Food & Drink', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Digital']

  const filteredRewards = selectedCategory === 'all' 
    ? rewardOptions 
    : rewardOptions.filter(reward => reward.category === selectedCategory)

  const handleRedeem = (reward: typeof rewardOptions[0]) => {
    setSelectedReward(reward)
    setShowRedeemModal(true)
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
            Rewards Center
          </h1>
          <p className="text-muted-foreground">
            Redeem your Urban Tokens for exclusive benefits and discounts
          </p>
        </motion.div>

        {/* Token Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-government-yellow/10 to-orange-500/10 border-government-yellow/20">
            <CardContent className="p-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-government-yellow to-orange-500 rounded-full mb-4"
                >
                  <Award className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-4xl font-bold text-government-yellow mb-2">
                    {userTokens}
                  </h2>
                  <p className="text-muted-foreground">Urban Tokens Available</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rewards Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${reward.color} rounded-lg flex items-center justify-center`}>
                          <reward.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {reward.available} left
                        </span>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4 text-government-yellow" />
                          <span className="font-bold text-government-yellow">{reward.cost} UT</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{reward.category}</span>
                      </div>

                      <Button
                        className="w-full"
                        disabled={userTokens < reward.cost}
                        onClick={() => handleRedeem(reward)}
                      >
                        {userTokens >= reward.cost ? 'Redeem Now' : 'Insufficient Tokens'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress to Next Tier */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-government-yellow" />
                    Citizen Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">Bronze Citizen</div>
                      <p className="text-sm text-muted-foreground">Level 2</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Silver</span>
                        <span>425/750 tokens</span>
                      </div>
                      <Progress value={(425/750) * 100} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      325 more tokens to unlock Silver tier benefits
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Redemptions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Redemptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentRedemptions.map((redemption, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-sm">{redemption.item}</p>
                        <p className="text-xs text-muted-foreground">{redemption.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-500">-{redemption.tokens} UT</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Earning Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">
                    Earning Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    • Report verified issues: +50 UT
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    • High-priority reports: +25 bonus UT
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    • Weekly streak bonus: +100 UT
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    • Community voting: +10 UT per vote
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRedeemModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${selectedReward.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <selectedReward.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{selectedReward.title}</h3>
                <p className="text-muted-foreground mb-6">{selectedReward.description}</p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span>Cost:</span>
                    <span className="font-bold text-government-yellow">{selectedReward.cost} UT</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Your Balance:</span>
                    <span className="font-bold">{userTokens} UT</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <span>After Redemption:</span>
                    <span className="font-bold">{userTokens - selectedReward.cost} UT</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRedeemModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-government-yellow hover:bg-government-yellow/90"
                    onClick={() => {
                      // Simulate redemption
                      setTimeout(() => {
                        setShowRedeemModal(false)
                        // Show success state
                      }, 1000)
                    }}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Redeem
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}