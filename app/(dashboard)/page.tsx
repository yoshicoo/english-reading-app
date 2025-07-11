import { createServerSupabaseClient } from '@/lib/supabase/server'
import StatsCard from '@/components/dashboard/StatsCard'
import WeeklyChart from '@/components/dashboard/WeeklyChart'
import { BookOpen, Target, TrendingUp, Clock } from 'lucide-react'
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // 統計情報の取得
  const { data: sessions } = await supabase
    .from('reading_sessions')
    .select('word_count, created_at, completed')
    .eq('user_id', user.id)

  const { data: vocabulary } = await supabase
    .from('vocabulary')
    .select('id')
    .eq('user_id', user.id)

  // 統計の計算
  const totalWords = sessions?.reduce((sum, session) => sum + session.word_count, 0) || 0
  const completedSessions = sessions?.filter(s => s.completed).length || 0
  const vocabularyCount = vocabulary?.length || 0

  // 週間データの準備
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const weeklyData = daysOfWeek.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayWords = sessions
      ?.filter(s => format(new Date(s.created_at), 'yyyy-MM-dd') === dayStr)
      .reduce((sum, s) => sum + s.word_count, 0) || 0
    
    return {
      date: dayStr,
      words: dayWords
    }
  })

  // 最近のセッション
  const recentSessions = sessions
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ダッシュボード</h2>
        <p className="mt-1 text-sm text-gray-600">
          あなたの学習進捗を確認しましょう
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="総読書単語数"
          value={totalWords.toLocaleString()}
          icon={<BookOpen className="h-8 w-8" />}
          description="これまでに読んだ単語"
        />
        <StatsCard
          title="完了セッション"
          value={completedSessions}
          icon={<Target className="h-8 w-8" />}
          description="完了した読書セッション"
        />
        <StatsCard
          title="単語帳登録数"
          value={vocabularyCount}
          icon={<TrendingUp className="h-8 w-8" />}
          description="学習中の単語"
        />
        <StatsCard
          title="今週の読書量"
          value={weeklyData.reduce((sum, d) => sum + d.words, 0).toLocaleString()}
          icon={<Clock className="h-8 w-8" />}
          description="今週読んだ単語数"
        />
      </div>

      <WeeklyChart data={weeklyData} />

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            最近の読書セッション
          </h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentSessions?.map((session) => (
                  <li key={session.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.genre} - {session.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.word_count} 単語 • {format(new Date(session.created_at), 'yyyy/MM/dd HH:mm')}
                        </p>
                      </div>
                      <div>
                        {session.completed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            完了
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            進行中
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
