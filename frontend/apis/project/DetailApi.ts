import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const DetailApi = async (id: number) => {
  const response = await axios.get(`${API}/api/v1/project/${id}`);
  console.log("DetailApi response:", response.data);
  return response.data.data;
};
