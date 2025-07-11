import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReadingView from '@/components/reading/ReadingView'

export default async function ReadingSessionPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return notFound()

  const { data: session } = await supabase
    .from('reading_sessions')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!session) return notFound()

  return (
    <div className="space-y-6">
      <ReadingView session={session} userId={user.id} />
    </div>
  )
}
