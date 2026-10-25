"use client";

import { Suspense } from "react";
import SOSEmergency from "@/components/layout/SOSEmergency";

export default function SOSPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div className="text-center py-20 font-bold text-orange-600 animate-pulse">Loading Emergency Services...</div>}>
        <SOSEmergency />
      </Suspense>
    </div>
  );
}
