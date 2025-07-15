"use client";

import "@/app/globals.css";
import { useCheckLogin } from "@/app/api/my/useCheckLogin";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useCheckLogin();
  return <>{children}</>;
}
