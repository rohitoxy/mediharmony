
import { Card } from "@/components/ui/card";
import { Check, Pill, Syringe, Droplets, Wind, Paintbrush, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MedicationCardHeader } from "./card/MedicationCardHeader";
import { MedicationCardContent } from "./card/MedicationCardContent";
import { MedicationCardActions } from "./card/MedicationCardActions";
import { MedicationDetails } from "./card/MedicationDetails";
import { 
  getMedicationColor,
  getIconBackgroundColor, 
  getPriorityBorderColor,
  getStatusIndicatorColor
} from "./card/style-utils";

interface MedicationCardProps {
  medication: {
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
    priority?: 'high' | 'medium' | 'low';
    medicineType?: 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops';
    frequency?: string;
    specificTimes?: string[];
  };
  timeStatus: "past" | "upcoming" | "future";
  onComplete: () => void;
  onDelete: () => void;
  compact?: boolean;
  showDeleteButton?: boolean;
}

const MedicationCard = ({ 
  medication, 
  timeStatus, 
  onComplete, 
  onDelete, 
  compact = false,
  showDeleteButton = true 
}: MedicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAlertActive = timeStatus === "upcoming" && !medication.completed;
  
  // Get priority or default to medium
  const priority = medication.priority || 'medium';
  
  // Get medicine type or default to pill
  const medicineType = medication.medicineType || 'pill';

  // Get styled colors
  const medicationColor = getMedicationColor(
    !!medication.completed, 
    isAlertActive, 
    timeStatus, 
    priority
  );
  
  const iconBgColor = getIconBackgroundColor(
    !!medication.completed,
    isAlertActive,
    priority
  );
  
  const borderColor = getPriorityBorderColor(!!medication.completed, priority);
  const statusIndicatorColor = getStatusIndicatorColor(!!medication.completed, timeStatus, priority);

  // Function to get medicine type icon component
  const getMedicineTypeIcon = () => {
    switch(medicineType) {
      case 'injection': return <Syringe className="w-4 h-4 text-red-500" />;
      case 'liquid': return <Droplets className="w-4 h-4 text-teal-500" />;
      case 'inhaler': return <Wind className="w-4 h-4 text-purple-500" />;
      case 'topical': return <Paintbrush className="w-4 h-4 text-amber-500" />;
      case 'drops': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'pill':
      default: return <Pill className="w-4 h-4 text-blue-500" />;
    }
  };

  if (compact) {
    // Compact theater-style view
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <div 
          className={`relative shadow-sm overflow-hidden rounded-md cursor-pointer 
            ${medication.completed ? 'bg-gray-100' : iconBgColor} 
            ${isAlertActive ? 'ring-2 ring-red-500' : ''}
            h-20 m-1
          `}
        >
          {/* Status indicator strip */}
          <div className={`absolute top-0 left-0 w-full h-1 ${statusIndicatorColor}`} />
          
          <MedicationCardActions 
            id={medication.id}
            completed={medication.completed}
            isAlertActive={isAlertActive}
            onComplete={onComplete}
            onDelete={onDelete}
            showDeleteButton={showDeleteButton}
            compact={true}
            medication={medication}
          />

          <div className="flex flex-col items-center justify-center p-2 h-full">
            <div className="font-semibold text-xs text-center truncate w-full flex items-center justify-center gap-1">
              {getMedicineTypeIcon()}
              {medication.medicineName}
            </div>
            <div className="text-xs text-gray-600 mb-1">
              {medication.time}
            </div>
            <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 border border-gray-200">
              Room {medication.roomNumber}
            </div>
            
            {medication.completed && (
              <div className="absolute bottom-0 left-0 right-0 bg-green-500 h-1"></div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular card view
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className={`relative shadow-md transition-all duration-300 bg-card overflow-hidden border ${borderColor}
          ${medication.completed ? 'bg-gray-50/50' : ''}
          ${isAlertActive ? 'shadow-lg ring-2 ring-red-500' : ''}
          ${isExpanded ? 'p-6' : 'p-4'}
        `}
      >
        {/* Status indicator strip */}
        <div className={`absolute top-0 left-0 w-1 h-full ${statusIndicatorColor}`} />

        {/* Completed Status Pill - Moved back to original position */}
        {medication.completed && (
          <div className="absolute top-4 left-4 flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3 mr-1" />
            Completed
          </div>
        )}

        {/* Top Actions - positioned in top-right corner */}
        <MedicationCardActions 
          id={medication.id}
          completed={medication.completed}
          isAlertActive={isAlertActive}
          onComplete={onComplete}
          onDelete={onDelete}
          showDeleteButton={showDeleteButton}
          medication={medication}
        />

        {/* Content - with proper spacing to avoid overlapping */}
        <div className="mt-2 pt-6">
          {/* Card Content - with proper spacing */}
          <MedicationCardHeader 
            time={medication.time}
            priority={priority}
            completed={medication.completed}
            timeStatus={timeStatus}
          />
          
          <div className={`${medication.completed ? 'mt-6' : 'mt-4'}`}>
            <MedicationCardContent
              medicineName={medication.medicineName}
              roomNumber={medication.roomNumber}
              patientId={medication.patientId}
              medicationColor={medicationColor}
              iconBgColor={iconBgColor}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              medicineTypeIcon={getMedicineTypeIcon()}
              medicationDetails={
                isExpanded && (
                  <MedicationDetails
                    medicineName={medication.medicineName}
                    dosage={medication.dosage}
                    durationDays={medication.durationDays}
                    foodTiming={medication.foodTiming}
                    notes={medication.notes}
                    medicineType={medicineType}
                    frequency={medication.frequency}
                    specificTimes={medication.specificTimes}
                  />
                )
              }
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MedicationCard;
