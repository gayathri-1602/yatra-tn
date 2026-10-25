"use client";

import { useState } from "react";
import { ShieldAlert, Phone, Ambulance, Flame, Hospital, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EMERGENCY_SERVICES = [
  { name: "Police", number: "100", icon: Phone },
  { name: "Ambulance", number: "108", icon: Ambulance },
  { name: "Fire Service", number: "101", icon: Flame },
];

const NEARBY_HOSPITALS = [
  { name: "Government General Hospital Chennai", number: "044-25305100", mapLink: "https://www.google.com/maps?q=Government+General+Hospital+Chennai&output=embed" },
  { name: "Apollo Hospitals Chennai", number: "044-28290234", mapLink: "https://www.google.com/maps?q=Apollo+Hospitals+Chennai&output=embed" },
  { name: "Madurai Government Rajaji Hospital", number: "0452-2520100", mapLink: "https://www.google.com/maps?q=Rajaji+Hospital+Madurai&output=embed" },
  { name: "Coimbatore Government Hospital", number: "0422-2301251", mapLink: "https://www.google.com/maps?q=Coimbatore+Government+Hospital&output=embed" },
  { name: "Kanyakumari District Hospital", number: "04652-246333", mapLink: "https://www.google.com/maps?q=Kanyakumari+District+Hospital&output=embed" },
];

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end gap-4 pointer-events-auto">
      {/* Emergency popup panel */}
      <div
        className={cn(
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none invisible"
        )}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-6 w-[320px] max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Emergency
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {EMERGENCY_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.number}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCall(s.number)}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Call
                  </button>
                </div>
              );
            })}

            <div className="pt-2 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Hospital className="w-4 h-4 text-red-500" />
                Nearby hospitals
              </h4>
              <div className="space-y-3">
                {NEARBY_HOSPITALS.map((h) => (
                  <div
                    key={h.name}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all duration-300"
                  >
                    <p className="font-medium text-gray-800 text-sm line-clamp-2">{h.name}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleCall(h.number)}
                        className="flex-1 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all duration-300 hover:scale-105"
                      >
                        Call
                      </button>
                      <a
                        href={h.mapLink.replace("output=embed", "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <MapPin className="w-3 h-3" />
                        Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main SOS button - red, circular, bottom right, hover glow */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 border-white shadow-xl",
          "bg-red-500 hover:bg-red-600 text-white",
          "transition-all duration-300 hover:scale-110 active:scale-95",
          "hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]",
          isOpen && "rotate-90 bg-gray-800 hover:bg-gray-900"
        )}
        aria-label="Emergency SOS"
      >
        {isOpen ? <X className="w-8 h-8 md:w-10 md:h-10" /> : <ShieldAlert className="w-8 h-8 md:w-10 md:h-10" />}
      </button>
    </div>
  );
}
