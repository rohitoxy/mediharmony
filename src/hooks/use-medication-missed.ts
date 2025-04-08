
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Medication } from "@/types/medication";
import { 
  getExistingScheduledRecord,
  updateRecordAsMissed,
  createMissedRecord,
  updateMedicationStatus
} from "@/services/medication-history-service";

export const useMedicationMissed = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const recordMedicationMissed = async (medication: Medication) => {
    try {
      setLoading(true);
      
      // First check if there's already a record for this medication
      const existingRecords = await getExistingScheduledRecord(medication.id);
      
      // If there's an existing scheduled record, update it
      if (existingRecords && existingRecords.length > 0) {
        const record = existingRecords[0];
        
        await updateRecordAsMissed(record.id);
        
        // Also update the medication's completed status in the medications table
        await updateMedicationStatus(medication.id, true);
        
        toast({
          title: "Recorded",
          description: "Medication marked as missed",
        });
        
        return true;
      } else {
        // Create a new record
        await createMissedRecord(medication);
        
        // Also update the medication's completed status in the medications table
        await updateMedicationStatus(medication.id, true);
        
        toast({
          title: "Recorded",
          description: "Medication recorded as missed",
        });
        
        return true;
      }
      
    } catch (error) {
      console.error('Error recording medication missed:', error);
      toast({
        title: "Error",
        description: "Failed to record medication as missed",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recordMedicationMissed
  };
};
