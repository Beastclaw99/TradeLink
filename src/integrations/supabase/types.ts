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
      admin_actions: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          target_id: string
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          target_id: string
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          target_id?: string
          target_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
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
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
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
      contract_templates: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id: string
          name?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_details: Json | null
          error_message: string
          id: string
          operation: string
          record_id: string | null
          table_name: string
        }
        Insert: {
          created_at?: string | null
          error_details?: Json | null
          error_message: string
          id?: string
          operation: string
          record_id?: string | null
          table_name: string
        }
        Update: {
          created_at?: string | null
          error_details?: Json | null
          error_message?: string
          id?: string
          operation?: string
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      file_access_controls: {
        Row: {
          allowed_file_types: string[]
          created_at: string | null
          id: string
          max_file_size: number | null
          max_files_per_submission: number | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_file_types?: string[]
          created_at?: string | null
          id?: string
          max_file_size?: number | null
          max_files_per_submission?: number | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_file_types?: string[]
          created_at?: string | null
          id?: string
          max_file_size?: number | null
          max_files_per_submission?: number | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_fields: {
        Row: {
          category: string | null
          created_at: string | null
          fields: Json | null
          id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          fields?: Json | null
          id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          fields?: Json | null
          id?: string
        }
        Relationships: []
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
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          project_id: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          project_id?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          project_id?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
          },
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
        Relationships: []
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_id: string | null
          payment_method: string | null
          payment_method_id: string | null
          payment_url: string | null
          professional_id: string | null
          project_id: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_method_id?: string | null
          payment_url?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_method_id?: string | null
          payment_url?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type_enum"]
          address: string | null
          admin_notes: string | null
          admin_permissions: string[] | null
          admin_status: string | null
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
          role: string | null
          service_areas: string[] | null
          show_email: boolean | null
          show_phone: boolean | null
          skills: string[] | null
          specialties: string[] | null
          state: string | null
          updated_at: string | null
          verification_status: string | null
          years_of_experience: number | null
          zip_code: string | null
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type_enum"]
          address?: string | null
          admin_notes?: string | null
          admin_permissions?: string[] | null
          admin_status?: string | null
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
          role?: string | null
          service_areas?: string[] | null
          show_email?: boolean | null
          show_phone?: boolean | null
          skills?: string[] | null
          specialties?: string[] | null
          state?: string | null
          updated_at?: string | null
          verification_status?: string | null
          years_of_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type_enum"]
          address?: string | null
          admin_notes?: string | null
          admin_permissions?: string[] | null
          admin_status?: string | null
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
          role?: string | null
          service_areas?: string[] | null
          show_email?: boolean | null
          show_phone?: boolean | null
          skills?: string[] | null
          specialties?: string[] | null
          state?: string | null
          updated_at?: string | null
          verification_status?: string | null
          years_of_experience?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      project_archives: {
        Row: {
          archive_notes: string | null
          archive_reason: string | null
          archived_at: string | null
          archived_by: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          archive_notes?: string | null
          archive_reason?: string | null
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          archive_notes?: string | null
          archive_reason?: string | null
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_completion_checklist: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          is_required: boolean | null
          item_name: string
          item_type: string
          notes: string | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_required?: boolean | null
          item_name: string
          item_type: string
          notes?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          is_required?: boolean | null
          item_name?: string
          item_type?: string
          notes?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_deliverables: {
        Row: {
          content: string | null
          created_at: string | null
          deliverable_type: string | null
          description: string | null
          feedback: string | null
          file_url: string
          id: string
          milestone_id: string | null
          project_id: string | null
          reviewed_at: string | null
          status: string | null
          uploaded_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          deliverable_type?: string | null
          description?: string | null
          feedback?: string | null
          file_url: string
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          reviewed_at?: string | null
          status?: string | null
          uploaded_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          deliverable_type?: string | null
          description?: string | null
          feedback?: string | null
          file_url?: string
          id?: string
          milestone_id?: string | null
          project_id?: string | null
          reviewed_at?: string | null
          status?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      project_history: {
        Row: {
          created_at: string | null
          created_by: string | null
          history_data: Json
          history_type: string
          id: string
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          history_data: Json
          history_type: string
          id?: string
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          history_data?: Json
          history_type?: string
          id?: string
          project_id?: string | null
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      project_tasks: {
        Row: {
          assignee_id: string | null
          completed: boolean | null
          completion_date: string | null
          created_at: string
          created_by: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          id: string
          milestone_id: string | null
          priority: string
          project_id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_id?: string | null
          priority?: string
          project_id: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_id?: string | null
          priority?: string
          project_id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          created_at: string | null
          file_access_level: string | null
          file_metadata: Json | null
          file_name: string | null
          file_url: string | null
          id: string
          message: string | null
          metadata: Json | null
          professional_id: string | null
          project_id: string | null
          status_update: string | null
          update_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_access_level?: string | null
          file_metadata?: Json | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          professional_id?: string | null
          project_id?: string | null
          status_update?: string | null
          update_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_access_level?: string | null
          file_metadata?: Json | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          professional_id?: string | null
          project_id?: string | null
          status_update?: string | null
          update_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_user_id_fkey"
            columns: ["user_id"]
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
          contract_template_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          expected_timeline: string | null
          id: string
          industry_specific_fields: Json | null
          location: string | null
          location_coordinates: unknown | null
          professional_id: string | null
          requirements: string[] | null
          scope: string | null
          sla_terms: Json | null
          status: string | null
          title: string
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: number | null
          category?: string | null
          client_id?: string | null
          contract_template_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          expected_timeline?: string | null
          id?: string
          industry_specific_fields?: Json | null
          location?: string | null
          location_coordinates?: unknown | null
          professional_id?: string | null
          requirements?: string[] | null
          scope?: string | null
          sla_terms?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: number | null
          category?: string | null
          client_id?: string | null
          contract_template_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          expected_timeline?: string | null
          id?: string
          industry_specific_fields?: Json | null
          location?: string | null
          location_coordinates?: unknown | null
          professional_id?: string | null
          requirements?: string[] | null
          scope?: string | null
          sla_terms?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      review_helpfulness: {
        Row: {
          created_at: string | null
          id: string
          is_helpful: boolean
          review_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_helpful: boolean
          review_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_helpful?: boolean
          review_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      review_responses: {
        Row: {
          created_at: string | null
          id: string
          responder_id: string | null
          response_text: string
          review_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          responder_id?: string | null
          response_text: string
          review_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          responder_id?: string | null
          response_text?: string
          review_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string | null
          comment: string | null
          communication_rating: number | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          professional_id: string | null
          professionalism_rating: number | null
          project_id: string | null
          quality_rating: number | null
          rating: number | null
          report_reason: string | null
          reported_at: string | null
          reported_by: string | null
          status: string | null
          timeliness_rating: number | null
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          client_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          professional_id?: string | null
          professionalism_rating?: number | null
          project_id?: string | null
          quality_rating?: number | null
          rating?: number | null
          report_reason?: string | null
          reported_at?: string | null
          reported_by?: string | null
          status?: string | null
          timeliness_rating?: number | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          client_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          professional_id?: string | null
          professionalism_rating?: number | null
          project_id?: string | null
          quality_rating?: number | null
          rating?: number | null
          report_reason?: string | null
          reported_at?: string | null
          reported_by?: string | null
          status?: string | null
          timeliness_rating?: number | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      payment_status_history_view: {
        Row: {
          amount: number | null
          client_first_name: string | null
          client_last_name: string | null
          paid_at: string | null
          payment_created_at: string | null
          payment_id: string | null
          payment_status: string | null
          professional_first_name: string | null
          professional_last_name: string | null
          project_id: string | null
          project_status: string | null
          project_title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_project_with_milestones: {
        Args: { project_data: Json; milestones_data: Json[] }
        Returns: string
      }
      delete_project_with_cleanup: {
        Args: { project_id: string }
        Returns: boolean
      }
      update_milestone_with_deliverables: {
        Args: {
          milestone_id: string
          milestone_data: Json
          deliverables_data: Json[]
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type_enum: "client" | "professional"
      dispute_status_enum:
        | "open"
        | "under_review"
        | "resolved"
        | "closed"
        | "escalated"
      file_review_status_enum: "pending" | "approved" | "rejected"
      milestone_status_enum:
        | "not_started"
        | "in_progress"
        | "completed"
        | "on_hold"
        | "overdue"
      payment_status_enum:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "overdue"
      project_status_enum:
        | "open"
        | "assigned"
        | "in_progress"
        | "work_submitted"
        | "work_revision_requested"
        | "work_approved"
        | "completed"
        | "archived"
        | "cancelled"
        | "disputed"
      review_status_enum: "pending" | "approved" | "rejected" | "reported"
      task_status_enum: "todo" | "in_progress" | "completed"
      verification_status_enum: "unverified" | "pending" | "verified"
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
      dispute_status_enum: [
        "open",
        "under_review",
        "resolved",
        "closed",
        "escalated",
      ],
      file_review_status_enum: ["pending", "approved", "rejected"],
      milestone_status_enum: [
        "not_started",
        "in_progress",
        "completed",
        "on_hold",
        "overdue",
      ],
      payment_status_enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "overdue",
      ],
      project_status_enum: [
        "open",
        "assigned",
        "in_progress",
        "work_submitted",
        "work_revision_requested",
        "work_approved",
        "completed",
        "archived",
        "cancelled",
        "disputed",
      ],
      review_status_enum: ["pending", "approved", "rejected", "reported"],
      task_status_enum: ["todo", "in_progress", "completed"],
      verification_status_enum: ["unverified", "pending", "verified"],
    },
  },
} as const
