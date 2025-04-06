
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import { Medication } from "@/types/medication";
import { useMedicationHistory } from "@/hooks/use-medication-history";
import { useToast } from "@/hooks/use-toast";

interface MedicationCardActionsProps {
  medication: Medication;
  onComplete: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

export function MedicationCardActions({ 
  medication, 
  onComplete, 
  onDelete 
}: MedicationCardActionsProps) {
  const { recordMedicationTaken, recordMedicationMissed, loading } = useMedicationHistory();
  const { toast } = useToast();
  
  const handleComplete = async () => {
    // Record this in the medication history with the exact current time
    const recorded = await recordMedicationTaken(medication);
    
    // If successfully recorded in history, mark as complete in main medications table
    if (recorded) {
      onComplete(medication);
    }
  };
  
  const handleMissed = async () => {
    // Record this medication as missed with the current timestamp
    await recordMedicationMissed(medication);
  };

  const handleDelete = () => {
    // Delete the medication
    onDelete(medication);
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

      <Button
        variant="outline"
        size="sm"
        className="border-red-300 hover:bg-red-100 hover:text-red-700"
        onClick={handleDelete}
      >
        <X className="h-4 w-4" />
        <span>Delete</span>
      </Button>
    </div>
  );
}
