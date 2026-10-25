"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import tourismData from "@/data/tourismData.json";
import { cn } from "@/lib/utils";

const MAP_PLACES = ["Chennai", "Madurai", "Ooty", "Kodaikanal", "Rameswaram", "Kanyakumari"];

const COORDS: Record<string, { x: number; y: number }> = {
  Chennai: { x: 72, y: 22 },
  Madurai: { x: 48, y: 48 },
  Ooty: { x: 28, y: 15 },
  Kodaikanal: { x: 42, y: 38 },
  Rameswaram: { x: 38, y: 82 },
  Kanyakumari: { x: 32, y: 92 },
};

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const firstMatch = selectedPlace
    ? (tourismData as Array<{ name: string; district: string; category: string; description: string; image: string }>).find(
        (s) => s.name === selectedPlace || s.district === selectedPlace
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-24 md:pb-12">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold font-serif">Interactive Tamil Nadu Map</h1>
          <p className="text-orange-100 text-sm mt-1">Click a marker — no API key</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Tamil_Nadu_district_map.svg/800px-Tamil_Nadu_district_map.svg.png"
            alt="Tamil Nadu"
            className="w-full h-full object-contain bg-gray-50"
          />
          {MAP_PLACES.map((place) => (
            <button
              key={place}
              type="button"
              className={cn(
                "absolute w-10 h-10 rounded-full bg-red-500 border-4 border-white shadow-lg",
                "flex items-center justify-center text-white transition-all duration-300",
                "hover:scale-125 hover:bg-red-600 hover:shadow-xl",
                selectedPlace === place && "ring-4 ring-orange-400 scale-125"
              )}
              style={{
                left: `${COORDS[place]?.x ?? 50}%`,
                top: `${COORDS[place]?.y ?? 50}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setSelectedPlace(place)}
            >
              <MapPin className="w-5 h-5" />
            </button>
          ))}
        </div>

        {selectedPlace && (
          <Card className="mt-8 max-w-2xl mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">{selectedPlace}</h2>
                <button
                  type="button"
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {firstMatch ? (
                <>
                  <p className="text-sm text-orange-600 font-semibold mt-1">{firstMatch.category} · {firstMatch.district}</p>
                  <p className="text-gray-600 mt-3">{firstMatch.description}</p>
                  <img
                    src={firstMatch.image}
                    alt={firstMatch.name}
                    className="mt-4 w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800";
                    }}
                  />
                </>
              ) : (
                <p className="text-gray-500 mt-2">
                  Major tourist hub. Explore destinations in {selectedPlace} from the Explore page.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Markers: Chennai, Madurai, Ooty, Kodaikanal, Rameswaram, Kanyakumari
        </p>
      </div>
    </div>
  );
}
