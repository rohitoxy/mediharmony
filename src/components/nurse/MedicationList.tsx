
import { Calendar } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Medication } from "@/types/medication";
import MedicationCard from "../medication/MedicationCard";

interface MedicationListProps {
  medications: Medication[];
  getTimeStatus: (time: string) => "past" | "upcoming" | "future";
  onComplete: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

export const MedicationList = ({
  medications,
  getTimeStatus,
  onComplete,
  onDelete
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

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            timeStatus={getTimeStatus(medication.time)}
            onComplete={() => onComplete(medication)}
            onDelete={() => onDelete(medication)}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};
