"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Users,
  User,
  Mountain,
  Church,
  IndianRupee,
  Car,
  Sun,
  CreditCard,
  CheckCircle2,
  Download,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import tourismData from "@/data/tourismData.json";
import { districts } from "@/lib/data/categories";

const TRAVEL_TYPES = [
  { id: "Solo", label: "Solo", icon: User },
  { id: "Family", label: "Family", icon: Users },
  { id: "Adventure", label: "Adventure", icon: Mountain },
  { id: "Pilgrimage", label: "Pilgrimage", icon: Church },
];

const BUDGETS = [
  { id: "Low", label: "Low", icon: IndianRupee },
  { id: "Medium", label: "Medium", icon: IndianRupee },
  { id: "Luxury", label: "Luxury", icon: IndianRupee },
];

const CITY_ROUTES: Record<string, string[]> = {
  Chennai: ["Chennai", "Chengalpattu", "Kancheepuram", "Tiruvallur", "Vellore", "Tirupathur"],
  Madurai: ["Madurai", "Theni", "Dindigul", "Sivaganga", "Ramanathapuram"],
  Coimbatore: ["Coimbatore", "Nilgiris", "Erode", "Tiruppur"],
  Tiruchirappalli: ["Tiruchirappalli", "Thanjavur", "Pudukkottai", "Ariyalur", "Perambalur"],
  Tirunelveli: ["Tirunelveli", "Kanyakumari", "Tenkasi", "Thoothukudi"],
  Salem: ["Salem", "Namakkal", "Dharmapuri", "Krishnagiri"],
  Ooty: ["Nilgiris", "Coimbatore", "Erode"],
  Kodaikanal: ["Dindigul", "Theni", "Madurai"],
};

function getDistrictsForCity(city: string): string[] {
  if (CITY_ROUTES[city]) return CITY_ROUTES[city];
  if (districts.includes(city)) return [city];
  return districts.slice(0, 8);
}

