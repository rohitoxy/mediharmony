
import { useCallback, useRef } from "react";
import { createAudioPlayer, createRepeatingSound } from "@/utils/audio-player";

export const useAlarmSounds = (isSoundEnabled: boolean) => {
  // Create separate audio refs for each priority level
  const lowPriorityAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediumPriorityAudioRef = useRef<HTMLAudioElement | null>(null);
  const highPriorityAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create separate audio refs for each full screen alert priority
  const fullScreenLowAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullScreenMediumAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullScreenHighAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sound interval refs
  const lowSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediumSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const highSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullScreenLowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullScreenMediumIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullScreenHighIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeAudio = useCallback(() => {
    // Updated sounds for different priority levels - especially improved low priority sound
    lowPriorityAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/1216/1216-preview.mp3", false, 0.7); // More distinct sound
    mediumPriorityAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", false, 0.7);
    highPriorityAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/1285/1285-preview.mp3", false, 0.8);
    
    // Updated full screen alert sounds by priority
    fullScreenLowAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2856/2856-preview.mp3", false, 0.8); // More engaging sound
    fullScreenMediumAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3", false, 0.8);
    fullScreenHighAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2887/2887-preview.mp3", false, 1.0);
    
    return () => {
      // Clean up all audio references
      [
        lowPriorityAudioRef, mediumPriorityAudioRef, highPriorityAudioRef,
        fullScreenLowAudioRef, fullScreenMediumAudioRef, fullScreenHighAudioRef
      ].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
      
      // Clean up all interval references
      [
        lowSoundIntervalRef, mediumSoundIntervalRef, highSoundIntervalRef,
        fullScreenLowIntervalRef, fullScreenMediumIntervalRef, fullScreenHighIntervalRef
      ].forEach(ref => {
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
    let enhancedPlayback = false;
    
    switch (priority) {
      case 'low':
        audioRef = lowPriorityAudioRef;
        intervalRef = lowSoundIntervalRef;
        repeatInterval = 6000; // Slightly more frequent than before
        repeatCount = 4; // More repeats to make it more noticeable
        enhancedPlayback = true; // Use enhanced playback for low priority
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
      createRepeatingSound(audioRef.current, repeatInterval, repeatCount, intervalRef, enhancedPlayback);
    }
  }, [isSoundEnabled]);

  const playFullScreenAlarm = useCallback((priority: 'low' | 'medium' | 'high' = 'high') => {
    if (!isSoundEnabled) return;
    
    // Select the appropriate audio reference based on priority
    let audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    let intervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
    let repeatInterval: number;
    let repeatCount: number;
    let enhancedPlayback = false;
    
    switch (priority) {
      case 'low':
        audioRef = fullScreenLowAudioRef;
        intervalRef = fullScreenLowIntervalRef;
        repeatInterval = 5000; // More frequent for better attention
        repeatCount = 6; // More repeats for better attention
        enhancedPlayback = true; // Use enhanced playback for low priority
        break;
      case 'medium':
        audioRef = fullScreenMediumAudioRef;
        intervalRef = fullScreenMediumIntervalRef;
        repeatInterval = 4000; // Medium frequency
        repeatCount = 10; // Medium repeats
        break;
      case 'high':
        audioRef = fullScreenHighAudioRef;
        intervalRef = fullScreenHighIntervalRef;
        repeatInterval = 2500; // More frequent for high priority
        repeatCount = 15; // More repeats
        break;
      default:
        audioRef = fullScreenHighAudioRef;
        intervalRef = fullScreenHighIntervalRef;
        repeatInterval = 2500;
        repeatCount = 15;
    }
    
    // Play the selected full screen alert sound
    if (audioRef.current) {
      createRepeatingSound(audioRef.current, repeatInterval, repeatCount, intervalRef, enhancedPlayback);
    }
  }, [isSoundEnabled]);

  const stopSounds = useCallback(() => {
    // Stop all sounds and clear all intervals
    [
      lowPriorityAudioRef, mediumPriorityAudioRef, highPriorityAudioRef,
      fullScreenLowAudioRef, fullScreenMediumAudioRef, fullScreenHighAudioRef
    ].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    
    [
      lowSoundIntervalRef, mediumSoundIntervalRef, highSoundIntervalRef,
      fullScreenLowIntervalRef, fullScreenMediumIntervalRef, fullScreenHighIntervalRef
    ].forEach(ref => {
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
      fullScreenLowAudioRef,
      fullScreenMediumAudioRef,
      fullScreenHighAudioRef,
      lowSoundIntervalRef,
      mediumSoundIntervalRef,
      highSoundIntervalRef,
      fullScreenLowIntervalRef,
      fullScreenMediumIntervalRef,
      fullScreenHighIntervalRef
    }
  };
};
