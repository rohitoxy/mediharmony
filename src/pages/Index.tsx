
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DoctorInterface from "@/components/DoctorInterface";
import NurseInterface from "@/components/NurseInterface";
import { motion } from "framer-motion";
import { Pill, UserPlus, LogOut, Home, Stethoscope, User } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedInterface) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center" />
        <div className="space-y-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-3 mb-8"
          >
            <div className="bg-white p-6 rounded-full shadow-lg">
              <Pill className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mt-4">Med Alert</h1>
            <p className="text-muted-foreground text-lg">Efficient Medication Management System</p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                className="w-64 h-20 text-lg shadow-lg bg-primary hover:bg-primary/90 gap-3"
                onClick={() => setSelectedInterface("doctor")}
              >
                <Stethoscope className="w-6 h-6" />
                Doctor Interface
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                className="w-64 h-20 text-lg shadow-lg bg-accent hover:bg-accent/90 gap-3"
                onClick={() => setSelectedInterface("nurse")}
              >
                <User className="w-6 h-6" />
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
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-6 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&auto=format&fit=crop&q=60')] opacity-5 bg-cover bg-center" />
        <Button
          variant="outline"
          onClick={() => setSelectedInterface(null)}
          className="mb-6 gap-2 relative z-10"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
        <div className="max-w-md mx-auto relative z-10">
          <LoginForm onSuccess={() => {
            console.log("Login successful");
          }} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4 gap-2">
                <UserPlus className="w-4 h-4" />
                Create New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <LoginForm onSuccess={() => {
                console.log("Signup successful");
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
          <div className="flex items-center gap-3">
            <div className="bg-white p-3 rounded-full shadow-md">
              <Pill className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Med Alert</h1>
          </div>
          <div className="flex gap-4">
            {session && (
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setSelectedInterface(null)}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
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
