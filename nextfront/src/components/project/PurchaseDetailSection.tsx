import { ProjectFormData } from "@/hooks/useProjectForm";

interface PurchaseDetailSectionProps {
  formData: ProjectFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function PurchaseDetailSection({
  formData,
  onChange,
}: PurchaseDetailSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">구매 상세 정보</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Git 주소
          </label>
          <input
            type="url"
            name="purchaseDetail.gitAddress"
            value={formData.purchaseDetail.gitAddress}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/username/repository"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 ID *
          </label>
          <select
            name="purchaseDetail.purchaseCategoryId"
            value={formData.purchaseDetail.purchaseCategoryId}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>템플릿/디자인</option>
            <option value={2}>교육/강의</option>
            <option value={3}>도구/플러그인</option>
            <option value={4}>기타</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          평균 배송 시간 *
        </label>
        <input
          type="text"
          name="purchaseDetail.getAverageDeliveryTime"
          value={formData.purchaseDetail.getAverageDeliveryTime}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="예: 즉시 다운로드 및 24시간 이내 이메일 발송"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          가격 플랜 ID *
        </label>
        <select
          name="pricingPlanId"
          value={formData.pricingPlanId}
          onChange={onChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={1}>기본 플랜</option>
          <option value={2}>프리미엄 플랜</option>
          <option value={3}>엔터프라이즈 플랜</option>
        </select>
      </div>
    </div>
  );
}
