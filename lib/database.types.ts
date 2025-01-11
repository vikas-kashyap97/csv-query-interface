export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      files: {
        Row: {
          id: string
          user_id: string
          filename: string
          original_name: string
          size_bytes: number
          mime_type: string
          status: 'processing' | 'ready' | 'error'
          column_names: Json | null
          sample_data: Json | null
          row_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          filename: string
          original_name: string
          size_bytes: number
          mime_type: string
          status?: 'processing' | 'ready' | 'error'
          column_names?: Json | null
          sample_data?: Json | null
          row_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          original_name?: string
          size_bytes?: number
          mime_type?: string
          status?: 'processing' | 'ready' | 'error'
          column_names?: Json | null
          sample_data?: Json | null
          row_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      queries: {
        Row: {
          id: string
          user_id: string
          file_id: string
          natural_language_query: string
          sql_query: string | null
          status: 'success' | 'error'
          error_message: string | null
          execution_time_ms: number | null
          result_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          file_id: string
          natural_language_query: string
          sql_query?: string | null
          status?: 'success' | 'error'
          error_message?: string | null
          execution_time_ms?: number | null
          result_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_id?: string
          natural_language_query?: string
          sql_query?: string | null
          status?: 'success' | 'error'
          error_message?: string | null
          execution_time_ms?: number | null
          result_count?: number | null
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_statistics: {
        Row: {
          user_id: string
          total_files: number
          total_queries: number
          total_storage_bytes: number
          last_query_at: string | null
        }
      }
    }
  }
}

