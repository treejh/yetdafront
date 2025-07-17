import Image from "next/image";

interface ImageUploadSectionProps {
  imagePreviews: string[];
  contentImageRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: (index: number) => void;
  onTriggerUpload: () => void;
}

export default function ImageUploadSection({
  imagePreviews,
  contentImageRef,
  onImageChange,
  onImageRemove,
  onTriggerUpload,
}: ImageUploadSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">콘텐츠 이미지</h2>

      <div className="mb-4">
        <button
          type="button"
          onClick={onTriggerUpload}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
        >
          이미지 추가
        </button>
        <input
          ref={contentImageRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onImageRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
