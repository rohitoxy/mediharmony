
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, X, Clock, Info } from 'lucide-react';
import { MedicationAlert } from '@/types/medication';
import { Button } from '@/components/ui/button';

interface MedicationReminderPopupProps {
  alert: MedicationAlert;
  onClose: (alertId: string) => void;
}

const MedicationReminderPopup: React.FC<MedicationReminderPopupProps> = ({
  alert,
  onClose
}) => {
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
            <h3 className={`font-semibold ${styles.textColor}`}>{alert.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full -mt-1 -mr-1"
              onClick={() => onClose(alert.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-slate-600 mt-1">{alert.body}</p>
          <p className="text-xs text-slate-500 mt-2 italic">
            Due in 1 minute
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationReminderPopup;
