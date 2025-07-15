"use client";

import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-4 text-gray-500">검색 중입니다...</p>}>
      <SearchClient />
    </Suspense>
  );
}
