
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Clock, DoorClosed, Pill, Calendar, AlarmClock, StickyNote } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const medication: Medication = {
      id: Date.now().toString(),
      ...formData,
    };
    onMedicationAdd(medication);
    toast({
      title: "Medication Added",
      description: "The medication has been successfully added to the nurse's schedule.",
    });
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
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <Card className="p-6 shadow-lg bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
        <h2 className="text-2xl font-semibold mb-6 text-center text-primary flex items-center justify-center gap-2">
          <Pill className="w-6 h-6" />
          Add Medication Schedule
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient ID
              </Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                className="w-full"
                placeholder="Enter patient ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="flex items-center gap-2">
                <DoorClosed className="w-4 h-4" />
                Room Number
              </Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
                className="w-full"
                placeholder="Enter room number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicineName" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicine Name
            </Label>
            <Input
              id="medicineName"
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              required
              className="w-full"
              placeholder="Enter medicine name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dosage" className="flex items-center gap-2">
                <AlarmClock className="w-4 h-4" />
                Dosage
              </Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
                className="w-full"
                placeholder="Enter dosage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationDays" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Duration (Days)
              </Label>
              <Input
                id="durationDays"
                type="number"
                min="1"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="foodTiming" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Food Timing
              </Label>
              <Select
                value={formData.foodTiming}
                onValueChange={(value) => setFormData({ ...formData, foodTiming: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Before Food</SelectItem>
                  <SelectItem value="after">After Food</SelectItem>
                  <SelectItem value="with">With Food</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full min-h-[100px]"
              placeholder="Enter any additional notes"
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
            <Pill className="w-4 h-4" />
            Add Medication
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DoctorInterface;
