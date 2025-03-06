
import { ExtendedNotificationOptions } from "@/types/medication";

export const showBrowserNotification = (
  title: string, 
  body: string, 
  medicationId: string, 
  priority: 'high' | 'medium' | 'low',
  notificationsEnabled: boolean
) => {
  if (notificationsEnabled && 'Notification' in window) {
    try {
      const tag = `mediharmony-${priority}`;
      
      const options: ExtendedNotificationOptions = {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag,
        renotify: true,
        data: {
          medicationId,
          priority,
          timestamp: Date.now()
        }
      };
      
      new Notification(title, options);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
};
