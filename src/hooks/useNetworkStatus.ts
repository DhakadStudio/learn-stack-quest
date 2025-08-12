import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState<string>('unknown');

  useEffect(() => {
    // Check initial network status
    const checkInitialStatus = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);
      } catch (error) {
        // Fallback to browser API
        setIsOnline(navigator.onLine);
      }
    };

    checkInitialStatus();

    // Listen for network changes
    let networkListener: any;
    
    const setupNetworkListener = async () => {
      try {
        networkListener = await Network.addListener('networkStatusChange', (status) => {
          setIsOnline(status.connected);
          setNetworkType(status.connectionType);
        });
      } catch (error) {
        console.log('Network listener setup failed:', error);
      }
    };

    setupNetworkListener();

    // Fallback browser listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (networkListener) {
        networkListener.remove();
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, networkType };
};