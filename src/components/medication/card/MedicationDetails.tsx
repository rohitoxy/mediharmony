
import { Calendar, Utensils, FileText, Pill, Syringe, Droplets, Wind, Paintbrush, Heart, Clock } from "lucide-react";

interface MedicationDetailsProps {
  medicineName: string;
  dosage: string;
  durationDays: number;
  foodTiming: string;
  notes?: string;
  medicineType?: 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops';
  frequency?: string;
  specificTimes?: string[];
}

export const MedicationDetails = ({ 
  medicineName,
  dosage, 
  durationDays, 
  foodTiming, 
  notes,
  medicineType = 'pill',
  frequency,
  specificTimes = []
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

  // Function to get the medicine type icon
  const getMedicineTypeIcon = (type: string) => {
    switch(type) {
      case 'pill':
        return <Pill className="w-3 h-3 mr-2 text-blue-500" />;
      case 'injection':
        return <Syringe className="w-3 h-3 mr-2 text-red-500" />;
      case 'liquid':
        return <Droplets className="w-3 h-3 mr-2 text-teal-500" />;
      case 'inhaler':
        return <Wind className="w-3 h-3 mr-2 text-purple-500" />;
      case 'topical':
        return <Paintbrush className="w-3 h-3 mr-2 text-amber-500" />;
      case 'drops':
        return <Heart className="w-3 h-3 mr-2 text-pink-500" />;
      default:
        return <Pill className="w-3 h-3 mr-2 text-primary" />;
    }
  };

  // Convert frequency to human-readable text
  const getFrequencyText = (freq?: string) => {
    if (!freq) return "As directed";
    
    switch(freq) {
      case "once": return "Once a day";
      case "twice": return "Twice a day";
      case "three": return "Three times a day";
      case "four": return "Four times a day";
      case "custom": return "Custom schedule";
      default: return freq;
    }
  };

  return (
    <div className="space-y-4 mt-3">
      {/* Medication Details */}
      <div className="space-y-2 text-sm text-foreground bg-background/50 p-3 rounded-md">
        <div className="flex items-center">
          {getMedicineTypeIcon(medicineType)}
          <p>Type: <span className="font-medium capitalize">{medicineType}</span></p>
        </div>
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
        {frequency && (
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-2 text-primary" />
            <p>Frequency: <span className="font-medium">{getFrequencyText(frequency)}</span></p>
          </div>
        )}
      </div>

      {/* Specific Times Section */}
      {specificTimes && specificTimes.length > 0 && (
        <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
          <p className="text-xs font-medium mb-2 text-primary">Scheduled times:</p>
          <div className="flex flex-wrap gap-1.5">
            {specificTimes.map((time, index) => (
              <div key={index} className="bg-primary/10 rounded-full px-2 py-0.5 text-xs flex items-center text-primary">
                <Clock className="w-2 h-2 mr-1" />
                {time}
              </div>
            ))}
          </div>
        </div>
      )}

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
