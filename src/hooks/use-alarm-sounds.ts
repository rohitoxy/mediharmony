
import { useCallback, useRef } from "react";
import { createAudioPlayer, createRepeatingSound } from "@/utils/audio-player";

export const useAlarmSounds = (isSoundEnabled: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loudAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loudSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeAudio = useCallback(() => {
    // Use more urgent alert sounds
    audioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", false, 0.8);
    loudAudioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2887/2887-preview.mp3", false, 1.0);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (loudAudioRef.current) {
        loudAudioRef.current.pause();
        loudAudioRef.current = null;
      }
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
      if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
        loudSoundIntervalRef.current = null;
      }
    };
  }, []);

  const playAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !audioRef.current) return;
    // Play alerts more frequently for warning notifications (every 5 seconds, 10 times)
    createRepeatingSound(audioRef.current, 5000, 10, soundIntervalRef);
  }, [isSoundEnabled]);

  const playLoudAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !loudAudioRef.current) return;
    // Play alerts more frequently and more times for critical notifications (every 3 seconds, 20 times)
    createRepeatingSound(loudAudioRef.current, 3000, 20, loudSoundIntervalRef);
  }, [isSoundEnabled]);

  const stopSounds = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    }
    if (loudAudioRef.current) {
      loudAudioRef.current.pause();
      loudAudioRef.current.currentTime = 0;
      if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
        loudSoundIntervalRef.current = null;
      }
    }
  }, []);

  return {
    initializeAudio,
    playAlarmSequence,
    playLoudAlarmSequence,
    stopSounds,
    audioRefs: { audioRef, loudAudioRef, soundIntervalRef, loudSoundIntervalRef }
  };
};
