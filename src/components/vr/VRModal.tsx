"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type VRPlace = {
  id: string;
  name: string;
  location: string;
  category: string;
  thumbnail: string;
  description: string;
  vrEmbedUrl: string;
};

export function VRModal({
  open,
  place,
  onClose,
}: {
  open: boolean;
  place: VRPlace | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && place && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative w-[95vw] h-[90vh] max-w-6xl",
              "rounded-3xl overflow-hidden bg-white shadow-2xl border border-white/20"
            )}
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold font-serif leading-tight">
                    {place.name}
                  </h2>
                  <p className="text-xs md:text-sm text-white/90 mt-1">
                    {place.location} · {place.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-11 h-11 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  aria-label="Close VR"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="w-full h-full pt-[76px] md:pt-[88px] bg-black">
              {/* Lazy-load: iframe renders only when modal is open */}
              <iframe
                src={place.vrEmbedUrl}
                title={`VR: ${place.name}`}
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

