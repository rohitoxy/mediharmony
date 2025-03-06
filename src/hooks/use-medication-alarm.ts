
import { useState, useEffect, useCallback } from "react";
import { Medication, MedicationAlert } from "@/types/medication";
import { useAlarmSounds } from "@/hooks/use-alarm-sounds";
import { useFirebaseNotifications } from "@/hooks/use-firebase-notifications";
import { useMedicationCheck } from "@/hooks/use-medication-check";

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState<MedicationAlert[]>([]);
  const [fullScreenAlert, setFullScreenAlert] = useState<MedicationAlert | null>(null);
  
  const {
    initializeAudio,
    playAlarmSequence,
    playLoudAlarmSequence,
    stopSounds
  } = useAlarmSounds(isSoundEnabled);
  
  const { notificationsEnabled } = useFirebaseNotifications(
    isSoundEnabled,
    setActiveAlerts,
    playAlarmSequence
  );
  
  const { currentTime } = useMedicationCheck(
    medications,
    isSoundEnabled,
    notificationsEnabled,
    setFullScreenAlert,
    setActiveAlerts,
    playAlarmSequence,
    playLoudAlarmSequence
  );

  useEffect(() => {
    return initializeAudio();
  }, [initializeAudio]);

  const closeFullScreenAlert = useCallback(() => {
    setFullScreenAlert(null);
    stopSounds();
  }, [stopSounds]);

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
    acknowledgeAlert,
    highPriorityCount: groupedAlerts.high?.length || 0,
    fullScreenAlert,
    closeFullScreenAlert
  };
};
