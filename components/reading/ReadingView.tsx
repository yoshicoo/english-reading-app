'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ReadingSession } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface ReadingViewProps {
  session: ReadingSession
  userId: string
}

export default function ReadingView({ session, userId }: ReadingViewProps) {
  const router = useRouter()
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleWordClick = useCallback(async (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '')
    if (!cleanWord) return

    if (selectedWords.has(cleanWord)) {
      setSelectedWords(prev => {
        const newSet = new Set(prev)
        newSet.delete(cleanWord)
        return newSet
      })
    } else {
      setSelectedWords(prev => new Set(prev).add(cleanWord))
      
      // 単語を単語帳に保存
      const context = getWordContext(word, session.content)
      await supabase
        .from('vocabulary')
        .upsert({
          user_id: userId,
          word: cleanWord,
          context,
          session_id: session.id,
        }, {
          onConflict: 'user_id,word'
        })
    }
  }, [selectedWords, session, userId, supabase])

  const getWordContext = (word: string, content: string) => {
    const sentences = content.split(/[.!?]+/)
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(word.toLowerCase())) {
        return sentence.trim()
      }
    }
    return ''
  }

  const handleComplete = async () => {
    setLoading(true)
    
    await supabase
      .from('reading_sessions')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', session.id)

    router.push('/')
  }

  const renderContent = () => {
    const words = session.content.split(/\s+/)
    return words.map((word, index) => (
      <span key={index}>
        <span
          onClick={() => handleWordClick(word)}
          className={`cursor-pointer hover:bg-yellow-100 transition-colors ${
            selectedWords.has(word.toLowerCase().replace(/[^a-z]/g, ''))
              ? 'bg-yellow-200 font-semibold'
              : ''
          }`}
        >
          {word}
        </span>
        {' '}
      </span>
    ))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {session.genre} - {session.type}
              </h2>
              <p className="text-sm text-gray-500">
                レベル: {session.level} • {session.word_count} 単語
              </p>
            </div>
            <div className="text-sm text-gray-500">
              選択した単語: {selectedWords.size}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed text-lg">
              {renderContent()}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              単語をクリックして単語帳に追加できます
            </p>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? '保存中...' : '読書を完了'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
