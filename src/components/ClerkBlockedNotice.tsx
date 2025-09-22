import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Wifi, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClerkBlockedNoticeProps {
  onRetry?: () => void;
}

export function ClerkBlockedNotice({ onRetry }: ClerkBlockedNoticeProps) {
  return (
    <div className="min-h-screen bg-gradient-feature flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-warning/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-warning" />
          </div>
          <CardTitle className="text-xl text-warning">Authentication Service Blocked</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your browser or network is blocking our authentication service (Clerk.com). 
              This is common with ad blockers or corporate firewalls.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">To fix this issue:</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Disable ad blockers (uBlock Origin, AdBlock Plus) for this site</li>
              <li>Add clerk.com to your allowlist/whitelist</li>
              <li>Try using incognito/private browsing mode</li>
              <li>Contact your network administrator if on a corporate network</li>
            </ol>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h5 className="font-medium mb-2">Alternative Options:</h5>
            <div className="space-y-2">
              <Link to="/role-login" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Wifi className="h-4 w-4 mr-2" />
                  Use Role-based Login (No external service)
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => window.open('https://docs.clerk.com/troubleshooting/network-issues', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn more about network issues
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                Try Again
              </Button>
            )}
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}