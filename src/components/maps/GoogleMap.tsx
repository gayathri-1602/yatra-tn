"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, Navigation, Search, Layers, Crosshair, MapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { cn } from "@/lib/utils";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 13.0827,
  lng: 80.2707, // Chennai
};

const importantPlaces = [
  { name: "Meenakshi Amman Temple", lat: 9.9195, lng: 78.1193 },
  { name: "Brihadeeswarar Temple", lat: 10.7828, lng: 79.1318 },
  { name: "Shore Temple", lat: 12.6159, lng: 80.1983 },
  { name: "Marina Beach", lat: 13.0483, lng: 80.2824 },
  { name: "Vivekananda Rock", lat: 8.0883, lng: 77.5385 },
];

export default function GoogleMapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<any>(null);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim() || !isLoaded || !map) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter = { lat: location.lat(), lng: location.lng() };
        setCenter(newCenter);
        map.panTo(newCenter);
        map.setZoom(14);
      } else {
        alert("Location not found. Please try again.");
      }
    });
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setCenter(loc);
          if (map) {
            map.panTo(loc);
            map.setZoom(15);
          }
        },
        () => alert("Error getting your location. Please check your browser settings.")
      );
    }
  };

  useEffect(() => {
    locateUser();
  }, [isLoaded]);

  return (
    <Card className="border-none shadow-xl bg-white rounded-[40px] overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <CardHeader className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <MapIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-[#4A2D1F]">Explore Tamil Nadu</CardTitle>
              <CardDescription className="text-gray-400">Find your next destination with ease</CardDescription>
            </div>
          </div>

          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search locations..."
              className="h-14 pl-12 pr-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-orange-600 hover:bg-orange-100 rounded-xl"
              onClick={handleSearch}
            >
              <Navigation className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4">
        <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-8 border-white group/map">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={7}
              onLoad={(m) => setMap(m)}
              onUnmount={onUnmount}
              options={{
                styles: [
                  {
                    featureType: "all",
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }],
                  },
                  {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#e9e9e9" }],
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9e9e9e" }],
                  },
                ],
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                  }}
                  title="Your Location"
                />
              )}

              {importantPlaces.map((place, idx) => (
                <Marker
                  key={idx}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => setSelectedPlace(place)}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                  }}
                />
              ))}

              {selectedPlace && (
                <InfoWindow
                  position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-gray-800">{selectedPlace.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Heritage Site in Tamil Nadu</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-orange-600 font-bold mt-2">
                      View Details →
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-[500px] bg-gray-50 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 font-medium">Loading map architecture...</p>
            </div>
          )}

          <Button 
            className="absolute bottom-6 right-6 h-14 w-14 rounded-2xl bg-white hover:bg-orange-50 text-orange-600 shadow-2xl border-none transition-all active:scale-95"
            onClick={locateUser}
          >
            <Crosshair className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center gap-4 group/item hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Markers</p>
              <p className="text-sm font-bold text-gray-700">Important Sites</p>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center gap-4 group/item hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Layers</p>
              <p className="text-sm font-bold text-gray-700">Detailed Terrain</p>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center gap-4 group/item hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <Navigation className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Navigation</p>
              <p className="text-sm font-bold text-gray-700">Real-time GPS</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
