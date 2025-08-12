import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OfflineIndicator = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 bg-destructive/10 border-destructive/20">
      <WifiOff className="h-4 w-4 text-destructive" />
      <AlertDescription className="text-destructive font-medium">
        No internet connection. Please check your network and try again.
      </AlertDescription>
    </Alert>
  );
};