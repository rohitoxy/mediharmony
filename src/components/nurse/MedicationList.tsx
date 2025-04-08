
import { Calendar } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Medication } from "@/types/medication";
import MedicationCard from "../medication/MedicationCard";

interface MedicationListProps {
  medications: Medication[];
  getTimeStatus: (time: string) => "past" | "upcoming" | "future";
  onComplete: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  viewMode?: 'grid' | 'compact';
}

export const MedicationList = ({
  medications,
  getTimeStatus,
  onComplete,
  onDelete,
  viewMode = 'grid'
}: MedicationListProps) => {
  if (medications.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg shadow-sm border border-border/30">
        <div className="bg-muted inline-flex p-4 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No medications found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          There are no medications scheduled. Check back later.
        </p>
      </div>
    );
  }

  // Helper function to get priority weight for sorting
  const getPriorityWeight = (priority?: 'high' | 'medium' | 'low'): number => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2; // Default to medium priority
    }
  };

  // Sort medications by priority (high to low) and then by time
  const sortedMedications = [...medications].sort((a, b) => {
    // First sort by whether the medication is due now
    const aIsUpcoming = getTimeStatus(a.time) === "upcoming";
    const bIsUpcoming = getTimeStatus(b.time) === "upcoming";
    
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;
    
    // Then sort by priority
    const aPriority = getPriorityWeight(a.priority);
    const bPriority = getPriorityWeight(b.priority);
    
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    // Finally sort by time
    return a.time.localeCompare(b.time);
  });

  // Determine grid classes based on view mode
  const gridClasses = viewMode === 'grid' 
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4" 
    : "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2";

  return (
    <AnimatePresence>
      <div className={gridClasses}>
        {sortedMedications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            timeStatus={getTimeStatus(medication.time)}
            onComplete={() => onComplete(medication)}
            onDelete={() => onDelete(medication)}
            compact={viewMode === 'compact'}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};
