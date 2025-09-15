import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Brain, Lightbulb, ChevronRight, RefreshCw } from "lucide-react";
import { generateAISuggestions } from "@/services/geminiService";
import { mockData } from "@/data/mockData";
import { useWeather } from "@/hooks/useWeather";
import type { GeminiSuggestion } from "@/services/geminiService";

export function AISuggestionsSection() {
  const [suggestions, setSuggestions] = useState<GeminiSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { weatherData } = useWeather();

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const aiSuggestions = await generateAISuggestions(
        mockData.farmer,
        weatherData,
        mockData.cropHealth,
        mockData.marketPrices
      );
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [weatherData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather':
        return '🌤️';
      case 'pest':
        return '🐛';
      case 'market':
        return '💰';
      case 'irrigation':
        return '💧';
      case 'fertilizer':
        return '🌿';
      default:
        return '💡';
    }
  };

  return (
    <div className="px-4 py-6">
      <Card className="shadow-sm border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Suggestions
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchSuggestions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2 text-muted-foreground">Generating personalized suggestions...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl">
                    {getCategoryIcon(suggestion.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-foreground text-sm leading-tight">
                        {suggestion.title}
                      </h3>
                      <Badge 
                        variant={getPriorityColor(suggestion.priority) as any}
                        className="text-xs"
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                      {suggestion.actionable && (
                        <Button size="sm" variant="ghost" className="text-xs h-8">
                          Take Action
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions available at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}