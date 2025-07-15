import type {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/*
요청 인터셉터 (Request Interceptor)
- 모든 요청을 보내기 전에 한 번 가로채서 처리
- 주로 하는 일: 토큰 자동 추가
  흐름:
    1. 사용자가 api.get('/users') 호출
    2. axios가 이 인터셉터를 거쳐서 config를 수정
    3. Authorization 헤더를 자동으로 붙임
    4. 최종 config로 서버에 전송
*/
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /*
    Next.js는 서버사이드(SSR)에서도 코드가 실행됨
    localStorage는 브라우저에만 있으니 서버에서는 접근하면 안 됨
    → typeof window !== 'undefined' 로 클라이언트인지 체크
    */
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers?.set) {
        // 최신 AxiosHeaders 타입이 .set() 메서드 제공
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - 로그인 필요!");
      // 401 Unauthorized = “인증이 없거나 잘못됐다” → 로그인(토큰) 다시
      // 여기서 로그아웃 처리나 리프레시 토큰 로직
    }
    return Promise.reject(error);
  },
);
