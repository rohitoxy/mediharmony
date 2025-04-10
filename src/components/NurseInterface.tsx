
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Medication } from "@/types/medication";
import { useMedications } from "@/hooks/use-medications";
import { useMedicationAlarm } from "@/hooks/use-medication-alarm";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X, AlertTriangle, CheckCircle, Info, Check } from "lucide-react";
import { NurseHeader } from "./nurse/NurseHeader";
import { NurseStats } from "./nurse/NurseStats";
import { MedicationFilter } from "./nurse/MedicationFilter";
import { MedicationList } from "./nurse/MedicationList";
import { ToggleView } from "./nurse/ToggleView";
import MedicationFullScreenAlert from "./medication/MedicationFullScreenAlert";
import MedicationReminderPopup from "./medication/MedicationReminderPopup";

const NurseInterface = ({ medications: initialMedications }: { medications: Medication[] }) => {
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  
  const { medications, handleComplete } = useMedications(initialMedications);
  const { 
    currentTime, 
    isSoundEnabled, 
    toggleSound, 
    groupedAlerts,
    acknowledgeAlert,
    highPriorityCount,
    medicationsByTime
  } = useMedicationAlarm(medications);

  const activeHighPriorityAlert = groupedAlerts.high?.find(alert => 
    !alert.acknowledged && !alert.id.includes("-warning")
  );
  const activeMediumPriorityAlert = groupedAlerts.medium?.find(alert => 
    !alert.acknowledged && !alert.id.includes("-warning")
  );
  const activeLowPriorityAlert = groupedAlerts.low?.find(alert => 
    !alert.acknowledged && !alert.id.includes("-warning")
  );
  
  const warningAlert = 
    (groupedAlerts.high?.find(alert => !alert.acknowledged && alert.id.includes("-warning"))) ||
    (groupedAlerts.medium?.find(alert => !alert.acknowledged && alert.id.includes("-warning"))) ||
    (groupedAlerts.low?.find(alert => !alert.acknowledged && alert.id.includes("-warning")));
  
  const activeAlert = activeHighPriorityAlert || activeMediumPriorityAlert || activeLowPriorityAlert;

  const getTimeStatus = (medicationTime: string) => {
    const [hours, minutes] = medicationTime.split(":");
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    if (currentHours > parseInt(hours) || 
        (currentHours === parseInt(hours) && currentMinutes > parseInt(minutes))) {
      return "past";
    }
    if (currentHours === parseInt(hours) && currentMinutes === parseInt(minutes)) {
      return "upcoming";
    }
    return "future";
  };

  const filteredMedications = medications.filter(med => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !med.completed;
    if (filterStatus === 'completed') return med.completed;
    return true;
  });

  const handleAlertAcknowledge = (alertId: string) => {
    const medicationId = acknowledgeAlert(alertId);
    if (medicationId) {
      const medication = medications.find(m => m.id === medicationId);
      if (medication) {
        handleComplete(medication);
      }
    }
    return medicationId;
  };

  const handleReminderClose = (alertId: string) => {
    acknowledgeAlert(alertId);
  };
  
  const getGroupedMedicationsForWarning = (alert: { id: string }) => {
    const [medicationId] = alert.id.split('-');
    const medication = medications.find(m => m.id === medicationId);
    
    if (!medication) return undefined;
    
    const timeGroup = medicationsByTime[medication.time];
    if (timeGroup && timeGroup.count > 1) {
      return {
        count: timeGroup.count,
        roomNumbers: timeGroup.roomNumbers,
      };
    }
    
    return undefined;
  };

  return (
    <div className="p-3 md:p-6 animate-fade-in">
      <NurseHeader
        currentTime={currentTime}
        isSoundEnabled={isSoundEnabled}
        toggleSound={toggleSound}
        highPriorityCount={highPriorityCount}
        setShowAlertsPanel={setShowAlertsPanel}
      />
      
      <NurseStats medications={medications} />
      
      <div className="flex items-center justify-between mb-4">
        <MedicationFilter
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <ToggleView 
          view={viewMode}
          onViewChange={setViewMode}
        />
      </div>
      
      <MedicationList
        medications={filteredMedications}
        getTimeStatus={getTimeStatus}
        onComplete={handleComplete}
        viewMode={viewMode}
      />

      <AnimatePresence>
        {activeAlert && (
          <MedicationFullScreenAlert
            alert={activeAlert}
            onAcknowledge={handleAlertAcknowledge}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {warningAlert && (
          <MedicationReminderPopup
            alert={warningAlert}
            onClose={handleReminderClose}
            groupedMedications={getGroupedMedicationsForWarning(warningAlert)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAlertsPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-auto border border-border/40"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-primary" />
                  Medication Alerts
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAlertsPanel(false)}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 space-y-4">
                {groupedAlerts.high && groupedAlerts.high.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Urgent Attention Required
                    </h4>
                    <div className="space-y-2 pl-2 border-l-2 border-red-500">
                      {groupedAlerts.high.map(alert => (
                        <motion.div 
                          key={alert.id} 
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="bg-red-50 p-3 rounded-md border border-red-200"
                        >
                          <p className="font-semibold">{alert.title}</p>
                          <p className="text-sm text-gray-700">{alert.body}</p>
                          <div className="flex justify-end mt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleAlertAcknowledge(alert.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark as Given
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {groupedAlerts.medium && groupedAlerts.medium.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Due in 1 Minute
                    </h4>
                    <div className="space-y-2 pl-2 border-l-2 border-orange-400">
                      {groupedAlerts.medium.map(alert => (
                        <motion.div 
                          key={alert.id} 
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="bg-orange-50 p-3 rounded-md border border-orange-200"
                        >
                          <p className="font-semibold">{alert.title}</p>
                          <p className="text-sm text-gray-700">{alert.body}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(groupedAlerts).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="bg-gray-100 p-3 rounded-full inline-flex mb-3">
                      <Check className="h-6 w-6 text-gray-400" />
                    </div>
                    <p>No active alerts</p>
                  </div>
                )}
              </div>
              
              <div className="border-t p-4">
                <Button 
                  className="w-full"
                  onClick={() => setShowAlertsPanel(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NurseInterface;
