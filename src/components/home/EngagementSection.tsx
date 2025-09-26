import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, ChevronRight } from "lucide-react";
import { mockData } from "@/data/mockData";

export function EngagementSection() {
  const { leaderboard, achievements, progress } = mockData;

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
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3">
              <div className="text-lg font-bold text-foreground">{progress.cropsMonitored}</div>
              <div className="text-xs text-muted-foreground">Crops Monitored</div>
            </div>
            <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3">
              <div className="text-lg font-bold text-foreground">{progress.diagnosesCompleted}</div>
              <div className="text-xs text-muted-foreground">Diagnoses</div>
            </div>
            <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-3">
              <div className="text-lg font-bold text-foreground">{progress.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Community Activity</span>
              <span className="font-medium text-foreground">{progress.communityPosts} posts</span>
            </div>
            <Progress value={(progress.communityPosts / 50) * 100} className="h-2" />
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
          {achievements.slice(0, 2).map((achievement, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
              <div className="text-2xl">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-foreground">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full">
            View All Achievements
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Top Farmers Leaderboard */}
      <Card className="shadow-sm border border-border bg-card dark:bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
            <Trophy className="h-5 w-5 text-primary" />
            Top Farmers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboard.slice(0, 3).map((farmer, index) => (
            <div key={farmer.rank} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-foreground">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {farmer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{farmer.name}</p>
                <p className="text-xs text-muted-foreground">{farmer.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{farmer.points}</p>
                <div className="flex gap-1 items-center">
                  <span className="text-xs">{farmer.badges.join(' ')}</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full">
            View Full Leaderboard
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}