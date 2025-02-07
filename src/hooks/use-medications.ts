
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/pages/Index";

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
      
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medication.id);

      if (error) throw error;

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
