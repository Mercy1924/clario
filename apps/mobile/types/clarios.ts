// Clarios App Types
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
  time_estimate: number | null;
  status: StepStatus;
  completed_at: string | null;
  created_at: string;
}

export interface Substep {
  id: string;
  title: string;
  completed: boolean;
}
