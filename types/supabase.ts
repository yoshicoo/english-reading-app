export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          created_at?: string
        }
      }
      reading_sessions: {
        Row: {
          id: string
          user_id: string
          genre: string
          type: string
          level: string
          word_count: number
          content: string
          completed: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          genre: string
          type: string
          level: string
          word_count: number
          content: string
          completed?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          genre?: string
          type?: string
          level?: string
          word_count?: number
          content?: string
          completed?: boolean
          created_at?: string
          completed_at?: string | null
        }
      }
      vocabulary: {
        Row: {
          id: string
          user_id: string
          word: string
          context: string | null
          explanation: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          context?: string | null
          explanation?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          context?: string | null
          explanation?: string | null
          session_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
