import { create } from 'zustand';
import type { Session, SessionMode, Step, Analysis, Diagram, Space } from 'clarios-types/index';

interface SessionState {
  // Current session
  currentSession: Session | null;
  currentSpace: Space | null;
  currentAnalysis: Analysis | null;
  currentDiagram: Diagram | null;
  currentStepIndex: number;
  steps: Step[];

  // Actions
  setCurrentSession: (session: Session) => void;
  setCurrentSpace: (space: Space) => void;
  setCurrentAnalysis: (analysis: Analysis) => void;
  setCurrentDiagram: (diagram: Diagram) => void;
  setSteps: (steps: Step[]) => void;
  setCurrentStepIndex: (index: number) => void;
  advanceStep: () => void;
  completeStep: () => void;
  skipStep: () => void;
  resetSession: () => void;

  // Mode selection
  selectedMode: SessionMode | null;
  setSelectedMode: (mode: SessionMode) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  currentSession: null,
  currentSpace: null,
  currentAnalysis: null,
  currentDiagram: null,
  currentStepIndex: 0,
  steps: [],
  selectedMode: null,

  setCurrentSession: (session) => set({ currentSession: session }),
  setCurrentSpace: (space) => set({ currentSpace: space }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setCurrentDiagram: (diagram) => set({ currentDiagram: diagram }),
  setSteps: (steps) => set({ steps, currentStepIndex: 0 }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  advanceStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    }
  },

  completeStep: () => {
    const { currentStepIndex, steps } = get();
    const updatedSteps = [...steps];
    if (updatedSteps[currentStepIndex]) {
      updatedSteps[currentStepIndex] = {
        ...updatedSteps[currentStepIndex],
        status: 'done',
        completed_at: new Date().toISOString(),
      };
      set({ steps: updatedSteps });
    }
  },

  skipStep: () => {
    const { currentStepIndex, steps } = get();
    const updatedSteps = [...steps];
    if (updatedSteps[currentStepIndex]) {
      updatedSteps[currentStepIndex] = {
        ...updatedSteps[currentStepIndex],
        status: 'skipped',
      };
      set({ steps: updatedSteps });
    }
  },

  resetSession: () =>
    set({
      currentSession: null,
      currentSpace: null,
      currentAnalysis: null,
      currentDiagram: null,
      currentStepIndex: 0,
      steps: [],
      selectedMode: null,
    }),

  setSelectedMode: (mode) => set({ selectedMode: mode }),
}));
