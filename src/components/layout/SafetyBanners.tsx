"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Info, Bell, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SafetyBanners() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/safety-alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error("Safety Alerts Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const visibleAlerts = alerts.filter(alert => !dismissed.includes(alert.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "relative overflow-hidden rounded-[24px] p-6 border shadow-xl flex items-center justify-between gap-6 transition-all animate-in slide-in-from-top duration-500",
            alert.riskLevel === "HIGH" ? "bg-red-50 border-red-100 text-red-900" :
            alert.riskLevel === "MEDIUM" ? "bg-orange-50 border-orange-100 text-orange-900" :
            "bg-blue-50 border-blue-100 text-blue-900"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
              alert.riskLevel === "HIGH" ? "bg-red-500 text-white" :
              alert.riskLevel === "MEDIUM" ? "bg-orange-500 text-white" :
              "bg-blue-500 text-white"
            )}>
              {alert.riskLevel === "HIGH" ? <ShieldAlert className="w-6 h-6" /> :
               alert.riskLevel === "MEDIUM" ? <AlertTriangle className="w-6 h-6" /> :
               <Info className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Safety Alert: {alert.location}</span>
                <span className={cn(
                  "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                  alert.riskLevel === "HIGH" ? "bg-red-200 text-red-700" :
                  alert.riskLevel === "MEDIUM" ? "bg-orange-200 text-orange-700" :
                  "bg-blue-200 text-blue-700"
                )}>
                  {alert.riskLevel} Risk
                </span>
              </div>
              <p className="font-bold text-sm md:text-base leading-tight">{alert.message}</p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(prev => [...prev, alert.id])}
            className="p-2 hover:bg-black/5 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 opacity-40 group-hover:opacity-100" />
          </button>
        </div>
      ))}
    </div>
  );
}
