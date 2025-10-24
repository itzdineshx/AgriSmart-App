import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Droplets, Sprout, Thermometer, TrendingUp } from "lucide-react";

export function AISuggestionsSection() {
  const aiSuggestions = [
    {
      id: 1,
      type: "irrigation",
      title: "Optimal Irrigation Schedule",
      description: "Based on current weather patterns and soil moisture levels, irrigate your wheat field tomorrow morning between 6-8 AM.",
      confidence: 92,
      icon: Droplets,
      color: "text-blue-600",
      action: "Schedule Irrigation"
    },
    {
      id: 2,
      type: "pest",
      title: "Preventive Pest Control",
      description: "High humidity levels detected. Apply neem oil spray to prevent fungal diseases in tomato plants.",
      confidence: 87,
      icon: Sprout,
      color: "text-green-600",
      action: "View Treatment Guide"
    },
    {
      id: 3,
      type: "market",
      title: "Optimal Selling Time",
      description: "Market analysis suggests selling your potato harvest this Friday when prices are expected to peak at ₹1,200/quintal.",
      confidence: 78,
      icon: TrendingUp,
      color: "text-orange-600",
      action: "Check Market Prices"
    }
  ];

  return (
    <div className="px-4 py-6">
      <Card className="shadow-elegant bg-gradient-to-br from-primary/5 via-card to-accent/5 border-primary/20 animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Suggestions
                </span>
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  Personalized farming recommendations powered by Gemini AI
                </p>
              </div>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-gray-100 ${suggestion.color}`}>
                  <suggestion.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-foreground">{suggestion.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    {suggestion.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}