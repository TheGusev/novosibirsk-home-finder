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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          role: string | null
          telegram: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          telegram?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          telegram?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          area_kitchen: number | null
          area_total: number
          availability_verified_at: string | null
          checks_done: Json
          checks_pending: Json
          created_at: string
          deal_type: string | null
          description: string | null
          district: string
          encumbrances: string | null
          finish: string | null
          floor: number | null
          floors_total: number | null
          house_type: string | null
          id: string
          images: Json
          lat: number | null
          lng: number | null
          metro: string | null
          price: number
          price_per_m2: number | null
          price_verified_at: string
          responsible_agent_id: string | null
          rooms: number
          slug: string
          source_type: string
          status: string
          title: string
          type: string
          year_built: number | null
        }
        Insert: {
          address?: string | null
          area_kitchen?: number | null
          area_total: number
          availability_verified_at?: string | null
          checks_done?: Json
          checks_pending?: Json
          created_at?: string
          deal_type?: string | null
          description?: string | null
          district: string
          encumbrances?: string | null
          finish?: string | null
          floor?: number | null
          floors_total?: number | null
          house_type?: string | null
          id?: string
          images?: Json
          lat?: number | null
          lng?: number | null
          metro?: string | null
          price: number
          price_per_m2?: number | null
          price_verified_at?: string
          responsible_agent_id?: string | null
          rooms?: number
          slug: string
          source_type?: string
          status?: string
          title: string
          type: string
          year_built?: number | null
        }
        Update: {
          address?: string | null
          area_kitchen?: number | null
          area_total?: number
          availability_verified_at?: string | null
          checks_done?: Json
          checks_pending?: Json
          created_at?: string
          deal_type?: string | null
          description?: string | null
          district?: string
          encumbrances?: string | null
          finish?: string | null
          floor?: number | null
          floors_total?: number | null
          house_type?: string | null
          id?: string
          images?: Json
          lat?: number | null
          lng?: number | null
          metro?: string | null
          price?: number
          price_per_m2?: number | null
          price_verified_at?: string
          responsible_agent_id?: string | null
          rooms?: number
          slug?: string
          source_type?: string
          status?: string
          title?: string
          type?: string
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_fk"
            columns: ["responsible_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      viewing_requests: {
        Row: {
          consent: boolean
          created_at: string
          id: string
          name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          property_id: string
        }
        Insert: {
          consent: boolean
          created_at?: string
          id?: string
          name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          property_id: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          id?: string
          name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
