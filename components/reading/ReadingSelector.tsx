'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Genre, ContentType, Level } from '@/types'

const genres: { value: Genre; label: string }[] = [
  { value: 'business', label: 'ビジネス' },
  { value: 'technology', label: 'テクノロジー' },
  { value: 'literature', label: '文学' },
  { value: 'daily', label: '日常会話' },
  { value: 'science', label: '科学' },
  { value: 'culture', label: '文化' },
]

const types: { value: ContentType; label: string }[] = [
  { value: 'magazine', label: '雑誌' },
  { value: 'sns', label: 'SNS' },
  { value: 'column', label: 'コラム' },
  { value: 'news', label: 'ニュース' },
  { value: 'novel', label: '小説' },
]

const levels: { value: Level; label: string }[] = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
]

const wordCounts = [100, 200, 300, 500, 750, 1000]

export default function ReadingSelector() {
  const router = useRouter()
  const [genre, setGenre] = useState<Genre>('technology')
  const [type, setType] = useState<ContentType>('news')
  const [level, setLevel] = useState<Level>('intermediate')
  const [wordCount, setWordCount] = useState(300)
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    
    const response = await fetch('/api/generate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genre, type, level, wordCount }),
    })

    if (response.ok) {
      const { sessionId } = await response.json()
      router.push(`/reading/${sessionId}`)
    } else {
      setLoading(false)
      alert('文章の生成に失敗しました')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">読書設定</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ジャンル
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genres.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGenre(g.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      genre === g.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記事タイプ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {types.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      type === t.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                レベル
              </label>
              <div className="grid grid-cols-3 gap-3">
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      level === l.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文字数: {wordCount} 単語
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? '文章を生成中...' : '読書を開始'}
        </button>
      </div>
    </div>
  )
}
