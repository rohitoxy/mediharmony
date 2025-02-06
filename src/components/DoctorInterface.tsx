import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      <Card className="p-6 shadow-lg bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center text-primary">Add Medication Schedule</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
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
              <Label htmlFor="roomNumber">Room Number</Label>
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
            <Label htmlFor="medicineName">Medicine Name</Label>
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
              <Label htmlFor="dosage">Dosage</Label>
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
              <Label htmlFor="durationDays">Duration (Days)</Label>
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
              <Label htmlFor="foodTiming">Food Timing</Label>
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
              <Label htmlFor="time">Time</Label>
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full min-h-[100px]"
              placeholder="Enter any additional notes"
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
            Add Medication
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DoctorInterface;