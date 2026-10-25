"use client";

import { useState, useMemo } from "react";
import { Hotel, MapPin, Star, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import hotelsData from "@/data/hotels.json";
import { cn } from "@/lib/utils";

type HotelType = (typeof hotelsData)[number];

export default function HotelsPage() {
  const [city, setCity] = useState<string>("all");
  const [budget, setBudget] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("0");

  const cities = useMemo(() => {
    const set = new Set(hotelsData.map((h) => h.city));
    return ["all", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return hotelsData.filter((h: HotelType) => {
      if (city !== "all" && h.city !== city) return false;
      if (budget !== "all" && h.priceRange !== budget) return false;
      if (minRating !== "0" && h.rating < parseFloat(minRating)) return false;
      return true;
    });
  }, [city, budget, minRating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-24 md:pb-12">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 shadow-lg">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Hotel className="w-10 h-10" />
            <h1 className="text-3xl font-bold font-serif">Hotel Finder</h1>
          </div>
          <p className="text-orange-100">Mock data — filter by city, budget & rating</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={city} onValueChange={(v) => setCity(v ?? city)}>
            <SelectTrigger className="w-[180px] rounded-xl bg-white border-0 shadow-md">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c === "all" ? "All cities" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={budget} onValueChange={(v) => setBudget(v ?? budget)}>
            <SelectTrigger className="w-[180px] rounded-xl bg-white border-0 shadow-md">
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
          <Select value={minRating} onValueChange={(v) => setMinRating(v ?? minRating)}>
            <SelectTrigger className="w-[140px] rounded-xl bg-white border-0 shadow-md">
              <SelectValue placeholder="Min rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h: HotelType) => (
            <Card
              key={h.id}
              className={cn(
                "overflow-hidden border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur",
                "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              )}
            >
              <div className="relative h-40 bg-gray-100">
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                  }}
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-sm">{h.rating}</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {h.priceRange}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{h.name}</h3>
                <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {h.city}
                </p>
                <div className="flex gap-2 mt-4">
                  <a
                    href={`tel:${h.name}`}
                    className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-center text-sm font-bold transition-all duration-300 hover:scale-105"
                  >
                    Call
                  </a>
                  <a
                    href={h.mapLink.replace("output=embed", "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-center text-sm font-bold transition-all duration-300 hover:scale-105"
                  >
                    Directions
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white/80 rounded-3xl">
            <p className="text-gray-500">No hotels match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
