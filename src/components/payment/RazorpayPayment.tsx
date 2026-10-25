"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Wallet, ChevronRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export default function RazorpayPayment({ userId }: { userId: string }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failure">("idle");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || loading) return;

    setLoading(true);
    setPaymentStatus("idle");

    try {
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 1. Create order on backend
      const orderRes = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), receipt: `receipt_${Date.now()}` }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "YatraTN Tourism",
        description: "Support Tamil Nadu Tourism Development",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Verify payment on backend
          const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.status === "success") {
            setPaymentStatus("success");
            // 4. Store payment status in Firestore
            await addDoc(collection(db, "payments"), {
              userId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: Number(amount),
              status: "success",
              createdAt: new Date(),
            });
          } else {
            setPaymentStatus("failure");
          }
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-serif text-[#4A2D1F]">Quick Payment</CardTitle>
            <CardDescription className="text-gray-400">Secure transactions for your trip</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4 space-y-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold text-lg">₹</div>
          <Input
            type="number"
            placeholder="Enter amount"
            className="h-14 pl-10 bg-gray-50 border-none rounded-2xl text-lg font-bold focus-visible:ring-2 focus-visible:ring-orange-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[100, 500, 1000, 5000].map((val) => (
            <Button
              key={val}
              variant="outline"
              onClick={() => setAmount(val.toString())}
              className={cn(
                "h-12 rounded-xl font-bold border-gray-100 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all",
                amount === val.toString() && "bg-orange-50 border-orange-200 text-orange-600"
              )}
            >
              ₹{val}
            </Button>
          ))}
        </div>

        {paymentStatus === "success" ? (
          <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <p className="text-sm font-bold text-green-700">Payment successful!</p>
          </div>
        ) : paymentStatus === "failure" ? (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-sm font-bold text-red-700">Payment failed. Please try again.</p>
          </div>
        ) : null}

        <Button
          className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          onClick={handlePayment}
          disabled={loading || !amount}
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Pay Now with Razorpay
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 pt-2 opacity-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4" alt="Razorpay" />
          <div className="w-px h-3 bg-gray-300" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure 256-bit SSL</p>
        </div>
      </CardContent>
    </Card>
  );
}