export default function PlannerPage() {
  const [startCity, setStartCity] = useState("Chennai");
  const [days, setDays] = useState(3);
  const [travelType, setTravelType] = useState("Solo");
  const [budget, setBudget] = useState("Medium");
  const [itinerary, setItinerary] = useState<Array<{ day: number; route: string; attractions: { name: string; place: string }[] }>>([]);
  const [generated, setGenerated] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [bookingMeta, setBookingMeta] = useState<{
    bookingId: string;
    amount: number;
    dateISO: string;
  } | null>(null);

  const districtsInRoute = useMemo(() => getDistrictsForCity(startCity), [startCity]);

  const estimatedCost = useMemo(() => {
    const basePerDay =
      budget === "Low" ? 2500 : budget === "Luxury" ? 12000 : 6000;
    const typeMultiplier =
      travelType === "Family" ? 1.6 : travelType === "Adventure" ? 1.2 : travelType === "Pilgrimage" ? 1.1 : 1;
    const amount = Math.round(basePerDay * Math.max(1, days) * typeMultiplier);
    return amount;
  }, [budget, travelType, days]);

  const generateItinerary = () => {
    const spots = tourismData as Array<{
      id: string;
      name: string;
      district: string;
      category: string;
      description: string;
    }>;
    const result: Array<{ day: number; route: string; attractions: { name: string; place: string }[] }> = [];
    const usedIds = new Set<string>();
    const distList = [...districtsInRoute];

    for (let d = 1; d <= days; d++) {
      const daySpots = spots.filter(
        (s) =>
          distList.includes(s.district) &&
          !usedIds.has(s.id) &&
          (travelType !== "Pilgrimage" || s.category === "Temple" || s.category === "Heritage") &&
          (travelType !== "Adventure" ||
            ["Nature", "Hill Station", "Wildlife"].includes(s.category))
      );
      const pick = daySpots.slice(0, 3);
      pick.forEach((s) => usedIds.add(s.id));
      const route =
        d === 1
          ? `${startCity} → ${pick[0]?.district || startCity}`
          : d === days
            ? `${pick[0]?.district || distList[0]} → ${startCity}`
            : `${pick[0]?.district || distList[0]} → ${distList[d % distList.length] || distList[0]}`;
      result.push({
        day: d,
        route,
        attractions: pick.map((s) => ({ name: s.name, place: s.district })),
      });
    }
    setItinerary(result);
    setGenerated(true);
    setPaid(false);
    setBookingMeta(null);
  };

  const openBooking = () => {
    setPaymentError("");
    setPaymentForm({ cardNumber: "", expiry: "", cvv: "", name: "" });
    setBookingMeta(null);
    setPaid(false);
    setBookingOpen(true);
  };

  const validatePayment = () => {
    const digits = paymentForm.cardNumber.replace(/\D/g, "");
    if (digits.length !== 16) return "Card number must be 16 digits.";
    const cvvDigits = paymentForm.cvv.replace(/\D/g, "");
    if (cvvDigits.length !== 3) return "CVV must be 3 digits.";
    return "";
  };

  const downloadReceipt = (meta: { bookingId: string; amount: number; dateISO: string }) => {
    const lines = [
      "YatraTN - Booking Receipt",
      "------------------------",
      `Trip: Smart Trip Planner (${travelType})`,
      `Start city: ${startCity}`,
      `Days: ${days}`,
      `Budget: ${budget}`,
      `Amount: ₹${meta.amount.toLocaleString()}`,
      `Date: ${new Date(meta.dateISO).toLocaleString()}`,
      `Booking ID: ${meta.bookingId}`,
      "",
      "Demo payment. No real transaction was processed.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yatratn-receipt-${meta.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handlePayNow = () => {
    const err = validatePayment();
    if (err) {
      setPaymentError(err);
      return;
    }
    setPaymentError("");
    setPaying(true);
    setTimeout(() => {
      const meta = {
        bookingId: `TN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: estimatedCost,
        dateISO: new Date().toISOString(),
      };
      setBookingMeta(meta);
      setPaid(true);
      setPaying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-24 md:pb-12">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 shadow-lg">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <MapPin className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-serif">Smart Trip Planner</h1>
          </div>
          <p className="text-orange-100">Instant itinerary from local data — no API</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 -mt-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-serif text-gray-800">Plan your trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Starting city
                  </label>
                  <Select value={startCity} onValueChange={(v) => setStartCity(v ?? startCity)}>
                    <SelectTrigger className="rounded-xl bg-gray-50 border-0 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Chennai", "Madurai", "Coimbatore", "Tiruchirappalli", "Tirunelveli", "Salem", "Ooty", "Kodaikanal", ...districts.slice(0, 10)].filter(
                        (v, i, a) => a.indexOf(v) === i
                      ).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    Number of days
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
                    className="rounded-xl bg-gray-50 border-0 shadow-sm h-11"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-2 block">Travel type</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <Button
                        key={t.id}
                        type="button"
                        variant={travelType === t.id ? "default" : "outline"}
                        className={cn(
                          "rounded-xl transition-all duration-300 hover:scale-105",
                          travelType === t.id && "bg-orange-500 hover:bg-orange-600"
                        )}
                        onClick={() => setTravelType(t.id)}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {t.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-2 block">Budget</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <Button
                      key={b.id}
                      type="button"
                      variant={budget === b.id ? "default" : "outline"}
                      className={cn(
                        "rounded-xl transition-all duration-300 hover:scale-105",
                        budget === b.id && "bg-orange-500 hover:bg-orange-600"
                      )}
                      onClick={() => setBudget(b.id)}
                    >
                      {b.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-lg font-bold shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02]"
                onClick={generateItinerary}
              >
                Generate itinerary
              </Button>
            </CardContent>
          </Card>

          {generated && itinerary.length > 0 && (
            <div className="mt-10 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 font-serif">Your itinerary</h2>
              {itinerary.map((day) => (
                <Card
                  key={day.day}
                  className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur transition-all duration-300 hover:shadow-2xl"
                >
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sun className="w-5 h-5 text-orange-500" />
                      Day {day.day}
                    </CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Car className="w-4 h-4" />
                      {day.route}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Suggested attractions</p>
                    <ul className="space-y-2">
                      {day.attractions.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                          {a.name} ({a.place})
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
                  <CardTitle className="text-lg font-serif text-gray-800">Booking summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span className="font-semibold">Start city</span>
                    <span className="font-bold">{startCity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span className="font-semibold">Days</span>
                    <span className="font-bold">{days}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span className="font-semibold">Travel type</span>
                    <span className="font-bold">{travelType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span className="font-semibold">Budget</span>
                    <span className="font-bold">{budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-base pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Estimated cost</span>
                    <span className="font-black text-orange-600">₹{estimatedCost.toLocaleString()}</span>
                  </div>
                  <Button
                    className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-lg font-bold shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    onClick={openBooking}
                  >
                    Proceed to Booking
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Demo payment only — no real transaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Fake payment modal */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => !paying && setBookingOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-[95vw] max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-white/20"
              initial={{ y: 20, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white/90">Demo Payment</p>
                    <h3 className="text-xl font-bold font-serif mt-1 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> {paid ? "Payment Successful" : "Pay & Confirm"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                    onClick={() => !paying && setBookingOpen(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {!paid ? (
                  <>
                    <div className="rounded-2xl bg-orange-50 p-4 border border-orange-100">
                      <p className="text-sm font-bold text-gray-800">Booking Summary</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {startCity} · {days} day(s) · {travelType} · {budget}
                      </p>
                      <p className="text-lg font-black text-orange-600 mt-2">
                        ₹{estimatedCost.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Input
                        placeholder="Card Number (16 digits)"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                        className="rounded-2xl bg-gray-50 border-0 shadow-inner"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Expiry (MM/YY)"
                          value={paymentForm.expiry}
                          onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                          className="rounded-2xl bg-gray-50 border-0 shadow-inner"
                        />
                        <Input
                          placeholder="CVV (3 digits)"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                          className="rounded-2xl bg-gray-50 border-0 shadow-inner"
                        />
                      </div>
                      <Input
                        placeholder="Name on Card"
                        value={paymentForm.name}
                        onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                        className="rounded-2xl bg-gray-50 border-0 shadow-inner"
                      />
                      {paymentError && (
                        <p className="text-sm text-red-600 font-semibold">{paymentError}</p>
                      )}
                    </div>

                    <Button
                      className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                      onClick={handlePayNow}
                      disabled={paying}
                    >
                      {paying ? "Processing..." : "Pay Now"}
                    </Button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-gray-800">Booking Confirmed</p>
                        <p className="text-sm text-gray-500">Payment Successful</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Trip details</p>
                      <p className="font-bold text-gray-800 mt-1">{startCity} · {days} day(s)</p>
                      <p className="text-sm text-gray-600">{travelType} · {budget}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Booking ID: <span className="font-bold">{bookingMeta?.bookingId}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Amount: <span className="font-bold">₹{bookingMeta?.amount.toLocaleString()}</span>
                      </p>
                    </div>

                    <Button
                      className="w-full h-14 rounded-2xl bg-[#4A2D1F] hover:bg-[#2D1F17] text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center gap-2"
                      onClick={() => bookingMeta && downloadReceipt(bookingMeta)}
                    >
                      <Download className="w-5 h-5" />
                      Download receipt
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
