import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { explainWord } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { word, context } = await request.json()

    // GPT-4-miniで単語説明
    const explanation = await explainWord(word, context)

    // 説明を更新
    await supabase
      .from('vocabulary')
      .update({ explanation })
      .eq('user_id', user.id)
      .eq('word', word.toLowerCase())

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('Explain word error:', error)
    return NextResponse.json(
      { error: 'Failed to explain word' },
      { status: 500 }
    )
  }
}
