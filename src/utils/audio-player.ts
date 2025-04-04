
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
  intervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  enhancedPlayback: boolean = false
) => {
  if (!audio) return;
  
  // Clear any existing interval
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  
  // Enhanced playback for low priority sounds to make them more noticeable
  if (enhancedPlayback) {
    // Briefly boost the volume for better attention-grabbing
    const originalVolume = audio.volume;
    audio.volume = Math.min(originalVolume * 1.2, 1.0);
    
    // Play sound immediately
    playSound(audio);
    
    // Reset volume after a short delay
    setTimeout(() => {
      if (audio) audio.volume = originalVolume;
    }, 300);
  } else {
    // Normal playback
    playSound(audio);
  }
  
  let playCount = 1; // Start at 1 because we already played once
  
  // Set up interval for repeated playing
  intervalRef.current = setInterval(() => {
    if (playCount < maxCount && audio) {
      if (enhancedPlayback) {
        // For enhanced sounds, alternate volume slightly to create rhythm
        const volumeMultiplier = playCount % 2 === 0 ? 1.1 : 1.0;
        const originalVolume = audio.volume;
        audio.volume = Math.min(originalVolume * volumeMultiplier, 1.0);
        playSound(audio);
        
        // Reset volume after a short delay
        setTimeout(() => {
          if (audio) audio.volume = originalVolume;
        }, 300);
      } else {
        playSound(audio);
      }
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
