
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
      
      const timeInMinutes = now.getHours() * 60 + now.getMinutes();
      
      medications.forEach(medication => {
        if (medication.completed) return;
        
        const [hours, minutes] = medication.time.split(':').map(Number);
        const medicationTime = hours * 60 + minutes;
        
        // Check if it's time for medication (within a 5-minute window)
        if (Math.abs(timeInMinutes - medicationTime) <= 5) {
          // Use just the medication ID as the base for the alert ID
          const medicationId = medication.id;
          
          // Check if this alert is already active
          const alertExists = activeAlerts.some(alert => alert.id.startsWith(medicationId));
          
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
      });
    };
    
    const interval = setInterval(checkMedications, 60000); // Check every minute
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
