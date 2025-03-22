
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlarmClock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MedicationAlert } from '@/types/medication';

interface MedicationFullScreenAlertProps {
  alert: MedicationAlert;
  onAcknowledge: (alertId: string) => string;
  onComplete?: (medicationId: string) => void;
}

const MedicationFullScreenAlert: React.FC<MedicationFullScreenAlertProps> = ({
  alert,
  onAcknowledge,
  onComplete
}) => {
  const handleAcknowledge = () => {
    const medicationId = onAcknowledge(alert.id);
    if (onComplete && medicationId) {
      onComplete(medicationId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card w-full max-w-md rounded-lg shadow-xl border border-red-500 overflow-hidden"
      >
        <div className="bg-red-500 p-4 flex items-center gap-3">
          <div className="bg-white rounded-full p-2">
            <AlarmClock className="h-6 w-6 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">{alert.title}</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{alert.body}</p>
            <p className="text-gray-500 mt-1">This medication needs to be administered immediately</p>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 w-full py-6 text-lg font-semibold"
              onClick={handleAcknowledge}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Acknowledge & Mark as Given
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MedicationFullScreenAlert;
