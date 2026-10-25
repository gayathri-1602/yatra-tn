"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true";
    if (isAuth) {
      router.replace("/");
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="animate-pulse text-orange-600 font-bold text-xl">Redirecting...</div>
    </div>
  );
}
