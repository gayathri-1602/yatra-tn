"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, LayoutGrid, Map as MapIcon, Calendar, Lightbulb, X } from "lucide-react";
import { categories, districts } from "@/lib/data/categories";
import tourismData from "@/data/tourismData.json";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/lib/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Spot = (typeof tourismData)[number];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const spots = useMemo(() => {
    let list: Spot[] = [...tourismData];
    if (selectedCategory) {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (selectedDistrict) {
      list = list.filter((s) => s.district === selectedDistrict);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, selectedDistrict, debouncedSearch]);

  const similarSpots = useMemo(() => {
    if (!selectedSpot) return [];
    return tourismData
      .filter((s) => s.category === selectedSpot.category && s.id !== selectedSpot.id)
      .slice(0, 4);
  }, [selectedSpot]);

  const galleryImages = selectedSpot
    ? [selectedSpot.image]
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50/80 to-amber-50/80 pb-24 md:pb-0">
      <div className="relative h-56 md:h-72 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop"
          alt="Tamil Nadu Tourism"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif drop-shadow-lg">
            Experience Tamil Nadu
          </h1>
          <p className="text-white/90 text-sm md:text-lg mt-2 max-w-2xl drop-shadow-md">
            Discover temples, beaches, hills & heritage
          </p>
          <div className="relative w-full max-w-xl mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search places, districts..."
              className="w-full h-12 md:h-14 pl-12 pr-4 bg-white border-0 rounded-2xl shadow-xl text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap gap-3 py-6">
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(v) => setSelectedCategory(!v || v === "all" ? null : v)}
          >
            <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur border-0 shadow-md rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedDistrict || "all"}
            onValueChange={(v) => setSelectedDistrict(!v || v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur border-0 shadow-md rounded-xl">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex bg-white/90 backdrop-blur rounded-xl p-1 shadow-md">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105",
                viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105",
                viewMode === "map" ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          {spots.length} destination{spots.length !== 1 ? "s" : ""} found
        </p>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {spots.map((spot) => (
              <Card
                key={spot.id}
                className={cn(
                  "overflow-hidden border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur",
                  "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                )}
                onClick={() => setSelectedSpot(spot)}
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600">
                    {spot.category}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{spot.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{spot.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      {spot.district}
                    </span>
                    <Button
                      size="sm"
                      className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpot(spot);
                      }}
                    >
                      View details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur mb-8">
            <iframe
              title="Tamil Nadu map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=76.0,8.0,80.5,13.5&layer=mapnik&marker=11.0,78.5"
              className="w-full h-[500px] border-0"
            />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {spots.slice(0, 6).map((spot) => (
                <Card
                  key={spot.id}
                  className="cursor-pointer border-0 shadow hover:shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => setSelectedSpot(spot)}
                >
                  <div className="flex">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-24 h-24 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200";
                      }}
                    />
                    <CardContent className="p-3 flex-1">
                      <h3 className="font-bold text-sm text-gray-800">{spot.name}</h3>
                      <p className="text-xs text-gray-500">{spot.district}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {spots.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No destinations match your filters.</p>
            <Button
              className="mt-4 rounded-xl bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDistrict("");
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedSpot} onOpenChange={(open) => !open && setSelectedSpot(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl bg-white">
          {selectedSpot && (
            <div className="flex flex-col h-[85vh]">
              <div className="relative h-52 shrink-0">
                <img
                  src={selectedSpot.image}
                  alt={selectedSpot.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <DialogTitle className="text-2xl font-bold font-serif">{selectedSpot.name}</DialogTitle>
                  <p className="flex items-center gap-1 mt-1 opacity-90">
                    <MapPin className="w-4 h-4" /> {selectedSpot.district} · {selectedSpot.category}
                  </p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Gallery</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {galleryImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${selectedSpot.name} ${i + 1}`}
                          className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200";
                          }}
                        />
                      ))}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedSpot.description}</p>
                  </section>
                  {selectedSpot.history && (
                    <section>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">History</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedSpot.history}</p>
                    </section>
                  )}
                  <section className="flex items-center gap-2 text-orange-600">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Best season:</span>
                    <span className="text-gray-700">{selectedSpot.bestSeason}</span>
                  </section>
                  {selectedSpot.travelTips && selectedSpot.travelTips.length > 0 && (
                    <section>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4" /> Travel tips
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {(Array.isArray(selectedSpot.travelTips)
                          ? selectedSpot.travelTips
                          : [selectedSpot.travelTips]
                        ).map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <section>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Map</h4>
                    <div className="rounded-2xl overflow-hidden border border-gray-200 h-64">
                      <iframe
                        title={`Map ${selectedSpot.name}`}
                        src={selectedSpot.mapEmbed}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </section>
                  {similarSpots.length > 0 && (
                    <section>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Similar places</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {similarSpots.map((s) => (
                          <Card
                            key={s.id}
                            className="cursor-pointer border shadow-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                            onClick={() => setSelectedSpot(s)}
                          >
                            <img
                              src={s.image}
                              alt={s.name}
                              className="w-full h-24 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200";
                              }}
                            />
                            <CardContent className="p-2">
                              <p className="font-semibold text-sm text-gray-800 line-clamp-1">{s.name}</p>
                              <p className="text-xs text-gray-500">{s.district}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
