export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      members: {
        Row: {
          id: string
          user_id: string | null
          name: string
          date_of_birth: string | null
          gender: string | null
          position: string | null
          jersey_number: number | null
          height: number | null
          weight: number | null
          phone: string | null
          email: string | null
          address: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          join_date: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          date_of_birth?: string | null
          gender?: string | null
          position?: string | null
          jersey_number?: number | null
          height?: number | null
          weight?: number | null
          phone?: string | null
          email?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          join_date?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          date_of_birth?: string | null
          gender?: string | null
          position?: string | null
          jersey_number?: number | null
          height?: number | null
          weight?: number | null
          phone?: string | null
          email?: string | null
          address?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          join_date?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      training_sessions: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string | null
          start_time: string
          end_time: string
          type: "regular" | "fitness" | "tactical" | "recovery" | "other" | null
          status: "scheduled" | "completed" | "cancelled" | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location?: string | null
          start_time: string
          end_time: string
          type?: "regular" | "fitness" | "tactical" | "recovery" | "other" | null
          status?: "scheduled" | "completed" | "cancelled" | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string | null
          start_time?: string
          end_time?: string
          type?: "regular" | "fitness" | "tactical" | "recovery" | "other" | null
          status?: "scheduled" | "completed" | "cancelled" | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      training_attendance: {
        Row: {
          id: string
          training_id: string
          member_id: string
          status: "present" | "absent" | "late" | "excused" | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          training_id: string
          member_id: string
          status?: "present" | "absent" | "late" | "excused" | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          training_id?: string
          member_id?: string
          status?: "present" | "absent" | "late" | "excused" | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      matches: {
        Row: {
          id: string
          opponent: string
          location: string | null
          match_date: string
          match_type: "friendly" | "league" | "cup" | "tournament" | "other" | null
          home_away: "home" | "away" | "neutral" | null
          result: "win" | "loss" | "draw" | "pending" | null
          score_for: number | null
          score_against: number | null
          notes: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          opponent: string
          location?: string | null
          match_date: string
          match_type?: "friendly" | "league" | "cup" | "tournament" | "other" | null
          home_away?: "home" | "away" | "neutral" | null
          result?: "win" | "loss" | "draw" | "pending" | null
          score_for?: number | null
          score_against?: number | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          opponent?: string
          location?: string | null
          match_date?: string
          match_type?: "friendly" | "league" | "cup" | "tournament" | "other" | null
          home_away?: "home" | "away" | "neutral" | null
          result?: "win" | "loss" | "draw" | "pending" | null
          score_for?: number | null
          score_against?: number | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      match_lineup: {
        Row: {
          id: string
          match_id: string
          member_id: string
          position: string | null
          is_starter: boolean | null
          minutes_played: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          match_id: string
          member_id: string
          position?: string | null
          is_starter?: boolean | null
          minutes_played?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          match_id?: string
          member_id?: string
          position?: string | null
          is_starter?: boolean | null
          minutes_played?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      match_events: {
        Row: {
          id: string
          match_id: string
          member_id: string
          event_type:
            | "goal"
            | "assist"
            | "yellow_card"
            | "red_card"
            | "substitution_in"
            | "substitution_out"
            | "injury"
            | "other"
            | null
          minute: number | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          match_id: string
          member_id: string
          event_type?:
            | "goal"
            | "assist"
            | "yellow_card"
            | "red_card"
            | "substitution_in"
            | "substitution_out"
            | "injury"
            | "other"
            | null
          minute?: number | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          match_id?: string
          member_id?: string
          event_type?:
            | "goal"
            | "assist"
            | "yellow_card"
            | "red_card"
            | "substitution_in"
            | "substitution_out"
            | "injury"
            | "other"
            | null
          minute?: number | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      medical_records: {
        Row: {
          id: string
          member_id: string
          record_date: string | null
          injury_type: string | null
          diagnosis: string | null
          treatment: string | null
          status: "active" | "recovered" | "pending" | null
          expected_recovery_date: string | null
          actual_recovery_date: string | null
          notes: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          member_id: string
          record_date?: string | null
          injury_type?: string | null
          diagnosis?: string | null
          treatment?: string | null
          status?: "active" | "recovered" | "pending" | null
          expected_recovery_date?: string | null
          actual_recovery_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          member_id?: string
          record_date?: string | null
          injury_type?: string | null
          diagnosis?: string | null
          treatment?: string | null
          status?: "active" | "recovered" | "pending" | null
          expected_recovery_date?: string | null
          actual_recovery_date?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      skill_assessments: {
        Row: {
          id: string
          member_id: string
          assessment_date: string | null
          category: "technical" | "tactical" | "physical" | "mental" | "other" | null
          skill_name: string
          rating: number | null
          notes: string | null
          assessed_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          member_id: string
          assessment_date?: string | null
          category?: "technical" | "tactical" | "physical" | "mental" | "other" | null
          skill_name: string
          rating?: number | null
          notes?: string | null
          assessed_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          member_id?: string
          assessment_date?: string | null
          category?: "technical" | "tactical" | "physical" | "mental" | "other" | null
          skill_name?: string
          rating?: number | null
          notes?: string | null
          assessed_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
