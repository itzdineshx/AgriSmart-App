import { GreetingSection } from "@/components/home/GreetingSection";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { AlertsSection } from "@/components/home/AlertsSection";
import { EngagementSection } from "@/components/home/EngagementSection";
import { KnowledgeSection } from "@/components/home/KnowledgeSection";
import { AISuggestionsSection } from "@/components/home/AIsuggestionsSection";
import { InteractiveMap } from "@/components/home/InteractiveMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Greeting + Smart Overview */}
      <GreetingSection />

      {/* Quick Actions Grid */}
      <QuickActionsGrid />

      {/* Alerts Section */}
      <AlertsSection />

      {/* Interactive Map */}
      <InteractiveMap />

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