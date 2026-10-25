"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, AlertTriangle, Users, LayoutDashboard, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import tourismData from "@/data/tourismData.json";

export default function AdminDashboard() {
  const [spots, setSpots] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Spot Form
  const [newSpot, setNewSpot] = useState({
    name: "",
    category: "nature",
    district: "Chennai",
    description: "",
    images: "[]",
    vrUrl: "",
    rating: 4.5
  });

  // New Alert Form
  const [newAlert, setNewAlert] = useState({
    location: "",
    riskLevel: "LOW",
    message: ""
  });

  useEffect(() => {
    // Demo mode: local dataset only (no backend)
    setSpots(tourismData.slice(0, 50));
    setAlerts([
      { id: "a1", location: "Chennai", riskLevel: "LOW", message: "Demo alert: stay hydrated and avoid peak noon heat." },
      { id: "a2", location: "Nilgiris", riskLevel: "MEDIUM", message: "Demo alert: fog expected in hill areas; drive carefully." },
    ]);
    setLoading(false);
  }, []);

  const handleAddSpot = async () => {
    alert("Demo mode: backend admin actions are disabled.");
  };

  const handleAddAlert = async () => {
    alert("Demo mode: backend admin actions are disabled.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] pb-24 md:pb-12">
      <header className="p-8 bg-white border-b">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A2D1F] font-serif">Admin Dashboard</h1>
            <p className="text-gray-500">Manage tourist places, safety alerts, and system activity.</p>
          </div>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-orange-600 hover:bg-orange-700 rounded-xl font-bold h-10 px-4 py-2 flex items-center gap-2"
                )}
              >
                <Plus className="w-4 h-4" /> Add New Place
              </DialogTrigger>
              <DialogContent className="rounded-[32px] p-8 max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">Add Tourist Spot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input placeholder="Spot Name" value={newSpot.name} onChange={e => setNewSpot({...newSpot, name: e.target.value})} />
                  <Input placeholder="District" value={newSpot.district} onChange={e => setNewSpot({...newSpot, district: e.target.value})} />
                  <textarea 
                    placeholder="Description" 
                    className="w-full h-32 p-4 bg-gray-50 rounded-xl border-none outline-none resize-none"
                    value={newSpot.description}
                    onChange={e => setNewSpot({...newSpot, description: e.target.value})}
                  />
                  <Input placeholder="Image URL" onChange={e => setNewSpot({...newSpot, images: JSON.stringify([e.target.value])})} />
                  <Input placeholder="VR URL (Google Street View embed)" onChange={e => setNewSpot({...newSpot, vrUrl: e.target.value})} />
                  <Button onClick={handleAddSpot} className="w-full bg-orange-600 hover:bg-orange-700 h-12 rounded-xl font-bold">Create Spot</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8 grid lg:grid-cols-4 gap-8">
        {/* Stats Cards */}
        <Card className="border-none shadow-sm rounded-3xl p-6 bg-white flex items-center gap-4 transition-all hover:shadow-xl hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">{spots.length}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Places</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-3xl p-6 bg-white flex items-center gap-4 transition-all hover:shadow-xl hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">{alerts.length}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Alerts</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-3xl p-6 bg-white flex items-center gap-4 transition-all hover:shadow-xl hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">1.2k</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-3xl p-6 bg-white flex items-center gap-4 transition-all hover:shadow-xl hover:-translate-y-0.5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">₹45k</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-xl font-serif">Tourist Spots Management</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[500px]">
              <div className="p-8 space-y-4">
                {spots.map(spot => (
                  <div key={spot.id} className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between border border-transparent hover:border-orange-100 hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                        <img src={JSON.parse(spot.images)[0]} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{spot.name}</h4>
                        <p className="text-xs text-gray-400 font-medium">{spot.district} • {spot.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-[32px] bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-0.5">
            <h3 className="text-xl font-serif mb-6">Quick Safety Alert</h3>
            <div className="space-y-4">
              <Input placeholder="Location (e.g. Ooty)" value={newAlert.location} onChange={e => setNewAlert({...newAlert, location: e.target.value})} />
              <Select value={newAlert.riskLevel} onValueChange={val => setNewAlert({...newAlert, riskLevel: val ?? newAlert.riskLevel})}>
                <SelectTrigger className="bg-gray-50 border-none rounded-xl">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low Risk</SelectItem>
                  <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                  <SelectItem value="HIGH">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <textarea 
                placeholder="Alert message..." 
                className="w-full h-24 p-4 bg-gray-50 rounded-xl border-none outline-none resize-none text-sm"
                value={newAlert.message}
                onChange={e => setNewAlert({...newAlert, message: e.target.value})}
              />
              <Button onClick={handleAddAlert} className="w-full bg-red-600 hover:bg-red-700 rounded-xl font-bold">Issue Alert</Button>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] bg-white p-8 transition-all hover:shadow-xl hover:-translate-y-0.5">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-400" /> System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">API Status</span>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Database</span>
                <span className="text-xs font-bold text-gray-800">SQLite (Connected)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Last Backup</span>
                <span className="text-xs font-bold text-gray-800">2h ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
