"use client";

import { useRouter } from "next/navigation";

import ProjectTypeSelector from "./components/ProjectTypeSelector";

export default function CreateProjectTypePage() {
  const router = useRouter();

  return (
    <ProjectTypeSelector
      onSelect={type => {
        //sell 이나 donation
        router.push(`/project/new/${type}`);
      }}
    />
  );
}
