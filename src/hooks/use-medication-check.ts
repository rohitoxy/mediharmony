
import { useState, useEffect, useRef, useCallback } from "react";
import { Medication, MedicationAlert } from "@/types/medication";
import { useToast } from "@/hooks/use-toast";
import { showBrowserNotification } from "@/utils/notification-utils";

export const useMedicationCheck = (
  medications: Medication[],
  isSoundEnabled: boolean,
  notificationsEnabled: boolean,
  setFullScreenAlert: (alert: MedicationAlert | null) => void,
  setActiveAlerts: (alerts: MedicationAlert[] | ((prev: MedicationAlert[]) => MedicationAlert[])) => void,
  playAlarmSequence: () => void,
  playLoudAlarmSequence: () => void
) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const alertedMedsRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  const showNotification = useCallback((
    title: string, 
    body: string, 
    medicationId: string, 
    priority: 'high' | 'medium' | 'low'
  ) => {
    showBrowserNotification(title, body, medicationId, priority, notificationsEnabled);
  }, [notificationsEnabled]);

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
  }, [
    currentTime, 
    medications, 
    toast, 
    setActiveAlerts, 
    setFullScreenAlert, 
    showNotification, 
    playAlarmSequence, 
    playLoudAlarmSequence
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkMedications();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [checkMedications]);

  return { currentTime };
};
