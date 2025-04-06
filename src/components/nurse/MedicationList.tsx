
import MedicationCard from "../medication/MedicationCard";
import { Medication } from "@/types/medication";
import { motion } from "framer-motion";

interface MedicationListProps {
  medications: Medication[];
  getTimeStatus: (medicationTime: string) => "past" | "upcoming" | "future";
  onComplete: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  viewMode: 'grid' | 'compact';
}

export function MedicationList({ 
  medications, 
  getTimeStatus,
  onComplete,
  onDelete,
  viewMode 
}: MedicationListProps) {
  // Sort medications by time
  const sortedMedications = [...medications].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by time
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    
    // Compare hours
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0];
    }
    
    // Compare minutes if hours are the same
    return timeA[1] - timeB[1];
  });

  if (viewMode === 'compact') {
    return (
      <motion.div 
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {sortedMedications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            timeStatus={getTimeStatus(medication.time)}
            onComplete={() => onComplete(medication)}
            onDelete={() => onDelete(medication)}
            compact={true}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sortedMedications.map((medication) => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          timeStatus={getTimeStatus(medication.time)}
          onComplete={() => onComplete(medication)}
          onDelete={() => onDelete(medication)}
        />
      ))}
    </div>
  );
}
