
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Clock, 
  DoorClosed, 
  Pill, 
  Calendar, 
  AlarmClock, 
  StickyNote, 
  Check,
  Heart,
  Activity,
  StethoscopeIcon,
  Shield,
  Sparkles
} from "lucide-react";

interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  dosage: string;
  durationDays: number;
  foodTiming: string;
  time: string;
  notes: string;
}

const DoctorInterface = ({ onMedicationAdd }: { onMedicationAdd: (medication: Medication) => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientId: "",
    roomNumber: "",
    medicineName: "",
    dosage: "",
    durationDays: 1,
    foodTiming: "before",
    time: "",
    notes: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const medication: Medication = {
      id: Date.now().toString(),
      ...formData,
    };
    onMedicationAdd(medication);
    setFormSubmitted(true);
    
    // Show success toast with animation
    toast({
      title: "Medication Added",
      description: "The medication has been successfully added to the nurse's schedule.",
      action: (
        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-green-600" />
        </div>
      ),
    });
    
    // Reset form after showing animation
    setTimeout(() => {
      setFormData({
        patientId: "",
        roomNumber: "",
        medicineName: "",
        dosage: "",
        durationDays: 1,
        foodTiming: "before",
        time: "",
        notes: "",
      });
      setFormSubmitted(false);
    }, 1000);
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 2px #4A9F8F33" },
    tap: { scale: 0.98 }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <Card className="relative overflow-hidden bg-white shadow-xl rounded-xl border-none">
        {/* Background graphic elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/10 rounded-bl-full z-0" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-primary/20 rounded-tr-full z-0" />
        
        {/* Floating pills background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute text-primary/5"
              initial={{ 
                x: Math.random() * 100, 
                y: Math.random() * 100,
                opacity: 0.3,
                scale: 0.5 + Math.random() * 0.5
              }}
              animate={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                opacity: 0.1 + Math.random() * 0.2,
                rotate: Math.random() * 360
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 15 + Math.random() * 10,
                repeatType: "reverse" 
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Pill size={20 + Math.random() * 30} />
            </motion.div>
          ))}
        </div>
        
        {/* Content wrapper with z-index to appear above decorative elements */}
        <div className="relative z-10 p-8">
          {/* Header with animation */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-gradient-to-r from-primary to-accent p-3 rounded-full text-white shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <StethoscopeIcon className="w-8 h-8" />
            </motion.div>
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Medication Scheduler
              </h2>
              <p className="text-muted-foreground text-sm">
                Create personalized medication schedules for patients
              </p>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {formSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <motion.div
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Schedule Created!</h3>
                <p className="text-muted-foreground text-center mb-6">
                  The medication has been added to the nurse's schedule
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setFormSubmitted(false)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Pill className="w-4 h-4" />
                    Add Another Medication
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Patient Info Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/10 p-1.5 rounded-full">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-700">Patient Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="patientId" className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        Patient ID
                      </Label>
                      <motion.div
                        whileFocus="focus"
                        whileTap="tap"
                        variants={inputVariants}
                      >
                        <Input
                          id="patientId"
                          value={formData.patientId}
                          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                          required
                          className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter patient ID"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roomNumber" className="flex items-center gap-2 text-gray-600">
                        <DoorClosed className="w-4 h-4" />
                        Room Number
                      </Label>
                      <motion.div
                        whileFocus="focus"
                        whileTap="tap"
                        variants={inputVariants}
                      >
                        <Input
                          id="roomNumber"
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                          required
                          className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter room number"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Medication Details Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/10 p-1.5 rounded-full">
                      <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-700">Medication Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="medicineName" className="flex items-center gap-2 text-gray-600">
                        <Pill className="w-4 h-4" />
                        Medicine Name
                      </Label>
                      <motion.div
                        whileFocus="focus"
                        whileTap="tap"
                        variants={inputVariants}
                      >
                        <Input
                          id="medicineName"
                          value={formData.medicineName}
                          onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                          required
                          className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="Enter medicine name"
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="dosage" className="flex items-center gap-2 text-gray-600">
                          <AlarmClock className="w-4 h-4" />
                          Dosage
                        </Label>
                        <motion.div
                          whileFocus="focus"
                          whileTap="tap"
                          variants={inputVariants}
                        >
                          <Input
                            id="dosage"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            required
                            className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="Enter dosage"
                          />
                        </motion.div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="durationDays" className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Duration (Days)
                        </Label>
                        <motion.div
                          whileFocus="focus"
                          whileTap="tap"
                          variants={inputVariants}
                        >
                          <Input
                            id="durationDays"
                            type="number"
                            min="1"
                            value={formData.durationDays}
                            onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                            required
                            className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-primary/10 p-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-700">Schedule Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="foodTiming" className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        Food Timing
                      </Label>
                      <Select
                        value={formData.foodTiming}
                        onValueChange={(value) => setFormData({ ...formData, foodTiming: value })}
                      >
                        <motion.div
                          whileHover="focus"
                          whileTap="tap"
                          variants={inputVariants}
                        >
                          <SelectTrigger className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Select timing" />
                          </SelectTrigger>
                        </motion.div>
                        <SelectContent>
                          <SelectItem value="before" className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500 mr-1"></span> Before Food
                          </SelectItem>
                          <SelectItem value="after" className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span> After Food
                          </SelectItem>
                          <SelectItem value="with" className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> With Food
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        Time
                      </Label>
                      <motion.div
                        whileFocus="focus"
                        whileTap="tap"
                        variants={inputVariants}
                      >
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                          className="w-full transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2 text-gray-600">
                    <StickyNote className="w-4 h-4" />
                    Notes
                  </Label>
                  <motion.div
                    whileFocus="focus"
                    whileTap="tap"
                    variants={inputVariants}
                  >
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full min-h-[100px] transition-all border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Enter any additional notes"
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-medium py-3 h-auto text-base shadow-lg gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Add Medication Schedule
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Card>
      
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-5 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1">Smart Scheduling</h3>
          <p className="text-sm text-muted-foreground">
            Optimize patient medication schedules with intelligent timing
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-5 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1">Error Prevention</h3>
          <p className="text-sm text-muted-foreground">
            Reduce medication errors with clear scheduling and reminders
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-white p-5 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1">Patient Care</h3>
          <p className="text-sm text-muted-foreground">
            Improve patient outcomes with consistent medication administration
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorInterface;
