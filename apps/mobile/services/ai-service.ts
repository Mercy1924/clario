import { supabase } from '../lib/supabase';

/**
 * AI Service - Handles all OpenAI GPT-4o Vision API calls
 * Uses Supabase Edge Functions for secure API key management
 */

const EDGE_FUNCTION_URL = supabase.functions.getUrl();

// ============================================================================
// ANALYSIS
// ============================================================================

export interface AnalysisResult {
  annotated_image_url: string;
  findings: Array<{
    id: string;
    label: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    category: 'clutter' | 'cleaning' | 'layout' | 'light' | 'flow';
  }>;
  mode_recommendation: 'tidy' | 'restructure';
  mode_rationale: string;
  context_confirmed: boolean;
  steps: Array<{
    title: string;
    substeps: Array<{ id: string; title: string }>;
    time_estimate: number;
  }>;
}

/**
 * Analyse a space using GPT-4o Vision
 * @param imageUrls - Array of captured image URLs
 * @param context - Optional context from user description
 */
export const analyseSpace = async (
  imageUrls: string[],
  context?: {
    space_type?: string;
    goal?: string;
    mode_preference?: string;
  }
): Promise<AnalysisResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyse-space', {
      body: {
        image_urls: imageUrls,
        context,
      },
    });

    if (error) {
      console.error('Analysis error:', error);
      return null;
    }

    return data as AnalysisResult;
  } catch (error) {
    console.error('Analysis failed:', error);
    return null;
  }
};

// ============================================================================
// DIAGRAM GENERATION
// ============================================================================

export interface DiagramResult {
  before_svg: string;
  after_svg: string;
  annotations: Array<{
    id: string;
    label: string;
    position: { x: number; y: number };
    change?: string;
  }>;
}

/**
 * Generate before/after layout diagram using GPT-4o Vision
 * @param imageUrls - Array of captured image URLs
 */
export const generateDiagram = async (
  imageUrls: string[]
): Promise<DiagramResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-diagram', {
      body: {
        image_urls: imageUrls,
      },
    });

    if (error) {
      console.error('Diagram generation error:', error);
      return null;
    }

    return data as DiagramResult;
  } catch (error) {
    console.error('Diagram generation failed:', error);
    return null;
  }
};

/**
 * Request an alternative layout variation
 */
export const generateAlternativeDiagram = async (
  imageUrls: string[],
  previousDiagram: DiagramResult
): Promise<DiagramResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-diagram', {
      body: {
        image_urls: imageUrls,
        variation_request: 'Generate an alternative layout arrangement',
        previous_diagram: previousDiagram,
      },
    });

    if (error) {
      console.error('Alternative diagram error:', error);
      return null;
    }

    return data as DiagramResult;
  } catch (error) {
    console.error('Alternative diagram generation failed:', error);
    return null;
  }
};

// ============================================================================
// STEP GENERATION
// ============================================================================

/**
 * Generate steps for a session (called automatically by analyseSpace, but available separately)
 */
export const generateSteps = async (
  mode: 'tidy' | 'restructure',
  analysis: AnalysisResult,
  diagram?: DiagramResult
): Promise<Array<{
  title: string;
  substeps: Array<{ id: string; title: string }>;
  time_estimate: number;
}>> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-steps', {
      body: {
        mode,
        analysis,
        diagram,
      },
    });

    if (error) {
      console.error('Step generation error:', error);
      return [];
    }

    return data.steps || [];
  } catch (error) {
    console.error('Step generation failed:', error);
    return [];
  }
};

// ============================================================================
// VOICE COMMANDS (for Tidy Mode voice interaction)
// ============================================================================

export type VoiceCommand = 'done' | 'next' | 'repeat' | 'back';

/**
 * Process voice command and return appropriate action
 */
export const processVoiceCommand = async (
  command: string
): Promise<VoiceCommand | null> => {
  const normalized = command.toLowerCase().trim();

  if (normalized.includes('done') || normalized.includes('finish')) {
    return 'done';
  }
  if (normalized.includes('next') || normalized.includes('continue')) {
    return 'next';
  }
  if (normalized.includes('repeat') || normalized.includes('again')) {
    return 'repeat';
  }
  if (normalized.includes('back') || normalized.includes('previous')) {
    return 'back';
  }

  return null;
};
