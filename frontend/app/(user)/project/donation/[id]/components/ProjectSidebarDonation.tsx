// // "use client";

// // import { CreditCard, Calendar } from "lucide-react";
// // import { useState } from "react";

// // import type { Project } from "@/types/project/project";

// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Progress } from "@/components/ui/progress";

// // interface Props {
// //   project: Project;
// // }

// // export default function ProjectSidebarDonation(
// //   {
// //     /*{ project }: Props*/
// //   },
// // ) {
//   // const [amount, setAmount] = useState("");

//   return (
//     <>
//       {/* <Card>
//         <CardContent className="p-6 space-y-4">
//           <div className="text-center">
//             <div className="text-3xl font-bold text-sky-500 mb-2">
//               {project.donation?.percentage ?? 0}%
//             </div>
//             <Progress
//               value={project.donation?.percentage ?? 0}
//               className="h-3 mb-4 [&>div]:bg-sky-500"
//             />
//             <div className="grid grid-cols-2 gap-4 text-center">
//               <div>
//                 <div className="text-2xl font-bold">
//                   {project.donation?.current?.toLocaleString()}원
//                 </div>
//                 <div className="text-sm text-gray-600">현재 모금액</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold">
//                   {project.donation?.backers ?? 0}명
//                 </div>
//                 <div className="text-sm text-gray-600">후원자</div>
//               </div>
//             </div>
//             <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
//                 <Calendar className="w-4 h-4" />
//                 <span>{project.donation?.daysLeft}일 남음</span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>후원하기</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="support-amount">후원 금액</Label>
//             <Input
//               id="support-amount"
//               placeholder="10000"
//               value={amount}
//               onChange={e => setAmount(e.target.value)}
//               className="mt-2"
//             />
//           </div>
//           <Button
//             className="w-full bg-sky-500 hover:bg-sky-600 text-white"
//             size="lg"
//           >
//             <CreditCard className="w-4 h-4 mr-2" />
//             후원하기
//           </Button>
//         </CardContent>
//       </Card> */}
//     </>
//   );
// }
