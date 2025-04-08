
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/types/medication";

export const useMedications = (initialMedications: Medication[]) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setMedications(initialMedications);
  }, [initialMedications]);

  const handleComplete = async (medication: Medication) => {
    try {
      console.log("Completing medication with ID:", medication.id);
      
      const { error } = await supabase
        .from('medications')
        .update({ completed: true })
        .eq('id', medication.id);

      if (error) throw error;

      setMedications(meds => 
        meds.map(med => 
          med.id === medication.id ? { ...med, completed: true } : med
        )
      );

      toast({
        title: "Success",
        description: "Medication marked as completed",
      });
    } catch (error) {
      console.error('Error completing medication:', error);
      toast({
        title: "Error",
        description: "Failed to mark medication as completed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (medication: Medication) => {
    try {
      console.log("Deleting medication with ID:", medication.id);
      
      // First, delete any related records in the medication_history table
      const { error: historyDeleteError } = await supabase
        .from('medication_history')
        .delete()
        .eq('medication_id', medication.id);

      if (historyDeleteError) {
        console.error('Error deleting medication history records:', historyDeleteError);
        throw historyDeleteError;
      }
      
      // Now delete the medication itself
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medication.id);

      if (error) throw error;

      // Update local state to remove the deleted medication
      setMedications(meds => meds.filter(med => med.id !== medication.id));

      toast({
        title: "Success",
        description: "Medication deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
    }
  };

  return {
    medications,
    handleComplete,
    handleDelete,
  };
};
