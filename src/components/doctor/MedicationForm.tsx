import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MedicineTypeSelector } from "@/components/medication/MedicineTypeSelector";
import { DosageScheduleSelector } from "@/components/medication/DosageScheduleSelector";
import { 
  ArrowLeft, Bell, Calendar, Pill, User, MapPin, Plus, X,
  AlertTriangle, Info, CheckCircle, UsersRound
} from "lucide-react";
import { Medication } from "@/types/medication";

interface Patient {
  id: string;
  name: string;
  roomNumber: string;
}

interface MedicationFormProps {
  onMedicationAdd: (medication: Medication) => void;
  existingPatients: Patient[];
}

const MedicationForm = ({ onMedicationAdd, existingPatients }: MedicationFormProps) => {
  const { toast } = useToast();
  const [patientMode, setPatientMode] = useState<'new' | 'existing'>('new');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [formData, setFormData] = useState({
    patientName: "",
    roomNumber: "",
    medicineName: "",
    dosage: "1",
    durationDays: 30,
    foodTiming: "with",
    time: "10:00",
    notes: "",
    priority: "medium" as 'high' | 'medium' | 'low',
    medicineType: "pill" as 'pill' | 'injection' | 'liquid' | 'inhaler' | 'topical' | 'drops',
    frequency: "once",
    specificTimes: [] as string[]
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    if (patientMode === 'existing' && selectedPatientId) {
      const patient = existingPatients.find(p => p.id === selectedPatientId);
      if (patient) {
        setFormData(prev => ({
          ...prev,
          patientName: patient.name,
          roomNumber: patient.roomNumber
        }));
      }
    }
  }, [selectedPatientId, existingPatients, patientMode]);
  
  useEffect(() => {
    const baseTime = formData.time || "09:00";
    const [hours, minutes] = baseTime.split(":").map(Number);
    
    let newSpecificTimes: string[] = [];
    
    switch(formData.frequency) {
      case "once":
        newSpecificTimes = [baseTime];
        break;
      case "twice":
        newSpecificTimes = [
          baseTime,
          `${(hours + 12) % 24}:${minutes.toString().padStart(2, '0')}`
        ];
        break;
      case "three":
        newSpecificTimes = [
          baseTime,
          `${(hours + 8) % 24}:${minutes.toString().padStart(2, '0')}`,
          `${(hours + 16) % 24}:${minutes.toString().padStart(2, '0')}`
        ];
        break;
      case "four":
        newSpecificTimes = [
          baseTime,
          `${(hours + 6) % 24}:${minutes.toString().padStart(2, '0')}`,
          `${(hours + 12) % 24}:${minutes.toString().padStart(2, '0')}`,
          `${(hours + 18) % 24}:${minutes.toString().padStart(2, '0')}`
        ];
        break;
      case "custom":
        return;
      default:
        newSpecificTimes = [baseTime];
    }
    
    newSpecificTimes.sort();
    
    setFormData(prev => ({
      ...prev,
      specificTimes: newSpecificTimes
    }));
  }, [formData.frequency, formData.time]);
  
  const generateUniquePatientId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "P-";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patientId = patientMode === 'existing' && selectedPatientId 
      ? selectedPatientId 
      : generateUniquePatientId();
    
    const medication: Medication = {
      id: Date.now().toString(),
      patientId,
      roomNumber: formData.roomNumber,
      medicineName: formData.medicineName,
      dosage: formData.dosage,
      durationDays: formData.durationDays,
      foodTiming: formData.foodTiming,
      time: formData.time,
      notes: formData.notes,
      priority: formData.priority,
      medicineType: formData.medicineType,
      frequency: formData.frequency,
      specificTimes: formData.specificTimes
    };
    
    onMedicationAdd(medication);
    setFormSubmitted(true);
    
    toast({
      title: "Medication Added",
      description: "The medication has been successfully added to the nurse's schedule.",
    });
    
    setTimeout(() => {
      setFormData({
        patientName: "",
        roomNumber: "",
        medicineName: "",
        dosage: "1",
        durationDays: 30,
        foodTiming: "with",
        time: "10:00",
        notes: "",
        priority: "medium",
        medicineType: "pill",
        frequency: "once",
        specificTimes: []
      });
      setFormSubmitted(false);
      setSelectedPatientId('');
      
      setPatientMode('new');
    }, 1000);
  };

  const FoodTimingOption = ({ value, isSelected, label, onClick }: { 
    value: string, 
    isSelected: boolean, 
    label: string,
    onClick: () => void 
  }) => (
    <div 
      className={`flex items-center justify-center p-4 rounded-md cursor-pointer transition-all ${
        isSelected 
          ? "bg-green-500 text-white" 
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="mb-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5h18v1H3z" fill={isSelected ? "white" : "currentColor"} />
            <path fillRule="evenodd" clipRule="evenodd" d="M7 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" fill={isSelected ? "white" : "currentColor"} />
            <path d="M17 8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V8z" fill={isSelected ? "white" : "currentColor"} />
            <path fillRule="evenodd" clipRule="evenodd" d="M17 5c-1.1 0-2 .9-2 2v2.535c.468-.344 1-.598 1.567-.738A3.503 3.503 0 0 1 20 12a3.503 3.503 0 0 1-3.433 3.203c-.567-.14-1.099-.394-1.567-.738V17c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2z" fill={isSelected ? "white" : "currentColor"} />
          </svg>
        </div>
        {label}
      </div>
    </div>
  );

  const PriorityOption = ({ value, icon: Icon, color, label }: { 
    value: 'high' | 'medium' | 'low',
    icon: React.ElementType,
    color: string,
    label: string
  }) => (
    <div className="flex items-center space-x-3">
      <RadioGroupItem value={value} id={`priority-${value}`} />
      <div className={`flex items-center p-2 rounded-full ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <Label htmlFor={`priority-${value}`} className="cursor-pointer">
        {label}
      </Label>
    </div>
  );

  return (
    <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
      <AnimatePresence>
        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 flex flex-col items-center justify-center h-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12l5 5L20 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Medication Added</h3>
            <p className="text-gray-500 text-center mb-6">
              The medication has been successfully added to the nurse's schedule
            </p>
            <Button 
              onClick={() => setFormSubmitted(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Add Another Medication
            </Button>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-base font-medium">Patient Selection</Label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  type="button"
                  className={`flex items-center justify-center p-4 ${
                    patientMode === 'new' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setPatientMode('new')}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Patient
                </Button>
                <Button
                  type="button"
                  className={`flex items-center justify-center p-4 ${
                    patientMode === 'existing' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setPatientMode('existing')}
                  disabled={existingPatients.length === 0}
                >
                  <UsersRound className="mr-2 h-5 w-5" />
                  Existing Patient
                </Button>
              </div>
              
              {patientMode === 'existing' && (
                <div className="mb-4">
                  <Label htmlFor="existingPatient">Select Patient</Label>
                  <Select 
                    value={selectedPatientId}
                    onValueChange={setSelectedPatientId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingPatients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          Room {patient.roomNumber} - Patient ID: {patient.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Patient details</Label>
              <div className="flex gap-3">
                <div className="w-full relative bg-gray-100 rounded-xl p-3 flex items-center">
                  <User className="h-5 w-5 mr-3 text-gray-500" />
                  <Input
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                    className="border-none bg-transparent focus:ring-0 p-0 w-full h-auto text-base"
                    placeholder="Patient Name"
                    disabled={patientMode === 'existing' && !!selectedPatientId}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-full relative bg-gray-100 rounded-xl p-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                  <Input
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    required
                    className="border-none bg-transparent focus:ring-0 p-0 w-full h-auto text-base"
                    placeholder="Room Number"
                    disabled={patientMode === 'existing' && !!selectedPatientId}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Medicine name</Label>
              <div className="relative">
                <div className="w-full relative bg-gray-100 rounded-xl p-3 flex items-center">
                  <Pill className="h-5 w-5 mr-3 text-gray-500" />
                  <Input
                    value={formData.medicineName}
                    onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                    required
                    className="border-none bg-transparent focus:ring-0 p-0 w-full h-auto text-base"
                    placeholder="Medicine name"
                  />
                  {formData.medicineName && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full absolute right-2 text-gray-500 hover:text-red-500"
                      onClick={() => setFormData({ ...formData, medicineName: "" })}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-base font-medium">Medicine Type</Label>
              <MedicineTypeSelector 
                selectedType={formData.medicineType}
                onChange={(type) => setFormData({ ...formData, medicineType: type })}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Priority</Label>
              <RadioGroup 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value as 'high' | 'medium' | 'low' })}
                className="space-y-3"
              >
                <PriorityOption 
                  value="high" 
                  icon={AlertTriangle} 
                  color="bg-red-100 text-red-600" 
                  label="High Priority" 
                />
                <PriorityOption 
                  value="medium" 
                  icon={Info} 
                  color="bg-amber-100 text-amber-600" 
                  label="Medium Priority" 
                />
                <PriorityOption 
                  value="low" 
                  icon={CheckCircle} 
                  color="bg-green-100 text-green-600" 
                  label="Low Priority" 
                />
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Amount & How long?</Label>
              <div className="flex gap-3">
                <div className="bg-gray-100 rounded-xl p-3 flex items-center flex-grow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-500">
                    <path d="M12 8v8m-4-4h8M7.8 4.8L16.2 19.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <Input
                    type="number"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    required
                    className="border-none bg-transparent focus:ring-0 p-0 w-16 h-auto text-base"
                    min="1"
                  />
                  <span className="text-gray-500 ml-2">pills</span>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 flex items-center flex-grow">
                  <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                  <Input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                    required
                    className="border-none bg-transparent focus:ring-0 p-0 w-16 h-auto text-base"
                    min="1"
                  />
                  <span className="text-gray-500 ml-2">days</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Dosage Schedule</Label>
              <DosageScheduleSelector 
                frequency={formData.frequency}
                specificTimes={formData.specificTimes}
                onFrequencyChange={(frequency) => setFormData({ ...formData, frequency })}
                onSpecificTimesChange={(specificTimes) => setFormData({ ...formData, specificTimes })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Notes (optional)</Label>
              <div className="flex items-center">
                <div className="w-full relative bg-gray-100 rounded-xl p-3">
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="border-none bg-transparent focus:ring-0 p-0 w-full min-h-[60px] text-base resize-none"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Food & Pills</Label>
              <div className="grid grid-cols-3 gap-3">
                <FoodTimingOption 
                  value="before" 
                  isSelected={formData.foodTiming === "before"} 
                  label="Before"
                  onClick={() => setFormData({ ...formData, foodTiming: "before" })}
                />
                <FoodTimingOption 
                  value="after" 
                  isSelected={formData.foodTiming === "after"} 
                  label="After"
                  onClick={() => setFormData({ ...formData, foodTiming: "after" })}
                />
                <FoodTimingOption 
                  value="with" 
                  isSelected={formData.foodTiming === "with"} 
                  label="With"
                  onClick={() => setFormData({ ...formData, foodTiming: "with" })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Main Notification Time</Label>
              <div className="flex justify-between">
                <div className="bg-gray-100 rounded-xl p-3 flex items-center flex-grow">
                  <Bell className="h-5 w-5 mr-3 text-gray-500" />
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="border-none bg-transparent focus:ring-0 p-0 h-auto text-base appearance-none"
                    style={{ colorScheme: "light" }}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 rounded-xl bg-green-500 hover:bg-green-600 text-white text-lg font-medium mt-8"
            >
              Done
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default MedicationForm;
