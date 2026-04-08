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
          created_at: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          report_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          report_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          report_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
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
          created_at: string | null
          created_by: string | null
          denominator: number | null
          id: string
          indicator_id: string | null
          institution_id: string | null
          numerator: number | null
          period_id: string | null
          reported_value: number | null
          reporting_month: string | null
          returned_at: string | null
          reviewed_at: string | null
          status: string | null
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          created_by?: string | null
          denominator?: number | null
          id?: string
          indicator_id?: string | null
          institution_id?: string | null
          numerator?: number | null
          period_id?: string | null
          reported_value?: number | null
          reporting_month?: string | null
          returned_at?: string | null
          reviewed_at?: string | null
          status?: string | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          created_by?: string | null
          denominator?: number | null
          id?: string
          indicator_id?: string | null
          institution_id?: string | null
          numerator?: number | null
          period_id?: string | null
          reported_value?: number | null
          reporting_month?: string | null
          returned_at?: string | null
          reviewed_at?: string | null
          status?: string | null
          updated_at?: string | null
          verification_method?: string | null
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
          created_at: string | null
          description: string | null
          id: string
          indicator_type: string | null
          informant_id: string | null
          institution_id: string | null
          instrument_id: string | null
          is_active: boolean | null
          name: string | null
          notes: string | null
          q1_prog: number | null
          q2_prog: number | null
          q3_prog: number | null
          q4_prog: number | null
          reporting_frequency: string | null
          reviewer_id: string | null
          target_value: number | null
          unit: string | null
          verification_means: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          indicator_type?: string | null
          informant_id?: string | null
          institution_id?: string | null
          instrument_id?: string | null
          is_active?: boolean | null
          name?: string | null
          notes?: string | null
          q1_prog?: number | null
          q2_prog?: number | null
          q3_prog?: number | null
          q4_prog?: number | null
          reporting_frequency?: string | null
          reviewer_id?: string | null
          target_value?: number | null
          unit?: string | null
          verification_means?: string | null
          weight?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          indicator_type?: string | null
          informant_id?: string | null
          institution_id?: string | null
          instrument_id?: string | null
          is_active?: boolean | null
          name?: string | null
          notes?: string | null
          q1_prog?: number | null
          q2_prog?: number | null
          q3_prog?: number | null
          q4_prog?: number | null
          reporting_frequency?: string | null
          reviewer_id?: string | null
          target_value?: number | null
          unit?: string | null
          verification_means?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicators_informant_id_fkey"
            columns: ["informant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "indicators_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          type?: string | null
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
          comment: string | null
          created_at: string | null
          id: string
          observation_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          observation_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          observation_id?: string | null
          user_id?: string | null
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
          comment: string | null
          created_at: string | null
          id: string
          report_id: string | null
          reviewer_id: string | null
          status: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          report_id?: string | null
          reviewer_id?: string | null
          status?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          report_id?: string | null
          reviewer_id?: string | null
          status?: string | null
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
          end_date: string | null
          id: string
          name: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          end_date?: string | null
          id?: string
          name?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          end_date?: string | null
          id?: string
          name?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          institution_id: string | null
          name: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          institution_id?: string | null
          name?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          institution_id?: string | null
          name?: string | null
          role?: string | null
        }
        Relationships: []
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
      indicator_type: "quantitative" | "qualitative" | "Cantidad" | "quantity"
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
      indicator_type: ["quantitative", "qualitative", "Cantidad", "quantity"],
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
