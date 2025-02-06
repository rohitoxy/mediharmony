import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, DoorClosed, Pill, Check, Trash2 } from "lucide-react";

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
  return (
    <Card className={`p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white ${
      medication.completed ? 'opacity-60' : ''
    }`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className={`mb-2 ${
              medication.completed
                ? "bg-green-100 text-green-800"
                : timeStatus === "upcoming"
                ? "bg-accent text-white"
                : timeStatus === "past"
                ? "bg-muted"
                : "bg-primary text-white"
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            {medication.time}
          </Badge>
          <div className="flex gap-2">
            {!medication.completed && (
              <Button
                variant="outline"
                size="icon"
                onClick={onComplete}
                className="h-8 w-8"
                title="Mark as completed"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
              title="Delete medication"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>Patient ID: {medication.patientId}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DoorClosed className="w-4 h-4 mr-2" />
            <span>Room: {medication.roomNumber}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Pill className="w-4 h-4 mr-2" />
            <span>{medication.medicineName}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-600">Dosage: {medication.dosage}</p>
          <p className="text-sm text-gray-600">Duration: {medication.durationDays} days</p>
          <p className="text-sm text-gray-600">Timing: {medication.foodTiming} food</p>
        </div>

        {medication.notes && (
          <p className="text-sm text-muted-foreground border-t pt-2">{medication.notes}</p>
        )}
      </div>
    </Card>
  );
};

export default MedicationCard;