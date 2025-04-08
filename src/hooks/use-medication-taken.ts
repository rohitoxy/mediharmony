
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Medication } from "@/types/medication";
import { 
  getExistingScheduledRecord, 
  updateRecordAsTaken, 
  createTakenRecord,
  updateMedicationStatus
} from "@/services/medication-history-service";

export const useMedicationTaken = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const recordMedicationTaken = async (medication: Medication) => {
    try {
      setLoading(true);
      
      // Store the exact current time when the medication is acknowledged
      const currentTime = new Date().toISOString();
      
      // First check if there's already a record for this medication and time
      const existingRecords = await getExistingScheduledRecord(medication.id);
      
      // If there's an existing scheduled record, update it
      if (existingRecords && existingRecords.length > 0) {
        const record = existingRecords[0];
        
        console.log("Updating existing record:", record.id);
        
        await updateRecordAsTaken(record.id, currentTime);
        
        // Also update the medication's completed status in the medications table
        await updateMedicationStatus(medication.id, true);
        
        toast({
          title: "Success",
          description: "Medication marked as taken",
        });
        
        return true;
      } else {
        // Create a new record
        await createTakenRecord(medication, currentTime);
        
        // Also update the medication's completed status in the medications table
        await updateMedicationStatus(medication.id, true);
        
        toast({
          title: "Success",
          description: "Medication recorded as taken",
        });
        
        return true;
      }
      
    } catch (error) {
      console.error('Error recording medication taken:', error);
      toast({
        title: "Error",
        description: "Failed to record medication as taken",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recordMedicationTaken
  };
};
