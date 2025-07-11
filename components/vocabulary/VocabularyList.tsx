'use client'

import { useState } from 'react'
import { Vocabulary } from '@/types'
import { Search, Book, RefreshCw } from 'lucide-react'

interface VocabularyListProps {
  vocabulary: Vocabulary[]
}

export default function VocabularyList({ vocabulary: initialVocabulary }: VocabularyListProps) {
  const [vocabulary, setVocabulary] = useState(initialVocabulary)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const filteredVocabulary = vocabulary.filter(v =>
    v.word.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExplain = async (word: Vocabulary) => {
    setLoading(word.id)
    
    const response = await fetch('/api/explain-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: word.word,
        context: word.context,
      }),
    })

    if (response.ok) {
      const { explanation } = await response.json()
      setVocabulary(prev =>
        prev.map(v => v.id === word.id ? { ...v, explanation } : v)
      )
      setSelectedWord({ ...word, explanation })
    }
    
    setLoading(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="単語を検索..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredVocabulary.map((word) => (
                <div
                  key={word.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedWord?.id === word.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedWord(word)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{word.word}</h4>
                      {word.context && (
                        <p className="mt-1 text-sm text-gray-600 italic">"{word.context}"</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        追加日: {new Date(word.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    {!word.explanation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExplain(word)
                        }}
                        disabled={loading === word.id}
                        className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                      >
                        {loading === word.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Book className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {selectedWord && (
          <div className="bg-white shadow rounded-lg sticky top-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedWord.word}
              </h3>
              
              {selectedWord.explanation ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {selectedWord.explanation}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    説明を表示するには本のアイコンをクリックしてください
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
