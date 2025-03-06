
import { useCallback, useRef } from "react";
import { createAudioPlayer, createRepeatingSound } from "@/utils/audio-player";

export const useAlarmSounds = (isSoundEnabled: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loudAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loudSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeAudio = useCallback(() => {
    audioRef.current = createAudioPlayer("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", false);
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
      }
      if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
      }
    };
  }, []);

  const playAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !audioRef.current) return;
    createRepeatingSound(audioRef.current, 10000, 12, soundIntervalRef);
  }, [isSoundEnabled]);

  const playLoudAlarmSequence = useCallback(() => {
    if (!isSoundEnabled || !loudAudioRef.current) return;
    createRepeatingSound(loudAudioRef.current, 5000, 24, loudSoundIntervalRef);
  }, [isSoundEnabled]);

  const stopSounds = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }
    if (loudAudioRef.current) {
      loudAudioRef.current.pause();
      if (loudSoundIntervalRef.current) {
        clearInterval(loudSoundIntervalRef.current);
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
