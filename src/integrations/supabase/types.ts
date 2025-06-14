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
          status: Database["public"]["Enums"]["application_status"] | null
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
          status?: Database["public"]["Enums"]["application_status"] | null
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
          status?: Database["public"]["Enums"]["application_status"] | null
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
            referencedColumns: ["id"]
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
      dispute_evidence: {
        Row: {
          created_at: string | null
          description: string | null
          dispute_id: string
          evidence_type: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          submitted_by: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dispute_id: string
          evidence_type: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          submitted_by: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dispute_id?: string
          evidence_type?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_evidence_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_evidence_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_mediators: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          dispute_id: string
          id: string
          mediator_id: string
          notes: string | null
          status: string
        }
        Insert: {
          assigned_at?: string | null
          completed_at?: string | null
          dispute_id: string
          id?: string
          mediator_id: string
          notes?: string | null
          status?: string
        }
        Update: {
          assigned_at?: string | null
          completed_at?: string | null
          dispute_id?: string
          id?: string
          mediator_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_mediators_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_mediators_mediator_id_fkey"
            columns: ["mediator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string | null
          dispute_id: string
          id: string
          is_internal: boolean | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string | null
          dispute_id: string
          id?: string
          is_internal?: boolean | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string | null
          dispute_id?: string
          id?: string
          is_internal?: boolean | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_status_history: {
        Row: {
          changed_by: string
          created_at: string | null
          dispute_id: string
          id: string
          new_status: Database["public"]["Enums"]["dispute_status"]
          old_status: Database["public"]["Enums"]["dispute_status"]
          reason: string | null
        }
        Insert: {
          changed_by: string
          created_at?: string | null
          dispute_id: string
          id?: string
          new_status: Database["public"]["Enums"]["dispute_status"]
          old_status: Database["public"]["Enums"]["dispute_status"]
          reason?: string | null
        }
        Update: {
          changed_by?: string
          created_at?: string | null
          dispute_id?: string
          id?: string
          new_status?: Database["public"]["Enums"]["dispute_status"]
          old_status?: Database["public"]["Enums"]["dispute_status"]
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_status_history_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          category: Database["public"]["Enums"]["dispute_category"]
          created_at: string | null
          description: string
          id: string
          initiator_id: string
          project_id: string
          resolution_amount: number | null
          resolution_details: Json | null
          resolution_type:
            | Database["public"]["Enums"]["dispute_resolution_type"]
            | null
          resolved_at: string | null
          resolved_by: string | null
          respondent_id: string
          status: Database["public"]["Enums"]["dispute_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["dispute_category"]
          created_at?: string | null
          description: string
          id?: string
          initiator_id: string
          project_id: string
          resolution_amount?: number | null
          resolution_details?: Json | null
          resolution_type?:
            | Database["public"]["Enums"]["dispute_resolution_type"]
            | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id: string
          status?: Database["public"]["Enums"]["dispute_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["dispute_category"]
          created_at?: string | null
          description?: string
          id?: string
          initiator_id?: string
          project_id?: string
          resolution_amount?: number | null
          resolution_details?: Json | null
          resolution_type?:
            | Database["public"]["Enums"]["dispute_resolution_type"]
            | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id?: string
          status?: Database["public"]["Enums"]["dispute_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_initiator_id_fkey"
            columns: ["initiator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "file_access_controls_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_access_controls_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "payment_status_history_view"
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
          status: Database["public"]["Enums"]["payment_status"] | null
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
          status?: Database["public"]["Enums"]["payment_status"] | null
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
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
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
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
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
            referencedRelation: "payment_status_history_view"
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
        Relationships: [
          {
            foreignKeyName: "project_archives_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_archives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_archives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
          status: Database["public"]["Enums"]["deliverable_status"] | null
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
          status?: Database["public"]["Enums"]["deliverable_status"] | null
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
          status?: Database["public"]["Enums"]["deliverable_status"] | null
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
            referencedRelation: "payment_status_history_view"
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
      project_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          metadata: Json | null
          project_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "project_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_sender_id_fkey"
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
          status: Database["public"]["Enums"]["milestone_status"] | null
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
          status?: Database["public"]["Enums"]["milestone_status"] | null
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
          status?: Database["public"]["Enums"]["milestone_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
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
        Relationships: [
          {
            foreignKeyName: "project_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
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
          project_start_time: string | null
          recommended_skills: string[] | null
          requirements: string[] | null
          rich_description: string | null
          scope: string | null
          service_contract: string | null
          sla_terms: Json | null
          spent: number | null
          status: Database["public"]["Enums"]["project_status_enum"] | null
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
          project_start_time?: string | null
          recommended_skills?: string[] | null
          requirements?: string[] | null
          rich_description?: string | null
          scope?: string | null
          service_contract?: string | null
          sla_terms?: Json | null
          spent?: number | null
          status?: Database["public"]["Enums"]["project_status_enum"] | null
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
          project_start_time?: string | null
          recommended_skills?: string[] | null
          requirements?: string[] | null
          rich_description?: string | null
          scope?: string | null
          service_contract?: string | null
          sla_terms?: Json | null
          spent?: number | null
          status?: Database["public"]["Enums"]["project_status_enum"] | null
          title?: string
          updated_at?: string | null
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
            foreignKeyName: "projects_contract_template_id_fkey"
            columns: ["contract_template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
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
        Relationships: [
          {
            foreignKeyName: "review_responses_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_moderated_by_fkey"
            columns: ["moderated_by"]
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
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reported_by_fkey"
            columns: ["reported_by"]
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
          id: string | null
          status: Database["public"]["Enums"]["project_status_enum"] | null
          updated_at: string | null
        }
        Insert: {
          id?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"] | null
          updated_at?: string | null
        }
        Update: {
          id?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"] | null
          updated_at?: string | null
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
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      rollback_policies_and_indexes: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      rollback_project_creation_fields: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      rollback_project_status_trigger: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      deliverable_status: "pending" | "approved" | "rejected"
      dispute_category:
        | "quality"
        | "timeline"
        | "payment"
        | "communication"
        | "scope"
        | "other"
      dispute_resolution_type:
        | "refund"
        | "partial_refund"
        | "work_revision"
        | "compensation"
        | "mediation"
        | "other"
      dispute_status:
        | "open"
        | "under_review"
        | "resolved"
        | "closed"
        | "cancelled"
      dispute_status_enum:
        | "open"
        | "under_review"
        | "resolved"
        | "closed"
        | "escalated"
      file_review_status_enum: "pending" | "approved" | "rejected"
      milestone_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "on_hold"
        | "overdue"
      milestone_status_enum:
        | "not_started"
        | "in_progress"
        | "completed"
        | "on_hold"
        | "overdue"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      payment_status_enum:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "overdue"
      project_status:
        | "draft"
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
      project_status_enum:
        | "draft"
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
      user_role: "client" | "professional" | "admin"
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
      application_status: ["pending", "accepted", "rejected", "withdrawn"],
      deliverable_status: ["pending", "approved", "rejected"],
      dispute_category: [
        "quality",
        "timeline",
        "payment",
        "communication",
        "scope",
        "other",
      ],
      dispute_resolution_type: [
        "refund",
        "partial_refund",
        "work_revision",
        "compensation",
        "mediation",
        "other",
      ],
      dispute_status: [
        "open",
        "under_review",
        "resolved",
        "closed",
        "cancelled",
      ],
      dispute_status_enum: [
        "open",
        "under_review",
        "resolved",
        "closed",
        "escalated",
      ],
      file_review_status_enum: ["pending", "approved", "rejected"],
      milestone_status: [
        "not_started",
        "in_progress",
        "completed",
        "on_hold",
        "overdue",
      ],
      milestone_status_enum: [
        "not_started",
        "in_progress",
        "completed",
        "on_hold",
        "overdue",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      payment_status_enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "overdue",
      ],
      project_status: [
        "draft",
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
      project_status_enum: [
        "draft",
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
      user_role: ["client", "professional", "admin"],
      verification_status_enum: ["unverified", "pending", "verified"],
    },
  },
} as const
