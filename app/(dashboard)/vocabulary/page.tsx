import { createServerSupabaseClient } from '@/lib/supabase/server'
import VocabularyList from '@/components/vocabulary/VocabularyList'

export default async function VocabularyPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: vocabulary } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">単語帳</h2>
        <p className="mt-1 text-sm text-gray-600">
          学習中の単語一覧 • {vocabulary?.length || 0} 単語
        </p>
      </div>

      {vocabulary && vocabulary.length > 0 ? (
        <VocabularyList vocabulary={vocabulary} />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">まだ単語が登録されていません</p>
          <p className="text-sm text-gray-400 mt-2">
            読書中に単語をクリックして登録しましょう
          </p>
        </div>
      )}
    </div>
  )
}
