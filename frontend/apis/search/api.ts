import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const searchResultApi = async (keyword: string) => {
  if (keyword.length < 2) {
    throw new Error("검색어는 최소 두 글자 이상 입력해야 합니다.");
  }
  const response = await axios.get(`${API}/api/v1/project/search`, {
    params: { keyword },
  });
  console.log("검색결과 조회", response.data);
  return response.data;
};
