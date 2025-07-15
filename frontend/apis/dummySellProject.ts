// import type { Project } from "@/types/project/project";

// export async function getSellProjectById(id: string): Promise<Project | null> {
//   return {
//     id,
//     type: "sell",
//     title: "AI 양말",
//     subtitle: "AI 양말 서비스",
//     description: `### 주요 기능
// - 자동 빨래
// - 다양한 색
// - 생각보다 두꺼움`,
//     category: "AI",
//     // subCategories: ["빨래 자동화", "GPT"],
//     images: [
//       "/placeholder.svg?width=600&height=400",
//       "/placeholder.svg?width=600&height=400",
//       "/placeholder.svg?width=600&height=400",
//     ],
//     creator: {
//       name: "Poby",
//       avatar: "/placeholder.svg?width=40&height=40",
//       bio: "양말에 진심인 개발자입니다.",
//       github: "https://github.com/Poby",
//       portfolio: "https://poby.dev",
//       projects: 3,
//       followers: 421,
//     },
//     price: 15000,
//     options: [
//       { name: "Standart", price: "3000", description: "기본 양말 제공" },
//       { name: "Delux", price: "5000", description: "고급 양말 제공" },
//     ],
//     updates: [
//       {
//         id: 1,
//         title: "AI 세탁 기능 추가 완료",
//         content: "AI가 스스로 오염도를 감지하고 세탁 타이밍을 조절합니다.",
//         date: "2024-06-01",
//         likes: 12,
//       },
//       {
//         id: 2,
//         title: "신규 색상 추가: 민트 & 라벤더",
//         content: "여름을 맞아 산뜻한 색상을 추가했습니다!",
//         date: "2024-06-10",
//         likes: 8,
//       },
//     ],
//     reviews: [
//       {
//         id: 1,
//         user: "양말매니아",
//         avatar: "/placeholder.svg?width=32&height=32",
//         rating: 5,
//         content:
//           "정말 편해요. 자동 세탁 기능 덕분에 세탁기 안 돌려도 돼서 좋아요!",
//         date: "2024-06-15",
//         helpful: 7,
//       },
//       {
//         id: 2,
//         user: "패션리더",
//         avatar: "/placeholder.svg?width=32&height=32",
//         rating: 4,
//         content: "디자인이 좀 더 다양했으면 좋겠지만, 기능은 만족스럽습니다.",
//         date: "2024-06-16",
//         helpful: 4,
//       },
//     ],
//     faqs: [
//       {
//         question: "AI 양말은 어떻게 작동하나요?",
//         answer: "센서를 통해 오염도를 인식하고 자동으로 세탁 알림을 줍니다.",
//       },
//       {
//         question: "사이즈는 어떻게 선택하나요?",
//         answer: "Free 사이즈이지만, 발목 탄성으로 대부분의 발에 잘 맞습니다.",
//       },
//     ],
//     stats: {
//       likes: 10,
//       shares: 5,
//       views: 120,
//     },
//   };
// }
