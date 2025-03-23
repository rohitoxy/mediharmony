
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlarmClock, CheckCircle2, Bell } from 'lucide-react';
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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: ["0 0 0 0px rgba(234, 56, 76, 0.3)", "0 0 0 20px rgba(234, 56, 76, 0)"]
        }}
        transition={{
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card w-full max-w-md rounded-lg shadow-2xl border-2 border-red-500 overflow-hidden animate-pulse"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 flex items-center gap-3">
          <div className="bg-white rounded-full p-2.5 shadow-md">
            <Bell className="h-7 w-7 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white">{alert.title}</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{alert.body}</p>
            <p className="text-red-500 mt-2 font-semibold">This medication needs to be administered immediately!</p>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 w-full py-7 text-lg font-semibold shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl"
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
