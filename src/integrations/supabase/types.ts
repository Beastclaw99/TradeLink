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
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      dispute_documents: {
        Row: {
          created_at: string | null
          description: string | null
          dispute_id: string
          file_id: string
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dispute_id: string
          file_id: string
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dispute_id?: string
          file_id?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_documents_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_documents_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "work_version_files"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          content: string
          created_at: string | null
          dispute_id: string
          id: string
          is_internal: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          dispute_id: string
          id?: string
          is_internal?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          dispute_id?: string
          id?: string
          is_internal?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
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
          reason: string | null
          status: string
        }
        Insert: {
          changed_by: string
          created_at?: string | null
          dispute_id: string
          id?: string
          reason?: string | null
          status: string
        }
        Update: {
          changed_by?: string
          created_at?: string | null
          dispute_id?: string
          id?: string
          reason?: string | null
          status?: string
        }
        Relationships: [
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
          created_at: string | null
          description: string
          id: string
          initiator_id: string
          project_id: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          respondent_id: string
          status: string
          title: string
          type: string
          updated_at: string | null
          work_version_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          initiator_id: string
          project_id: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id: string
          status: string
          title: string
          type: string
          updated_at?: string | null
          work_version_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          initiator_id?: string
          project_id?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          respondent_id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          work_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "disputes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_work_version_id_fkey"
            columns: ["work_version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
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
            referencedColumns: ["project_id"]
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
      payment_status_history: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          payment_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_status_history_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["payment_id"]
          },
          {
            foreignKeyName: "payment_status_history_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhooks: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          payment_id: string | null
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          payment_id?: string | null
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          payment_id?: string | null
          processed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_webhooks_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["payment_id"]
          },
          {
            foreignKeyName: "payment_webhooks_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
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
          payment_method_id?: string | null
          payment_url?: string | null
          professional_id?: string | null
          project_id?: string | null
          status?: string | null
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
            referencedColumns: ["project_id"]
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
          last_admin_action: string | null
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
          years_experience: number | null
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
          last_admin_action?: string | null
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
          years_experience?: number | null
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
          last_admin_action?: string | null
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
          years_experience?: number | null
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
            foreignKeyName: "project_archives_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
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
        Relationships: [
          {
            foreignKeyName: "project_completion_checklist_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_completion_checklist_project_id_fkey"
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
            referencedColumns: ["project_id"]
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
            foreignKeyName: "project_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
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
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
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
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
          },
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
          contract_template_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          expected_timeline: string | null
          id: string
          industry_specific_fields: Json | null
          location: string | null
          location_coordinates: unknown | null
          payment_due_date: string | null
          payment_id: string | null
          payment_required: boolean | null
          payment_status: string | null
          professional_id: string | null
          project_start_time: string | null
          recommended_skills: string | null
          requirements: string[] | null
          rich_description: string | null
          scope: string | null
          service_contract: string | null
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
          payment_due_date?: string | null
          payment_id?: string | null
          payment_required?: boolean | null
          payment_status?: string | null
          professional_id?: string | null
          project_start_time?: string | null
          recommended_skills?: string | null
          requirements?: string[] | null
          rich_description?: string | null
          scope?: string | null
          service_contract?: string | null
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
          payment_due_date?: string | null
          payment_id?: string | null
          payment_required?: boolean | null
          payment_status?: string | null
          professional_id?: string | null
          project_start_time?: string | null
          recommended_skills?: string | null
          requirements?: string[] | null
          rich_description?: string | null
          scope?: string | null
          service_contract?: string | null
          sla_terms?: Json | null
          status?: string | null
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
            foreignKeyName: "projects_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["payment_id"]
          },
          {
            foreignKeyName: "projects_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
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
        Relationships: [
          {
            foreignKeyName: "review_helpfulness_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpfulness_user_id_fkey"
            columns: ["user_id"]
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
          "updated at": string | null
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
          "updated at"?: string | null
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
          "updated at"?: string | null
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
            referencedColumns: ["project_id"]
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
      work_version_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          uploaded_at: string | null
          version_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_at?: string | null
          version_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_version_files_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "work_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      work_versions: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string | null
          version_number: number
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          version_number: number
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "payment_status_history_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "work_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
          project_payment_status: string | null
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
