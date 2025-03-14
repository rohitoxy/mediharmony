
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bell, Calendar, Pill, Plus, X } from "lucide-react";

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
    dosage: "1",
    durationDays: 30,
    foodTiming: "with",
    time: "10:00",
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
    
    toast({
      title: "Medication Added",
      description: "The medication has been successfully added to the nurse's schedule.",
    });
    
    setTimeout(() => {
      setFormData({
        patientId: "",
        roomNumber: "",
        medicineName: "",
        dosage: "1",
        durationDays: 30,
        foodTiming: "with",
        time: "10:00",
        notes: "",
      });
      setFormSubmitted(false);
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

  return (
    <div className="max-w-md mx-auto">
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
              <div className="flex items-center mb-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold ml-2">Add Plan</h1>
              </div>

              {/* Pills name section */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Pills name</Label>
                <div className="flex items-center">
                  <div className="w-full relative bg-gray-100 rounded-xl p-3 flex items-center">
                    <Pill className="h-5 w-5 mr-3 text-gray-500" />
                    <Input
                      value={formData.medicineName}
                      onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                      required
                      className="border-none bg-transparent focus:ring-0 p-0 w-full h-auto text-base"
                      placeholder="Medicine name"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full absolute right-2 text-green-500"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Amount & How long section */}
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

              {/* Hidden fields that are not in the design but needed for functionality */}
              <div className="hidden">
                <Input
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                  placeholder="Patient ID"
                />
                <Input
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                  placeholder="Room Number"
                />
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes"
                />
              </div>

              {/* Food & Pills section */}
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

              {/* Notification section */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Notification</Label>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-3 bg-gray-100 rounded-xl h-12 w-12 flex items-center justify-center text-green-500"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Submit button */}
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
    </div>
  );
};

export default DoctorInterface;
