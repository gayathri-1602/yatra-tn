"use client";

import { useState } from "react";
import { Calculator, MapPin, Calendar, Users, Hotel, Utensils, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import tourismData from "@/data/tourismData.json";
import { cn } from "@/lib/utils";

const DESTINATIONS = [...new Set(tourismData.map((d: { district: string }) => d.district))].sort();
const TRAVEL_TYPES = ["Solo", "Family", "Adventure", "Pilgrimage"];
const HOTEL_CATEGORIES = ["Budget", "Mid", "Luxury"];

const RATES = {
  transport: { Solo: 1500, Family: 4000, Adventure: 2500, Pilgrimage: 2000 },
  hotel: { Budget: 1500, Mid: 3500, Luxury: 8000 },
  food: { Solo: 800, Family: 2200, Adventure: 1000, Pilgrimage: 600 },
  activities: { Solo: 500, Family: 1500, Adventure: 2000, Pilgrimage: 300 },
};

export default function BudgetPage() {
  const [destination, setDestination] = useState("Chennai");
  const [days, setDays] = useState(3);
  const [travelType, setTravelType] = useState("Solo");
  const [hotelCategory, setHotelCategory] = useState("Mid");

  const transportPerDay = RATES.transport[travelType as keyof typeof RATES.transport] ?? 2000;
  const hotelPerDay = RATES.hotel[hotelCategory as keyof typeof RATES.hotel] ?? 3500;
  const foodPerDay = RATES.food[travelType as keyof typeof RATES.food] ?? 1000;
  const activitiesPerDay = RATES.activities[travelType as keyof typeof RATES.activities] ?? 800;

  const totalTransport = transportPerDay * Math.min(days, 7) + (days > 7 ? (days - 7) * 500 : 0);
  const totalHotel = hotelPerDay * days;
  const totalFood = foodPerDay * days;
  const totalActivities = activitiesPerDay * days;
  const total = totalTransport + totalHotel + totalFood + totalActivities;
  const perDay = days > 0 ? Math.round(total / days) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-24 md:pb-12">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 shadow-lg">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="w-10 h-10" />
            <h1 className="text-3xl font-bold font-serif">Travel Budget Calculator</h1>
          </div>
          <p className="text-orange-100">Estimate cost — no API</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-orange-500" />
                Destination
              </label>
              <Select value={destination} onValueChange={(v) => setDestination(v ?? destination)}>
                <SelectTrigger className="rounded-xl bg-gray-50 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-orange-500" />
                Number of days
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
                className="rounded-xl bg-gray-50 border-0"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-orange-500" />
                Travel type
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_TYPES.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={travelType === t ? "default" : "outline"}
                    size="sm"
                    className={cn("rounded-xl", travelType === t && "bg-orange-500 hover:bg-orange-600")}
                    onClick={() => setTravelType(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1">
                <Hotel className="w-4 h-4 text-orange-500" />
                Hotel category
              </label>
              <div className="flex flex-wrap gap-2">
                {HOTEL_CATEGORIES.map((c) => (
                  <Button
                    key={c}
                    type="button"
                    variant={hotelCategory === c ? "default" : "outline"}
                    size="sm"
                    className={cn("rounded-xl", hotelCategory === c && "bg-orange-500 hover:bg-orange-600")}
                    onClick={() => setHotelCategory(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
            <CardTitle className="text-lg font-serif">Estimated budget</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center text-gray-700">
              <span className="flex items-center gap-2"><Car className="w-4 h-4 text-orange-500" /> Transport</span>
              <span className="font-bold">₹{totalTransport.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="flex items-center gap-2"><Hotel className="w-4 h-4 text-orange-500" /> Hotel</span>
              <span className="font-bold">₹{totalHotel.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="flex items-center gap-2"><Utensils className="w-4 h-4 text-orange-500" /> Food</span>
              <span className="font-bold">₹{totalFood.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="flex items-center gap-2">Activities</span>
              <span className="font-bold">₹{totalActivities.toLocaleString()}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-orange-600">₹{total.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500">Approx ₹{perDay.toLocaleString()} per day</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
