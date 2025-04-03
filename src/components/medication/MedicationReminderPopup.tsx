
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, X, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { MedicationAlert } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MedicationReminderPopupProps {
  alert: MedicationAlert;
  onClose: (alertId: string) => void;
  groupedMedications?: {
    count: number;
    roomNumbers: string[];
  };
}

const MedicationReminderPopup: React.FC<MedicationReminderPopupProps> = ({
  alert,
  onClose,
  groupedMedications
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get priority-specific styles
  const getPriorityStyles = () => {
    switch (alert.priority) {
      case 'high':
        return {
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          icon: <Bell className="h-4 w-4 text-red-500" />
        };
      case 'medium':
        return {
          borderColor: 'border-amber-400',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-800',
          icon: <Bell className="h-4 w-4 text-amber-500" />
        };
      case 'low':
        return {
          borderColor: 'border-blue-400',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          icon: <Info className="h-4 w-4 text-blue-500" />
        };
      default:
        return {
          borderColor: 'border-slate-300',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-700',
          icon: <Info className="h-4 w-4 text-slate-500" />
        };
    }
  };

  const styles = getPriorityStyles();
  
  // Determine if we have multiple patients for this alert time
  const hasMultipleMedications = groupedMedications && groupedMedications.count > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed top-4 right-4 max-w-sm shadow-lg rounded-lg border-l-4 ${styles.borderColor} ${styles.bgColor} z-50`}
    >
      <div className="p-4 flex gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="flex items-center justify-center bg-white p-1.5 rounded-full shadow-sm">
            <Clock className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold ${styles.textColor}`}>
              {hasMultipleMedications 
                ? `${groupedMedications.count} Medications Due Soon` 
                : alert.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full -mt-1 -mr-1"
              onClick={() => onClose(alert.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          {hasMultipleMedications ? (
            <div className="text-sm text-slate-600 mt-1">
              <div className="flex justify-between items-center">
                <p>Multiple medications due in 1 minute</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
              
              {expanded && (
                <div className="mt-2 space-y-1.5 pl-1 border-l-2 border-primary/30">
                  {groupedMedications.roomNumbers.map((room, i) => (
                    <p key={i} className="text-xs flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      Room {room}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600 mt-1">{alert.body}</p>
          )}
          
          <p className="text-xs text-slate-500 mt-2 italic">
            Due in 1 minute
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationReminderPopup;
