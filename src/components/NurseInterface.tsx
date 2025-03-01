
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Volume2, VolumeX, Bell, X, Calendar, CheckCircle, Clock, AlertTriangle, Info, Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MedicationCard from "./medication/MedicationCard";
import { useMedications } from "@/hooks/use-medications";
import { useMedicationAlarm } from "@/hooks/use-medication-alarm";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  
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

  const filteredMedications = medications.filter(med => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !med.completed;
    if (filterStatus === 'completed') return med.completed;
    return true;
  });

  // Function to format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-3 md:p-6 animate-fade-in">
      {/* Header Section with Date and Time */}
      <div className="mb-6 bg-gradient-to-r from-primary/10 to-accent/5 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar className="text-primary h-6 w-6 mr-2" />
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-primary">
                Medication Schedule
              </h2>
              <p className="text-muted-foreground text-sm">
                {currentTime.toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-white px-3 py-1.5 rounded-md shadow-sm text-primary font-medium">
              <Clock className="inline-block h-4 w-4 mr-1.5 text-primary" />
              {formatTime(currentTime)}
            </div>
            
            {highPriorityCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAlertsPanel(true)}
                className="relative bg-white border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Bell className="h-4 w-4 text-red-500" />
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
              className="bg-white"
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-4 flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter:</span>
        <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
          <Button 
            variant={filterStatus === 'all' ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilterStatus('all')}
            className={`rounded-none px-3 ${filterStatus === 'all' ? '' : 'text-muted-foreground'}`}
          >
            All
          </Button>
          <Button 
            variant={filterStatus === 'pending' ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilterStatus('pending')}
            className={`rounded-none px-3 ${filterStatus === 'pending' ? '' : 'text-muted-foreground'}`}
          >
            Pending
          </Button>
          <Button 
            variant={filterStatus === 'completed' ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilterStatus('completed')}
            className={`rounded-none px-3 ${filterStatus === 'completed' ? '' : 'text-muted-foreground'}`}
          >
            Completed
          </Button>
        </div>
      </div>
      
      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold text-gray-800">{medications.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-xl font-semibold text-gray-800">
              {medications.filter(m => !m.completed).length}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-xl font-semibold text-gray-800">
              {medications.filter(m => m.completed).length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Empty State */}
      {filteredMedications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="bg-muted inline-flex p-4 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No medications found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {filterStatus === 'all' 
              ? "There are no medications scheduled. Check back later."
              : filterStatus === 'pending'
              ? "All medications have been administered. Great job!"
              : "No completed medications yet."}
          </p>
        </div>
      )}
      
      {/* Medication Card Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredMedications.map((medication) => (
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
      </AnimatePresence>

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
              className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-auto"
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
                {/* High Priority Alerts */}
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
                              onClick={() => {
                                acknowledgeAlert(alert.id);
                                // Find the corresponding medication
                                const med = medications.find(m => m.id === alert.id);
                                if (med) handleComplete(med);
                              }}
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
                
                {/* Medium Priority Alerts */}
                {groupedAlerts.medium && groupedAlerts.medium.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-orange-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Coming Up Soon
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
                
                {/* Low Priority Alerts */}
                {groupedAlerts.low && groupedAlerts.low.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-600 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      For Your Information
                    </h4>
                    <div className="space-y-2 pl-2 border-l-2 border-blue-400">
                      {groupedAlerts.low.map(alert => (
                        <motion.div 
                          key={alert.id} 
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="bg-blue-50 p-3 rounded-md border border-blue-200"
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
