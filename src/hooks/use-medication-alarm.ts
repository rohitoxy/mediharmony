
import { useState, useEffect, useCallback, useRef } from "react";
import { Medication, MedicationAlert } from "@/types/medication";
import { useAlarmSounds } from "@/hooks/use-alarm-sounds";
import { useFirebaseNotifications } from "@/hooks/use-firebase-notifications";
import { useMedicationCheck } from "@/hooks/use-medication-check";
import { useLocalNotifications } from "@/hooks/use-local-notifications";

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const {
    initializeAudio,
    playAlarmByPriority,
    playFullScreenAlarm,
    stopSounds
  } = useAlarmSounds(isSoundEnabled);
  
  const medicationCheck = useMedicationCheck(medications);
  const { 
    activeAlerts, 
    acknowledgeAlert, 
    clearAlert, 
    currentTime,
    medicationsByTime 
  } = medicationCheck;

  // Initialize local notifications
  const {
    permissionGranted: localNotificationsEnabled,
    sendNotification,
    scheduleMedicationNotifications
  } = useLocalNotifications(isSoundEnabled);

  // Provide the function to play medium priority sounds as default for firebase notifications
  const { notificationsEnabled } = useFirebaseNotifications(
    isSoundEnabled,
    (alerts) => {
      // Update activeAlerts from firebase notifications
      if (alerts && alerts.length > 0) {
        console.log('Received alerts from Firebase:', alerts);
      }
    },
    () => playAlarmByPriority('medium') // Default to medium priority for firebase notifications
  );

  // Initialize audio on mount
  useEffect(() => {
    const cleanup = initializeAudio();
    console.log('Audio initialized with priority-based sounds');
    return cleanup;
  }, [initializeAudio]);

  // Schedule local notifications for medications
  useEffect(() => {
    if (localNotificationsEnabled) {
      console.log('Scheduling local notifications for medications');
      scheduleMedicationNotifications(medications);
    }
  }, [localNotificationsEnabled, medications, scheduleMedicationNotifications]);

  // Play sounds based on alert priority - only for regular alerts, not warning alerts
  useEffect(() => {
    // Find unacknowledged alerts for each priority (excluding warning alerts)
    const highPriorityAlert = activeAlerts.find(a => 
      a.priority === 'high' && 
      !a.acknowledged && 
      !a.id.includes("-warning")
    );
    
    const mediumPriorityAlert = activeAlerts.find(a => 
      a.priority === 'medium' && 
      !a.acknowledged && 
      !a.id.includes("-warning")
    );
    
    const lowPriorityAlert = activeAlerts.find(a => 
      a.priority === 'low' && 
      !a.acknowledged && 
      !a.id.includes("-warning")
    );
    
    // Play full screen alert sound for the highest priority alert (excluding warning alerts)
    if (isSoundEnabled) {
      if (highPriorityAlert) {
        console.log('Playing full screen alarm for high priority alert:', highPriorityAlert.id);
        playFullScreenAlarm('high');
        
        // Also send a local notification
        if (localNotificationsEnabled) {
          sendNotificationForAlert(highPriorityAlert);
        }
      } else if (mediumPriorityAlert) {
        console.log('Playing full screen alarm for medium priority alert:', mediumPriorityAlert.id);
        playFullScreenAlarm('medium');
        
        if (localNotificationsEnabled) {
          sendNotificationForAlert(mediumPriorityAlert);
        }
      } else if (lowPriorityAlert) {
        console.log('Playing full screen alarm for low priority alert:', lowPriorityAlert.id);
        playFullScreenAlarm('low');
        
        if (localNotificationsEnabled) {
          sendNotificationForAlert(lowPriorityAlert);
        }
      }
      
      // We're removing the sound playing for warning alerts
      // Warning alerts will now just show a small popup without sound
    }
  }, [activeAlerts, isSoundEnabled, playAlarmByPriority, playFullScreenAlarm, localNotificationsEnabled, sendNotification, medications]);

  // Helper function to send notification for an alert
  const sendNotificationForAlert = (alert: MedicationAlert) => {
    const [medicationId] = alert.id.split('-');
    const medication = medications.find(med => med.id === medicationId);
    
    if (medication) {
      sendNotification(
        alert.title,
        alert.body,
        medicationId,
        alert.priority
      );
    }
  };

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    console.log('Using handleAcknowledgeAlert for:', alertId);
    
    // Find the medication ID from the alert ID
    const [medicationId] = alertId.split('-');
    
    // Acknowledge the alert
    acknowledgeAlert(alertId);
    
    // Stop sounds
    stopSounds();

    return medicationId;
  }, [acknowledgeAlert, stopSounds]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      if (prev) {
        stopSounds();
      }
      return !prev;
    });
  }, [stopSounds]);

  // Group alerts by priority for easier rendering
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
    notificationsEnabled: notificationsEnabled || localNotificationsEnabled,
    activeAlerts,
    groupedAlerts,
    medicationsByTime,
    acknowledgeAlert: handleAcknowledgeAlert,
    highPriorityCount: groupedAlerts.high?.length || 0,
  };
};
