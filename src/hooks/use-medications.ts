import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  dosage: string;
  durationDays: number;
  foodTiming: string;
  time: string;
  notes: string;
  completed?: boolean;
}

export const useMedications = (initialMedications: Medication[]) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const mappedMedications = initialMedications.map(med => ({
      ...med,
      id: med.id.toString(),
    }));
    setMedications(mappedMedications);
  }, [initialMedications]);

  const handleComplete = async (medication: Medication) => {
    try {
      console.log("Completing medication with ID:", medication.id);
      
      const { data: medData, error: fetchError } = await supabase
        .from('medications')
        .select('id')
        .eq('patient_id', medication.patientId)
        .eq('room_number', medication.roomNumber)
        .eq('medicine_name', medication.medicineName)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching medication:', fetchError);
        throw fetchError;
      }

      if (!medData) {
        console.error('Medication not found in database');
        toast({
          title: "Error",
          description: "Could not find the medication in the database",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('medications')
        .update({ completed: true })
        .eq('id', medData.id);

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
      
      const { data: medData, error: fetchError } = await supabase
        .from('medications')
        .select('id')
        .eq('patient_id', medication.patientId)
        .eq('room_number', medication.roomNumber)
        .eq('medicine_name', medication.medicineName)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching medication:', fetchError);
        throw fetchError;
      }

      if (!medData) {
        console.error('Medication not found in database');
        toast({
          title: "Error",
          description: "Could not find the medication in the database",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medData.id);

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