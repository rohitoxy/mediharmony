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

interface ExtendedNotificationOptions extends NotificationOptions {
  renotify?: boolean;
}

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<MedicationAlert[]>([]);
  const [fullScreenAlert, setFullScreenAlert] = useState<MedicationAlert | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loudAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const alertedMedsRef = useRef<Set<string>>(new Set());
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loudSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audioRef.current.loop = false;
    
    loudAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2887/2887-preview.mp3");
    loudAudioRef.current.loop = false;
    loudAudioRef.current.volume = 1.0;

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
      if (loudAudioRef.current) {
        loudAudioRef.current.pause();
        loudAudioRef.current = null;
      }
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
      if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
      }
    };
  }, [medications]);

  const showNotification = useCallback((title: string, body: string, medicationId: string, priority: 'high' | 'medium' | 'low') => {
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
  }, [notificationsEnabled]);

  const playAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !audioRef.current) return;

    audioRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });

    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }

    let playCount = 0;
    soundIntervalRef.current = setInterval(() => {
      if (playCount < 12 && audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        playCount++;
      } else if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }, 10000);
  }, [isSoundEnabled]);

  const playLoudAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !loudAudioRef.current) return;

    loudAudioRef.current.play().catch(error => {
      console.error("Error playing loud audio:", error);
    });

    if (loudSoundIntervalRef.current) {
      clearInterval(loudSoundIntervalRef.current);
    }

    let playCount = 0;
    loudSoundIntervalRef.current = setInterval(() => {
      if (playCount < 24 && loudAudioRef.current) {
        loudAudioRef.current.play().catch(error => {
          console.error("Error playing loud audio:", error);
        });
        playCount++;
      } else if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
      }
    }, 5000);
  }, [isSoundEnabled]);

  const checkMedications = useCallback(() => {
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    
    medications.forEach((med) => {
      if (med.completed) {
        alertedMedsRef.current.delete(med.id);
        
        setActiveAlerts(prev => prev.filter(alert => alert.id !== med.id));
        setFullScreenAlert(prev => prev?.id === med.id ? null : prev);
        
        return;
      }
      
      const [hours, minutes] = med.time.split(":");
      const targetHour = parseInt(hours);
      const targetMinute = parseInt(minutes);
      
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
        
        const newAlert: MedicationAlert = {
          id: med.id,
          title,
          body,
          timestamp: Date.now(),
          priority,
          acknowledged: false
        };
        
        setActiveAlerts(prev => [...prev, newAlert]);
        
        toast({
          title,
          description: body,
          variant: priority === 'high' ? "destructive" : "default",
          duration: 30000,
        });

        showNotification(title, body, med.id, priority);

        if (isExactTime) {
          setFullScreenAlert(newAlert);
          playLoudAlarmSequence();
        } else if (isOverdue) {
          playAlarmSequence();
        }

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
            
            if (isExactTime) {
              setFullScreenAlert({
                id: med.id,
                title: reminderTitle,
                body: reminderBody,
                timestamp: Date.now(),
                priority: 'high',
                acknowledged: false
              });
              playLoudAlarmSequence();
            } else {
              playAlarmSequence();
            }
          }
        }, 120000);
      }
    });
  }, [currentTime, medications, toast, playAlarmSequence, playLoudAlarmSequence, showNotification]);

  const closeFullScreenAlert = useCallback(() => {
    setFullScreenAlert(null);
    
    if (loudAudioRef.current) {
      loudAudioRef.current.pause();
      if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
      }
    }
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true } 
          : alert
      )
    );
    
    if (fullScreenAlert?.id === alertId) {
      closeFullScreenAlert();
    }
  }, [fullScreenAlert, closeFullScreenAlert]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current);
        }
      }
      if (loudAudioRef.current) {
        loudAudioRef.current.pause();
        if (loudSoundIntervalRef.current) {
          clearInterval(loudSoundIntervalRef.current);
        }
      }
    }
  }, [isSoundEnabled]);

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
    highPriorityCount: groupedAlerts.high?.length || 0,
    fullScreenAlert,
    closeFullScreenAlert
  };
};
