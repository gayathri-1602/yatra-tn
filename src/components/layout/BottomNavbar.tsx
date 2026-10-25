"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Globe, Map, Headphones, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/", icon: Compass },
  { label: "Explore", href: "/explore", icon: Globe },
  { label: "Planner", href: "/planner", icon: Map },
  { label: "Assist", href: "/assistance", icon: Headphones },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 py-2 shadow-lg md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-orange-500" : "text-gray-400 hover:text-orange-400"
              )}
            >
              <div className={cn(
                "p-1 rounded-full transition-all duration-300",
                isActive && "bg-orange-50 scale-110"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-semibold transition-all duration-300",
                isActive ? "text-orange-600" : "text-gray-500"
              )}>{item.label}</span>
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 bg-orange-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
