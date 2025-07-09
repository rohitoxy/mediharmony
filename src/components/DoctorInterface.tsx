
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Medication } from "@/types/medication";
import DoctorTabs from "@/components/doctor/DoctorTabs";
import MedicationForm from "@/components/doctor/MedicationForm";
import MedicationHistory from "@/components/doctor/MedicationHistory";
import PatientReport from "@/components/doctor/PatientReport";
import { useMedicationHistory } from "@/hooks/use-medication-history";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  name: string;
  roomNumber: string;
}

const DoctorInterface = ({ onMedicationAdd }: { onMedicationAdd: (medication: Medication) => void }) => {
  const [activeTab, setActiveTab] = useState("add-medication");
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const [existingPatients, setExistingPatients] = useState<Patient[]>([]);
  const { scheduleMedicationDoses } = useMedicationHistory();
  const { toast } = useToast();
  
  // Load existing patients from medications
  useEffect(() => {
    const fetchExistingPatients = async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('patient_id, medicine_name, room_number')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching existing patients:', error);
        return;
      }
      
      // Create a map to deduplicate patients by ID
      const patientMap = new Map<string, Patient>();
      
      data?.forEach(med => {
        if (!patientMap.has(med.patient_id)) {
          patientMap.set(med.patient_id, {
            id: med.patient_id,
            name: med.medicine_name.split(' ')[0], // Using first part of medicine name as placeholder
            roomNumber: med.room_number
          });
        }
      });
      
      setExistingPatients(Array.from(patientMap.values()));
    };
    
    fetchExistingPatients();
  }, [historyRefreshTrigger]);
  
  const handleMedicationAdd = async (medication: Medication) => {
    // Add medication to the main application state
    onMedicationAdd(medication);
    
    // Schedule doses in the medication history
    const scheduled = await scheduleMedicationDoses(medication);
    
    if (scheduled) {
      toast({
        title: "Success",
        description: "Medication doses scheduled successfully",
      });
      // Trigger a refresh of the medication history tab and patient list
      setHistoryRefreshTrigger(prev => prev + 1);
    }
  };

  const handleMedicationDelete = async (medicationId: string) => {
    try {
      // First, delete any related records in the medication_history table
      const { error: historyDeleteError } = await supabase
        .from('medication_history')
        .delete()
        .eq('medication_id', medicationId);

      if (historyDeleteError) {
        console.error('Error deleting medication history records:', historyDeleteError);
        toast({
          title: "Error",
          description: "Failed to delete medication history records",
          variant: "destructive",
        });
        return;
      }
      
      // Wait for the history deletion to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now delete the medication itself
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medicationId);

      if (error) {
        console.error('Error deleting medication:', error);
        toast({
          title: "Error",
          description: "Failed to delete medication",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Medication deleted successfully",
      });
      
      // Trigger a refresh of the medication history tab and patient list
      setHistoryRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscriptions for medication updates
  useEffect(() => {
    console.log("Setting up real-time subscriptions for doctor interface");

    // Subscribe to medication table changes
    const medicationChannel = supabase
      .channel('medication-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medications'
        },
        (payload) => {
          console.log('Medication table change detected:', payload);
          setHistoryRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    // Subscribe to medication history table changes
    const historyChannel = supabase
      .channel('medication-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medication_history'
        },
        (payload) => {
          console.log('Medication history change detected:', payload);
          setHistoryRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscriptions");
      supabase.removeChannel(medicationChannel);
      supabase.removeChannel(historyChannel);
    };
  }, []);

  // Set up an interval to refresh as a fallback
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (activeTab === "medication-history" || activeTab === "patient-report") {
        setHistoryRefreshTrigger(prev => prev + 1);
      }
    }, 30000); // Refresh every 30 seconds as fallback

    return () => clearInterval(refreshInterval);
  }, [activeTab]);
  
  return (
    <div className="max-w-4xl mx-auto">
      <DoctorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "add-medication" && (
        <MedicationForm 
          onMedicationAdd={handleMedicationAdd} 
          existingPatients={existingPatients}
        />
      )}
      
      {activeTab === "medication-history" && (
        <MedicationHistory 
          refreshTrigger={historyRefreshTrigger} 
          onMedicationDelete={handleMedicationDelete}
        />
      )}
      
      {activeTab === "patient-report" && (
        <PatientReport refreshTrigger={historyRefreshTrigger} />
      )}
    </div>
  );
};

export default DoctorInterface;
