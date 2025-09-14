import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { 
  Menu, 
  Search, 
  Bell,
  Cloud,
  Home, 
  Camera, 
  ShoppingCart, 
  Users,
  User,
  TrendingUp,
  Sparkles,
  Leaf,
  MessageCircle,
  Settings,
  LogOut
} from "lucide-react";
import { WeatherWidget } from "./WeatherWidget";

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isAuthenticated, isClerkUser, userRole } = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Diagnose", path: "/diagnose", icon: Camera },
    { name: "Marketplace", path: "/buy", icon: ShoppingCart },
    { name: "Community", path: "/community", icon: Users },
    { name: "Market Analysis", path: "/market-analysis", icon: TrendingUp },
    { name: "Recommendations", path: "/recommendations", icon: Sparkles },
    { name: "Government Schemes", path: "/government-schemes", icon: Users },
    { name: "Crops & Hybrids", path: "/hybrid", icon: Leaf },
    { name: "News & Blogs", path: "/blogs", icon: MessageCircle },
    { name: "Weather", path: "/weather", icon: Cloud },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-elegant">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img 
            src="/lovable-uploads/logo.png" 
            alt="AgriSmart Logo" 
            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary">AgriSmart</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Smart Farming</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
          </Button>

          {/* Compact Weather Widget */}
          <WeatherWidget />
          
          {/* Hamburger Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/lovable-uploads/logo.png" 
                      alt="AgriSmart Logo" 
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h2 className="font-bold text-xl text-primary">AgriSmart</h2>
                      <p className="text-sm text-muted-foreground">Smart Farming Solutions</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6">
                  <nav className="px-6 space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* User Section */}
                <div className="border-t border-border p-6">
                  <SignedOut>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full" variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  
                  <SignedIn>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <UserButton />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {user?.firstName || user?.username || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.emailAddresses?.[0]?.emailAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to="/user-profile" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLogout}
                          className="flex-1"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SignedIn>

                  {/* Role-based auth for non-Clerk users */}
                  {isAuthenticated && !isClerkUser && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Role Account</p>
                          <p className="text-xs text-muted-foreground">{userRole}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to="/user-profile" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleLogout}
                          className="flex-1"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}