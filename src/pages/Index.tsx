import { GreetingSection } from "@/components/home/GreetingSection";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { AlertsSection } from "@/components/home/AlertsSection";
import { EngagementSection } from "@/components/home/EngagementSection";
import { KnowledgeSection } from "@/components/home/KnowledgeSection";
import { AISuggestionsSection } from "@/components/home/AIsuggestionsSection";
import { FieldIntelligenceMap } from "@/components/cards/FieldIntelligenceMap";
import { InteractiveMapNew } from "@/components/maps/InteractiveMapNew";
import { StatsOverlay } from "@/components/home/StatsOverlay";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/95 dark:to-accent/20">
      {/* Hero Section with Enhanced Greeting */}
      <div className="animate-fade-in">
        <GreetingSection />
      </div>

      {/* Quick Actions with Stagger Animation */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <QuickActionsGrid />
      </div>

      {/* Alerts Section */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <AlertsSection />
      </div>

      {/* Stats Overlay */}
      <div className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <StatsOverlay />
      </div>

      {/* Enhanced Interactive Map Section */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-2">
                🗺️ Field Intelligence Map
              </h2>
              <p className="text-muted-foreground">
                Explore real-time agricultural data and insights in your area
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-border/50">
              <InteractiveMapNew />
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions with Enhanced Styling */}
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <AISuggestionsSection />
      </div>

      {/* Engagement Features */}
      <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <EngagementSection />
      </div>

      {/* Knowledge Section */}
      <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <KnowledgeSection />
      </div>
    </div>
  );
};

export default Index;