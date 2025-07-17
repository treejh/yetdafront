import { PurchaseOption } from "@/hooks/useProjectForm";

interface PurchaseOptionsSectionProps {
  options: PurchaseOption[];
  onOptionChange: (
    index: number,
    field: keyof PurchaseOption,
    value: string | number
  ) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export default function PurchaseOptionsSection({
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: PurchaseOptionsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">구매 옵션</h2>
        <button
          type="button"
          onClick={onAddOption}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
        >
          + 옵션 추가
        </button>
      </div>

      {options.map((option, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              옵션 {index + 1}
            </h3>
            {options.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveOption(index)}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제공 방식 *
              </label>
              <select
                value={option.providingMethod}
                onChange={(e) =>
                  onOptionChange(
                    index,
                    "providingMethod",
                    e.target.value as "DOWNLOAD" | "EMAIL"
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DOWNLOAD">다운로드</option>
                <option value="EMAIL">이메일</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 (원) *
              </label>
              <input
                type="number"
                value={option.price}
                onChange={(e) => onOptionChange(index, "price", e.target.value)}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                옵션 제목 *
              </label>
              <input
                type="text"
                value={option.title}
                onChange={(e) => onOptionChange(index, "title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="옵션 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                value={option.optionStatus}
                onChange={(e) =>
                  onOptionChange(
                    index,
                    "optionStatus",
                    e.target.value as "AVAILABLE" | "UNAVAILABLE"
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="AVAILABLE">사용 가능</option>
                <option value="UNAVAILABLE">사용 불가</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              옵션 설명 *
            </label>
            <textarea
              value={option.content}
              onChange={(e) => onOptionChange(index, "content", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이 옵션에 대한 설명을 입력하세요"
            />
          </div>

          {option.fileIdentifier && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                연결된 파일: {option.fileIdentifier}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
