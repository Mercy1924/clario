import { supabase } from './supabase';
import type { SessionMode, SessionStatus, DescriptionMethod, StepStatus } from './database.types';

// ============================================================================
// SESSIONS
// ============================================================================

export const createSession = async (mode: SessionMode) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      mode,
      status: 'active',
    })
    .select()
    .single();

  return { data, error };
};

export const getSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  return { data, error };
};

export const updateSessionStatus = async (
  sessionId: string,
  status: SessionStatus,
  completedAt?: string
) => {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      status,
      completed_at: completedAt || new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single();

  return { data, error };
};

export const getUserSessions = async () => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, spaces(*), analysis(*)')
    .order('created_at', { ascending: false });

  return { data, error };
};

// ============================================================================
// SPACES
// ============================================================================

export const createSpace = async (space: {
  session_id: string;
  name?: string;
  type?: string;
  goal?: string;
  description_method: DescriptionMethod;
  images: string[];
}) => {
  const { data, error } = await supabase
    .from('spaces')
    .insert(space)
    .select()
    .single();

  return { data, error };
};

export const updateSpace = async (
  spaceId: string,
  updates: Partial<typeof createSpace>
) => {
  const { data, error } = await supabase
    .from('spaces')
    .update(updates)
    .eq('id', spaceId)
    .select()
    .single();

  return { data, error };
};

// ============================================================================
// ANALYSIS
// ============================================================================

export const createAnalysis = async (analysis: {
  session_id: string;
  annotated_image_url?: string;
  findings?: unknown[];
  mode_recommendation?: SessionMode;
  mode_rationale?: string;
  context_confirmed?: boolean;
}) => {
  const { data, error } = await supabase
    .from('analysis')
    .insert(analysis)
    .select()
    .single();

  return { data, error };
};

export const updateAnalysis = async (
  analysisId: string,
  updates: Partial<typeof createAnalysis>
) => {
  const { data, error } = await supabase
    .from('analysis')
    .update(updates)
    .eq('id', analysisId)
    .select()
    .single();

  return { data, error };
};

export const getAnalysis = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('analysis')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  return { data, error };
};

// ============================================================================
// DIAGRAMS
// ============================================================================

export const createDiagram = async (diagram: {
  session_id: string;
  before_svg: string;
  after_svg: string;
  annotations?: unknown[];
}) => {
  const { data, error } = await supabase
    .from('diagrams')
    .insert(diagram)
    .select()
    .single();

  return { data, error };
};

export const getDiagram = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('diagrams')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  return { data, error };
};

// ============================================================================
// STEPS
// ============================================================================

export const createSteps = async (steps: Array<{
  session_id: string;
  step_order: number;
  title: string;
  substeps?: unknown[];
  time_estimate?: number;
  status?: StepStatus;
}>) => {
  const { data, error } = await supabase
    .from('steps')
    .insert(steps)
    .select();

  return { data, error };
};

export const getSteps = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('session_id', sessionId)
    .order('step_order', { ascending: true });

  return { data, error };
};

export const updateStep = async (
  stepId: string,
  updates: {
    status?: StepStatus;
    completed_at?: string;
  }
) => {
  const { data, error } = await supabase
    .from('steps')
    .update(updates)
    .eq('id', stepId)
    .select()
    .single();

  return { data, error };
};

export const updateStepStatus = async (
  stepId: string,
  status: StepStatus
) => {
  const completedAt = status === 'done' ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('steps')
    .update({
      status,
      completed_at: completedAt,
    })
    .eq('id', stepId)
    .select()
    .single();

  return { data, error };
};
