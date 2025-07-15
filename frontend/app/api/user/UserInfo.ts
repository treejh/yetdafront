import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const getUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${API}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("에러 발생", error);
  }
};
