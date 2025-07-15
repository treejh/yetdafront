"use client";

import Link from "next/link";
import { Github } from "lucide-react";

interface GithubBadgeProps {
  githubUrl: string;
}

export function GithubBadge({ githubUrl }: GithubBadgeProps) {
  const username = githubUrl.split("/").pop();

  return (
    <Link
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center justify-center bg-black rounded-full h-6 w-6 hover:w-[120px] transition-all duration-300 overflow-hidden"
    >
      <Github className="h-4 w-4 text-white shrink-0" />
      <span className="ml-2 text-white text-xs whitespace-nowrap hidden group-hover:inline">
        @{username}
      </span>
    </Link>
  );
}
