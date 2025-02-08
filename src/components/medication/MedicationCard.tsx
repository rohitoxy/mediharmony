
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, DoorClosed, Pill, Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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

  return (
    <Card 
      className={`relative shadow-md hover:shadow-lg transition-all duration-300 bg-white
        ${medication.completed ? 'opacity-60' : ''}
        ${isAlertActive ? 'animate-pulse border-2 border-red-500' : ''}
        ${isExpanded ? 'p-6' : 'p-4'}
      `}
    >
      {/* Top Actions */}
      <div className="absolute top-2 right-2 flex gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${medication.id}`}
            checked={medication.completed}
            onCheckedChange={onComplete}
            className={`h-4 w-4 border-2 ${isAlertActive ? 'animate-bounce' : ''}`}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Card Content */}
      <div 
        className="space-y-3 mt-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Badge
          variant="outline"
          className={`${
            medication.completed
              ? "bg-green-100 text-green-800"
              : timeStatus === "upcoming"
              ? "bg-red-500 text-white animate-bounce"
              : timeStatus === "past"
              ? "bg-muted"
              : "bg-primary text-white"
          }`}
        >
          <Clock className="w-3 h-3 mr-1" />
          {medication.time}
        </Badge>

        <div className="flex items-center text-gray-700">
          <Pill className="w-3 h-3 mr-1" />
          <span className="text-sm font-medium truncate">{medication.medicineName}</span>
        </div>

        {!isExpanded ? (
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center">
              <DoorClosed className="w-3 h-3 mr-1" />
              <span>Room {medication.roomNumber}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <User className="w-3 h-3 mr-1" />
                <span className="text-sm">Patient ID: {medication.patientId}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DoorClosed className="w-3 h-3 mr-1" />
                <span className="text-sm">Room: {medication.roomNumber}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Dosage: {medication.dosage}</p>
              <p>Duration: {medication.durationDays} days</p>
              <p>Timing: {medication.foodTiming} food</p>
            </div>

            {medication.notes && (
              <p className="text-sm text-muted-foreground border-t pt-2">{medication.notes}</p>
            )}
            
            <div className="flex justify-center">
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicationCard;

