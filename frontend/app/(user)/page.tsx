"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";

import { popularProjectApi } from "@/apis/popular-project/api";

import HomeCarousel from "./components/HomeCarousel";
import ProjectCard from "./components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // const loadMore = useCallback(async () => {
  //   if (!hasMore || isLoading) return;
  //   setIsLoading(true);

  //   try {
  //     const data = await popularProjectApi(page, 20);
  //     console.log("Popular projects:", data);
  //     setProjects(prev => [...prev, ...data.content]);
  //     setPage(prev => prev + 1);
  //     setHasMore(!data.last);
  //   } catch (err) {
  //     console.error("인기 프로젝트 조회 실패:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [page, hasMore, isLoading]);

  // useEffect(() => {
  //   loadMore();
  // }, []);

  // useEffect(() => {
  //   const el = loaderRef.current;
  //   if (!el) return;
  //   const obs = new IntersectionObserver(
  //     entries => {
  //       if (entries[0].isIntersecting) {
  //         loadMore();
  //       }
  //     },
  //     { root: null, rootMargin: "0px", threshold: 0.1 },
  //   );

  //   obs.observe(el);
  //   return () => obs.disconnect();
  // }, [loadMore]);

  return (
    <main>
      <HomeCarousel />

      <div className="w-full text-lg font-bold p-4">인기 프로젝트</div>

      <div className="grid grid-cols-4 gap-10 px-4">
        {projects.map((project, idx) => (
          <Link href={`/project/sell/${project.id}`} key={project.id}>
            <ProjectCard
              key={`${project.id}-${idx}`}
              hostName={project.hostName}
              thumbnail={project.thumbnail ?? "/images/sample-image.jpg"}
              title={project.title}
              sellingAmount={project.sellingAmount}
            />
          </Link>
        ))}
      </div>

      <div ref={loaderRef} className="py-10 text-center">
        {isLoading ? "로딩 중…" : hasMore ? "더 불러오는 중…" : <div></div>}
      </div>
    </main>
  );
}
