
// Utility functions for handling audio playback
export const createAudioPlayer = (soundUrl: string, shouldLoop: boolean = false, volume: number = 1.0) => {
  const audio = new Audio(soundUrl);
  audio.loop = shouldLoop;
  audio.volume = volume;
  
  return audio;
};

export const playSound = (audio: HTMLAudioElement | null) => {
  if (!audio) return;
  
  audio.play().catch(error => {
    console.error("Error playing audio:", error);
  });
};

export const pauseSound = (audio: HTMLAudioElement | null) => {
  if (!audio) return;
  
  audio.pause();
};

export const createRepeatingSound = (
  audio: HTMLAudioElement | null,
  intervalMs: number,
  maxCount: number,
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) => {
  if (!audio) return;
  
  playSound(audio);
  
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  
  let playCount = 0;
  intervalRef.current = setInterval(() => {
    if (playCount < maxCount && audio) {
      playSound(audio);
      playCount++;
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, intervalMs);
  
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
};
