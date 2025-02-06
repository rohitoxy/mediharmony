import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, DoorClosed, Pill, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const NurseInterface = ({ medications }: { medications: Medication[] }) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audioRef.current.loop = false;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkMedications();
    }, 1000);

    return () => {
      clearInterval(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [medications]);

  const playAlarm = () => {
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

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
          description: `Patient ${med.patientId} in Room ${med.roomNumber} needs ${med.medicineName}`,
          variant: "destructive",
        });
        playAlarm();
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

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary">Medication Schedule</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="ml-2"
          title={isSoundEnabled ? "Disable sound" : "Enable sound"}
        >
          {isSoundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <Card
            key={medication.id}
            className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
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
                  <Clock className="w-4 h-4 mr-1" />
                  {medication.time}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Patient ID: {medication.patientId}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DoorClosed className="w-4 h-4 mr-2" />
                  <span>Room: {medication.roomNumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Pill className="w-4 h-4 mr-2" />
                  <span>{medication.medicineName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-600">Dosage: {medication.dosage}</p>
                <p className="text-sm text-gray-600">Duration: {medication.durationDays} days</p>
                <p className="text-sm text-gray-600">Timing: {medication.foodTiming} food</p>
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