// Clarios Shared Types
// April 2026

// ============================================================================
// DATABASE TYPES
// ============================================================================

export type SessionMode = 'tidy' | 'restructure';
export type SessionStatus = 'active' | 'complete' | 'abandoned';
export type StepStatus = 'pending' | 'done' | 'skipped';
export type DescriptionMethod = 'type' | 'voice' | 'skipped';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  voiceSpeed?: number;
  ttsVoice?: string;
  fontSize?: 'small' | 'medium' | 'large';
  notificationsEnabled?: boolean;
}

export interface Session {
  id: string;
  user_id: string;
  mode: SessionMode;
  status: SessionStatus;
  created_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface Space {
  id: string;
  session_id: string;
  name: string | null;
  type: string | null;
  goal: string | null;
  description_method: DescriptionMethod | null;
  images: string[];
  created_at: string;
}

export interface Analysis {
  id: string;
  session_id: string;
  annotated_image_url: string | null;
  findings: AnalysisFinding[];
  mode_recommendation: SessionMode | null;
  mode_rationale: string | null;
  context_confirmed: boolean;
  created_at: string;
}

export interface AnalysisFinding {
  id: string;
  label: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  category?: 'clutter' | 'cleaning' | 'layout' | 'light' | 'flow';
}

export interface Diagram {
  id: string;
  session_id: string;
  before_svg: string;
  after_svg: string;
  annotations: DiagramAnnotation[];
  created_at: string;
}

export interface DiagramAnnotation {
  id: string;
  label: string;
  position: { x: number; y: number };
  change?: string;
}

export interface Step {
  id: string;
  session_id: string;
  step_order: number;
  title: string;
  substeps: Substep[];
  time_estimate: number | null; // minutes
  status: StepStatus;
  completed_at: string | null;
  created_at: string;
}

export interface Substep {
  id: string;
  title: string;
  completed: boolean;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateSessionRequest {
  mode?: SessionMode;
  space?: {
    type?: string;
    goal?: string;
    description_method: DescriptionMethod;
  };
}

export interface CreateSessionResponse {
  session: Session;
  space: Space;
}

export interface AnalysisRequest {
  session_id: string;
  image_urls: string[];
  context?: {
    space_type?: string;
    goal?: string;
  };
}

export interface AnalysisResponse {
  annotated_image_url: string;
  findings: AnalysisFinding[];
  mode_recommendation: SessionMode;
  mode_rationale: string;
  context_confirmed: boolean;
}

export interface GenerateStepsRequest {
  session_id: string;
  mode: SessionMode;
  analysis: Analysis;
  diagram?: Diagram;
}

export interface GenerateStepsResponse {
  steps: Omit<Step, 'completed_at'>[];
}

export interface GenerateDiagramRequest {
  session_id: string;
  image_urls: string[];
}

export interface GenerateDiagramResponse {
  before_svg: string;
  after_svg: string;
  annotations: DiagramAnnotation[];
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface StepCardProps {
  step: Step;
  stepNumber: number;
  totalSteps: number;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
  mode: SessionMode;
}

export interface VoiceModeProps {
  step: Step;
  annotatedImageUrl: string;
  transcript: string;
  onVoiceCommand: (command: 'done' | 'next' | 'repeat' | 'back') => void;
  onSwitchToText: () => void;
}

export interface CameraCaptureProps {
  onCapture: (images: string[]) => void;
  mode: 'photo' | 'multi' | 'scan';
  contextSet?: string | null;
}
