
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, DoorClosed, Pill, Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
      className={`shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer
        ${medication.completed ? 'opacity-60' : ''}
        ${isAlertActive ? 'animate-pulse border-2 border-red-500' : ''}
        ${isExpanded ? 'p-6' : 'p-4'}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
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
          <div className="flex gap-2">
            {!medication.completed && (
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className={`h-7 w-7 ${isAlertActive ? 'animate-bounce' : ''}`}
                title="Mark as completed"
              >
                <Check className="h-3 w-3 text-green-600" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-7 w-7"
              title="Delete medication"
            >
              <Trash2 className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
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
          <>
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

            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Dosage: {medication.dosage}</p>
              <p className="text-gray-600">Duration: {medication.durationDays} days</p>
              <p className="text-gray-600">Timing: {medication.foodTiming} food</p>
            </div>

            {medication.notes && (
              <p className="text-sm text-muted-foreground border-t pt-2">{medication.notes}</p>
            )}
            
            <div className="flex justify-center">
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default MedicationCard;
