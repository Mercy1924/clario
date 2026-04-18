// Mock Data for Testing Session Flow (No AI Required)
// Use these to test the full UX before integrating real AI

import type { Analysis, Diagram, Step, Space } from '../types/clarios';

// ============================================================================
// MOCK ANALYSIS - TIDY MODE
// ============================================================================

export const mockTidyAnalysis: Analysis = {
  id: 'mock-analysis-1',
  session_id: 'mock-session-1',
  annotated_image_url: null,
  findings: [
    {
      id: 'finding-1',
      label: 'Surface clutter',
      description: 'Desk and bedside table have accumulated items',
      severity: 'medium',
      category: 'clutter',
    },
    {
      id: 'finding-2',
      label: 'Floor items',
      description: 'Several items on floor that need relocating',
      severity: 'low',
      category: 'clutter',
    },
    {
      id: 'finding-3',
      label: 'Dust accumulation',
      description: 'Visible dust on horizontal surfaces',
      severity: 'low',
      category: 'cleaning',
    },
  ],
  mode_recommendation: 'tidy',
  mode_rationale: 'This space needs decluttering and organisation before any layout changes would help.',
  context_confirmed: true,
  created_at: new Date().toISOString(),
};

// ============================================================================
// MOCK ANALYSIS - RESTRUCTURE MODE
// ============================================================================

export const mockRestructureAnalysis: Analysis = {
  id: 'mock-analysis-2',
  session_id: 'mock-session-2',
  annotated_image_url: null,
  findings: [
    {
      id: 'finding-1',
      label: 'Poor desk placement',
      description: 'Desk is facing away from natural light source',
      severity: 'medium',
      category: 'layout',
    },
    {
      id: 'finding-2',
      label: 'Traffic flow blocked',
      description: 'Chair path intersects with door swing',
      severity: 'low',
      category: 'flow',
    },
    {
      id: 'finding-3',
      label: 'Unused corner',
      description: 'Far corner has no defined purpose',
      severity: 'low',
      category: 'layout',
    },
  ],
  mode_recommendation: 'restructure',
  mode_rationale: 'This space would benefit from furniture repositioning to improve light usage and flow.',
  context_confirmed: true,
  created_at: new Date().toISOString(),
};

// ============================================================================
// MOCK DIAGRAM - RESTRUCTURE MODE
// ============================================================================

export const mockDiagram: Diagram = {
  id: 'mock-diagram-1',
  session_id: 'mock-session-2',
  before_svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="400" height="300" fill="#f5f5f5" stroke="#ddd" stroke-width="2"/>
    <!-- Door -->
    <rect x="0" y="120" width="10" height="60" fill="#8b4513"/>
    <path d="M10 120 Q 50 120 50 180" stroke="#8b4513" stroke-width="2" fill="none"/>
    <!-- Window -->
    <rect x="150" y="0" width="100" height="10" fill="#87ceeb"/>
    <!-- Desk (wrong position) -->
    <rect x="280" y="200" width="80" height="50" fill="#654321" stroke="#333"/>
    <text x="320" y="230" text-anchor="middle" fill="#fff" font-size="12">Desk</text>
    <!-- Chair -->
    <rect x="260" y="180" width="30" height="30" fill="#555"/>
    <!-- Bed -->
    <rect x="20" y="180" width="100" height="100" fill="#4a90a4" stroke="#333"/>
    <text x="70" y="240" text-anchor="middle" fill="#fff" font-size="12">Bed</text>
    <!-- Nightstand -->
    <rect x="130" y="200" width="40" height="40" fill="#8b4513"/>
  </svg>`,
  after_svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="400" height="300" fill="#f5f5f5" stroke="#ddd" stroke-width="2"/>
    <!-- Door -->
    <rect x="0" y="120" width="10" height="60" fill="#8b4513"/>
    <path d="M10 120 Q 50 120 50 180" stroke="#8b4513" stroke-width="2" fill="none"/>
    <!-- Window -->
    <rect x="150" y="0" width="100" height="10" fill="#87ceeb"/>
    <!-- Desk (new position - facing window) -->
    <rect x="140" y="20" width="120" height="50" fill="#654321" stroke="#333"/>
    <text x="200" y="50" text-anchor="middle" fill="#fff" font-size="12">Desk</text>
    <!-- Chair -->
    <rect x="185" y="70" width="30" height="30" fill="#555"/>
    <!-- Bed (same position) -->
    <rect x="20" y="180" width="100" height="100" fill="#4a90a4" stroke="#333"/>
    <text x="70" y="240" text-anchor="middle" fill="#fff" font-size="12">Bed</text>
    <!-- Nightstand -->
    <rect x="130" y="200" width="40" height="40" fill="#8b4513"/>
    <!-- Reading nook in freed corner -->
    <circle cx="320" cy="220" r="30" fill="#90a4ae" stroke="#555"/>
    <text x="320" y="225" text-anchor="middle" fill="#333" font-size="10">Nook</text>
  </svg>`,
  annotations: [
    {
      id: 'annotation-1',
      label: 'Desk',
      position: { x: 200, y: 50 },
      change: 'Move to north wall, facing window',
    },
    {
      id: 'annotation-2',
      label: 'Chair',
      position: { x: 200, y: 85 },
      change: 'Reposition with desk',
    },
    {
      id: 'annotation-3',
      label: 'Corner',
      position: { x: 320, y: 220 },
      change: 'Add reading nook',
    },
  ],
  created_at: new Date().toISOString(),
};

