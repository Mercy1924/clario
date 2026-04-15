export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SessionMode = 'tidy' | 'restructure'
export type SessionStatus = 'active' | 'complete' | 'abandoned'
export type StepStatus = 'pending' | 'done' | 'skipped'
export type DescriptionMethod = 'type' | 'voice' | 'skipped'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          preferences: Json
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          preferences?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          preferences?: Json
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          mode: SessionMode
          status: SessionStatus
          created_at: string
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mode: SessionMode
          status?: SessionStatus
          created_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mode?: SessionMode
          status?: SessionStatus
          created_at?: string
          completed_at?: string | null
          updated_at?: string
        }
      }
      spaces: {
        Row: {
          id: string
          session_id: string
          name: string | null
          type: string | null
          goal: string | null
          description_method: DescriptionMethod | null
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          name?: string | null
          type?: string | null
          goal?: string | null
          description_method?: DescriptionMethod | null
          images?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          name?: string | null
          type?: string | null
          goal?: string | null
          description_method?: DescriptionMethod | null
          images?: string[]
          created_at?: string
        }
      }
      analysis: {
        Row: {
          id: string
          session_id: string
          annotated_image_url: string | null
          findings: Json
          mode_recommendation: SessionMode | null
          mode_rationale: string | null
          context_confirmed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          annotated_image_url?: string | null
          findings?: Json
          mode_recommendation?: SessionMode | null
          mode_rationale?: string | null
          context_confirmed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          annotated_image_url?: string | null
          findings?: Json
          mode_recommendation?: SessionMode | null
          mode_rationale?: string | null
          context_confirmed?: boolean
          created_at?: string
        }
      }
      diagrams: {
        Row: {
          id: string
          session_id: string
          before_svg: string
          after_svg: string
          annotations: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          before_svg: string
          after_svg: string
          annotations?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          before_svg?: string
          after_svg?: string
          annotations?: Json
          created_at?: string
        }
      }
      steps: {
        Row: {
          id: string
          session_id: string
          step_order: number
          title: string
          substeps: Json
          time_estimate: number | null
          status: StepStatus
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          step_order: number
          title: string
          substeps?: Json
          time_estimate?: number | null
          status?: StepStatus
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          step_order?: number
          title?: string
          substeps?: Json
          time_estimate?: number | null
          status?: StepStatus
          completed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
