import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DoctorInterface from "@/components/DoctorInterface";
import NurseInterface from "@/components/NurseInterface";
import { motion } from "framer-motion";
import { Pill } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMedicationAdd = (medication: Medication) => {
    setMedications([...medications, medication]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSelectedInterface(null);
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
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Pill className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-800">
              Med Alert
            </h1>
          </motion.div>
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

  if (selectedInterface === "doctor" && !session) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button
          variant="outline"
          onClick={() => setSelectedInterface(null)}
          className="mb-6"
        >
          Back to Home
        </Button>
        <LoginForm onSuccess={() => setSession(session)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Med Alert</h1>
          </div>
          <div className="flex gap-4">
            {session && (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setSelectedInterface(null)}
            >
              Back to Home
            </Button>
          </div>
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