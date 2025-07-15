"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchResultApi } from "@/apis/search/api";
import ProjectCard from "../components/ProjectCard";
import Link from "next/link";

interface RawProject {
  id: number;
  hostName: string;
  thumbnail: string;
  title: string;
  sellingAmount: number;
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [projects, setProjects] = useState<RawProject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (keyword.length < 2) {
      setProjects([]);
      setTotalCount(0);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await searchResultApi(keyword);
        const rawList: RawProject[] = res.data.content || [];

        setProjects(rawList);
        setTotalCount(res.data.totalElements ?? rawList.length);
      } catch (e: any) {
        console.error("검색 실패:", e);

        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword]);

  return (
    <div className="w-full h-fit flex flex-col items-center justify-center">
      {keyword.length < 2 ? (
        <p className="mt-4 text-gray-500">
          검색어를 최소 2글자 이상 입력해주세요.
        </p>
      ) : loading ? (
        <p className="mt-4">검색 중…</p>
      ) : error ? (
        <p className="mt-4 text-red-500">에러 발생: {error}</p>
      ) : (
        <div className="w-full flex justify-start items-center px-4 pt-4 pb-10">
          <div className="text-[#0064FF]">{totalCount}</div>개의 검색결과가
          있습니다.
        </div>
      )}

      <div className="grid grid-cols-4 gap-10 px-4">
        {projects.map(p => (
          <Link href={`/project/sell/${p.id}`} key={p.id}>
            <ProjectCard
              hostName={p.hostName}
              thumbnail={p.thumbnail}
              title={p.title}
              sellingAmount={p.sellingAmount}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
