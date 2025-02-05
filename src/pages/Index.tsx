import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorInterface from "@/components/DoctorInterface";
import NurseInterface from "@/components/NurseInterface";

interface Medication {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  time: string;
  notes: string;
}

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([]);

  const handleMedicationAdd = (medication: Medication) => {
    setMedications([...medications, medication]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Medicine Reminder</h1>
        
        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="doctor">Doctor Interface</TabsTrigger>
            <TabsTrigger value="nurse">Nurse Interface</TabsTrigger>
          </TabsList>
          
          <TabsContent value="doctor" className="mt-0">
            <DoctorInterface onMedicationAdd={handleMedicationAdd} />
          </TabsContent>
          
          <TabsContent value="nurse" className="mt-0">
            <NurseInterface medications={medications} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;