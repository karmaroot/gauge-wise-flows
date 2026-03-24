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
      attachments: {
        Row: {
          created_at: string
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          observation_id: string | null
          report_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          observation_id?: string | null
          report_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          observation_id?: string | null
          report_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "indicator_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      indicator_reports: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string
          denominator: number | null
          id: string
          indicator_id: string
          institution_id: string
          numerator: number | null
          period_id: string
          reported_value: number | null
          reporting_month: string | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by: string
          denominator?: number | null
          id?: string
          indicator_id: string
          institution_id: string
          numerator?: number | null
          period_id: string
          reported_value?: number | null
          reporting_month?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string
          denominator?: number | null
          id?: string
          indicator_id?: string
          institution_id?: string
          numerator?: number | null
          period_id?: string
          reported_value?: number | null
          reporting_month?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_reports_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_reports_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_reports_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "periods"
            referencedColumns: ["id"]
          },
        ]
      }
      indicators: {
        Row: {
          created_at: string
          description: string | null
          id: string
          indicator_type: Database["public"]["Enums"]["indicator_type"]
          institution_id: string | null
          instrument_id: string | null
          is_active: boolean
          name: string
          reporting_frequency: Database["public"]["Enums"]["reporting_frequency"]
          target_value: number
          unit: string
          weight: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          indicator_type?: Database["public"]["Enums"]["indicator_type"]
          institution_id?: string | null
          instrument_id?: string | null
          is_active?: boolean
          name: string
          reporting_frequency?: Database["public"]["Enums"]["reporting_frequency"]
          target_value?: number
          unit?: string
          weight?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          indicator_type?: Database["public"]["Enums"]["indicator_type"]
          institution_id?: string | null
          instrument_id?: string | null
          is_active?: boolean
          name?: string
          reporting_frequency?: Database["public"]["Enums"]["reporting_frequency"]
          target_value?: number
          unit?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicators_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicators_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "instruments"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["institution_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type?: Database["public"]["Enums"]["institution_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["institution_type"]
        }
        Relationships: []
      }
      instrument_indicators: {
        Row: {
          auto_start: boolean
          created_at: string
          id: string
          indicator_id: string
          informant_id: string
          instrument_id: string
          is_active: boolean
          last_started_at: string | null
          periodicity: string
          reviewer_id: string
          unit_area: string | null
        }
        Insert: {
          auto_start?: boolean
          created_at?: string
          id?: string
          indicator_id: string
          informant_id: string
          instrument_id: string
          is_active?: boolean
          last_started_at?: string | null
          periodicity?: string
          reviewer_id: string
          unit_area?: string | null
        }
        Update: {
          auto_start?: boolean
          created_at?: string
          id?: string
          indicator_id?: string
          informant_id?: string
          instrument_id?: string
          is_active?: boolean
          last_started_at?: string | null
          periodicity?: string
          reviewer_id?: string
          unit_area?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instrument_indicators_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instrument_indicators_informant_id_fkey"
            columns: ["informant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instrument_indicators_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "instruments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instrument_indicators_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instruments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          institution_id: string
          is_active: boolean
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          institution_id: string
          is_active?: boolean
          name: string
          type?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          institution_id?: string
          is_active?: boolean
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "instruments_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_responses: {
        Row: {
          comment: string
          created_at: string
          id: string
          observation_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          observation_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          observation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observation_responses_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "observations"
            referencedColumns: ["id"]
          },
        ]
      }
      observations: {
        Row: {
          comment: string
          created_at: string
          id: string
          report_id: string
          status: Database["public"]["Enums"]["observation_status"]
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          report_id: string
          status?: Database["public"]["Enums"]["observation_status"]
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          report_id?: string
          status?: Database["public"]["Enums"]["observation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "observations_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "indicator_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      periods: {
        Row: {
          end_date: string
          id: string
          name: string
          start_date: string
          status: Database["public"]["Enums"]["period_status"]
        }
        Insert: {
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["period_status"]
        }
        Update: {
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["period_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          institution_id: string | null
          name: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          institution_id?: string | null
          name: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          institution_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "reviewer" | "informant"
      indicator_type: "quantitative" | "qualitative"
      institution_type: "public" | "private" | "autonomous"
      observation_status: "open" | "answered" | "closed"
      period_status: "open" | "closed"
      report_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "observed"
        | "responded"
        | "approved"
        | "rejected"
      reporting_frequency: "monthly" | "quarterly" | "annually"
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
    Enums: {
      app_role: ["admin", "reviewer", "informant"],
      indicator_type: ["quantitative", "qualitative"],
      institution_type: ["public", "private", "autonomous"],
      observation_status: ["open", "answered", "closed"],
      period_status: ["open", "closed"],
      report_status: [
        "draft",
        "submitted",
        "under_review",
        "observed",
        "responded",
        "approved",
        "rejected",
      ],
      reporting_frequency: ["monthly", "quarterly", "annually"],
    },
  },
} as const
