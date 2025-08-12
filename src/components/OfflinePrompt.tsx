import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { AlertTriangle, Wifi } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface OfflinePromptProps {
  onRetry?: () => void;
  message?: string;
}

export const OfflinePrompt = ({ 
  onRetry, 
  message = "Please turn on your internet connection to continue using the app." 
}: OfflinePromptProps) => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Alert className="max-w-md bg-card border-destructive/20 shadow-lg">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="space-y-4">
          <div>
            <p className="font-medium text-destructive mb-2">No Internet Connection</p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="w-full"
            >
              <Wifi className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};