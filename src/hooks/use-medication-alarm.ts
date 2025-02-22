
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
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    };
  }, [medications]);

  const playAlarmSequence = () => {
    if (!isSoundEnabled || !audioRef.current) return;

    // Play immediately
    audioRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });

    // Clear any existing interval
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
    }

    // Set up interval to play sound every 10 seconds for 2 minutes
    let playCount = 0;
    soundIntervalRef.current = setInterval(() => {
      if (playCount < 12 && audioRef.current) { // 12 times = 2 minutes
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        playCount++;
      } else if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }, 10000); // Every 10 seconds
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
      const targetHour = parseInt(hours);
      const targetMinute = parseInt(minutes);
      
      // Check if we're within 5 minutes of the target time
      const isNearTime = (
        (currentHours === targetHour && Math.abs(currentMinutes - targetMinute) <= 5) ||
        (currentHours === targetHour - 1 && targetMinute < 5 && currentMinutes >= 55) ||
        (currentHours === targetHour + 1 && targetMinute >= 55 && currentMinutes < 5)
      );

      const isExactTime = currentHours === targetHour && currentMinutes === targetMinute;

      if (isNearTime && !alertedMedsRef.current.has(med.id)) {
        alertedMedsRef.current.add(med.id);
        
        // Show toast with different variants based on urgency
        toast({
          title: isExactTime ? "🚨 MEDICATION DUE NOW!" : "⚠️ Medication Due Soon!",
          description: `Patient ${med.patientId} in Room ${med.roomNumber} needs ${med.medicineName}`,
          variant: isExactTime ? "destructive" : "default",
          duration: 30000, // Show for 30 seconds
        });

        if (isExactTime) {
          playAlarmSequence();
        }

        // Set up a reminder if the medication isn't marked as completed
        setTimeout(() => {
          if (!med.completed) {
            toast({
              title: "⏰ Reminder: Medication Still Due!",
              description: `Patient ${med.patientId} still needs ${med.medicineName}`,
              variant: "destructive",
              duration: 30000,
            });
            playAlarmSequence();
          }
        }, 120000); // 2 minutes later
      }
    });
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled && audioRef.current) {
      audioRef.current.pause();
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }
  };

  return {
    currentTime,
    isSoundEnabled,
    toggleSound,
  };
};
