
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  DoorClosed, 
  Pill, 
  Check, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Utensils,
  AlertCircle,
  FileText
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

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
  };
  timeStatus: "past" | "upcoming" | "future";
  onComplete: () => void;
  onDelete: () => void;
}

const MedicationCard = ({ medication, timeStatus, onComplete, onDelete }: MedicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAlertActive = timeStatus === "upcoming" && !medication.completed;

  // Function to determine the color for the medication icon
  const getMedicationColor = () => {
    if (medication.completed) return "text-green-500";
    if (isAlertActive) return "text-red-500";
    if (timeStatus === "past") return "text-gray-400";
    return "text-primary";
  };
  
  // Function to determine timing icon based on food timing
  const renderFoodTimingIcon = () => {
    switch(medication.foodTiming) {
      case "before":
        return <span className="text-orange-500">Before</span>;
      case "with":
        return <span className="text-green-500">With</span>;
      case "after":
        return <span className="text-blue-500">After</span>;
      default:
        return <span className="text-gray-500">{medication.foodTiming}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className={`relative shadow-md transition-all duration-300 bg-card overflow-hidden border border-border/30
          ${medication.completed ? 'bg-gray-50/50' : ''}
          ${isAlertActive ? 'shadow-lg ring-2 ring-red-500' : ''}
          ${isExpanded ? 'p-6' : 'p-4'}
        `}
      >
        {/* Status indicator strip */}
        <div className={`absolute top-0 left-0 w-1 h-full 
          ${medication.completed ? 'bg-green-500' : 
            timeStatus === "upcoming" ? 'bg-red-500' : 
            timeStatus === "future" ? 'bg-primary' : 'bg-gray-300'}`} 
        />

        {/* Top Actions */}
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${medication.id}`}
              checked={medication.completed}
              onCheckedChange={onComplete}
              className={`h-4 w-4 border-2 ${isAlertActive ? 'animate-pulse' : ''}`}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 hover:bg-red-100 hover:text-red-600 rounded-full"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Card Content */}
        <div 
          className="space-y-3 mt-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-between items-center">
            <Badge
              variant="outline"
              className={`${
                medication.completed
                  ? "bg-green-100 text-green-800"
                  : timeStatus === "upcoming"
                  ? "bg-red-500 text-white animate-pulse"
                  : timeStatus === "past"
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
              } flex items-center`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {medication.time}
            </Badge>
            
            {isAlertActive && (
              <div className="flex items-center text-red-500 animate-pulse">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Due now</span>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className={`p-1.5 rounded-full ${
              medication.completed ? 'bg-green-100' : 
              isAlertActive ? 'bg-red-100' : 'bg-primary/10'
            } mr-3`}>
              <Pill className={`w-4 h-4 ${getMedicationColor()}`} />
            </div>
            <span className="text-sm font-medium truncate">{medication.medicineName}</span>
          </div>

          {!isExpanded ? (
            <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
              <div className="flex items-center">
                <DoorClosed className="w-3 h-3 mr-1" />
                <span>Room {medication.roomNumber}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4 mt-3">
              {/* Patient & Room Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-foreground bg-background/50 p-2 rounded-md">
                  <div className="bg-primary/10 p-1 rounded-full mr-2">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">ID: {medication.patientId}</span>
                </div>
                <div className="flex items-center text-foreground bg-background/50 p-2 rounded-md">
                  <div className="bg-primary/10 p-1 rounded-full mr-2">
                    <DoorClosed className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">Room: {medication.roomNumber}</span>
                </div>
              </div>

              {/* Medication Details */}
              <div className="space-y-2 text-sm text-foreground bg-background/50 p-3 rounded-md">
                <div className="flex items-center">
                  <Pill className="w-3 h-3 mr-2 text-primary" />
                  <p>Dosage: <span className="font-medium">{medication.dosage}</span></p>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-2 text-primary" />
                  <p>Duration: <span className="font-medium">{medication.durationDays} days</span></p>
                </div>
                <div className="flex items-center">
                  <Utensils className="w-3 h-3 mr-2 text-primary" />
                  <p>Timing: {renderFoodTimingIcon()} food</p>
                </div>
              </div>

              {/* Notes Section */}
              {medication.notes && (
                <div className="bg-yellow-50 p-3 rounded-md border-l-2 border-yellow-300">
                  <div className="flex items-start">
                    <FileText className="w-3 h-3 mr-2 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-gray-600">{medication.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
        
        {/* Status Pill */}
        {medication.completed && (
          <div className="absolute top-2 left-4 flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3 mr-1" />
            Completed
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default MedicationCard;
