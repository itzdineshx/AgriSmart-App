import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, ShoppingBag, Clock, TrendingUp, Trophy, Star, Target, Zap, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserProgress, useAchievements, useQuests } from "@/hooks/useGamification";
import { motion } from "framer-motion";

const NEARBY_MARKETS = [
  { name: 'Koyambedu Market', distance: '1.8 km', type: 'Wholesale Market', timing: '4:00 AM - 2:00 PM', rating: 4.7 },
  { name: 'Poonamallee Weekly Market', distance: '2.5 km', type: 'Farmers Market', timing: '6:00 AM - 12:00 PM', rating: 4.5 },
  { name: 'Anna Nagar Farmers Market', distance: '3.2 km', type: 'Fresh Produce', timing: '5:00 AM - 10:00 AM', rating: 4.4 },
  { name: 'Guindy Organic Market', distance: '4.1 km', type: 'Organic Market', timing: '7:00 AM - 7:00 PM', rating: 4.8 },
  { name: 'Chromepet Vegetable Market', distance: '5.3 km', type: 'Local Market', timing: '5:30 AM - 11:00 AM', rating: 4.3 },
  { name: 'Thiruvallur Grain Market', distance: '7.8 km', type: 'Grain Trading', timing: '6:00 AM - 6:00 PM', rating: 4.6 },
];

export default function Marketplace() {
  // Gamification hooks
  const { userLevel, userStats, levelProgress } = useUserProgress();
  const { achievements } = useAchievements();
  const { activeQuests } = useQuests();

  // Trading specific achievements
  const tradingAchievements = achievements.filter(a => 
    a.category === 'market' || a.category === 'farming'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Gamification */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🏪 Local Markets</h1>
              <p className="text-gray-600">Find the best agricultural markets and trading centers nearby</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Level {userLevel.currentLevel} Trader
              </Badge>
              <Badge className="bg-green-600 text-white">
                {userStats.marketDeals} Deals Made
              </Badge>
            </div>
          </div>
        </div>

        {/* Trading Progress Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-600" />
                Your Trading Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userLevel.currentLevel}</div>
                  <div className="text-sm text-gray-600">Trader Level</div>
                  <Progress value={levelProgress} className="mt-2 h-1" />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <ShoppingBag className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats.marketDeals}</div>
                  <div className="text-sm text-gray-600">Successful Deals</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats.totalPoints.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Trading Points</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{tradingAchievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-gray-600">Trading Badges</div>
                </motion.div>
              </div>
              
              {/* Active Trading Quests */}
              {activeQuests.filter(q => q.category === 'market').length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    Active Trading Quests
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeQuests.filter(q => q.category === 'market').slice(0, 2).map((quest) => (
                      <div key={quest.id} className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="font-medium text-sm">{quest.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{quest.description}</p>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{quest.progress}/{quest.maxProgress}</span>
                          </div>
                          <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-1" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">{quest.type}</Badge>
                          <div className="text-xs text-green-600">
                            +{quest.rewards.reduce((sum, r) => sum + (r.value || 0), 0)} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Markets</p>
                  <p className="text-3xl font-bold text-red-600">15</p>
                </div>
                <ShoppingBag className="h-12 w-12 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Now</p>
                  <p className="text-3xl font-bold text-green-600">8</p>
                </div>
                <Clock className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-yellow-600">4.5</p>
                </div>
                <TrendingUp className="h-12 w-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Markets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEARBY_MARKETS.map((market, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{market.name}</span>
                  <Badge variant="secondary">⭐ {market.rating}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{market.distance} away</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    <span className="text-sm">{market.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{market.timing}</span>
                  </div>
                  <div className="pt-3">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Visit Market
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}