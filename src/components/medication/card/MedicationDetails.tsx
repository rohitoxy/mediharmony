
import { Calendar, Utensils, FileText, Pill } from "lucide-react";

interface MedicationDetailsProps {
  medicineName: string;
  dosage: string;
  durationDays: number;
  foodTiming: string;
  notes?: string;
}

export const MedicationDetails = ({ 
  medicineName,
  dosage, 
  durationDays, 
  foodTiming, 
  notes 
}: MedicationDetailsProps) => {
  // Function to determine timing icon based on food timing
  const renderFoodTimingIcon = (foodTiming: string) => {
    switch(foodTiming) {
      case "before":
        return <span className="text-orange-500">Before</span>;
      case "with":
        return <span className="text-green-500">With</span>;
      case "after":
        return <span className="text-blue-500">After</span>;
      default:
        return <span className="text-gray-500">{foodTiming}</span>;
    }
  };

  return (
    <div className="space-y-4 mt-3">
      {/* Medication Details */}
      <div className="space-y-2 text-sm text-foreground bg-background/50 p-3 rounded-md">
        <div className="flex items-center">
          <Pill className="w-3 h-3 mr-2 text-primary" />
          <p>Dosage: <span className="font-medium">{dosage}</span></p>
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-2 text-primary" />
          <p>Duration: <span className="font-medium">{durationDays} days</span></p>
        </div>
        <div className="flex items-center">
          <Utensils className="w-3 h-3 mr-2 text-primary" />
          <p>Timing: {renderFoodTimingIcon(foodTiming)} food</p>
        </div>
      </div>

      {/* Notes Section */}
      {notes && (
        <div className="bg-yellow-50 p-3 rounded-md border-l-2 border-yellow-300">
          <div className="flex items-start">
            <FileText className="w-3 h-3 mr-2 text-yellow-600 mt-0.5" />
            <p className="text-sm text-gray-600">{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};
