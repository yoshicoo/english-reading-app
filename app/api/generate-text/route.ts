import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateReadingContent } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { genre, type, level, wordCount } = await request.json()

    // ChatGPTで文章生成
    const content = await generateReadingContent(genre, type, level, wordCount)

    // セッションを保存
    const { data: session, error } = await supabase
      .from('reading_sessions')
      .insert({
        user_id: user.id,
        genre,
        type,
        level,
        word_count: wordCount,
        content,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Generate text error:', error)
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    )
  }
}
