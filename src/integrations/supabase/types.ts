export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      study_session_videos: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          position: number
          session_id: string
          status: string
          thumbnail_url: string | null
          title: string
          video_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          position?: number
          session_id: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          video_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          position?: number
          session_id?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_session_videos_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          created_at: string
          goal_days: number | null
          goal_minutes_per_day: number | null
          id: string
          playlist_id: string | null
          session_type: string
          status: string
          target_finish_date: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          goal_days?: number | null
          goal_minutes_per_day?: number | null
          id?: string
          playlist_id?: string | null
          session_type?: string
          status?: string
          target_finish_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          goal_days?: number | null
          goal_minutes_per_day?: number | null
          id?: string
          playlist_id?: string | null
          session_type?: string
          status?: string
          target_finish_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transcript_quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          id: string
          quiz_id: string
          score: number
          total: number
          user_id: string | null
        }
        Insert: {
          answers?: Json
          completed_at?: string
          id?: string
          quiz_id: string
          score?: number
          total?: number
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string
          id?: string
          quiz_id?: string
          score?: number
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcript_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "transcript_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      transcript_quizzes: {
        Row: {
          chunk_end_seconds: number | null
          chunk_start_seconds: number | null
          created_at: string
          id: string
          questions: Json
          quiz_mode: string
          video_id: string
        }
        Insert: {
          chunk_end_seconds?: number | null
          chunk_start_seconds?: number | null
          created_at?: string
          id?: string
          questions?: Json
          quiz_mode?: string
          video_id: string
        }
        Update: {
          chunk_end_seconds?: number | null
          chunk_start_seconds?: number | null
          created_at?: string
          id?: string
          questions?: Json
          quiz_mode?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcript_quizzes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "study_session_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      transcript_segments: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          segment_index: number
          start_seconds: number
          text: string
          track_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          id?: string
          segment_index?: number
          start_seconds?: number
          text?: string
          track_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          segment_index?: number
          start_seconds?: number
          text?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcript_segments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "transcript_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      transcript_tracks: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          language_code: string
          track_kind: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          language_code?: string
          track_kind?: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          language_code?: string
          track_kind?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcript_tracks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "study_session_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_watch_progress: {
        Row: {
          completed: boolean
          current_time_seconds: number
          duration_seconds: number
          id: string
          last_watched_at: string
          percent_watched: number
          user_id: string | null
          video_id: string
        }
        Insert: {
          completed?: boolean
          current_time_seconds?: number
          duration_seconds?: number
          id?: string
          last_watched_at?: string
          percent_watched?: number
          user_id?: string | null
          video_id: string
        }
        Update: {
          completed?: boolean
          current_time_seconds?: number
          duration_seconds?: number
          id?: string
          last_watched_at?: string
          percent_watched?: number
          user_id?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_watch_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "study_session_videos"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
