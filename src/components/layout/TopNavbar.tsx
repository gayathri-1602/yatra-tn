"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Globe, Map, Headphones, User, Menu, X, Languages, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "VR Experience", href: "/vr", icon: Globe },
  { label: "Trip Planner", href: "/planner", icon: Map },
  { label: "Travel Assist", href: "/assistance", icon: Headphones },
  { label: "Admin", href: "/admin", icon: ShieldCheck },
  { label: "Profile", href: "/profile", icon: User },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  // Hide on auth pages
  if (pathname.startsWith("/auth")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/explore" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-serif">
              YatraTN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-orange-500 flex items-center gap-2",
                    isActive ? "text-orange-600" : "text-gray-600"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />

            <Select value={lang} onValueChange={(val) => setLang(val ?? lang)}>
              <SelectTrigger className="w-[80px] h-9 bg-gray-50 border-none rounded-lg font-bold text-xs">
                <div className="flex items-center gap-2">
                  <Languages className="w-3 h-3 text-orange-500" />
                  <SelectValue placeholder="EN" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="TN">Tamil</SelectItem>
                <SelectItem value="HI">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </nav>

          {/* Mobile Menu Toggle (only visible on small screens where bottom nav might be hidden or preferred) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-sm font-semibold",
                pathname === item.href ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
