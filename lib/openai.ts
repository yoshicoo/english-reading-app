import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateReadingContent(
  genre: string,
  type: string,
  level: string,
  wordCount: number
) {
  const prompt = `Generate an English ${type} article about ${genre} for ${level} level learners. 
  The content should be approximately ${wordCount} words. 
  Make it engaging and educational. Include varied vocabulary appropriate for the level.
  Format: Return only the article content without any meta information.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: wordCount * 2,
  })

  return response.choices[0].message.content || ''
}

export async function explainWord(word: string, context?: string) {
  const prompt = `Explain the word "${word}"${context ? ` in the context: "${context}"` : ''} 
  for an English learner. Include:
  1. Definition
  2. Part of speech
  3. Example sentences
  4. Synonyms
  5. Common usage
  Keep the explanation clear and concise.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
  })

  return response.choices[0].message.content || ''
}
