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

  // Fix: Provide the missing third argument (playAlarmSequence)
  const { notificationsEnabled } = useFirebaseNotifications(
    isSoundEnabled,
    (alerts) => {
      // No-op for this implementation
    },
    playAlarmSequence
  );

  // Initialize audio on mount
  useEffect(() => {
    return initializeAudio();
  }, [initializeAudio]);

  // Schedule local notifications for medications
  useEffect(() => {
    if (localNotificationsEnabled) {
      scheduleMedicationNotifications(medications);
    }
  }, [localNotificationsEnabled, medications, scheduleMedicationNotifications]);

  // When a high priority alert is active, play the alarm
  useEffect(() => {
    // Only play sounds for high priority alerts that are not warning alerts
    const highPriorityAlert = activeAlerts.find(a => 
      a.priority === 'high' && 
      !a.acknowledged && 
      !a.id.includes("-warning")
    );
    
    if (highPriorityAlert) {
      if (isSoundEnabled) {
        // Use the loud alarm sequence for high priority alerts at exact time
        console.log('Playing loud alarm for high priority alert:', highPriorityAlert.id);
        playLoudAlarmSequence();
      }
      
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
    } else {
      // No active sounds for medium priority (warning) alerts
      // We'll just keep the visual notifications without sound
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
