"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, Phone, Map, Hospital, Building, Siren, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 11.0168,
  lng: 76.9558,
};

export default function SOSEmergency() {
  const searchParams = useSearchParams();
  const [activeService, setActiveService] = useState<string | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const findNearbyPlaces = useCallback((type: string) => {
    if (!isLoaded || !userLocation || typeof google === 'undefined') return;

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.nearbySearch(
      {
        location: userLocation,
        radius: 5000, // 5km
        type: type,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaces(results);
        }
      }
    );
  }, [isLoaded, userLocation]);

  const handleServiceClick = useCallback((service: string) => {
    setActiveService(service);
    setPlaces([]);
    if (service === "Ambulance" || service === "Helpline") {
      return;
    }
    let type = "";
    if (service === "Hospitals") type = "hospital";
    if (service === "Police") type = "police_station";
    if (service === "Fire") type = "fire_station";
    if (type && typeof google !== 'undefined') {
      findNearbyPlaces(type);
    }
  }, [findNearbyPlaces]);

  useEffect(() => {
    const service = searchParams.get("service");
    if (service && isLoaded && userLocation) {
      handleServiceClick(service);
    }
  }, [searchParams, isLoaded, userLocation, handleServiceClick]);

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || center}
      zoom={14}
      options={{
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {userLocation && <Marker position={userLocation} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />}
      {places.map((place) => (
        <Marker key={place.place_id} position={place.geometry.location} />
      ))}
    </GoogleMap>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-serif text-gray-800">
          Emergency Services
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border-none shadow-xl rounded-[32px]">
            <CardContent className="p-0">
              {isLoaded ? renderMap() : (
                <div className="h-[500px] bg-gray-100 flex items-center justify-center">
                  <p className="animate-pulse font-bold text-gray-400">Loading Map...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-none shadow-xl rounded-[32px] bg-white overflow-hidden">
            <CardHeader className="bg-red-50 p-6 border-b border-red-100">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Siren className="w-5 h-5" />
                {activeService || "Select Service"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {activeService === "Ambulance" || activeService === "Helpline" ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Call Emergency Services</h3>
                  <p className="text-gray-500 mb-6">Immediate medical assistance is available 24/7.</p>
                  <a 
                    href="tel:108" 
                    className={cn(buttonVariants({ size: "lg" }), "w-full h-16 bg-red-600 hover:bg-red-700 text-lg font-bold rounded-2xl")}
                  >
                    <Phone className="mr-2 h-6 w-6" /> Dial 108
                  </a>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {places.length > 0 ? (
                    places.map((place) => (
                      <div key={place.place_id} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100 group">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 mb-1 group-hover:text-red-600 transition-colors">{place.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{place.vicinity}</p>
                            {place.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-orange-600">★ {place.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}`}
                              target="_blank"
                              rel="noreferrer"
                              className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-xl w-10 h-10")}
                            >
                              <Map className="h-5 w-5" />
                            </a>
                            <a 
                              href={`tel:${place.formatted_phone_number || '108'}`}
                              className={cn(buttonVariants({ size: "icon" }), "rounded-xl w-10 h-10 bg-red-600")}
                            >
                              <Phone className="h-5 w-5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-gray-400">
                      <p>Select a service from the SOS button to see nearby results.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
