
import { useCallback, useRef } from "react";
import { createAudioPlayer, createRepeatingSound } from "@/utils/audio-player";

export const useAlarmSounds = (isSoundEnabled: boolean) => {
  // Create separate audio refs for each priority level
  const lowPriorityAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediumPriorityAudioRef = useRef<HTMLAudioElement | null>(null);
  const highPriorityAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullScreenAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sound interval refs
  const lowSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediumSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const highSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullScreenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeAudio = useCallback(() => {
    // Different sounds for different priority levels
    lowPriorityAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3", false, 0.6);
    mediumPriorityAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", false, 0.7);
    highPriorityAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/1285/1285-preview.mp3", false, 0.8);
    fullScreenAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2887/2887-preview.mp3", false, 1.0);
    
    return () => {
      // Clean up all audio references
      [lowPriorityAudioRef, mediumPriorityAudioRef, highPriorityAudioRef, fullScreenAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
      
      // Clean up all interval references
      [lowSoundIntervalRef, mediumSoundIntervalRef, highSoundIntervalRef, fullScreenIntervalRef].forEach(ref => {
        if (ref.current) {
          clearInterval(ref.current);
          ref.current = null;
        }
      });
    };
  }, []);

  const playAlarmByPriority = useCallback((priority: 'low' | 'medium' | 'high') => {
    if (!isSoundEnabled) return;
    
    // Select the appropriate audio reference based on priority
    let audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    let intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
    let repeatInterval: number;
    let repeatCount: number;
    
    switch (priority) {
      case 'low':
        audioRef = lowPriorityAudioRef;
        intervalRef = lowSoundIntervalRef;
        repeatInterval = 8000; // Less frequent for low priority
        repeatCount = 3; // Fewer repeats
        break;
      case 'medium':
        audioRef = mediumPriorityAudioRef;
        intervalRef = mediumSoundIntervalRef;
        repeatInterval = 5000; // Medium frequency
        repeatCount = 5; // Medium repeats
        break;
      case 'high':
        audioRef = highPriorityAudioRef;
        intervalRef = highSoundIntervalRef;
        repeatInterval = 3000; // More frequent for high priority
        repeatCount = 8; // More repeats
        break;
      default:
        audioRef = mediumPriorityAudioRef;
        intervalRef = mediumSoundIntervalRef;
        repeatInterval = 5000;
        repeatCount = 5;
    }
    
    // Play the selected alert sound
    if (audioRef.current) {
      createRepeatingSound(audioRef.current, repeatInterval, repeatCount, intervalRef);
    }
  }, [isSoundEnabled]);

  const playFullScreenAlarm = useCallback(() => {
    if (!isSoundEnabled || !fullScreenAudioRef.current) return;
    
    // Play the more urgent full screen alert sound
    createRepeatingSound(fullScreenAudioRef.current, 2500, 15, fullScreenIntervalRef);
  }, [isSoundEnabled]);

  const stopSounds = useCallback(() => {
    // Stop all sounds and clear all intervals
    [lowPriorityAudioRef, mediumPriorityAudioRef, highPriorityAudioRef, fullScreenAudioRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    
    [lowSoundIntervalRef, mediumSoundIntervalRef, highSoundIntervalRef, fullScreenIntervalRef].forEach(ref => {
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    });
  }, []);

  return {
    initializeAudio,
    playAlarmByPriority,
    playFullScreenAlarm,
    stopSounds,
    audioRefs: { 
      lowPriorityAudioRef,
      mediumPriorityAudioRef,
      highPriorityAudioRef,
      fullScreenAudioRef,
      lowSoundIntervalRef,
      mediumSoundIntervalRef,
      highSoundIntervalRef,
      fullScreenIntervalRef
    }
  };
};
