"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Map, MessageCircle, Hotel, Calculator, Mic, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isAuth = typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true";
    if (!isAuth) {
      router.push("/auth/login");
    }
  }, [mounted, router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="animate-pulse text-orange-600 font-bold text-2xl">YatraTN</div>
      </div>
    );
  }

  const quickLinks = [
    { label: "Explore", href: "/explore", icon: Compass, desc: "100+ destinations" },
    { label: "Trip Planner", href: "/planner", icon: Map, desc: "Smart itinerary" },
    { label: "AI Assistant", href: "/assistance", icon: MessageCircle, desc: "Chat & voice" },
    { label: "Hotels", href: "/hotels", icon: Hotel, desc: "Find stays" },
    { label: "Budget", href: "/budget", icon: Calculator, desc: "Estimate cost" },
    { label: "Map", href: "/map", icon: MapPin, desc: "Interactive map" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-24 md:pb-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
        <div className="container mx-auto px-4 md:px-8 py-12 relative">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A2D1F] mb-2">
            Welcome to YatraTN
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Your AI-powered Smart Tourism companion for Tamil Nadu
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card
                    className={cn(
                      "h-full border-0 shadow-lg rounded-2xl overflow-hidden",
                      "bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02]",
                      "transition-all duration-300 hover:border-orange-200"
                    )}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.label}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
