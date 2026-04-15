import { create } from 'zustand';
import * as Speech from 'expo-speech';

interface VoiceState {
  // State
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  voiceSpeed: number;

  // Actions
  setIsListening: (listening: boolean) => void;
  setTranscript: (text: string) => void;
  setVoiceSpeed: (speed: number) => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  isListening: false,
  isSpeaking: false,
  transcript: '',
  voiceSpeed: 1.0,

  setIsListening: (listening) => set({ isListening: listening }),
  setTranscript: (text) => set({ transcript: text }),
  setVoiceSpeed: (speed) => set({ voiceSpeed: speed }),

  speak: async (text: string) => {
    const { voiceSpeed } = get();
    set({ isSpeaking: true });

    await Speech.speak(text, {
      rate: voiceSpeed,
      onDone: () => set({ isSpeaking: false }),
      onError: () => set({ isSpeaking: false }),
    });
  },

  stopSpeaking: () => {
    Speech.stop();
    set({ isSpeaking: false });
  },

  startListening: async () => {
    // Note: expo-speech only provides TTS, not STT
    // For speech-to-text, you'll need to use a native module
    // This is a placeholder for the actual implementation
    set({ isListening: true });
    // Actual STT implementation would go here
  },

  stopListening: () => {
    set({ isListening: false });
  },
}));
