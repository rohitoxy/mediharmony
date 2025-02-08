
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import MedicationCard from "./medication/MedicationCard";
import { useMedications } from "@/hooks/use-medications";
import { useMedicationAlarm } from "@/hooks/use-medication-alarm";
import { useState } from "react";

interface Medication {
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

const NurseInterface = ({ medications: initialMedications }: { medications: Medication[] }) => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { medications, handleComplete, handleDelete } = useMedications(initialMedications);
  const { currentTime, isSoundEnabled, toggleSound } = useMedicationAlarm(medications);

  const getTimeStatus = (medicationTime: string) => {
    const [hours, minutes] = medicationTime.split(":");
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    if (currentHours > parseInt(hours) || 
        (currentHours === parseInt(hours) && currentMinutes > parseInt(minutes))) {
      return "past";
    }
    if (currentHours === parseInt(hours) && currentMinutes === parseInt(minutes)) {
      return "upcoming";
    }
    return "future";
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Medication Schedule</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="ml-2"
          title={isSoundEnabled ? "Disable sound" : "Enable sound"}
        >
          {isSoundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            timeStatus={getTimeStatus(medication.time)}
            onComplete={() => handleComplete(medication)}
            onDelete={() => {
              setSelectedMedication(medication);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedMedication) {
                  handleDelete(selectedMedication);
                  setIsDeleteDialogOpen(false);
                  setSelectedMedication(null);
                }
              }} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NurseInterface;
