
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlarmClock, CheckCircle2, Bell, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { MedicationAlert } from '@/types/medication';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface MedicationFullScreenAlertProps {
  alert: MedicationAlert;
  onAcknowledge: (alertId: string) => string;
  onComplete?: (medicationId: string) => void;
  groupedMedications?: {
    count: number;
    roomNumbers: string[];
  };
}

const MedicationFullScreenAlert: React.FC<MedicationFullScreenAlertProps> = ({
  alert,
  onAcknowledge,
  onComplete,
  groupedMedications
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const { toast } = useToast();
  
  const handleConfirmAcknowledge = () => {
    const medicationId = onAcknowledge(alert.id);
    
    if (onComplete && medicationId) {
      onComplete(medicationId);
      
      toast({
        title: "Medication administered",
        description: "The medication has been marked as given",
        variant: "default",
      });
    }
    
    setIsConfirmOpen(false);
  };
  
  // Determine if we have multiple patients for this alert
  const hasMultipleMedications = groupedMedications && groupedMedications.count > 1;
  
  // Determine styles based on priority
  const getPriorityStyles = () => {
    switch (alert.priority) {
      case 'high':
        return {
          gradientFrom: 'from-red-600',
          gradientTo: 'to-red-500',
          borderColor: 'border-red-500',
          iconBg: 'text-red-500',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          animationColor: 'rgba(234, 56, 76, 0.3)',
          icon: <AlertTriangle className="h-7 w-7 text-red-500 animate-pulse" />,
          label: hasMultipleMedications 
            ? `There are ${groupedMedications?.count} medications that need urgent attention!`
            : 'This medication is urgent and needs to be administered immediately!',
          bgOpacity: 'bg-black/90'
        };
      case 'medium':
        return {
          gradientFrom: 'from-amber-500',
          gradientTo: 'to-amber-400',
          borderColor: 'border-amber-500',
          iconBg: 'text-amber-500',
          buttonBg: 'bg-amber-600 hover:bg-amber-700',
          animationColor: 'rgba(245, 158, 11, 0.3)',
          icon: <Bell className="h-7 w-7 text-amber-500 animate-pulse" />,
          label: hasMultipleMedications 
            ? `There are ${groupedMedications?.count} medications that need to be administered soon!`
            : 'This medication needs to be administered soon!',
          bgOpacity: 'bg-black/80'
        };
      case 'low':
        return {
          gradientFrom: 'from-blue-500',
          gradientTo: 'to-blue-400',
          borderColor: 'border-blue-400',
          iconBg: 'text-blue-500',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          animationColor: 'rgba(59, 130, 246, 0.3)',
          icon: <Info className="h-7 w-7 text-blue-500 animate-pulse" />,
          label: hasMultipleMedications 
            ? `There are ${groupedMedications?.count} medications scheduled for administration.`
            : 'This medication is scheduled for administration.',
          bgOpacity: 'bg-black/70'
        };
      default:
        return {
          gradientFrom: 'from-red-600',
          gradientTo: 'to-red-500',
          borderColor: 'border-red-500',
          iconBg: 'text-red-500',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          animationColor: 'rgba(234, 56, 76, 0.3)',
          icon: <AlertTriangle className="h-7 w-7 text-red-500 animate-pulse" />,
          label: 'This medication needs to be administered immediately!',
          bgOpacity: 'bg-black/90'
        };
    }
  };

  const styles = getPriorityStyles();

  const pulseAnimation = {
    scale: [1, 1.03, 1],
    opacity: [1, 0.9, 1]
  };

  const pulseTransition = {
    duration: alert.priority === 'high' ? 0.8 : alert.priority === 'medium' ? 1.2 : 1.5,
    ease: "easeInOut",
    repeat: Infinity
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 ${styles.bgOpacity} backdrop-blur-md flex items-center justify-center p-4`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            boxShadow: [`0 0 0 0px ${styles.animationColor}`, `0 0 0 20px ${styles.animationColor.replace('0.3', '0')}`]
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: alert.priority === 'high' ? 1.5 : alert.priority === 'medium' ? 2 : 2.5,
              ease: "easeInOut"
            }
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-card w-full max-w-md rounded-lg shadow-2xl border-2 ${styles.borderColor} overflow-hidden`}
        >
          <motion.div 
            className={`bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} p-5 flex items-center gap-3`}
            animate={pulseAnimation}
            transition={pulseTransition}
          >
            <div className="bg-white rounded-full p-2.5 shadow-md">
              {styles.icon}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {hasMultipleMedications ? 'Multiple Medications Due' : alert.title}
            </h2>
          </motion.div>
          
          <div className="p-6 space-y-6">
            <div className="text-center">
              {hasMultipleMedications ? (
                <>
                  <p className="text-xl font-bold mb-3">
                    {groupedMedications?.count} medications due now
                  </p>
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAllRooms(!showAllRooms)}
                      className={`text-xs flex items-center gap-1 ${
                        alert.priority === 'high' ? 'text-red-600 border-red-300' : 
                        alert.priority === 'medium' ? 'text-amber-600 border-amber-300' : 
                        'text-blue-600 border-blue-300'
                      }`}
                    >
                      {showAllRooms ? "Hide Details" : "Show Details"}
                      {showAllRooms ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                  </div>
                  
                  {showAllRooms && groupedMedications?.roomNumbers.length > 0 && (
                    <div className="mt-3 space-y-1 p-3 bg-black/5 rounded-md">
                      <p className="text-sm font-medium mb-2">Medications for rooms:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {groupedMedications.roomNumbers.map((room, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                              alert.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              alert.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            Room {room}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-2xl font-bold">{alert.body}</p>
              )}
              
              <p className={`mt-2 font-semibold ${
                alert.priority === 'high' ? 'text-red-500' : 
                alert.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {styles.label}
              </p>
            </div>
            
            <div className="mt-8 flex flex-col gap-3">
              <Button 
                size="lg" 
                className={`${styles.buttonBg} w-full py-7 text-lg font-semibold shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl text-white`}
                onClick={() => setIsConfirmOpen(true)}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {hasMultipleMedications 
                  ? "Mark This Medication As Given" 
                  : "Acknowledge & Mark as Given"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Administration</AlertDialogTitle>
            <AlertDialogDescription>
              {hasMultipleMedications 
                ? "Are you sure you want to mark this medication as administered? There are multiple medications due right now." 
                : "Are you sure you want to mark this medication as administered? This action confirms that you have given the medication to the patient."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAcknowledge}
              className={`${styles.buttonBg} text-white`}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MedicationFullScreenAlert;
