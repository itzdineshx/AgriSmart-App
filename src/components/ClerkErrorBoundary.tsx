import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Wifi, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isClerkError: boolean;
}

export class ClerkErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isClerkError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const isClerkError = error.message.includes('Clerk') || 
                        error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
                        error.message.includes('net::ERR_') ||
                        error.stack?.includes('clerk');
    
    return { 
      hasError: true, 
      error,
      isClerkError 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Clerk authentication error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRoleLogin = () => {
    window.location.href = '/role-login';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                {this.state.isClerkError ? (
                  <ShieldAlert className="h-8 w-8 text-destructive" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                )}
              </div>
              <CardTitle className="text-xl text-destructive">
                {this.state.isClerkError ? 'Authentication Service Blocked' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.isClerkError ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    The authentication service appears to be blocked by your browser, ad blocker, or network.
                    This is common with privacy extensions like uBlock Origin or corporate firewalls.
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-muted-foreground text-center">
                  We encountered an unexpected error during authentication.
                </p>
              )}
              
              <div className="space-y-3">
                <h4 className="font-medium">Try these solutions:</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Disable ad blockers (uBlock Origin, AdBlock Plus) for this site</li>
                  <li>Try incognito/private browsing mode</li>
                  <li>Check if your network/firewall is blocking clerk.com</li>
                  <li>Use the role-based login as an alternative</li>
                </ul>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-muted p-4 rounded-md">
                  <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                  <pre className="text-sm text-destructive whitespace-pre-wrap overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={this.handleRoleLogin} className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Use Role Login
                </Button>
                <Button variant="outline" onClick={this.handleReload} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload
                </Button>
              </div>
              
              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}