
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Volume2, VolumeX, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MedicationCard from "./medication/MedicationCard";
import { useMedications } from "@/hooks/use-medications";
import { useMedicationAlarm } from "@/hooks/use-medication-alarm";
import { useState } from "react";

interface Medication {
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
}

const NurseInterface = ({ medications: initialMedications }: { medications: Medication[] }) => {
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  
  const { medications, handleComplete, handleDelete } = useMedications(initialMedications);
  const { 
    currentTime, 
    isSoundEnabled, 
    toggleSound, 
    groupedAlerts,
    acknowledgeAlert,
    highPriorityCount 
  } = useMedicationAlarm(medications);

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

  return (
    <div className="p-3 md:p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Medication Schedule</h2>
        <div className="flex items-center space-x-1 md:space-x-2">
          {highPriorityCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlertsPanel(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge 
                className="absolute -top-2 -right-2 bg-red-500 text-white animate-pulse" 
                variant="destructive"
              >
                {highPriorityCount}
              </Badge>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            title={isSoundEnabled ? "Disable sound" : "Enable sound"}
          >
            {isSoundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            timeStatus={getTimeStatus(medication.time)}
            onComplete={() => handleComplete(medication)}
            onDelete={() => {
              setSelectedMedication(medication);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      {/* Delete Medication Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedMedication) {
                  handleDelete(selectedMedication);
                  setIsDeleteDialogOpen(false);
                  setSelectedMedication(null);
                }
              }} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alerts Panel */}
      {showAlertsPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Medication Alerts</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAlertsPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* High Priority Alerts */}
              {groupedAlerts.high && groupedAlerts.high.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600 flex items-center">
                    <span className="mr-2">🚨</span> Urgent Attention Required
                  </h4>
                  <div className="space-y-2 pl-2 border-l-2 border-red-500">
                    {groupedAlerts.high.map(alert => (
                      <div 
                        key={alert.id} 
                        className="bg-red-50 p-3 rounded-md border border-red-200"
                      >
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-sm text-gray-700">{alert.body}</p>
                        <div className="flex justify-end mt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => {
                              acknowledgeAlert(alert.id);
                              // Find the corresponding medication
                              const med = medications.find(m => m.id === alert.id);
                              if (med) handleComplete(med);
                            }}
                          >
                            Mark as Given
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Medium Priority Alerts */}
              {groupedAlerts.medium && groupedAlerts.medium.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-600 flex items-center">
                    <span className="mr-2">⚠️</span> Coming Up Soon
                  </h4>
                  <div className="space-y-2 pl-2 border-l-2 border-orange-400">
                    {groupedAlerts.medium.map(alert => (
                      <div 
                        key={alert.id} 
                        className="bg-orange-50 p-3 rounded-md border border-orange-200"
                      >
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-sm text-gray-700">{alert.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Low Priority Alerts */}
              {groupedAlerts.low && groupedAlerts.low.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600 flex items-center">
                    <span className="mr-2">ℹ️</span> For Your Information
                  </h4>
                  <div className="space-y-2 pl-2 border-l-2 border-blue-400">
                    {groupedAlerts.low.map(alert => (
                      <div 
                        key={alert.id} 
                        className="bg-blue-50 p-3 rounded-md border border-blue-200"
                      >
                        <p className="font-semibold">{alert.title}</p>
                        <p className="text-sm text-gray-700">{alert.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {Object.keys(groupedAlerts).length === 0 && (
                <div className="text-center py-8 text-gray-500">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseInterface;
