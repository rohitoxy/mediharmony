import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DoctorInterface from "@/components/DoctorInterface";
import NurseInterface from "@/components/NurseInterface";
import { motion } from "framer-motion";

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
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);

  const handleMedicationAdd = (medication: Medication) => {
    setMedications([...medications, medication]);
  };

  if (!selectedInterface) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)"
        }}
      >
        <div className="space-y-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Medicine Reminder
          </motion.h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                className="w-48 h-16 text-lg shadow-lg bg-primary hover:bg-primary/90"
                onClick={() => setSelectedInterface("doctor")}
              >
                Doctor Interface
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                className="w-48 h-16 text-lg shadow-lg bg-accent hover:bg-accent/90"
                onClick={() => setSelectedInterface("nurse")}
              >
                Nurse Interface
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Medicine Reminder</h1>
          <Button
            variant="outline"
            onClick={() => setSelectedInterface(null)}
          >
            Back to Home
          </Button>
        </div>
        
        <Tabs value={selectedInterface} className="w-full">
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