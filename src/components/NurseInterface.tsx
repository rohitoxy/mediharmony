import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  time: string;
  notes: string;
}

const NurseInterface = ({ medications }: { medications: Medication[] }) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkMedications();
    }, 1000);

    return () => clearInterval(timer);
  }, [medications]);

  const checkMedications = () => {
    medications.forEach((med) => {
      const [hours, minutes] = med.time.split(":");
      const medicationTime = new Date();
      medicationTime.setHours(parseInt(hours), parseInt(minutes), 0);

      if (
        Math.abs(currentTime.getTime() - medicationTime.getTime()) < 1000 &&
        currentTime.getHours() === parseInt(hours) &&
        currentTime.getMinutes() === parseInt(minutes)
      ) {
        toast({
          title: "Medication Due!",
          description: `Patient ${med.patientId} needs ${med.medicineName}`,
          variant: "destructive",
        });
      }
    });
  };

  const getTimeStatus = (medicationTime: string) => {
    const [hours, minutes] = medicationTime.split(":");
    const medTime = new Date();
    medTime.setHours(parseInt(hours), parseInt(minutes), 0);
    const timeDiff = medTime.getTime() - currentTime.getTime();

    if (timeDiff < 0) return "past";
    if (timeDiff < 1800000) return "upcoming"; // 30 minutes
    return "future";
  };

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center text-foreground">Medication Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <Card
            key={medication.id}
            className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <Badge
                    variant="outline"
                    className={`mb-2 ${
                      getTimeStatus(medication.time) === "upcoming"
                        ? "bg-accent text-white"
                        : getTimeStatus(medication.time) === "past"
                        ? "bg-muted"
                        : "bg-primary text-white"
                    }`}
                  >
                    {medication.time}
                  </Badge>
                  <h3 className="text-lg font-semibold">Patient ID: {medication.patientId}</h3>
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">{medication.medicineName}</p>
                <p className="text-sm text-muted-foreground">Dosage: {medication.dosage}</p>
              </div>
              {medication.notes && (
                <p className="text-sm text-muted-foreground border-t pt-2">{medication.notes}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NurseInterface;