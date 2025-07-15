"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type { Project } from "@/types/project/project";
import { getSellProjectById } from "@/apis/project";
import ProjectDescriptionTabs from "./components/ProjectDescriptionTabs";
import ProjectHeader from "./components/ProjectHeader";
import ProjectImageGallery from "./components/ProjectImageGallery";
import ProjectSidebar from "./components/ProjectSidebar";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectData = await getSellProjectById(id);
        setProject(projectData);
      } catch (error) {
        console.error("프로젝트 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">프로젝트 로딩 중...</div>
      </div>
    );
  }

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          <div className="space-y-12">
            <ProjectHeader project={project} />
            <ProjectImageGallery images={project.contentImageUrls} />
            <ProjectDescriptionTabs
              description={project.content}
              faqs={[]}
              reviews={[]}
              updates={[]}
            />
          </div>
          <div className="sticky top-24 self-start">
            <ProjectSidebar project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
