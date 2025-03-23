
// Utility functions for handling audio playback
export const createAudioPlayer = (soundUrl: string, shouldLoop: boolean = false, volume: number = 1.0) => {
  const audio = new Audio(soundUrl);
  audio.loop = shouldLoop;
  audio.volume = volume;
  
  return audio;
};

export const playSound = (audio: HTMLAudioElement | null) => {
  if (!audio) return;
  
  // Reset the audio to start from the beginning
  audio.currentTime = 0;
  
  audio.play().catch(error => {
    console.error("Error playing audio:", error);
  });
};

export const pauseSound = (audio: HTMLAudioElement | null) => {
  if (!audio) return;
  
  audio.pause();
  audio.currentTime = 0;
};

export const createRepeatingSound = (
  audio: HTMLAudioElement | null,
  intervalMs: number,
  maxCount: number,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
  if (!audio) return;
  
  // Clear any existing interval
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  
  // Play sound immediately
  playSound(audio);
  
  let playCount = 1; // Start at 1 because we already played once
  
  // Set up interval for repeated playing
  intervalRef.current = setInterval(() => {
    if (playCount < maxCount && audio) {
      playSound(audio);
      playCount++;
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, intervalMs);
  
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
};
