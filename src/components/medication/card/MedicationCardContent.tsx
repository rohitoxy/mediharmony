
import { useState } from 'react';
import { Pill, DoorClosed, User, ChevronDown, ChevronUp } from 'lucide-react';

interface MedicationCardContentProps {
  medicineName: string;
  roomNumber: string;
  patientId: string;
  medicationColor: string;
  iconBgColor: string;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  medicationDetails: React.ReactNode;
}

export const MedicationCardContent = ({
  medicineName,
  roomNumber,
  patientId,
  medicationColor,
  iconBgColor,
  isExpanded,
  setIsExpanded,
  medicationDetails
}: MedicationCardContentProps) => {
  return (
    <div 
      className="space-y-3 mt-4 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center">
        <div className={`p-1.5 rounded-full ${iconBgColor} mr-3`}>
          <Pill className={`w-4 h-4 ${medicationColor}`} />
        </div>
        <span className="text-sm font-medium truncate">{medicineName}</span>
      </div>

      {!isExpanded ? (
        <div className="flex items-center justify-between text-muted-foreground text-sm mt-2">
          <div className="flex items-center">
            <DoorClosed className="w-3 h-3 mr-1" />
            <span>Room {roomNumber}</span>
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
              <span className="text-sm">ID: {patientId}</span>
            </div>
            <div className="flex items-center text-foreground bg-background/50 p-2 rounded-md">
              <div className="bg-primary/10 p-1 rounded-full mr-2">
                <DoorClosed className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm">Room: {roomNumber}</span>
            </div>
          </div>

          {medicationDetails}
          
          <div className="flex justify-center">
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};