// ============================================================================
// MOCK STEPS - TIDY MODE
// ============================================================================

export const mockTidySteps: Step[] = [
  {
    id: 'step-1',
    session_id: 'mock-session-1',
    step_order: 1,
    title: 'Clear the desk surface',
    substeps: [
      { id: 'sub-1', title: 'Remove all items from the desk', completed: false },
      { id: 'sub-2', title: 'Wipe the surface with a cloth', completed: false },
      { id: 'sub-3', title: 'Return only essential items', completed: false },
    ],
    time_estimate: 10,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'step-2',
    session_id: 'mock-session-1',
    step_order: 2,
    title: 'Tidy the bedside table',
    substeps: [
      { id: 'sub-1', title: 'Remove any trash', completed: false },
      { id: 'sub-2', title: 'Group similar items together', completed: false },
      { id: 'sub-3', title: 'Wipe the surface', completed: false },
    ],
    time_estimate: 8,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'step-3',
    session_id: 'mock-session-1',
    step_order: 3,
    title: 'Pick up items from the floor',
    substeps: [
      { id: 'sub-1', title: 'Collect all items from the floor', completed: false },
      { id: 'sub-2', title: 'Sort into: keep, relocate, bin', completed: false },
      { id: 'sub-3', title: 'Put away keep items', completed: false },
    ],
    time_estimate: 12,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'step-4',
    session_id: 'mock-session-1',
    step_order: 4,
    title: 'Dust all horizontal surfaces',
    substeps: [
      { id: 'sub-1', title: 'Dust the desk', completed: false },
      { id: 'sub-2', title: 'Dust the bedside table', completed: false },
      { id: 'sub-3', title: 'Dust any shelves', completed: false },
    ],
    time_estimate: 10,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
];

// ============================================================================
// MOCK STEPS - RESTRUCTURE MODE
// ============================================================================

export const mockRestructureSteps: Step[] = [
  {
    id: 'step-1',
    session_id: 'mock-session-2',
    step_order: 1,
    title: 'Move the desk to the north wall',
    substeps: [
      { id: 'sub-1', title: 'Clear all items from the desk', completed: false },
      { id: 'sub-2', title: 'Move the desk to face the window', completed: false },
      { id: 'sub-3', title: 'Position the chair', completed: false },
    ],
    time_estimate: 15,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'step-2',
    session_id: 'mock-session-2',
    step_order: 2,
    title: 'Clear the far corner',
    substeps: [
      { id: 'sub-1', title: 'Remove any items from the corner', completed: false },
      { id: 'sub-2', title: 'Vacuum or sweep the area', completed: false },
    ],
    time_estimate: 8,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'step-3',
    session_id: 'mock-session-2',
    step_order: 3,
    title: 'Set up the reading nook',
    substeps: [
      { id: 'sub-1', title: 'Place a small chair or cushion in the corner', completed: false },
      { id: 'sub-2', title: 'Add a side table or shelf nearby', completed: false },
      { id: 'sub-3', title: 'Arrange books and a lamp', completed: false },
    ],
    time_estimate: 12,
    status: 'pending',
    completed_at: null,
    created_at: new Date().toISOString(),
  },
];

// ============================================================================
// MOCK SPACE
// ============================================================================

export const mockSpace: Space = {
  id: 'mock-space-1',
  session_id: 'mock-session-1',
  name: 'Bedroom',
  type: 'Bedroom',
  goal: 'More space to work',
  description_method: 'type',
  images: [],
  created_at: new Date().toISOString(),
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getMockAnalysis = (mode: 'tidy' | 'restructure'): Analysis => {
  return mode === 'tidy' ? mockTidyAnalysis : mockRestructureAnalysis;
};

export const getMockSteps = (mode: 'tidy' | 'restructure'): Step[] => {
  return mode === 'tidy' ? mockTidySteps : mockRestructureSteps;
};

export const simulateApiDelay = async <T>(data: T, ms: number = 1500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
};
