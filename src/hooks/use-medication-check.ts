
import { useState, useEffect } from 'react';
import { Medication, MedicationAlert } from '@/types/medication';
import { useToast } from '@/hooks/use-toast';
import { useMedicationAlarm } from '@/hooks/use-medication-alarm';

export const useMedicationCheck = (medications: Medication[]) => {
  const [activeAlerts, setActiveAlerts] = useState<MedicationAlert[]>([]);
  const { toast } = useToast();
  const { playAlarm, stopAlarm } = useMedicationAlarm();

  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      medications.forEach(medication => {
        if (medication.completed) return;
        
        const [hours, minutes] = medication.time.split(':').map(Number);
        const medicationTime = hours * 60 + minutes;
        
        // Check if it's time for medication (within a 5-minute window)
        if (Math.abs(currentTime - medicationTime) <= 5) {
          const alertId = `${medication.id}-${now.toISOString()}`;
          
          // Check if this alert is already active
          const alertExists = activeAlerts.some(alert => alert.id.startsWith(medication.id));
          
          if (!alertExists) {
            const newAlert: MedicationAlert = {
              id: alertId,
              title: 'Medication Due',
              body: `${medication.medicineName} for patient in room ${medication.roomNumber}`,
              timestamp: Date.now(),
              priority: 'high',
              acknowledged: false
            };
            
            setActiveAlerts(prev => [...prev, newAlert]);
            
            playAlarm();
            
            toast({
              title: 'Medication Due',
              description: `Time to administer ${medication.medicineName} for patient in room ${medication.roomNumber}`,
              variant: 'destructive',
            });
          }
        }
      });
    };
    
    const interval = setInterval(checkMedications, 60000); // Check every minute
    checkMedications(); // Check immediately on first load
    
    return () => {
      clearInterval(interval);
      stopAlarm();
    };
  }, [medications, activeAlerts, toast, playAlarm, stopAlarm]);
  
  const acknowledgeAlert = (alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true } 
          : alert
      )
    );
    stopAlarm();
  };
  
  const clearAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // If no active alerts are left, stop the alarm
    if (activeAlerts.length <= 1) {
      stopAlarm();
    }
  };
  
  return {
    activeAlerts,
    acknowledgeAlert,
    clearAlert
  };
};
