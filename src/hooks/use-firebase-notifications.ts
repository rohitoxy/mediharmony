
import { useState, useEffect, useCallback } from "react";
import { MedicationAlert } from "@/types/medication";
import { requestNotificationPermission, setupMessageListener } from "@/integrations/firebase/firebase";
import { useToast } from "@/hooks/use-toast";

export const useFirebaseNotifications = (
  isSoundEnabled: boolean,
  setActiveAlerts: (alerts: MedicationAlert[] | ((prev: MedicationAlert[]) => MedicationAlert[])) => void,
  playAlarmSequence: () => void
) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initFirebaseNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          setNotificationsEnabled(true);
          console.log("Firebase notifications enabled with token:", token);
        }
      } catch (error) {
        console.error("Failed to initialize Firebase notifications:", error);
      }
    };

    initFirebaseNotifications();
    
    const messageUnsubscribe = setupMessageListener((payload) => {
      if (payload.notification) {
        const newAlert: MedicationAlert = {
          id: payload.data?.medicationId || `med-${Date.now()}`,
          title: payload.notification.title,
          body: payload.notification.body,
          timestamp: Date.now(),
          priority: (payload.data?.priority as 'high' | 'medium' | 'low') || 'medium',
          acknowledged: false
        };
        
        setActiveAlerts((prevAlerts) => [...prevAlerts, newAlert]);
        
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
          variant: newAlert.priority === 'high' ? "destructive" : "default",
          duration: 30000,
        });
        
        if (newAlert.priority === 'high' && isSoundEnabled) {
          playAlarmSequence();
        }
      }
    });

    return () => {
      if (messageUnsubscribe) messageUnsubscribe();
    };
  }, [isSoundEnabled, setActiveAlerts, playAlarmSequence, toast]);

  return {
    notificationsEnabled,
    fcmToken
  };
};
