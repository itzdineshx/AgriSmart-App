import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Award,
  Activity,
  Target
} from 'lucide-react';

export function StatsOverlay() {
  const stats = [
    {
      label: "Active Farmers",
      value: "12.5K+",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%"
    },
    {
      label: "Crop Diagnostics",
      value: "45.2K",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+24%"
    },
    {
      label: "Market Insights",
      value: "98%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+8%"
    },
    {
      label: "Success Rate",
      value: "94.7%",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5%"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            📊 Platform Impact
          </h2>
          <p className="text-muted-foreground">
            Real-time statistics showing our community's growth and success
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-3`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      {stat.change} this month
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Live Activity Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-accent/20 rounded-full border border-border/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-medium">
              Live updates • Last updated 2 min ago
            </span>
            <Zap className="h-3 w-3 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}