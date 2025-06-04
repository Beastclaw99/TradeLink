export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          availability: string | null
          bid_amount: number | null
          cover_letter: string | null
          created_at: string | null
          id: string
          professional_id: string | null
          project_id: string | null
          proposal_message: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          availability?: string | null
          bid_amount?: number | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          project_id?: string | null
          proposal_message?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          availability?: string | null
          bid_amount?: number | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          project_id?: string | null
          proposal_message?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          id: string
          recipient_id: string | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          content: string
          id?: string
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          id: string
          issued_at: string | null
          paid_at: string | null
          professional_id: string | null
          project_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          id?: string
          issued_at?: string | null
          paid_at?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          id?: string
          issued_at?: string | null
          paid_at?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          id: string
          paid_at: string | null
          professional_id: string | null
          project_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type_enum"]
          address: string | null
          allow_messages: boolean | null
          availability: string | null
          bio: string | null
          business_description: string | null
          business_name: string | null
          certifications: string[] | null
          city: string | null
          completed_projects: number | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          hourly_rate: number | null
          id: string
          insurance_info: string | null
          is_available: boolean | null
          last_name: string | null
          license_number: string | null
          location: string | null
          on_time_completion: number | null
          phone: string | null
          portfolio_images: string[] | null
          portfolio_urls: string[] | null
          profile_image: string | null
          profile_image_url: string | null
          profile_visibility: boolean | null
          rating: number | null
          response_rate: number | null
          service_areas: string[] | null
          show_email: boolean | null
          show_phone: boolean | null
          skills: string[] | null
          specialties: string[] | null
          state: string | null
          updated_at: string | null
          verification_status: string | null
          years_experience: number | null
          years_of_experience: number | null
          zip_code: string | null
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type_enum"]
          address?: string | null
          allow_messages?: boolean | null
          availability?: string | null
          bio?: string | null
          business_description?: string | null
          business_name?: string | null
          certifications?: string[] | null
          city?: string | null
          completed_projects?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id: string
          insurance_info?: string | null
          is_available?: boolean | null
          last_name?: string | null
          license_number?: string | null
          location?: string | null
          on_time_completion?: number | null
          phone?: string | null
          portfolio_images?: string[] | null
          portfolio_urls?: string[] | null
          profile_image?: string | null
          profile_image_url?: string | null
          profile_visibility?: boolean | null
          rating?: number | null
          response_rate?: number | null
          service_areas?: string[] | null
          show_email?: boolean | null
          show_phone?: boolean | null
          skills?: string[] | null
          specialties?: string[] | null
          state?: string | null
          updated_at?: string | null
          verification_status?: string | null
          years_experience?: number | null
          years_of_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type_enum"]
          address?: string | null
          allow_messages?: boolean | null
          availability?: string | null
          bio?: string | null
          business_description?: string | null
          business_name?: string | null
          certifications?: string[] | null
          city?: string | null
          completed_projects?: number | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_info?: string | null
          is_available?: boolean | null
          last_name?: string | null
          license_number?: string | null
          location?: string | null
          on_time_completion?: number | null
          phone?: string | null
          portfolio_images?: string[] | null
          portfolio_urls?: string[] | null
          profile_image?: string | null
          profile_image_url?: string | null
          profile_visibility?: boolean | null
          rating?: number | null
          response_rate?: number | null
          service_areas?: string[] | null
          show_email?: boolean | null
          show_phone?: boolean | null
          skills?: string[] | null
          specialties?: string[] | null
          state?: string | null
          updated_at?: string | null
          verification_status?: string | null
          years_experience?: number | null
          years_of_experience?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      project_deliverables: {
        Row: {
          content: string | null
          created_at: string | null
          deliverable_type: string | null
          description: string | null
          file_url: string
          id: string
          milestone_id: string | null
          project_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          deliverable_type?: string | null
          description?: string | null
          file_url: string
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          deliverable_type?: string | null
          description?: string | null
          file_url?: string
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_deliverables_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_deliverables_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          content: string
          id: string
          project_id: string | null
          recipient_id: string | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          content: string
          id?: string
          project_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          project_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          is_complete: boolean | null
          project_id: string | null
          requires_deliverable: boolean | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_complete?: boolean | null
          project_id?: string | null
          requires_deliverable?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_complete?: boolean | null
          project_id?: string | null
          requires_deliverable?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_created_by_fkey2"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          message: string | null
          metadata: Json | null
          professional_id: string | null
          project_id: string | null
          status_update: string | null
          update_type: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          professional_id?: string | null
          project_id?: string | null
          status_update?: string | null
          update_type?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          professional_id?: string | null
          project_id?: string | null
          status_update?: string | null
          update_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_updates_user_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_to: string | null
          budget: number | null
          category: string | null
          client_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          expected_timeline: string | null
          id: string
          location: string | null
          professional_id: string | null
          project_start_time: string | null
          required_skills: string | null
          requirements: string[] | null
          scope: string | null
          service_contract: string | null
          status: string | null
          title: string
          "updated at": string | null
          urgency: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          expected_timeline?: string | null
          id?: string
          location?: string | null
          professional_id?: string | null
          project_start_time?: string | null
          required_skills?: string | null
          requirements?: string[] | null
          scope?: string | null
          service_contract?: string | null
          status?: string | null
          title: string
          "updated at"?: string | null
          urgency?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: number | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          expected_timeline?: string | null
          id?: string
          location?: string | null
          professional_id?: string | null
          project_start_time?: string | null
          required_skills?: string | null
          requirements?: string[] | null
          scope?: string | null
          service_contract?: string | null
          status?: string | null
          title?: string
          "updated at"?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          client_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          professional_id: string | null
          project_id: string | null
          rating: number | null
          "updated at": string | null
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          project_id?: string | null
          rating?: number | null
          "updated at"?: string | null
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          professional_id?: string | null
          project_id?: string | null
          rating?: number | null
          "updated at"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      account_type_enum: "client" | "professional"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type_enum: ["client", "professional"],
    },
  },
} as const
