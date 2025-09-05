import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-nexus-hero">
        <div className="absolute inset-0 bg-nexus-gradient opacity-10" />
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 text-sm font-medium tracking-wide"
            >
              ✨ Welcome to the Future
            </Badge>
            
            <h1 className="text-5xl sm:text-7xl font-bold bg-nexus-gradient bg-clip-text text-transparent mb-6 tracking-tight">
              NEXUS
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Where innovation meets connection. Building the future of digital experiences 
              through cutting-edge technology and seamless integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-nexus-gradient text-primary-foreground px-8 py-3 text-lg font-semibold shadow-nexus-glow hover:shadow-nexus-glow-accent transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 text-lg font-semibold border-2 hover:bg-secondary transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Connected Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the power of seamless integration and innovative technology 
            designed to transform your digital experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 shadow-nexus-elegant hover:shadow-nexus-glow transition-all duration-300 border-border/50">
            <div className="w-12 h-12 bg-nexus-gradient rounded-xl mb-6 flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Seamless Integration
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect all your tools and platforms effortlessly with our advanced integration system.
            </p>
          </Card>

          <Card className="p-8 shadow-nexus-elegant hover:shadow-nexus-glow transition-all duration-300 border-border/50">
            <div className="w-12 h-12 bg-nexus-gradient rounded-xl mb-6 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Experience unprecedented speed and performance with our optimized infrastructure.
            </p>
          </Card>

          <Card className="p-8 shadow-nexus-elegant hover:shadow-nexus-glow transition-all duration-300 border-border/50">
            <div className="w-12 h-12 bg-nexus-gradient rounded-xl mb-6 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Enterprise Security
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Trust in bank-level security protocols protecting your valuable data and connections.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Connect?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of innovators who trust NEXUS to power their digital transformation.
          </p>
          <Button 
            size="lg"
            className="bg-nexus-gradient text-primary-foreground px-12 py-4 text-xl font-semibold shadow-nexus-glow hover:shadow-nexus-glow-accent transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;