
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  patientId: string;
  roomNumber: string;
  medicineName: string;
  time: string;
  completed?: boolean;
}

export const useMedicationAlarm = (medications: Medication[]) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const alertedMedsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
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
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    
    medications.forEach((med) => {
      if (med.completed) {
        alertedMedsRef.current.delete(med.id);
        return;
      }
      
      const [hours, minutes] = med.time.split(":");
      const isExactTime = currentHours === parseInt(hours) && currentMinutes === parseInt(minutes);

      if (isExactTime && !alertedMedsRef.current.has(med.id)) {
        alertedMedsRef.current.add(med.id);
        toast({
          title: "⚠️ Medication Due!",
          description: `Patient ${med.patientId} in Room ${med.roomNumber} needs ${med.medicineName}`,
          variant: "destructive",
          duration: 10000, // Show for 10 seconds
        });
        playAlarm();
      }
    });
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled && audioRef.current) {
      audioRef.current.pause();
    }
  };

  return {
    currentTime,
    isSoundEnabled,
    toggleSound,
  };
};
