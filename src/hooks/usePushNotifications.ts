import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

export const usePushNotifications = () => {
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
    checkSupport();
  }, []);

  const checkSupport = async () => {
    try {
      // Check if push notifications are supported
      setIsSupported(true);
    } catch (error) {
      console.log('Push notifications not supported:', error);
      setIsSupported(false);
    }
  };

  const checkPermissionStatus = async () => {
    try {
      const result = await PushNotifications.checkPermissions();
      setPermissionStatus(result.receive as string);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const result = await PushNotifications.requestPermissions();
      setPermissionStatus(result.receive as string);
      
      if (result.receive === 'granted') {
        await PushNotifications.register();
        await Preferences.set({ key: 'notificationsEnabled', value: 'true' });
        
        // Schedule daily reminder
        await scheduleDailyReminder();
      }
      
      return result.receive === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const scheduleDailyReminder = async () => {
    try {
      // Cancel any existing notifications
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      // Schedule daily reminder at 7 PM
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(19, 0, 0, 0); // 7:00 PM

      // If it's already past 7 PM today, schedule for tomorrow
      if (now > reminderTime) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: '? Bank - Study Reminder',
            body: "Don't break your streak! Come back and solve some questions.",
            id: 1,
            schedule: { at: reminderTime, repeats: true },
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: '? Bank',
            body: 'Great job! Keep up your learning streak!',
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return {
    permissionStatus,
    isSupported,
    requestPermission,
    checkPermissionStatus,
    scheduleDailyReminder,
    sendTestNotification
  };
};