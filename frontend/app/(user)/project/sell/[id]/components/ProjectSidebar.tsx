import type { Project } from "@/types/project/project";

import ProjectSidebarPanel from "./ProjectSidebarPanel";
import ProjectSidebarSell from "./ProjectSidebarSell";

interface Props {
  project: Project;
}

export default function ProjectSidebar({ project }: Props) {
  return (
    <div className="space-y-6">
      <ProjectSidebarSell project={project} />
      <ProjectSidebarPanel
        creator={{
          name: project.name,
          userProfileImage: project.userProfileImage,
          userIntroduce: project.userIntroduce,
          followerCount: project.followerCount,
          userId: project.userId,
          email: project.email,
        }}
        stats={project.stats ?? { likes: 0, shares: 0, views: 0 }}
      />
    </div>
  );
}
