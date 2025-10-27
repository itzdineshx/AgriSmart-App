import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, MapPin, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MARKET_DATA = [
  {
    commodity: "Tomato",
    price: "₹45/kg",
    change: "+₹5",
    changePercent: "+12.5%",
    trend: "up",
    location: "Koyambedu"
  },
  {
    commodity: "Potato",
    price: "₹25/kg",
    change: "-₹2",
    changePercent: "-7.4%",
    trend: "down",
    location: "Poonamallee"
  },
  {
    commodity: "Onion",
    price: "₹35/kg",
    change: "+₹3",
    changePercent: "+9.4%",
    trend: "up",
    location: "Anna Nagar"
  },
];

export function MarketAnalysisPreview() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground dark:text-foreground">📊 Market Analysis</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/market-analysis')}
          className="text-primary hover:text-primary/80"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Commodities</p>
                <p className="text-2xl font-bold text-green-600">150+</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Markets</p>
                <p className="text-2xl font-bold text-blue-600">25</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/20 dark:to-slate-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Real-time Updates</p>
                <p className="text-2xl font-bold text-slate-700">24/7</p>
              </div>
              <RefreshCw className="h-8 w-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {MARKET_DATA.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/market-analysis')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{item.commodity}</h3>
                    <Badge variant="outline" className="text-xs">{item.location}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.price}</span>
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      item.trend === 'up'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{item.change} ({item.changePercent})</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}