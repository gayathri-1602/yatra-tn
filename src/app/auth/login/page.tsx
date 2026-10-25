"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, ShieldCheck, LogIn, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Dummy login and OTP via backend

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Identifier, 2: Verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [preference, setPreference] = useState<"phone" | "email">("phone");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [preference]);

  const handleEmailLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/email-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Replace with Firebase Authentication in production.
        localStorage.setItem("isAuthenticated", "true");
        router.push("/");
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    // Replace with Firebase Authentication in production.
    setLoading(true);
    setError("");
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    // Replace with Firebase OTP in production
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (verificationCode === "123456") {
        // Replace with Firebase Authentication in production.
        localStorage.setItem("isAuthenticated", "true");
        router.push("/");
      } else {
        setError("Invalid OTP. Please use 123456 for this demo.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F5]">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop"
          alt="Tamil Nadu Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 font-serif drop-shadow-lg">
            YatraTN
          </h1>
          <p className="text-orange-100 text-lg md:text-xl font-medium drop-shadow-md">
            Your Gateway to the Heart of Tamil Nadu
          </p>
        </div>
      </div>

      {/* Login Card Section */}
      <div className="flex-1 flex items-center justify-center px-6 -mt-20 relative z-30">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <Card className="shadow-2xl border-none bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="pt-10 pb-2 px-8">
                <CardTitle className="text-2xl font-serif text-[#4A2D1F]">Welcome Back</CardTitle>
                <CardDescription className="text-gray-500">Login to continue your journey</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-2xl">
                  <Button
                    variant="ghost"
                    onClick={() => setPreference("phone")}
                    className={cn(
                      "h-11 rounded-xl font-bold transition-all",
                      preference === "phone" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
                    )}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setPreference("email")}
                    className={cn(
                      "h-11 rounded-xl font-bold transition-all",
                      preference === "email" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
                    )}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <div className="space-y-4">
                  {preference === "phone" ? (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <Input
                        placeholder="Enter phone number (+91...)"
                        className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <Input
                          placeholder="Enter email address"
                          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div />

                <Button
                  className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02]"
                  onClick={handleSendOTP}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Send OTP"}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-gray-500 text-sm">
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0 h-auto text-orange-600 font-bold" onClick={() => router.push("/auth/register")}>
                      Register Now
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-2xl border-none bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="pt-10 pb-2 px-8">
                <CardTitle className="text-2xl font-serif text-[#4A2D1F]">Verify Phone</CardTitle>
                <CardDescription className="text-gray-500">Enter the 6-digit code sent to your phone</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <Input
                    placeholder="Enter verification code"
                    className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500 tracking-[0.5em] font-bold"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02]"
                  onClick={handleVerifyOTP}
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="text-center pt-2">
                  <Button variant="link" className="text-gray-500 text-sm font-bold" onClick={() => setStep(1)}>
                    Change Phone Number
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
