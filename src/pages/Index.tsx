
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
import { Medication } from "@/types/medication";
import { useMedicationHistory } from "@/hooks/use-medication-history";
import { PatientStatistics } from "@/components/landing/PatientStatistics";

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const { scheduleMedicationDoses } = useMedicationHistory();

  // Auto-refresh medications every minute to ensure multi-day medications appear
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);
      
      if (!session) {
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
      // Always fetch scheduled medications for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      try {
        // First, fetch all scheduled doses for today from medication_history
        const { data: scheduledDoses, error: dosesError } = await supabase
          .from('medication_history')
          .select('*')
          .eq('status', 'scheduled')
          .gte('scheduled_time', today.toISOString())
          .lt('scheduled_time', tomorrow.toISOString())
          .order('scheduled_time', { ascending: true });
          
        if (dosesError) throw dosesError;
        
        // Then fetch all medications
        const { data: medicationsData, error: medicationsError } = await supabase
          .from('medications')
          .select('*');
          
        if (medicationsError) throw medicationsError;
        
        // Create a map of medication_id to determine which ones need to be shown today
        const activeMedicationIds = new Set();
        scheduledDoses?.forEach(dose => {
          activeMedicationIds.add(dose.medication_id);
        });
        
        // Map all medications, but mark only those with scheduled doses for today as not completed
        const mappedMedications: Medication[] = medicationsData.map(med => ({
          id: med.id,
          patientId: med.patient_id,
          medicineName: med.medicine_name,
          roomNumber: med.room_number,
          durationDays: med.duration_days,
          foodTiming: med.food_timing,
          time: med.notification_time,
          dosage: med.dosage,
          notes: med.notes || undefined,
          completed: activeMedicationIds.has(med.id) ? false : (med.completed || false),
          priority: (med.priority as 'high' | 'medium' | 'low') || 'medium',
          medicineType: med.medicine_type as 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops' || 'pill',
          frequency: med.frequency || 'once',
          specificTimes: med.specific_times ? JSON.parse(med.specific_times) : [],
        }));
        
        setMedications(mappedMedications);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch medications",
          variant: "destructive",
        });
      }
    };

    if (selectedInterface) {
      fetchMedications();
    }
  }, [session, toast, selectedInterface, refreshTrigger]);

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
            priority: medication.priority || 'medium',
            medicine_type: medication.medicineType || 'pill',
            frequency: medication.frequency || 'once',
            specific_times: medication.specificTimes && medication.specificTimes.length > 0 
              ? JSON.stringify(medication.specificTimes) 
              : null,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newMedication: Medication = {
          id: data.id,
          patientId: data.patient_id,
          medicineName: data.medicine_name,
          roomNumber: data.room_number,
          durationDays: data.duration_days,
          foodTiming: data.food_timing,
          time: data.notification_time,
          dosage: data.dosage,
          notes: data.notes || undefined,
          completed: data.completed || false,
          priority: (data.priority as 'high' | 'medium' | 'low') || 'medium',
          medicineType: (data.medicine_type as 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops') || 'pill',
          frequency: data.frequency || 'once',
          specificTimes: data.specific_times ? JSON.parse(data.specific_times) : [],
        };
        setMedications([...medications, newMedication]);
        
        await scheduleMedicationDoses(newMedication);
        
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container py-8">
          <LandingPage onInterfaceSelect={setSelectedInterface} />
          <PatientStatistics />
        </div>
      </div>
    );
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
