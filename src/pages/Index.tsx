import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DoctorInterface from "@/components/DoctorInterface";
import NurseInterface from "@/components/NurseInterface";
import { motion } from "framer-motion";
import { Pill, UserPlus } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
}

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setLoading(false);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleMedicationAdd = (medication: Medication) => {
    setMedications([...medications, medication]);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      } else {
        setSelectedInterface(null);
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedInterface) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="space-y-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Pill className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-800">Med Alert</h1>
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
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-6">
        <Button
          variant="outline"
          onClick={() => setSelectedInterface(null)}
          className="mb-6"
        >
          Back to Home
        </Button>
        <div className="max-w-md mx-auto">
          <LoginForm onSuccess={() => {
            console.log("Login successful");
            // The session will be updated automatically by the auth state listener
          }} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">
                <UserPlus className="w-4 h-4 mr-2" />
                Create New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <LoginForm onSuccess={() => {
                console.log("Signup successful");
                // The session will be updated automatically by the auth state listener
              }} isSignUp />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
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