"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, MessageCircle, Sun, Languages, Gem, RotateCw, MapPin, Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { districts } from "@/lib/data/categories";
import { getChatbotResponse } from "@/lib/chatbot";
import translationsData from "@/data/translations.json";

const LANG_MAP: Record<string, keyof typeof translationsData> = {
  English: "en",
  Tamil: "ta",
  Hindi: "hi",
  Telugu: "te",
  Malayalam: "ml",
  Kannada: "kn",
};

function translateWithDictionary(text: string, toLang: string): string {
  const key = LANG_MAP[toLang] || "ta";
  const dict = translationsData[key] as Record<string, string>;
  const trimmed = text.trim();
  if (dict[trimmed]) return dict[trimmed];
  const lower = trimmed.toLowerCase();
  for (const [en, trans] of Object.entries(dict)) {
    if (en.toLowerCase() === lower) return trans;
  }
  const enDict = translationsData.en as Record<string, string>;
  for (const [en, trans] of Object.entries(enDict)) {
    if (trans.toLowerCase() === lower && dict[en]) return dict[en];
  }
  return trimmed ? `[No exact match for "${trimmed}" in dictionary. Try: Hello, Thank you, Where is the temple?]` : "";
}

export default function AssistancePage() {
  const [mounted, setMounted] = useState(false);
  const [translateText, setTranslateText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Tamil");
  const [translatedResult, setTranslatedResult] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTranslate = () => {
    if (!translateText.trim()) return;
    setTranslatedResult(translateWithDictionary(translateText, targetLanguage));
  };

  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Vanakkam! I'm your YatraTN AI guide. Ask about places, food, best time to visit, transport, or safety. No API — instant answers from local knowledge." }
  ]);
  const [selectedCity, setSelectedCity] = useState("Chennai");
  const [weatherData, setWeatherData] = useState<{ temp: number; condition: string } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [listening, setListening] = useState(false);

  const fetchWeather = () => {
    setLoadingWeather(true);
    setTimeout(() => {
      setWeatherData({
        temp: Math.floor(Math.random() * (35 - 25 + 1)) + 25,
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Humid"][Math.floor(Math.random() * 4)]
      });
      setLoadingWeather(false);
    }, 800);
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedCity]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatMessage("");
    setLoadingChat(true);
    setTimeout(() => {
      const reply = getChatbotResponse(userMsg);
      setChatHistory(prev => [...prev, { role: "ai", content: reply }]);
      setLoadingChat(false);
    }, 300);
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setChatHistory(prev => [...prev, { role: "ai", content: "Voice input is not supported in this browser. Try Chrome." }]);
      return;
    }
    const SpeechRecognitionCtor =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const rec = new SpeechRecognitionCtor();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setChatMessage(t);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const suggestedPrompts = [
    "Best time to visit Ooty?",
    "Temple etiquette in Madurai",
    "Local food in Thanjavur",
    "2-day itinerary for Chennai",
    "Safety tips for solo travel",
  ];

  const festivals = [
    {
      name: "Pongal",
      date: "January 14-17",
      description: "Tamil harvest festival with Jallikattu and Kolam competitions"
    },
    {
      name: "Chithirai Thiruvizha",
      date: "April-May",
      description: "Grand 15-day festival at Meenakshi Temple, Madurai"
    },
    {
      name: "Navaratri/Golu",
      date: "September-October",
      description: "Nine nights of doll displays and classical music"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F5] pb-24 md:pb-12">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#4A2D1F] mb-2 font-serif">Travel Assistance</h1>
          <p className="text-gray-500 mb-8">Your 24/7 companion for a smooth journey across Tamil Nadu.</p>

          <Tabs defaultValue="weather" className="w-full">
            <TabsList className="grid grid-cols-5 h-auto p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 mb-8 shadow-sm">
              <TabsTrigger 
                value="weather" 
                className="flex flex-col md:flex-row gap-2 py-4 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 rounded-xl transition-all font-bold text-gray-500"
              >
                <Sun className="w-5 h-5" />
                <span className="text-[10px] md:text-sm">Weather</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="flex flex-col md:flex-row gap-2 py-4 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 rounded-xl transition-all font-bold text-gray-500"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] md:text-sm">AI Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="translate" 
                className="flex flex-col md:flex-row gap-2 py-4 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 rounded-xl transition-all font-bold text-gray-500"
              >
                <Languages className="w-5 h-5" />
                <span className="text-[10px] md:text-sm">Translate</span>
              </TabsTrigger>
              <TabsTrigger 
                value="gems" 
                className="flex flex-col md:flex-row gap-2 py-4 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 rounded-xl transition-all font-bold text-gray-500"
              >
                <Gem className="w-5 h-5" />
                <span className="text-[10px] md:text-sm">Gems</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rules" 
                className="flex flex-col md:flex-row gap-2 py-4 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 rounded-xl transition-all font-bold text-gray-500"
              >
                <ShieldAlert className="w-5 h-5" />
                <span className="text-[10px] md:text-sm">Rules</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 min-h-[500px]">
              <TabsContent value="weather" className="space-y-8 mt-0 animate-in fade-in duration-500">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-6">
                    <h3 className="text-xl font-bold text-[#4A2D1F] font-serif">Check Forecast</h3>
                    <div className="flex gap-2">
                      <Select value={selectedCity} onValueChange={(val) => setSelectedCity(val ?? selectedCity)}>
                        <SelectTrigger className="flex-1 h-14 bg-white rounded-2xl border-none shadow-sm text-lg">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-none shadow-sm bg-white hover:bg-orange-50 transition-colors">
                        <RotateCw className="w-6 h-6 text-orange-500" />
                      </Button>
                    </div>

                    <Card className="border-none shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] overflow-hidden text-white">
                      <CardContent className="flex flex-col items-center justify-center text-center p-8 gap-6">
                        {loadingWeather ? (
                          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                              <Sun className="w-12 h-12 text-white" />
                            </div>
                            <div>
                              <p className="text-4xl font-bold mb-1">{weatherData?.temp}°C</p>
                              <p className="text-orange-100 font-medium">{weatherData?.condition} in {selectedCity}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-[#4A2D1F] flex items-center gap-2 font-serif">
                      🎊 Local Festivals & Events
                    </h3>
                    <div className="grid gap-4">
                      {festivals.map((festival) => (
                        <div key={festival.name} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 hover:shadow-md transition-all group cursor-default">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">{festival.name}</h4>
                            <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{festival.date}</span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {festival.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-0 animate-in fade-in duration-500">
                <Card className="h-[600px] flex flex-col border-none shadow-2xl bg-white rounded-[32px] overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">YatraTN AI Guide</h3>
                        <p className="text-xs text-orange-100">Always online to help you</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-white border-b border-gray-50">
                    <div className="flex flex-wrap gap-2 max-w-3xl mx-auto">
                      {suggestedPrompts.map((p) => (
                        <button
                          key={p}
                          onClick={() => setChatMessage(p)}
                          className="px-3 py-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl text-xs font-bold transition-colors border border-transparent hover:border-orange-100"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-6 bg-[#FAFAFA]">
                    <div className="space-y-6 max-w-3xl mx-auto">
                      {chatHistory.map((chat, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "shadow-md rounded-2xl p-4 max-w-[80%] md:max-w-[70%] animate-in slide-in-from-bottom-2 duration-300",
                            chat.role === "user" 
                              ? "bg-orange-600 text-white ml-auto rounded-tr-none" 
                              : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                          )}
                        >
                          <p className="text-sm md:text-base leading-relaxed">{chat.content}</p>
                        </div>
                      ))}
                      {loadingChat && (
                        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 w-16">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-75" />
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-150" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="p-6 bg-white border-t border-gray-50">
                    <div className="flex gap-2 max-w-3xl mx-auto">
                      <Button
                        type="button"
                        size="icon"
                        className={cn(
                          "h-14 w-14 rounded-2xl shrink-0 transition-all duration-300 hover:scale-105",
                          listening ? "bg-red-500 animate-pulse" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        )}
                        onClick={startVoiceInput}
                        title="Voice input"
                      >
                        <Mic className="w-6 h-6" />
                      </Button>
                      <Input
                        placeholder="Ask: best places, temples, food, Ooty..."
                        className="h-14 bg-gray-50 border-none rounded-2xl px-6 text-lg focus-visible:ring-2 focus-visible:ring-orange-500 flex-1"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button 
                        size="icon" 
                        className="h-14 w-14 rounded-2xl bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/20 shrink-0 transition-all duration-300 hover:scale-105"
                        onClick={handleSendMessage}
                        disabled={loadingChat || !chatMessage.trim()}
                      >
                        <MessageCircle className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="translate" className="mt-0 animate-in fade-in duration-500">
                <div className="max-w-2xl mx-auto space-y-8">
                  <Card className="border-none shadow-xl bg-white rounded-[32px] p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                            <Languages className="w-6 h-6 text-orange-600" />
                          </div>
                          <h3 className="text-xl font-bold text-[#4A2D1F] font-serif">Smart Translator</h3>
                        </div>
                        <Select value={targetLanguage} onValueChange={(val) => setTargetLanguage(val ?? targetLanguage)}>
                          <SelectTrigger className="w-[160px] h-12 bg-gray-50 border-none rounded-xl font-bold">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tamil">Tamil</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="Telugu">Telugu</SelectItem>
                            <SelectItem value="Malayalam">Malayalam</SelectItem>
                            <SelectItem value="Kannada">Kannada</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <textarea
                        placeholder="Type what you want to translate here..."
                        className="w-full h-48 p-6 bg-[#FAFAFA] border-none rounded-3xl text-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none shadow-inner"
                        value={translateText}
                        onChange={(e) => setTranslateText(e.target.value)}
                      />
                      <Button 
                        className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 font-bold text-lg shadow-2xl shadow-orange-600/20 transition-all duration-300 hover:scale-[1.02]"
                        onClick={handleTranslate}
                        disabled={!translateText.trim()}
                      >
                        Translate to {targetLanguage}
                      </Button>

                      {translatedResult && (
                        <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 animate-in zoom-in-95 duration-300">
                          <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-2">{targetLanguage} Translation</p>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-2xl font-bold text-gray-800">{translatedResult}</p>
                            <div className="flex gap-2 shrink-0">
                              <Button 
                                variant="outline" 
                                className="rounded-xl"
                                onClick={() => navigator.clipboard.writeText(translatedResult)}
                              >
                                Copy
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="rounded-xl"
                                onClick={() => setSavedPhrases(prev => [...prev, translatedResult])}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Try these common phrases:</p>
                        <div className="flex flex-wrap gap-2">
                          {["Hello", "Thank you", "Where is the temple?", "How much is the food?", "Help me"].map((phrase) => (
                            <button
                              key={phrase}
                              onClick={() => setTranslateText(phrase)}
                              className="px-4 py-2 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl text-sm font-medium transition-colors border border-transparent hover:border-orange-100"
                            >
                              {phrase}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {translatedResult && (
                    <Card className="border-none shadow-xl bg-gradient-to-r from-orange-50 to-white rounded-[32px] p-8 border-l-8 border-orange-500 animate-in slide-in-from-left duration-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-4">Tamil Translation</h4>
                      <p className="text-2xl font-bold text-gray-800 leading-snug">{translatedResult}</p>
                    </Card>
                  )}
                  
                  {savedPhrases.length > 0 && (
                    <Card className="border-none shadow-xl bg-white rounded-[32px] p-8">
                      <h4 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-4">Saved Phrases</h4>
                      <div className="flex flex-wrap gap-2">
                        {savedPhrases.map((p, i) => (
                          <span key={i} className="px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-100">{p}</span>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gems" className="mt-0 animate-in fade-in duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      name: "Pichavaram Mangrove",
                      district: "Cuddalore",
                      description: "The world's second-largest mangrove forest with unique boat rides.",
                      image: "https://images.unsplash.com/photo-1582268611958-ebaf161c8e28?q=80&w=2070&auto=format&fit=crop"
                    },
                    {
                      name: "Valparai Hill Station",
                      district: "Coimbatore",
                      description: "Tea estates and waterfalls in the Western Ghats.",
                      image: "https://images.unsplash.com/photo-1590424744295-9773822f3041?q=80&w=2070&auto=format&fit=crop"
                    },
                    {
                      name: "Tranquebar",
                      district: "Mayiladuthurai",
                      description: "A former Danish colony with unique architecture and a beach fort.",
                      image: "https://images.unsplash.com/photo-1621349320625-78e762c66f7d?q=80&w=2070&auto=format&fit=crop"
                    },
                    {
                      name: "Megamalai",
                      district: "Theni",
                      description: "Misty mountains and pristine tea estates.",
                      image: "https://images.unsplash.com/photo-1590424744295-9773822f3041?q=80&w=2070&auto=format&fit=crop"
                    }
                  ].map((gem) => (
                    <Card key={gem.name} className="overflow-hidden border-none shadow-xl bg-white rounded-[32px] group">
                      <div className="relative h-48 overflow-hidden">
                        <img src={gem.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={gem.name} />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-600 shadow-xl">
                          Hidden Gem
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-bold text-xl text-gray-800 mb-2">{gem.name}</h4>
                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 text-orange-400" />
                          <span className="text-xs font-bold uppercase tracking-widest">{gem.district}</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                          {gem.description}
                        </p>
                        <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rules" className="py-12 animate-in fade-in duration-700">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold text-[#4A2D1F] mb-8 font-serif">Travel Guidelines & Etiquette</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Temple Etiquette",
                        tips: ["Remove footwear before entering", "Dress modestly (shoulders & knees covered)", "Ask before taking photos"]
                      },
                      {
                        title: "General Safety",
                        tips: ["Carry a physical map for remote areas", "Drink only bottled or filtered water", "Keep local emergency numbers handy"]
                      }
                    ].map((rule) => (
                      <Card key={rule.title} className="border-none shadow-lg bg-white rounded-3xl p-8">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                          <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-4">{rule.title}</h4>
                        <ul className="space-y-3">
                          {rule.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
