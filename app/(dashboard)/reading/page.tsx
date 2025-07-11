import ReadingSelector from '@/components/reading/ReadingSelector'

export default function ReadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">多読</h2>
        <p className="mt-1 text-sm text-gray-600">
          ジャンルとレベルを選択して、読書を始めましょう
        </p>
      </div>

      <ReadingSelector />
    </div>
  )
}
