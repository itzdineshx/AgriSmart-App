import { SignIn, SignUp, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const clerk = useClerk();

  useEffect(() => {
    // Check if Clerk is loaded
    const checkClerkLoaded = () => {
      if (clerk.loaded) {
        setIsClerkLoaded(true);
      } else {
        setTimeout(checkClerkLoaded, 100);
      }
    };
    checkClerkLoaded();

    // Listen for network errors
    const handleNetworkError = () => {
      setHasNetworkError(true);
    };

    window.addEventListener('offline', handleNetworkError);
    
    // Check for blocked requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          setHasNetworkError(true);
        }
        throw error;
      }
    };

    return () => {
      window.removeEventListener('offline', handleNetworkError);
      window.fetch = originalFetch;
    };
  }, [clerk]);

  if (!isClerkLoaded) {
    return (
      <div className="min-h-screen bg-gradient-feature flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-feature flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/logo.png" 
              alt="AgriSmart Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="font-bold text-2xl text-primary">AgriSmart</span>
          </Link>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {hasNetworkError && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Authentication services may be blocked by your ad blocker or network. 
              Please disable ad blockers for this site or try the{" "}
              <Link to="/role-login" className="text-primary underline">
                role-based login
              </Link>.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle>
              {isSignUp ? "Sign Up" : "Sign In"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSignUp ? (
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full",
                    formButtonPrimary: "bg-primary hover:bg-primary/90",
                    footerActionLink: "text-primary hover:text-primary/90",
                    formFieldInput: "focus:ring-primary focus:border-primary",
                    footerAction: "text-center"
                  }
                }}
                fallbackRedirectUrl="/"
                forceRedirectUrl="/"
                signInFallbackRedirectUrl="/"
                signInForceRedirectUrl="/"
                routing="path"
                path="/auth"
              />
            ) : (
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                    headerTitle: "hidden", 
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full",
                    formButtonPrimary: "bg-primary hover:bg-primary/90",
                    footerActionLink: "text-primary hover:text-primary/90",
                    formFieldInput: "focus:ring-primary focus:border-primary",
                    footerAction: "text-center"
                  }
                }}
                fallbackRedirectUrl="/"
                forceRedirectUrl="/"
                signUpFallbackRedirectUrl="/"
                signUpForceRedirectUrl="/"
                routing="path"
                path="/auth"
              />
            )}
            
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground"
              >
                {isSignUp 
                  ? "Already have an account? Sign In" 
                  : "Don't have an account? Sign Up"
                }
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Or try alternative login:</p>
              <Link to="/role-login">
                <Button variant="outline" className="w-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  Role-based Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}