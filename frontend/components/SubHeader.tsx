"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SubHeader() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const q = keyword.trim();
    if (q.length < 2) {
      return alert("검색어는 최소 2글자 이상 입력해주세요.");
    }
    router.push(`/search?keyword=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
      {/* 헤더 카테고리 */}
      <div className="flex text-md-navItem gap-5">
        <Link href="/">앱/서비스</Link>
        <Link href="/">Notion 템플릿</Link>
        <Link href="/">슬라이드/제안서</Link>
        <Link href="/">자동화 툴</Link>
        <Link href="/">디자인 리소스</Link>
      </div>

      {/* 검색 바 */}
      <div className="flex items-center px-4 py-2 bg-gray-100 rounded-xl w-1/3">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해주세요"
          className="flex-1 bg-transparent text-xs outline-none"
        />
        <button onClick={handleSearch} aria-label="검색">
          <Search width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
