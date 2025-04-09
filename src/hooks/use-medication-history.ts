
import { useState, useEffect } from "react";
import { supabase, MedicationHistoryRow } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Medication } from "@/types/medication";

export interface MedicationHistoryItem extends MedicationHistoryRow {}

export const useMedicationHistory = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Function to record when a medication is taken
  const recordMedicationTaken = async (medication: Medication) => {
    try {
      setLoading(true);
      
      // Store the exact current time when the medication is acknowledged
      const currentTime = new Date().toISOString();
      
      // First check if there's already a record for this medication and time
      const { data: existingRecords, error: checkError } = await supabase
        .from('medication_history')
        .select('*')
        .eq('medication_id', medication.id)
        .eq('status', 'scheduled')
        .order('scheduled_time', { ascending: false })
        .limit(1);
      
      if (checkError) throw checkError;
      
      // Cast the data to our known type
      const typedExistingRecords = existingRecords as unknown as MedicationHistoryRow[];
      
      // If there's an existing scheduled record, update it
      if (typedExistingRecords && typedExistingRecords.length > 0) {
        const record = typedExistingRecords[0];
        
        console.log("Updating existing record:", record.id);
        
        const { error: updateError } = await supabase
          .from('medication_history')
          .update({
            status: 'taken',
            taken_time: currentTime
          })
          .eq('id', record.id);
        
        if (updateError) {
          console.error("Error updating medication history:", updateError);
          throw updateError;
        }
        
        // Also update the medication's completed status in the medications table
        const { error: updateMedicationError } = await supabase
          .from('medications')
          .update({
            completed: true
          })
          .eq('id', medication.id);
          
        if (updateMedicationError) {
          console.error('Error updating medication status:', updateMedicationError);
          throw updateMedicationError;
        }
        
        toast({
          title: "Success",
          description: "Medication marked as taken",
        });
        
        return true;
      } else {
        // Create a new record
        const { error: insertError } = await supabase
          .from('medication_history')
          .insert([{
            medication_id: medication.id,
            patient_id: medication.patientId,
            medicine_name: medication.medicineName,
            dosage: medication.dosage,
            scheduled_time: currentTime,
            taken_time: currentTime,
            status: 'taken',
            notes: `Medication taken at ${new Date().toLocaleTimeString()}`
          }]);
        
        if (insertError) {
          console.error("Error inserting medication history:", insertError);
          throw insertError;
        }
        
        // Also update the medication's completed status in the medications table
        const { error: updateMedicationError } = await supabase
          .from('medications')
          .update({
            completed: true
          })
          .eq('id', medication.id);
          
        if (updateMedicationError) {
          console.error('Error updating medication status:', updateMedicationError);
          throw updateMedicationError;
        }
        
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
  
  // Function to record when a medication is missed
  const recordMedicationMissed = async (medication: Medication) => {
    try {
      setLoading(true);
      
      // First check if there's already a record for this medication
      const { data: existingRecords, error: checkError } = await supabase
        .from('medication_history')
        .select('*')
        .eq('medication_id', medication.id)
        .eq('status', 'scheduled')
        .order('scheduled_time', { ascending: false })
        .limit(1);
      
      if (checkError) throw checkError;
      
      // Cast the data to our known type
      const typedExistingRecords = existingRecords as unknown as MedicationHistoryRow[];
      
      // If there's an existing scheduled record, update it
      if (typedExistingRecords && typedExistingRecords.length > 0) {
        const record = typedExistingRecords[0];
        
        const { error: updateError } = await supabase
          .from('medication_history')
          .update({
            status: 'missed',
            notes: `Medication missed at ${new Date().toLocaleTimeString()}`
          })
          .eq('id', record.id);
        
        if (updateError) {
          console.error("Error updating medication history:", updateError);
          throw updateError;
        }
        
        // Also update the medication's completed status in the medications table
        const { error: updateMedicationError } = await supabase
          .from('medications')
          .update({
            completed: true
          })
          .eq('id', medication.id);
          
        if (updateMedicationError) {
          console.error('Error updating medication status for missed medication:', updateMedicationError);
          throw updateMedicationError;
        }
        
        toast({
          title: "Recorded",
          description: "Medication marked as missed",
        });
        
        return true;
      } else {
        // Create a new record
        const { error: insertError } = await supabase
          .from('medication_history')
          .insert([{
            medication_id: medication.id,
            patient_id: medication.patientId,
            medicine_name: medication.medicineName,
            dosage: medication.dosage,
            scheduled_time: new Date().toISOString(),
            taken_time: null,
            status: 'missed',
            notes: `Medication missed at ${new Date().toLocaleTimeString()}`
          }]);
        
        if (insertError) {
          console.error("Error inserting medication history:", insertError);
          throw insertError;
        }
        
        // Also update the medication's completed status in the medications table
        const { error: updateMedicationError } = await supabase
          .from('medications')
          .update({
            completed: true
          })
          .eq('id', medication.id);
          
        if (updateMedicationError) {
          console.error('Error updating medication status for missed medication:', updateMedicationError);
          throw updateMedicationError;
        }
        
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
  
  // Function to schedule medication doses for a newly added medication
  const scheduleMedicationDoses = async (medication: Medication) => {
    try {
      setLoading(true);
      
      const scheduledDoses = [];
      const now = new Date();
      
      // Schedule doses for the duration of the medication
      for (let day = 0; day < medication.durationDays; day++) {
        // For each specific time in the medication
        for (const timeStr of medication.specificTimes || [medication.time]) {
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          const doseDate = new Date(now);
          doseDate.setDate(now.getDate() + day);
          doseDate.setHours(hours, minutes, 0, 0);
          
          // Only schedule future doses
          if (doseDate > now) {
            scheduledDoses.push({
              medication_id: medication.id,
              patient_id: medication.patientId,
              medicine_name: medication.medicineName,
              dosage: medication.dosage,
              scheduled_time: doseDate.toISOString(),
              status: 'scheduled',
              notes: `${medication.medicineType} ${medication.foodTiming} food`
            });
          }
        }
      }
      
      if (scheduledDoses.length > 0) {
        const { error } = await supabase
          .from('medication_history')
          .insert(scheduledDoses as any);
        
        if (error) throw error;
        
        console.log(`Scheduled ${scheduledDoses.length} doses for medication ${medication.id}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error scheduling medication doses:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    recordMedicationTaken,
    recordMedicationMissed,
    scheduleMedicationDoses
  };
};
