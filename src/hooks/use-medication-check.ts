
import { useState, useEffect, useCallback } from 'react';
import { Medication, MedicationAlert } from '@/types/medication';
import { useToast } from '@/hooks/use-toast';

export const useMedicationCheck = (medications: Medication[]) => {
  const [activeAlerts, setActiveAlerts] = useState<MedicationAlert[]>([]);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clear stale alerts on medication change
  useEffect(() => {
    // Remove alerts for medications that no longer exist or are completed
    setActiveAlerts(prev => 
      prev.filter(alert => {
        const [medicationId] = alert.id.split('-');
        const medication = medications.find(m => m.id === medicationId);
        return medication && !medication.completed;
      })
    );
  }, [medications]);

  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      medications.forEach(medication => {
        if (medication.completed) return;
        
        const [hours, minutes] = medication.time.split(':').map(Number);
        
        // Check if it's the exact time for medication
        if (currentHours === hours && currentMinutes === minutes) {
          // Use just the medication ID as the base for the alert ID
          const medicationId = medication.id;
          
          // Check if this alert is already active
          const alertExists = activeAlerts.some(alert => 
            alert.id.startsWith(medicationId) && !alert.id.includes("-warning")
          );
          
          if (!alertExists) {
            const alertId = `${medicationId}-${now.toISOString()}`;
            const newAlert: MedicationAlert = {
              id: alertId,
              title: 'Medication Due',
              body: `${medication.medicineName} for patient in room ${medication.roomNumber}`,
              timestamp: Date.now(),
              priority: 'high',
              acknowledged: false
            };
            
            console.log('Creating new medication alert:', newAlert);
            setActiveAlerts(prev => [...prev, newAlert]);
            
            toast({
              title: 'Medication Due',
              description: `Time to administer ${medication.medicineName} for patient in room ${medication.roomNumber}`,
              variant: 'destructive',
            });
          }
        }
        
        // Also check for 1-minute warning (exact time minus 1 minute)
        // But create a warning notification without sound
        const warningMinuteTime = new Date();
        warningMinuteTime.setHours(hours, minutes, 0, 0);
        warningMinuteTime.setMinutes(warningMinuteTime.getMinutes() - 1);
        
        if (currentHours === warningMinuteTime.getHours() && 
            currentMinutes === warningMinuteTime.getMinutes()) {
          // Create a warning alert with medium priority
          const medicationId = medication.id;
          const warningAlertExists = activeAlerts.some(alert => 
            alert.id.startsWith(`${medicationId}-warning`)
          );
          
          if (!warningAlertExists) {
            const alertId = `${medicationId}-warning-${now.toISOString()}`;
            const newAlert: MedicationAlert = {
              id: alertId,
              title: 'Medication Due Soon',
              body: `${medication.medicineName} for patient in room ${medication.roomNumber} due in 1 minute`,
              timestamp: Date.now(),
              priority: 'medium',
              acknowledged: false
            };
            
            console.log('Creating medication warning alert:', newAlert);
            setActiveAlerts(prev => [...prev, newAlert]);
            
            toast({
              title: 'Medication Due Soon',
              description: `${medication.medicineName} for patient in room ${medication.roomNumber} due in 1 minute`,
              variant: 'default',
            });
          }
        }
      });
    };
    
    const interval = setInterval(checkMedications, 10000); // Check every 10 seconds for better efficiency
    checkMedications(); // Check immediately on first load
    
    return () => {
      clearInterval(interval);
    };
  }, [medications, activeAlerts, toast]);
  
  const acknowledgeAlert = useCallback((alertId: string) => {
    console.log('Acknowledging alert:', alertId);
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true } 
          : alert
      )
    );
  }, []);
  
  const clearAlert = useCallback((alertId: string) => {
    console.log('Clearing alert:', alertId);
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);
  
  return {
    activeAlerts,
    acknowledgeAlert,
    clearAlert,
    currentTime
  };
};
