import { GreetingSection } from "@/components/home/GreetingSection";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { AlertsSection } from "@/components/home/AlertsSection";
import { EngagementSection } from "@/components/home/EngagementSection";
import { KnowledgeSection } from "@/components/home/KnowledgeSection";
import { AISuggestionsSection } from "@/components/home/AIsuggestionsSection";
import { FieldIntelligenceMap } from "@/components/cards/FieldIntelligenceMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Greeting + Smart Overview */}
      <GreetingSection />

      {/* Quick Actions Grid */}
      <QuickActionsGrid />

      {/* Alerts Section */}
      <AlertsSection />

      {/* Field Intelligence Map */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <FieldIntelligenceMap className="w-full" />
        </div>
      </div>

      {/* AI Suggestions */}
      <AISuggestionsSection />

      {/* Engagement Features */}
      <EngagementSection />

      {/* Knowledge & News */}
      <KnowledgeSection />
    </div>
  );
};

export default Index;