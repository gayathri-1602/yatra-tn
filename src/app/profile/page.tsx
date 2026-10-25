"use client";

import { User, MapPin, History, Star, Settings, LogOut, Package, Mail, Phone, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = {
    name: "John Doe",
    city: "Chennai",
    phone: "+91 9876543210",
    email: "john@example.com",
    profileImage: null,
    joinedDate: "March 2024",
    totalTrips: 12,
    points: 850
  };

  useEffect(() => {
    setTrips([]);
    setHistory([]);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F5] pb-24 md:pb-12">
      {/* Hero Section */}
      <div className="relative h-[35vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop"
          alt="Tamil Nadu Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl overflow-hidden group">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif drop-shadow-lg">
            {user.name}
          </h1>
          <p className="text-orange-100 text-lg font-medium drop-shadow-md flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {user.city}, Tamil Nadu
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-16 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-2xl bg-white rounded-[32px] overflow-hidden p-8">
              <div className="grid grid-cols-3 gap-4 text-center mb-8 border-b border-gray-50 pb-8">
                <div>
                  <p className="text-2xl font-black text-orange-600">{user.totalTrips}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trips</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-orange-600">{user.points}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-orange-600">4.8</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rating</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="font-bold text-gray-800">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    <p className="font-bold text-gray-800">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
                    <p className="font-bold text-gray-800">{user.joinedDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <Button className="w-full h-14 bg-orange-600 hover:bg-orange-700 rounded-2xl font-bold shadow-xl shadow-orange-600/20">
                  <Settings className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
                <Button variant="ghost" className="w-full h-14 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl font-bold">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] p-8 text-white">
              <Star className="w-10 h-10 mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">YatraTN Elite</h3>
              <p className="text-orange-100 text-sm mb-6">You're only 150 points away from unlocking exclusive heritage tours!</p>
              <Button className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-bold border-none">
                View Rewards
              </Button>
            </Card>
          </div>

          {/* Right Column: Trips & History */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl bg-white rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#4A2D1F] font-serif">Recent Journeys</h2>
                  <p className="text-gray-400 text-sm">Your travels across the landscape of Tamil Nadu</p>
                </div>
                <Button variant="outline" className="rounded-xl border-orange-100 text-orange-600 hover:bg-orange-50 font-bold">
                  View All
                </Button>
              </div>

              <div className="space-y-6">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 font-bold">Fetching your adventures...</p>
                  </div>
                ) : trips.length > 0 ? (
                  trips.map((trip) => (
                    <div key={trip.id} className="group relative bg-gray-50 hover:bg-white rounded-[24px] p-6 transition-all duration-300 border border-transparent hover:border-orange-100 hover:shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                            <MapPin className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                                {trip.travelType}
                              </span>
                              <span className="text-gray-300">•</span>
                              <p className="text-xs font-bold text-gray-400">
                                {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">Journey to the {trip.district || "Heritage Sites"}</h4>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost</p>
                            <p className="text-xl font-black text-orange-600">₹{trip.budget}</p>
                          </div>
                          <Button variant="ghost" className="h-12 w-12 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-orange-50 hover:text-orange-600 group-hover:scale-110 transition-all">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 px-8">
                    <div className="w-20 h-20 bg-orange-50 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                      <History className="w-10 h-10 text-orange-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No trips planned yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">Your future adventures across Tamil Nadu are waiting for you to start planning!</p>
                    <Button 
                      onClick={() => window.location.href = "/planner"}
                      className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold shadow-xl shadow-orange-600/20"
                    >
                      Plan Your First Trip
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-none shadow-2xl bg-white rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#4A2D1F] font-serif">Trip Planner History</h2>
                  <p className="text-gray-400 text-sm">Routes you've explored with our smart planner</p>
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="py-10 flex justify-center">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : history.length > 0 ? (
                  history.map((item) => (
                    <div key={item.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                          <History className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-gray-800">{item.startLocation}</span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="font-bold text-gray-800">{item.destination}</span>
                          </div>
                          <p className="text-xs text-gray-400 font-medium">{format(new Date(item.date), "MMMM do, yyyy")}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-lg text-orange-600 font-bold hover:bg-orange-50">
                        Re-plan
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-gray-400 font-medium italic">No planning history found.</p>
                )}
              </div>
            </Card>

            <Card className="border-none shadow-2xl bg-white rounded-[32px] p-8">
              <h3 className="text-xl font-bold text-[#4A2D1F] font-serif mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-orange-500" />
                Special Offers For You
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Stay Deal</p>
                  <h4 className="font-bold text-gray-800">20% Off Madurai Luxury Resorts</h4>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Experience</p>
                  <h4 className="font-bold text-gray-800">Free Heritage Walk in Chennai</h4>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
