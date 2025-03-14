
import { useState, useEffect, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  requestLocalNotificationPermission, 
  showLocalNotification,
  scheduleLocalNotification,
  cancelScheduledNotification
} from '@/utils/local-notification-utils';
import { Medication, ExtendedNotificationOptions } from '@/types/medication';

interface ScheduledNotification {
  id: string;
  medicationId: string;
  timerId: number;
  scheduledTime: Date;
}

export const useLocalNotifications = (isSoundEnabled: boolean) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const isMobile = useIsMobile();
  
  // Request permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await requestLocalNotificationPermission();
      setPermissionGranted(permission === 'granted');
    };
    
    requestPermission();
  }, []);
  
  // Listen for notification clicks
  useEffect(() => {
    const handleNotificationClick = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { medicationId } = customEvent.detail;
      console.log('Notification clicked for medication:', medicationId);
      // Components can listen for this event to handle UI updates
    };
    
    window.addEventListener('notificationclick', handleNotificationClick);
    
    return () => {
      window.removeEventListener('notificationclick', handleNotificationClick);
    };
  }, []);
  
  // Send an immediate notification
  const sendNotification = useCallback((
    title: string,
    body: string,
    medicationId: string,
    priority: 'high' | 'medium' | 'low',
  ) => {
    if (permissionGranted) {
      // Mobile devices should use vibration for high priority
      const options: Partial<ExtendedNotificationOptions> = isMobile && priority === 'high' 
        ? { vibrate: [200, 100, 200, 100, 200, 100, 200] } 
        : {};
      
      showLocalNotification(title, body, medicationId, priority, options);
      return true;
    }
    return false;
  }, [permissionGranted, isMobile]);
  
  // Schedule a notification for later
  const scheduleNotification = useCallback((
    title: string,
    body: string,
    medicationId: string,
    priority: 'high' | 'medium' | 'low',
    scheduledTime: Date
  ) => {
    if (!permissionGranted) return null;
    
    // Create options optimal for mobile if applicable
    const options: Partial<ExtendedNotificationOptions> = isMobile 
      ? { vibrate: priority === 'high' ? [200, 100, 200, 100, 200] : [100, 50, 100] }
      : {};
    
    const timerId = scheduleLocalNotification(
      title,
      body,
      medicationId,
      priority,
      scheduledTime,
      options
    );
    
    const notificationId = `${medicationId}-${scheduledTime.getTime()}`;
    
    setScheduledNotifications(prev => [
      ...prev, 
      { 
        id: notificationId,
        medicationId,
        timerId, 
        scheduledTime
      }
    ]);
    
    return notificationId;
  }, [permissionGranted, isMobile]);
  
  // Cancel a scheduled notification
  const cancelNotification = useCallback((notificationId: string) => {
    setScheduledNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      
      if (notification) {
        cancelScheduledNotification(notification.timerId);
        return prev.filter(n => n.id !== notificationId);
      }
      
      return prev;
    });
  }, []);
  
  // Schedule notifications for medications
  const scheduleMedicationNotifications = useCallback((medications: Medication[]) => {
    // Cancel any existing notifications for these medications
    setScheduledNotifications(prev => {
      prev.forEach(notification => {
        cancelScheduledNotification(notification.timerId);
      });
      return [];
    });
    
    // Set up new notifications
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    medications.forEach(medication => {
      if (medication.completed) return;
      
      const [hours, minutes] = medication.time.split(':').map(Number);
      
      // Schedule for today
      const todayTime = new Date(now);
      todayTime.setHours(hours, minutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      const scheduledTime = todayTime > now ? todayTime : new Date(tomorrow.setHours(hours, minutes, 0, 0));
      
      scheduleNotification(
        'Medication Due',
        `${medication.medicineName} for patient in room ${medication.roomNumber}`,
        medication.id,
        'high',
        scheduledTime
      );
      
      // Also schedule a reminder 15 minutes before
      const reminderTime = new Date(scheduledTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - 15);
      
      if (reminderTime > now) {
        scheduleNotification(
          'Upcoming Medication',
          `${medication.medicineName} for patient in room ${medication.roomNumber} in 15 minutes`,
          medication.id,
          'medium',
          reminderTime
        );
      }
    });
  }, [scheduleNotification]);
  
  return {
    permissionGranted,
    sendNotification,
    scheduleNotification,
    cancelNotification,
    scheduleMedicationNotifications,
    scheduledNotifications
  };
};
