
import { useState, useEffect, useCallback, useRef } from 'react';
import { Medication, MedicationAlert } from '@/types/medication';
import { useToast } from '@/hooks/use-toast';

export const useMedicationCheck = (medications: Medication[]) => {
  const [activeAlerts, setActiveAlerts] = useState<MedicationAlert[]>([]);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Track medications by time for grouping
  const [medicationsByTime, setMedicationsByTime] = useState<Record<string, {
    count: number;
    roomNumbers: string[];
    medicationIds: string[];
  }>>({});

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
      
      // Group medications by time
      const groupedByTime: Record<string, {
        medications: Medication[];
        count: number;
        roomNumbers: string[];
        medicationIds: string[];
      }> = {};
      
      medications.forEach(medication => {
        if (!medication.completed) {
          const timeKey = medication.time;
          if (!groupedByTime[timeKey]) {
            groupedByTime[timeKey] = {
              medications: [],
              count: 0,
              roomNumbers: [],
              medicationIds: []
            };
          }
          
          groupedByTime[timeKey].medications.push(medication);
          groupedByTime[timeKey].count++;
          
          if (!groupedByTime[timeKey].roomNumbers.includes(medication.roomNumber)) {
            groupedByTime[timeKey].roomNumbers.push(medication.roomNumber);
          }
          
          groupedByTime[timeKey].medicationIds.push(medication.id);
        }
      });
      
      // Update state with medication time groups (for UI display)
      const timeGroups: Record<string, {
        count: number;
        roomNumbers: string[];
        medicationIds: string[];
      }> = {};
      
      Object.keys(groupedByTime).forEach(time => {
        const group = groupedByTime[time];
        timeGroups[time] = {
          count: group.count,
          roomNumbers: group.roomNumbers,
          medicationIds: group.medicationIds
        };
      });
      
      setMedicationsByTime(timeGroups);
      
      // Check for medications due now
      medications.forEach(medication => {
        if (medication.completed) return;
        
        const [hours, minutes] = medication.time.split(':').map(Number);
        
        // Check if it's the exact time for medication (check within the minute)
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
              priority: medication.priority || 'high',
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
          
          const timeKey = medication.time;
          const hasMultipleAtSameTime = groupedByTime[timeKey]?.count > 1;
          
          if (!warningAlertExists) {
            const alertId = `${medicationId}-warning-${now.toISOString()}`;
            const newAlert: MedicationAlert = {
              id: alertId,
              title: hasMultipleAtSameTime 
                ? `Multiple Medications Due Soon`
                : 'Medication Due Soon',
              body: hasMultipleAtSameTime
                ? `${groupedByTime[timeKey].count} medications due in 1 minute`
                : `${medication.medicineName} for patient in room ${medication.roomNumber} due in 1 minute`,
              timestamp: Date.now(),
              priority: 'medium',
              acknowledged: false
            };
            
            console.log('Creating medication warning alert:', newAlert);
            setActiveAlerts(prev => [...prev, newAlert]);
            
            toast({
              title: hasMultipleAtSameTime ? 'Multiple Medications Due Soon' : 'Medication Due Soon',
              description: hasMultipleAtSameTime
                ? `${groupedByTime[timeKey].count} medications due in 1 minute`
                : `${medication.medicineName} for patient in room ${medication.roomNumber} due in 1 minute`,
              variant: 'default',
            });
          }
        }
      });
    };
    
    // Check immediately on mount and medication changes
    checkMedications();
    
    // Clear previous interval if it exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up a more frequent interval (every 5 seconds) for more accurate checks
    intervalRef.current = setInterval(checkMedications, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
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
    
    // Extract medication ID from alert ID
    const [medicationId] = alertId.split('-');
    return medicationId;
  }, []);
  
  const clearAlert = useCallback((alertId: string) => {
    console.log('Clearing alert:', alertId);
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);
  
  return {
    activeAlerts,
    acknowledgeAlert,
    clearAlert,
    currentTime,
    medicationsByTime
  };
};
