
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Medication } from "@/types/medication";
import DoctorTabs from "@/components/doctor/DoctorTabs";
import MedicationForm from "@/components/doctor/MedicationForm";
import MedicationHistory from "@/components/doctor/MedicationHistory";
import PatientReport from "@/components/doctor/PatientReport";

const DoctorInterface = ({ onMedicationAdd }: { onMedicationAdd: (medication: Medication) => void }) => {
  const [activeTab, setActiveTab] = useState("add-medication");
  
  return (
    <div className="max-w-4xl mx-auto">
      <DoctorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "add-medication" && (
        <MedicationForm onMedicationAdd={onMedicationAdd} />
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
