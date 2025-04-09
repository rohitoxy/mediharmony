
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

      if (error) {
        console.error('Error completing medication:', error);
        throw error;
      }

      // Update local state to reflect the change
      setMedications(meds => 
        meds.map(med => 
          med.id === medication.id ? { ...med, completed: true } : med
        )
      );

      toast({
        title: "Success",
        description: "Medication marked as completed",
      });
      
      // Return the updated medication to propagate changes
      return {...medication, completed: true};
      
    } catch (error) {
      console.error('Error completing medication:', error);
      toast({
        title: "Error",
        description: "Failed to mark medication as completed",
        variant: "destructive",
      });
      return medication;
    }
  };

  return {
    medications,
    handleComplete,
  };
};
