export interface User {
  id: string
  email: string
  username?: string
  created_at: string
}

export interface ReadingSession {
  id: string
  user_id: string
  genre: string
  type: string
  level: string
  word_count: number
  content: string
  completed: boolean
  created_at: string
  completed_at?: string
}

export interface Vocabulary {
  id: string
  user_id: string
  word: string
  context?: string
  explanation?: string
  session_id?: string
  created_at: string
}

export interface ReadingStats {
  totalWords: number
  sessionsCompleted: number
  vocabularyCount: number
  weeklyProgress: {
    date: string
    words: number
  }[]
}

export type Genre = 'business' | 'technology' | 'literature' | 'daily' | 'science' | 'culture'
export type ContentType = 'magazine' | 'sns' | 'column' | 'news' | 'novel'
export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface ReadingOptions {
  genre: Genre
  type: ContentType
  level: Level
  wordCount: number
}
