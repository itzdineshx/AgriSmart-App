import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code, Database, Globe, Zap, Users, Shield } from 'lucide-react'

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const features = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Smart Analysis",
      description: "AI-powered repository analysis and project insights"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Integration",
      description: "Connect and sync data across multiple platforms seamlessly"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Network",
      description: "Access a worldwide network of developers and projects"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Optimized performance for rapid development cycles"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Built-in tools for seamless team collaboration"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-level security for your most sensitive projects"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-nexus-dark via-nexus-darker to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-nexus-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-nexus-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-nexus-accent/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-nexus-border/20 bg-nexus-dark/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-nexus-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-2xl font-bold bg-nexus-text-gradient bg-clip-text text-transparent">
                NEXUS
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-nexus-muted hover:text-nexus-primary transition-colors">Features</a>
              <a href="#about" className="text-nexus-muted hover:text-nexus-primary transition-colors">About</a>
              <Button variant="outline" size="sm" className="border-nexus-primary/50 text-nexus-primary hover:bg-nexus-primary/10">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-8 bg-nexus-primary/10 text-nexus-primary border-nexus-primary/20">
            ✨ Introducing NEXUS 2.0
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-nexus-text-gradient bg-clip-text text-transparent">
              Connected
            </span>
            <br />
            <span className="text-white">Solutions</span>
          </h1>
          
          <p className="text-xl text-nexus-muted max-w-3xl mx-auto mb-12 leading-relaxed">
            Get AI-powered project ideas, find similar repositories, and get a visual plan to build it. 
            Transform your development workflow with intelligent insights and seamless collaboration.
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <Input
                type="text"
                placeholder="Enter a concept to discover relevant projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 px-6 pr-32 text-lg bg-nexus-card/50 border-nexus-border backdrop-blur-sm focus:border-nexus-primary transition-all duration-300"
              />
              <Button 
                className="absolute right-2 top-2 h-10 px-6 bg-nexus-gradient hover:opacity-90 transition-opacity"
                onClick={() => console.log('Search:', searchQuery)}
              >
                Search <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-nexus-gradient hover:opacity-90 transition-opacity px-8 py-6 text-lg">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-nexus-primary/50 text-nexus-primary hover:bg-nexus-primary/10 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to <span className="bg-nexus-text-gradient bg-clip-text text-transparent">connect</span>
            </h2>
            <p className="text-xl text-nexus-muted max-w-2xl mx-auto">
              Powerful features designed to streamline your development process and enhance team collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-nexus-card/50 border-nexus-border backdrop-blur-sm hover:border-nexus-primary/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 bg-nexus-gradient rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-nexus-muted">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Card className="bg-nexus-gradient p-12 border-0">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to transform your workflow?
            </h3>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of developers who are already using NEXUS to build better software.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-nexus-dark hover:bg-white/90 px-8 py-6 text-lg">
              Start Building Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Index