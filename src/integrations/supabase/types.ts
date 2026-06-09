export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      app_config: {
        Row: {
          description: string | null;
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          description?: string | null;
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          description?: string | null;
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          booking_code: string;
          booking_date: string;
          created_at: string;
          customer_line_user_id: string | null;
          customer_push: Json;
          dietary_notes: string | null;
          dietary_plan: string | null;
          expert_name: string | null;
          id: string;
          meal_plan: Json;
          meals_url: string | null;
          partner_line_user_id: string | null;
          partner_notes: string | null;
          partner_push: Json;
          partner_response: Json;
          program_duration: string;
          program_id: string;
          program_name: string;
          program_price: number;
          program_venue: string;
          status: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          booking_code: string;
          booking_date: string;
          created_at?: string;
          customer_line_user_id?: string | null;
          customer_push?: Json;
          dietary_notes?: string | null;
          dietary_plan?: string | null;
          expert_name?: string | null;
          id?: string;
          meal_plan?: Json;
          meals_url?: string | null;
          partner_line_user_id?: string | null;
          partner_notes?: string | null;
          partner_push?: Json;
          partner_response?: Json;
          program_duration: string;
          program_id: string;
          program_name: string;
          program_price?: number;
          program_venue: string;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          booking_code?: string;
          booking_date?: string;
          created_at?: string;
          customer_line_user_id?: string | null;
          customer_push?: Json;
          dietary_notes?: string | null;
          dietary_plan?: string | null;
          expert_name?: string | null;
          id?: string;
          meal_plan?: Json;
          meals_url?: string | null;
          partner_line_user_id?: string | null;
          partner_notes?: string | null;
          partner_push?: Json;
          partner_response?: Json;
          program_duration?: string;
          program_id?: string;
          program_name?: string;
          program_price?: number;
          program_venue?: string;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      line_identities: {
        Row: {
          channel: string;
          created_at: string;
          display_name: string | null;
          id: string;
          line_user_id: string;
          picture_url: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          channel: string;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          line_user_id: string;
          picture_url?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          channel?: string;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          line_user_id?: string;
          picture_url?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          config: Json;
          created_at: string;
          currency: string;
          description: string | null;
          duration: string;
          id: string;
          image_url: string | null;
          images: Json;
          is_published: boolean;
          name: string;
          name_en: string | null;
          name_th: string | null;
          price: number;
          slug: string;
          sort_order: number;
          tagline: string | null;
          tagline_en: string | null;
          tagline_th: string | null;
          updated_at: string;
        };
        Insert: {
          config?: Json;
          created_at?: string;
          currency?: string;
          description?: string | null;
          duration?: string;
          id?: string;
          image_url?: string | null;
          images?: Json;
          is_published?: boolean;
          name: string;
          name_en?: string | null;
          name_th?: string | null;
          price?: number;
          slug: string;
          sort_order?: number;
          tagline?: string | null;
          tagline_en?: string | null;
          tagline_th?: string | null;
          updated_at?: string;
        };
        Update: {
          config?: Json;
          created_at?: string;
          currency?: string;
          description?: string | null;
          duration?: string;
          id?: string;
          image_url?: string | null;
          images?: Json;
          is_published?: boolean;
          name?: string;
          name_en?: string | null;
          name_th?: string | null;
          price?: number;
          slug?: string;
          sort_order?: number;
          tagline?: string | null;
          tagline_en?: string | null;
          tagline_th?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      telegram_identities: {
        Row: {
          chat_id: number;
          created_at: string;
          first_name: string | null;
          id: string;
          language_code: string | null;
          language_preference: string | null;
          last_name: string | null;
          start_param: string | null;
          tg_user_id: number | null;
          updated_at: string;
          user_id: string | null;
          username: string | null;
        };
        Insert: {
          chat_id: number;
          created_at?: string;
          first_name?: string | null;
          id?: string;
          language_code?: string | null;
          language_preference?: string | null;
          last_name?: string | null;
          start_param?: string | null;
          tg_user_id?: number | null;
          updated_at?: string;
          user_id?: string | null;
          username?: string | null;
        };
        Update: {
          chat_id?: number;
          created_at?: string;
          first_name?: string | null;
          id?: string;
          language_code?: string | null;
          language_preference?: string | null;
          last_name?: string | null;
          start_param?: string | null;
          tg_user_id?: number | null;
          updated_at?: string;
          user_id?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      telegram_messages: {
        Row: {
          chat_id: number;
          created_at: string;
          processed_at: string | null;
          raw_update: Json;
          text: string | null;
          tg_user_id: number | null;
          update_id: number;
        };
        Insert: {
          chat_id: number;
          created_at?: string;
          processed_at?: string | null;
          raw_update: Json;
          text?: string | null;
          tg_user_id?: number | null;
          update_id: number;
        };
        Update: {
          chat_id?: number;
          created_at?: string;
          processed_at?: string | null;
          raw_update?: Json;
          text?: string | null;
          tg_user_id?: number | null;
          update_id?: number;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "staff" | "user" | "expert" | "partner";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ============================================================================
// Helper Types
// ============================================================================

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

// Table Row Types
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

// Table Insert Types
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

// Table Update Types
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

// Enum Types
export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

// Composite Types
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

// ============================================================================
// Convenience Types
// ============================================================================

export type AppConfig = Tables<"app_config">;
export type Booking = Tables<"bookings">;
export type LineIdentity = Tables<"line_identities">;
export type Program = Tables<"programs">;
export type TelegramIdentity = Tables<"telegram_identities">;
export type TelegramMessage = Tables<"telegram_messages">;
export type UserRole = Tables<"user_roles">;

export type AppRole = Enums<"app_role">;

// ============================================================================
// Booking Status Helper
// ============================================================================

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "redeemed" | "cancelled";

export const BookingStatusLabels: Record<BookingStatus, { th: string; en: string }> = {
  pending: { th: "รอดำเนินการ", en: "Pending" },
  accepted: { th: "ยอมรับแล้ว", en: "Accepted" },
  rejected: { th: "ปฏิเสธแล้ว", en: "Rejected" },
  completed: { th: "เสร็จสิ้น", en: "Completed" },
  redeemed: { th: "ใช้แล้ว", en: "Redeemed" },
  cancelled: { th: "ยกเลิกแล้ว", en: "Cancelled" },
};

// ============================================================================
// Channel Types
// ============================================================================

export type ChannelType = "customer" | "partner";

// ============================================================================
// Push Result Type
// ============================================================================

export interface PushResult {
  ok: boolean;
  status?: number;
  error?: string;
  channel?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user", "expert", "partner"] as const,
    },
  },
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Checks if a booking status is valid
 */
export function isValidBookingStatus(status: string): status is BookingStatus {
  return ["pending", "accepted", "rejected", "completed", "redeemed", "cancelled"].includes(status);
}

/**
 * Gets localized booking status label
 */
export function getBookingStatusLabel(status: BookingStatus, lang: "th" | "en"): string {
  return BookingStatusLabels[status]?.[lang] || status;
}

/**
 * Checks if a user role is valid
 */
export function isValidAppRole(role: string): role is AppRole {
  return ["admin", "staff", "user", "expert", "partner"].includes(role);
}
