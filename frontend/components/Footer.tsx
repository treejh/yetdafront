export default function Footer() {
  return (
    <div className="w-full h-[186px] flex items-center px-36 py-8 bg-primary text-white mt-20">
      <div className="flex justify-between items-start gap-20">
        {/* 푸터 메뉴 */}
        <div className="flex flex-col justify-center items-start gap-7">
          <div className="text-md-navItem text-white">예따</div>
          <div className="text-sm text-white">공지사항</div>
        </div>
        <div className="flex flex-col justify-center items-start gap-7">
          <div className="text-md-navItem text-white">이용안내</div>
          <div className="flex flex-col gap-3">
            <div className="text-sm text-white">창작자 가이드</div>
            <div className="text-sm text-white">개발자 가이드</div>
            <div className="text-sm text-white">수수료 안내</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-7">
          <div className="text-md-navItem text-white">정책</div>
          <div className="flex flex-col gap-3">
            <div className="text-sm text-white">이용약관/운영정책</div>
            <div className="text-sm text-white">개인정보 처리 방침</div>
            <div className="text-sm text-white">프로젝트 심사 기준</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-7">
          <div className="text-md-navItem text-white">문의 사항</div>
          <div className="text-sm text-white border">문의 하기</div>
        </div>
      </div>
    </div>
  );
}
