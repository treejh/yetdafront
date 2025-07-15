import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectContent } from "@/types/user/purchaseProject";

interface MyProjectCardProps {
  project: ProjectContent;
}

export default function MyProjectCard({ project }: MyProjectCardProps) {
  return (
    <Card className="w-full max-w-[280px] max-h-[330px] rounded-xl overflow-hidden flex flex-col">
      <CardHeader>
        <div className="relative w-full h-30">
          <Image
            src={project.contentImageUrls}
            alt="Project Image"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-between gap-2.5 p-4">
        <div className="text-xs color-[#868E96]">{project.hostName}</div>
        <CardTitle className="text-md truncate w-full">
          {project.title}
        </CardTitle>
        <div className="text-title">
          {project.purchaseOptions?.length}회 판매
        </div>
        <Badge
          variant="outline"
          className="py-1 px-2 w-fit h-fit bg-gradient-to-r from-[#1F9EFF] to-[#0064FF] text-white border-none"
        >
          좋은 창작자
        </Badge>
      </CardContent>
    </Card>
  );
}
