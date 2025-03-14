
import { ExtendedNotificationOptions } from "@/types/medication";
import { useIsMobile } from "@/hooks/use-mobile";

// Check if the browser supports notifications
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestLocalNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!checkNotificationSupport()) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }
  
  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Show a local notification
export const showLocalNotification = (
  title: string, 
  body: string, 
  medicationId: string, 
  priority: 'high' | 'medium' | 'low',
  options: Partial<ExtendedNotificationOptions> = {}
): Notification | null => {
  if (!checkNotificationSupport() || Notification.permission !== 'granted') {
    console.warn('Notifications not allowed');
    return null;
  }

  try {
    const tag = `mediharmony-${priority}-${medicationId}`;
    
    const notificationOptions: ExtendedNotificationOptions = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag,
      renotify: true,
      vibrate: priority === 'high' ? [200, 100, 200, 100, 200] : [100, 50, 100],
      data: {
        medicationId,
        priority,
        timestamp: Date.now()
      },
      ...options
    };
    
    const notification = new Notification(title, notificationOptions);
    
    // Add click handler
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      // Dispatch custom event that components can listen for
      window.dispatchEvent(new CustomEvent('notificationclick', {
        detail: { medicationId, priority }
      }));
    };
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Schedule a local notification for a specific time
export const scheduleLocalNotification = (
  title: string,
  body: string,
  medicationId: string,
  priority: 'high' | 'medium' | 'low',
  scheduledTime: Date,
  options: Partial<ExtendedNotificationOptions> = {}
): number => {
  const now = new Date();
  const delayMs = Math.max(0, scheduledTime.getTime() - now.getTime());
  
  // Schedule the notification
  const timerId = window.setTimeout(() => {
    showLocalNotification(title, body, medicationId, priority, options);
  }, delayMs);
  
  return timerId;
};

// Cancel a scheduled notification
export const cancelScheduledNotification = (timerId: number): void => {
  window.clearTimeout(timerId);
};
