import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, TrendingUp, Medal } from "lucide-react";

export function EngagementSection() {
  const userProgress = {
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    achievements: 8,
    streak: 15
  };

  const recentAchievements = [
    {
      id: 1,
      title: "First Harvest",
      description: "Completed your first successful harvest",
      icon: "🌾",
      date: "2024-01-15",
      rarity: "common"
    },
    {
      id: 2,
      title: "Weather Expert",
      description: "Accurately predicted weather for 7 days",
      icon: "🌤️",
      date: "2024-01-12",
      rarity: "rare"
    },
    {
      id: 3,
      title: "Community Helper",
      description: "Helped 5 fellow farmers with advice",
      icon: "🤝",
      date: "2024-01-10",
      rarity: "uncommon"
    }
  ];

  const topFarmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Punjab",
      score: 9850,
      badge: "🥇",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Haryana",
      score: 9420,
      badge: "🥈",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Amit Singh",
      location: "UP",
      score: 9180,
      badge: "🥉",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Progress Overview */}
      <Card className="shadow-sm border border-border bg-card dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
            <Trophy className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Level {userProgress.level}</p>
              <p className="text-xs text-muted-foreground">
                {userProgress.xp} / {userProgress.xpToNext} XP
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {userProgress.streak} day streak
            </Badge>
          </div>
          <Progress value={(userProgress.xp / userProgress.xpToNext) * 100} className="h-2" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{userProgress.achievements}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{userProgress.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="shadow-sm border border-border bg-card dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
            <Award className="h-5 w-5 text-primary" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </div>
              <Badge
                variant={achievement.rarity === 'rare' ? 'default' : achievement.rarity === 'uncommon' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {achievement.rarity}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Farmers Leaderboard */}
      <Card className="shadow-sm border border-border bg-card dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
            <Medal className="h-5 w-5 text-primary" />
            Top Farmers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topFarmers.map((farmer, index) => (
            <div key={farmer.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="text-lg font-bold text-muted-foreground w-6">{farmer.badge}</div>
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{farmer.name}</p>
                <p className="text-xs text-muted-foreground">{farmer.location}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{farmer.score.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}