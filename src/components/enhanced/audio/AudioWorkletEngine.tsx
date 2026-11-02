import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';

// High-Performance Audio Engine using AudioWorklet
// Runs on dedicated audio thread for zero-latency, glitch-free synthesis

interface AudioEngineContextType {
  play: (sound: ClaySound, intensity?: number, position?: { x: number; y: number }) => void;
  enable: () => void;
  disable: () => void;
  isEnabled: boolean;
  isReady: boolean;
}

type ClaySound = 'click' | 'squish' | 'pop' | 'hover' | 'success' | 'error' | 'slide';

const AudioEngineContext = createContext<AudioEngineContextType>({
  play: () => {},
  enable: () => {},
  disable: () => {},
  isEnabled: false,
  isReady: false,
});

export const useMochiAudio = () => useContext(AudioEngineContext);

export const AudioWorkletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const readyRef = useRef(false);

  // Initialize AudioWorklet
  const initAudio = useCallback(async () => {
    if (audioCtxRef.current) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Load and register AudioWorklet processor
      await ctx.audioWorklet.addModule(`${import.meta.env.BASE_URL}assets/ClaySoundProcessor.js`);

      // Create worklet node
      const workletNode = new AudioWorkletNode(ctx, 'clay-sound-processor', {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2], // Stereo
      });

      // Connect to destination
      workletNode.connect(ctx.destination);
      workletNodeRef.current = workletNode;

      setIsReady(true);
      readyRef.current = true;

      // Resume context (needed for autoplay policy)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch (err) {
      console.warn('AudioWorklet not supported, falling back to basic audio:', err);
      // Fallback to basic AudioContext without worklet
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
    }
  }, []);

  const play = useCallback((sound: ClaySound, intensity: number = 0.5, position?: { x: number; y: number }) => {
    if (!isEnabled) return;

    // Initialize on first play (user gesture required)
    if (!audioCtxRef.current) {
      initAudio();
      return;
    }

    const ctx = audioCtxRef.current;

    // Resume if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Use AudioWorklet if available
    if (workletNodeRef.current && readyRef.current) {
      workletNodeRef.current.port.postMessage({
        type: 'trigger',
        sound,
        intensity,
        position: position || { x: 0.5, y: 0.5 },
      });
    } else {
      // Fallback synthesis
      playFallback(ctx, sound, intensity);
    }
  }, [initAudio]);

  // Fallback synthesis using standard Web Audio API
  const playFallback = (ctx: AudioContext, sound: ClaySound, intensity: number) => {
    const now = ctx.currentTime;

    switch (sound) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 - intensity * 400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'squish': {
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(200, now + 0.3);
        filter.Q.value = 3;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.connect(filter).connect(gain).connect(ctx.destination);
        noise.start();
        break;
      }
      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'hover': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 400;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'success': {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, now + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
        break;
      }
      case 'error': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 200;
        osc2.type = 'square';
        osc2.frequency.value = 207;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
        break;
      }
      case 'slide': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
    }
  };

  const enable = useCallback(() => {
    setIsEnabled(true);
    initAudio();
  }, [initAudio]);

  const disable = useCallback(() => {
    setIsEnabled(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const value: AudioEngineContextType = {
    play,
    enable,
    disable,
    isEnabled,
    isReady,
  };

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
};

export default AudioEngineContext;
