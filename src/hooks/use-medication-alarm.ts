
import { useState, useEffect, useCallback } from "react";
import { Medication, MedicationAlert } from "@/types/medication";
import { useAlarmSounds } from "@/hooks/use-alarm-sounds";
import { useFirebaseNotifications } from "@/hooks/use-firebase-notifications";
import { useMedicationCheck } from "@/hooks/use-medication-check";

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [fullScreenAlert, setFullScreenAlert] = useState<MedicationAlert | null>(null);
  
  const {
    initializeAudio,
    playAlarmSequence,
    playLoudAlarmSequence,
    stopSounds
  } = useAlarmSounds(isSoundEnabled);
  
  const medicationCheck = useMedicationCheck(medications);
  const { activeAlerts, acknowledgeAlert, clearAlert, currentTime } = medicationCheck;

  // Fix: Provide the missing third argument (playAlarmSequence)
  const { notificationsEnabled } = useFirebaseNotifications(
    isSoundEnabled,
    (alerts) => {
      // No-op for this implementation
    },
    playAlarmSequence
  );

  useEffect(() => {
    return initializeAudio();
  }, [initializeAudio]);

  const closeFullScreenAlert = useCallback(() => {
    if (fullScreenAlert) {
      console.log('Closing full screen alert:', fullScreenAlert.id);
      setFullScreenAlert(null);
      stopSounds();
    }
  }, [fullScreenAlert, stopSounds]);

  // When a high priority alert is active, play the alarm and show fullscreen alert
  useEffect(() => {
    const highPriorityAlert = activeAlerts.find(a => a.priority === 'high' && !a.acknowledged);
    
    if (highPriorityAlert && !fullScreenAlert) {
      console.log('Showing high priority alert:', highPriorityAlert);
      setFullScreenAlert(highPriorityAlert);
      if (isSoundEnabled) {
        playAlarmSequence();
      }
    } else if (!highPriorityAlert && fullScreenAlert) {
      closeFullScreenAlert();
    }
  }, [activeAlerts, fullScreenAlert, isSoundEnabled, playAlarmSequence, closeFullScreenAlert]);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    console.log('Using handleAcknowledgeAlert for:', alertId);
    
    // Find the medication ID from the alert ID
    const [medicationId] = alertId.split('-');
    const medication = medications.find(med => med.id === medicationId);
    
    // Acknowledge the alert
    acknowledgeAlert(alertId);
    
    // Close fullscreen alert if it's the same one
    if (fullScreenAlert?.id === alertId) {
      closeFullScreenAlert();
    }

    return medicationId;
  }, [fullScreenAlert, closeFullScreenAlert, acknowledgeAlert, medications]);

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
    notificationsEnabled,
    activeAlerts,
    groupedAlerts,
    acknowledgeAlert: handleAcknowledgeAlert,
    highPriorityCount: groupedAlerts.high?.length || 0,
    fullScreenAlert,
    closeFullScreenAlert
  };
};
