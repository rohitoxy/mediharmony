
import { useState, useEffect, useCallback } from "react";
import { Medication, MedicationAlert } from "@/types/medication";
import { useAlarmSounds } from "@/hooks/use-alarm-sounds";
import { useFirebaseNotifications } from "@/hooks/use-firebase-notifications";
import { useMedicationCheck } from "@/hooks/use-medication-check";
import { useLocalNotifications } from "@/hooks/use-local-notifications";

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const {
    initializeAudio,
    playAlarmSequence,
    playLoudAlarmSequence,
    stopSounds
  } = useAlarmSounds(isSoundEnabled);
  
  const medicationCheck = useMedicationCheck(medications);
  const { activeAlerts, acknowledgeAlert, clearAlert, currentTime } = medicationCheck;

  // Initialize local notifications
  const {
    permissionGranted: localNotificationsEnabled,
    sendNotification,
    scheduleMedicationNotifications
  } = useLocalNotifications(isSoundEnabled);

  // Provide the missing third argument (playAlarmSequence)
  const { notificationsEnabled } = useFirebaseNotifications(
    isSoundEnabled,
    (alerts) => {
      // Update activeAlerts from firebase notifications
      if (alerts && alerts.length > 0) {
        console.log('Received alerts from Firebase:', alerts);
      }
    },
    playAlarmSequence
  );

  // Initialize audio on mount
  useEffect(() => {
    const cleanup = initializeAudio();
    console.log('Audio initialized');
    return cleanup;
  }, [initializeAudio]);

  // Schedule local notifications for medications
  useEffect(() => {
    if (localNotificationsEnabled) {
      console.log('Scheduling local notifications for medications');
      scheduleMedicationNotifications(medications);
    }
  }, [localNotificationsEnabled, medications, scheduleMedicationNotifications]);

  // When a high priority alert is active, play the alarm
  useEffect(() => {
    // Find high priority alerts that need attention
    const highPriorityAlert = activeAlerts.find(a => 
      a.priority === 'high' && 
      !a.acknowledged && 
      !a.id.includes("-warning")
    );
    
    if (highPriorityAlert) {
      if (isSoundEnabled) {
        console.log('Playing loud alarm for high priority alert:', highPriorityAlert.id);
        playLoudAlarmSequence();
        
        // Also send a local notification for this alert
        if (localNotificationsEnabled) {
          const [medicationId] = highPriorityAlert.id.split('-');
          const medication = medications.find(med => med.id === medicationId);
          
          if (medication) {
            sendNotification(
              highPriorityAlert.title,
              highPriorityAlert.body,
              medicationId,
              'high'
            );
          }
        }
      }
    } else {
      // Check for medium priority alerts
      const mediumPriorityAlert = activeAlerts.find(a => 
        a.priority === 'medium' && 
        !a.acknowledged
      );
      
      if (mediumPriorityAlert && isSoundEnabled) {
        console.log('Playing standard alarm for medium priority alert:', mediumPriorityAlert.id);
        playAlarmSequence();
      }
    }
  }, [activeAlerts, isSoundEnabled, playAlarmSequence, playLoudAlarmSequence, localNotificationsEnabled, sendNotification, medications]);

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
    acknowledgeAlert: handleAcknowledgeAlert,
    highPriorityCount: groupedAlerts.high?.length || 0,
  };
};
