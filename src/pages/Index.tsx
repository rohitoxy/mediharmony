
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import DoctorInterface from "@/components/DoctorInterface";
import NurseInterface from "@/components/NurseInterface";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LandingPage from "@/components/landing/LandingPage";
import AuthPage from "@/components/auth/AuthPage";
import AppHeader from "@/components/app/AppHeader";

export interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  dosage: string;
  durationDays: number;
  foodTiming: string;
  time: string;
  notes?: string;
  completed?: boolean;
}

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      
      if (!session) {
        // Clear any user-specific state when logged out
        setMedications([]);
        setSelectedInterface(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchMedications = async () => {
      if (!session) return; // Don't fetch if not logged in

      const { data, error } = await supabase
        .from('medications')
        .select('*');

      if (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch medications",
          variant: "destructive",
        });
      } else if (data) {
        const mappedMedications: Medication[] = data.map(med => ({
          id: med.id,
          patientId: med.patient_id,
          medicineName: med.medicine_name,
          roomNumber: med.room_number,
          durationDays: med.duration_days,
          foodTiming: med.food_timing,
          time: med.notification_time,
          dosage: med.dosage,
          notes: med.notes || undefined,
          completed: med.completed || false,
        }));
        setMedications(mappedMedications);
      }
    };

    fetchMedications();
  }, [session, toast]);

  const handleMedicationAdd = async (medication: Medication) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([
          {
            patient_id: medication.patientId,
            room_number: medication.roomNumber,
            medicine_name: medication.medicineName,
            dosage: medication.dosage,
            duration_days: medication.durationDays,
            food_timing: medication.foodTiming,
            notification_time: medication.time,
            notes: medication.notes || null,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newMedication: Medication = {
          ...medication,
          id: data.id,
          completed: false,
        };
        setMedications([...medications, newMedication]);
        toast({
          title: "Success",
          description: "Medication added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      } else {
        setSession(null);
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
    } finally {
      setLoading(false);
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
    return <LandingPage onInterfaceSelect={setSelectedInterface} />;
  }

  if (selectedInterface === "doctor" && !session) {
    return <AuthPage onBack={() => setSelectedInterface(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container py-8">
        <AppHeader 
          onLogout={handleLogout}
          onBack={() => setSelectedInterface(null)}
          showLogout={!!session}
        />
        
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
