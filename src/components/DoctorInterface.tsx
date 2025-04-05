
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Medication } from "@/types/medication";
import DoctorTabs from "@/components/doctor/DoctorTabs";
import MedicationForm from "@/components/doctor/MedicationForm";
import MedicationHistory from "@/components/doctor/MedicationHistory";
import PatientReport from "@/components/doctor/PatientReport";
import { useMedicationHistory } from "@/hooks/use-medication-history";

const DoctorInterface = ({ onMedicationAdd }: { onMedicationAdd: (medication: Medication) => void }) => {
  const [activeTab, setActiveTab] = useState("add-medication");
  const { scheduleMedicationDoses } = useMedicationHistory();
  const { toast } = useToast();
  
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
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <DoctorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "add-medication" && (
        <MedicationForm onMedicationAdd={handleMedicationAdd} />
      )}
      
      {activeTab === "medication-history" && (
        <MedicationHistory />
      )}
      
      {activeTab === "patient-report" && (
        <PatientReport />
      )}
    </div>
  );
};

export default DoctorInterface;
