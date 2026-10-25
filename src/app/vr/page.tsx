"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import vrPlaces from "@/data/vrPlaces.json";
import { VRModal, type VRPlace } from "@/components/vr/VRModal";

export default function VRPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useState<VRPlace | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return vrPlaces as unknown as VRPlace[];
    return (vrPlaces as unknown as VRPlace[]).filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-24 md:pb-12">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif">VR Experience</h1>
              <p className="text-orange-100">Explore Tamil Nadu in VR (iframe embeds, no API keys)</p>
            </div>
          </div>

          <div className="relative mt-6 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 w-5 h-5" />
            <Input
              placeholder="Search VR places..."
              className="h-14 pl-12 pr-4 bg-white/15 text-white placeholder:text-white/70 border border-white/20 rounded-2xl focus-visible:ring-2 focus-visible:ring-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200";
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/90 text-orange-600 text-xs font-bold">
                    {p.category}
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-gray-800 leading-tight">{p.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold">{p.location}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                  <Button
                    className="mt-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => setActive(p)}
                  >
                    View in VR
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">No VR places match your search.</div>
        )}
      </div>

      <VRModal open={!!active} place={active} onClose={() => setActive(null)} />
    </div>
  );
}
