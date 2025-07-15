"use client";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * QueryProvider
 * - 클라이언트 전역에서 React Query 상태관리 세팅
 * - 전역 QueryClient 포함
 * - 필요한 하위 레이아웃/페이지에서 이 Provider로 감싸서 사용
 *
 *  역할 정리
 *    - useQuery → GET 요청 자동 관리
 *    - useMutation → POST/PUT/DELETE 요청 전담
 *    - queryClient → 캐시를 직접 다루는 관리자
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 유용한 글로벌 쿼리 옵션 예시
            refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리패치 막기
            retry: 1, // 실패 시 1번만 재시도
            staleTime: 5 * 60 * 1000, // 5분 간 신선하게 유지
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

//https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
//https://tanstack.com/query/latest/docs/framework/react/devtools
