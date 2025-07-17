import { ProjectFormData } from "@/hooks/useProjectForm";

interface BasicInfoSectionProps {
  formData: ProjectFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function BasicInfoSection({
  formData,
  onChange,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">기본 정보</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프로젝트 제목 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="프로젝트 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            분야 *
          </label>
          <input
            type="text"
            name="field"
            value={formData.field}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 웹 개발, 디자인, 교육 등"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          프로젝트 소개 *
        </label>
        <textarea
          name="introduce"
          value={formData.introduce}
          onChange={onChange}
          required
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="프로젝트를 간단히 소개해주세요"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상세 내용 *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={onChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="프로젝트에 대한 자세한 내용을 작성해주세요"
        />
      </div>
    </div>
  );
}
