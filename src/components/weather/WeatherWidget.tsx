"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind, MapPin, RefreshCw, Thermometer, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeather = async (lat?: number, lon?: number) => {
    setLoading(true);
    setError("");
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&units=metric`;
      
      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      } else {
        url += `&q=Chennai,IN`; // Default to Chennai
      }

      const res = await fetch(url);
      const data = await res.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      
      setWeather(data);
    } catch (err: any) {
      console.error("Weather error:", err);
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather() // Fallback to default
      );
    } else {
      fetchWeather();
    }
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear": return <Sun className="w-10 h-10 text-yellow-400" />;
      case "clouds": return <Cloud className="w-10 h-10 text-gray-400" />;
      case "rain": return <CloudRain className="w-10 h-10 text-blue-400" />;
      default: return <Sun className="w-10 h-10 text-yellow-400" />;
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <Cloud className="w-5 h-5 text-orange-600" />
          </div>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Weather Guide</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => fetchWeather()} 
          className="h-8 w-8 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
          disabled={loading}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </CardHeader>

      <CardContent className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Detecting climate...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <Button variant="link" onClick={() => fetchWeather()} className="text-orange-600 text-xs font-bold mt-2">
              Try again
            </Button>
          </div>
        ) : weather && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-black text-[#4A2D1F] mb-1">{Math.round(weather.main.temp)}°C</h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-3 h-3 text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">{weather.name}, {weather.sys.country}</span>
                </div>
              </div>
              <div className="w-20 h-20 bg-gray-50 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/50">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Droplets className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Humidity</p>
                  <p className="text-sm font-bold text-gray-700">{weather.main.humidity}%</p>
                </div>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100/50">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Wind className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wind Speed</p>
                  <p className="text-sm font-bold text-gray-700">{Math.round(weather.wind.speed * 3.6)} km/h</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-4 bg-orange-600 rounded-2xl flex items-center justify-between text-white shadow-xl shadow-orange-600/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Condition</p>
                    <p className="text-sm font-bold capitalize">{weather.weather[0].description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
