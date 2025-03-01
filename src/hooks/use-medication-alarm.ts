
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { requestNotificationPermission, setupMessageListener } from "@/integrations/firebase/firebase";

interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  time: string;
  completed?: boolean;
  dosage?: string;
  priority?: string;
}

interface MedicationAlert {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  acknowledged: boolean;
}

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<MedicationAlert[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const alertedMedsRef = useRef<Set<string>>(new Set());
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Firebase notifications
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
    
    // Setup message listener for foreground messages
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
        
        // Show toast for foreground message
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

    // Initialize audio
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audioRef.current.loop = false;

    // Check medications every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkMedications();
    }, 1000);

    return () => {
      clearInterval(timer);
      if (messageUnsubscribe) messageUnsubscribe();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    };
  }, [medications]);

  // Play sound alarm sequence
  const playAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !audioRef.current) return;

    // Play immediately
    audioRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });

    // Clear any existing interval
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }

    // Set up interval to play sound every 10 seconds for 2 minutes
    let playCount = 0;
    soundIntervalRef.current = setInterval(() => {
      if (playCount < 12 && audioRef.current) { // 12 times = 2 minutes
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        playCount++;
      } else if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }, 10000); // Every 10 seconds
  }, [isSoundEnabled]);

  // Check medications for alerts
  const checkMedications = useCallback(() => {
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    
    medications.forEach((med) => {
      if (med.completed) {
        alertedMedsRef.current.delete(med.id);
        
        // Remove any active alerts for this medication
        setActiveAlerts(prev => prev.filter(alert => alert.id !== med.id));
        return;
      }
      
      const [hours, minutes] = med.time.split(":");
      const targetHour = parseInt(hours);
      const targetMinute = parseInt(minutes);
      
      // Check if we're within 5 minutes of the target time
      const isNearTime = (
        (currentHours === targetHour && Math.abs(currentMinutes - targetMinute) <= 5) ||
        (currentHours === targetHour - 1 && targetMinute < 5 && currentMinutes >= 55) ||
        (currentHours === targetHour + 1 && targetMinute >= 55 && currentMinutes < 5)
      );

      const isExactTime = currentHours === targetHour && currentMinutes === targetMinute;
      const isOverdue = (
        currentHours > targetHour || 
        (currentHours === targetHour && currentMinutes > targetMinute + 5)
      );

      // Determine priority based on timing
      const getPriority = (): 'high' | 'medium' | 'low' => {
        if (isExactTime || isOverdue) return 'high';
        if (isNearTime) return 'medium';
        return 'low';
      };

      if ((isNearTime || isExactTime || isOverdue) && !alertedMedsRef.current.has(med.id)) {
        alertedMedsRef.current.add(med.id);
        
        const priority = getPriority();
        const title = isExactTime ? "🚨 MEDICATION DUE NOW!" : 
                    isOverdue ? "⚠️ OVERDUE MEDICATION!" : 
                    "⚠️ Medication Due Soon!";
        const body = `Patient ${med.patientId} in Room ${med.roomNumber} needs ${med.medicineName} ${med.dosage || ''}`;
        
        // Create new alert
        const newAlert: MedicationAlert = {
          id: med.id,
          title,
          body,
          timestamp: Date.now(),
          priority,
          acknowledged: false
        };
        
        // Add to active alerts
        setActiveAlerts(prev => [...prev, newAlert]);
        
        // Show toast notification
        toast({
          title,
          description: body,
          variant: priority === 'high' ? "destructive" : "default",
          duration: 30000,
        });

        // Show system notification
        showNotification(title, body, med.id, priority);

        // Play sound for high priority
        if (priority === 'high') {
          playAlarmSequence();
        }

        // Set up a reminder if the medication isn't marked as completed
        setTimeout(() => {
          if (!med.completed) {
            const reminderTitle = "⏰ Reminder: Medication Still Due!";
            const reminderBody = `Patient ${med.patientId} still needs ${med.medicineName}`;
            
            toast({
              title: reminderTitle,
              description: reminderBody,
              variant: "destructive",
              duration: 30000,
            });
            
            showNotification(reminderTitle, reminderBody, med.id, 'high');
            playAlarmSequence();
          }
        }, 120000); // 2 minutes later
      }
    });
  }, [currentTime, medications, toast, playAlarmSequence]);

  // Show browser notification
  const showNotification = useCallback((title: string, body: string, medicationId: string, priority: 'high' | 'medium' | 'low') => {
    if (notificationsEnabled && 'Notification' in window) {
      try {
        // Group notifications by priority
        const tag = `mediharmony-${priority}`;
        
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag, // Group by priority
          renotify: true, // Notify again even if using same tag
          data: {
            medicationId,
            priority,
            timestamp: Date.now()
          }
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }, [notificationsEnabled]);

  // Mark an alert as acknowledged
  const acknowledgeAlert = useCallback((alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true } 
          : alert
      )
    );
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled && audioRef.current) {
      audioRef.current.pause();
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }
  }, [isSoundEnabled]);

  // Group alerts by priority
  const groupedAlerts = activeAlerts.reduce((acc, alert) => {
    if (!acc[alert.priority]) {
      acc[alert.priority] = [];
    }
    acc[alert.priority].push(alert);
    return acc;
  }, {} as Record<string, MedicationAlert[]>);

  return {
    currentTime,
    isSoundEnabled,
    toggleSound,
    notificationsEnabled,
    activeAlerts,
    groupedAlerts,
    acknowledgeAlert,
    highPriorityCount: groupedAlerts.high?.length || 0
  };
};
