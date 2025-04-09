
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Medication } from "@/types/medication";
import { useMedicationHistory } from "@/hooks/use-medication-history";
import { useToast } from "@/hooks/use-toast";

interface MedicationCardActionsProps {
  medication: Medication;
  onComplete: (medication: Medication) => void;
  showDeleteButton?: boolean;
}

export function MedicationCardActions({ 
  medication, 
  onComplete,
  showDeleteButton = true
}: MedicationCardActionsProps) {
  const { recordMedicationTaken, recordMedicationMissed, loading } = useMedicationHistory();
  const { toast } = useToast();
  
  const handleComplete = async () => {
    try {
      // Record this in the medication history with the exact current time
      const recorded = await recordMedicationTaken(medication);
      
      console.log("Medication recorded as taken:", recorded);
      
      // If successfully recorded in history, mark as complete in main medications table
      if (recorded) {
        onComplete(medication);
      }
    } catch (error) {
      console.error("Error completing medication:", error);
      toast({
        title: "Error",
        description: "Failed to mark medication as completed",
        variant: "destructive",
      });
    }
  };
  
  const handleMissed = async () => {
    try {
      // Record this medication as missed with the current timestamp
      await recordMedicationMissed(medication);
    } catch (error) {
      console.error("Error marking medication as missed:", error);
      toast({
        title: "Error",
        description: "Failed to mark medication as missed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2 justify-end px-4 pb-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="border-red-200 hover:bg-red-100 hover:text-red-700 space-x-1"
        onClick={handleMissed}
        disabled={loading || medication.completed}
      >
        <X className="h-4 w-4" />
        <span>Missed</span>
      </Button>
      
      <Button 
        size="sm" 
        className="bg-green-500 hover:bg-green-600 space-x-1"
        onClick={handleComplete}
        disabled={loading || medication.completed}
      >
        <Check className="h-4 w-4" />
        <span>Complete</span>
      </Button>
    </div>
  );
}
