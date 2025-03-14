
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
  
  const { notificationsEnabled } = useFirebaseNotifications(
    isSoundEnabled,
    (alerts) => {
      if (medicationCheck && Array.isArray(alerts)) {
        // Only update if we have a valid medicationCheck and alerts is an array
        medicationCheck.activeAlerts.push(...alerts);
      }
    },
    playAlarmSequence
  );
  
  const medicationCheck = useMedicationCheck(medications);
  const { activeAlerts, acknowledgeAlert, clearAlert, currentTime } = medicationCheck;

  useEffect(() => {
    return initializeAudio();
  }, [initializeAudio]);

  const closeFullScreenAlert = useCallback(() => {
    setFullScreenAlert(null);
    stopSounds();
  }, [stopSounds]);

  // When a high priority alert is active, play the alarm and show fullscreen alert
  useEffect(() => {
    const highPriorityAlert = activeAlerts.find(a => a.priority === 'high' && !a.acknowledged);
    
    if (highPriorityAlert && !fullScreenAlert) {
      setFullScreenAlert(highPriorityAlert);
      if (isSoundEnabled) {
        playAlarmSequence();
      }
    } else if (!highPriorityAlert && fullScreenAlert) {
      closeFullScreenAlert();
    }
  }, [activeAlerts, fullScreenAlert, isSoundEnabled, playAlarmSequence, closeFullScreenAlert]);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    acknowledgeAlert(alertId);
    
    if (fullScreenAlert?.id === alertId) {
      closeFullScreenAlert();
    }
  }, [fullScreenAlert, closeFullScreenAlert, acknowledgeAlert]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      if (prev) {
        stopSounds();
      }
      return !prev;
    });
  }, [stopSounds]);

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
