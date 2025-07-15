// import axios from "axios";

// import type { Project } from "@/types/project/project";

// const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

// const ACCESS_TOKEN =
//   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob24yZ0BleGFtcGxlLmNvbSIsInVzZXJJZCI6MSwidXNlcm5hbWUiOiLqsJDsnKDsoIAiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MjU4MDgwNiwiZXhwIjoxNzUyNTkxNjA2fQ.l0Py6jihWMvqKR17Bac64zh23_mzG2urm23URGNMk00";

// export async function createPurchaseProject(formData: FormData) {
//   try {
//     const res = await axios.post(
//       `${API_URL}/api/v1/project/purchase`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//         },
//       },
//     );
//     return res;
//   } catch (err) {
//     console.error("프로젝트 등록 실패:", err);
//     throw err;
//   }
// }

// export async function getSellProjectById(id: string): Promise<Project | null> {
//   try {
//     const res = await axios.get(`${API_URL}/api/v1/project/${id}`, {
//       headers: {
//         Authorization: `Bearer ${ACCESS_TOKEN}`,
//       },
//     });

//     const project: Project = {
//       ...res.data.data,
//       images: res.data.data.contentImageUrls || [],
//     };

//     return project;
//   } catch (err) {
//     console.error("프로젝트 조회 실패:", err);
//     return null;
//   }
// }

// export const CreatePurchaseInfo = async ({
//   projectId,
//   optionIds,
//   email,
// }: {
//   projectId: number;
//   optionIds: number[];
//   email: string;
// }) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/api/v1/order/purchase`,
//       {
//         projectId,
//         projectType: "PURCHASE",
//         customerEmail: email,
//         purchaseOptions: optionIds,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//         },
//       },
//     );
//     return response.data.data;
//   } catch (error) {
//     console.error("Error creating purchase info:", error);
//     throw error;
//   }
// };

// export const TossPurchaseApi = async (
//   paymentKey: string,
//   orderId: string,
//   amount: number,
// ) => {
//   const response = await axios.post(
//     `${API_URL}/api/v1/toss/confirm`,
//     {
//       paymentKey,
//       orderId,
//       amount,
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${ACCESS_TOKEN}`,
//       },
//     },
//   );
//   return response.data;
// };

// export const GetPurchasedFileUrl = async (optionId: number) => {
//   const response = await axios.get(
//     `${API_URL}/api/v1/order/purchase/${optionId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${ACCESS_TOKEN}`,
//       },
//     },
//   );
//   return response.data.data.fileUrl as string | null;
// };
// export async function updatePurchaseProject(
//   projectId: string,
//   formData: FormData,
// ) {
//   try {
//     const res = await axios.put(
//       `${API_URL}/api/v1/project/purchase/${projectId}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//         },
//       },
//     );
//     return res;
//   } catch (err) {
//     console.error("프로젝트 수정 실패:", err);
//     throw err;
//   }
// }
