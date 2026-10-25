"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, User, MapPin, ShieldCheck, ArrowRight, LogIn, Lock, BookOpen, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signUpWithEmail, setupRecaptcha, signInWithPhone, verifyOTP } from "@/lib/firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Details, 2: Verification
  const [details, setDetails] = useState({
    name: "",
    rollNumber: "",
    department: "",
    phone: "",
    email: "",
    password: "",
    preference: "email" as "phone" | "email",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (details.preference === "phone") {
      const verifier = setupRecaptcha("recaptcha-container");
      (window as any).recaptchaVerifier = verifier;
    }
  }, [details.preference]);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      if (details.preference === "email") {
        await signUpWithEmail(details.email, details.password, {
          name: details.name,
          rollNumber: details.rollNumber,
          department: details.department,
        });
        router.push("/explore");
      } else {
        const appVerifier = (window as any).recaptchaVerifier;
        const result = await signInWithPhone(details.phone, appVerifier);
        setConfirmationResult(result);
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      await verifyOTP(confirmationResult, verificationCode, {
        name: details.name,
        rollNumber: details.rollNumber,
        department: details.department,
      });
      router.push("/explore");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F5]">
      {/* Hero Section */}
      <div className="relative h-[30vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2070&auto=format&fit=crop"
          alt="Tamil Nadu Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif drop-shadow-lg">
            Join YatraTN
          </h1>
          <p className="text-orange-100 text-sm md:text-base font-medium drop-shadow-md">
            Start Your Journey Through the Heart of Tamil Nadu
          </p>
        </div>
      </div>

      {/* Register Card Section */}
      <div className="flex-1 flex items-center justify-center px-6 -mt-12 relative z-30 pb-12">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <Card className="shadow-2xl border-none bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="pt-8 pb-2 px-8">
                <CardTitle className="text-2xl font-serif text-[#4A2D1F]">Create Account</CardTitle>
                <CardDescription className="text-gray-500">Enter your details to get started</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-5">
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                    <Input
                      placeholder="Full Name"
                      className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                    <Input
                      placeholder="Roll Number"
                      className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                      value={details.rollNumber}
                      onChange={(e) => setDetails({ ...details, rollNumber: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                    <Input
                      placeholder="Department"
                      className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                      value={details.department}
                      onChange={(e) => setDetails({ ...details, department: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-2xl">
                    <Button
                      variant="ghost"
                      onClick={() => setDetails({ ...details, preference: "email" })}
                      className={cn(
                        "h-11 rounded-xl font-bold transition-all",
                        details.preference === "email" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
                      )}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setDetails({ ...details, preference: "phone" })}
                      className={cn(
                        "h-11 rounded-xl font-bold transition-all",
                        details.preference === "phone" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"
                      )}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  {details.preference === "email" ? (
                    <>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                        <Input
                          placeholder="Email Address"
                          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                          value={details.email}
                          onChange={(e) => setDetails({ ...details, email: e.target.value })}
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                          value={details.password}
                          onChange={(e) => setDetails({ ...details, password: e.target.value })}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                      <Input
                        placeholder="Phone Number (+91...)"
                        className="h-14 pl-12 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                        value={details.phone}
                        onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div id="recaptcha-container"></div>

                <Button
                  className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02]"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Processing..." : details.preference === "email" ? "Register" : "Send OTP"}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 h-auto text-orange-600 font-bold" onClick={() => router.push("/auth/login")}>
                      Login Now
                    </Button>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-2xl border-none bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="pt-8 pb-2 px-8">
                <CardTitle className="text-2xl font-serif text-[#4A2D1F]">Verify Identity</CardTitle>
                <CardDescription className="text-gray-500">Enter the 6-digit code sent to your phone</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  <Input
                    placeholder="Verification Code"
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
                  {loading ? "Verifying..." : "Complete Registration"}
                </Button>

                <div className="text-center pt-2">
                  <Button variant="link" className="text-gray-500 text-sm font-bold" onClick={() => setStep(1)}>
                    Back to Details
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

