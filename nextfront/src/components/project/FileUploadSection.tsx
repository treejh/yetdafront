interface FileUploadSectionProps {
  files: File[];
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
  onTriggerUpload: () => void;
}

export default function FileUploadSection({
  files,
  fileRef,
  onFileChange,
  onFileRemove,
  onTriggerUpload,
}: FileUploadSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">옵션 파일</h2>

      <div className="mb-4">
        <button
          type="button"
          onClick={onTriggerUpload}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          파일 추가
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span className="text-sm text-gray-700">{file.name}</span>
              <button
                type="button"
                onClick={() => onFileRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
