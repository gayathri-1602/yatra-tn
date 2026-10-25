"use client";

import { useState } from "react";
import { Languages, ArrowRightLeft, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import translationsData from "@/data/translations.json";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", label: "English" },
  { value: "ta", label: "Tamil" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ml", label: "Malayalam" },
  { value: "kn", label: "Kannada" },
];

type LangCode = keyof typeof translationsData;

function translatePhrase(text: string, from: LangCode, to: LangCode): string {
  const t = text.trim();
  if (!t) return "";
  const fromDict = translationsData[from] as Record<string, string>;
  const toDict = translationsData[to] as Record<string, string>;
  if (from === to) return t;
  if (toDict[t]) return toDict[t];
  if (fromDict[t]) {
    const enKey = t;
    return toDict[enKey] ?? t;
  }
  const lower = t.toLowerCase();
  for (const [key, val] of Object.entries(fromDict)) {
    if (val.toLowerCase() === lower || key.toLowerCase() === lower) {
      return (toDict[key] as string) ?? (toDict[val] as string) ?? t;
    }
  }
  return `[No match for "${t}" in dictionary. Try: Hello, Thank you, Where is the temple?]`;
}

export default function Translator() {
  const [fromLang, setFromLang] = useState<LangCode>("en");
  const [toLang, setToLang] = useState<LangCode>("ta");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [listening, setListening] = useState(false);

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setTranslatedText(translatePhrase(inputText, fromLang, toLang));
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setTranslatedText("[Voice not supported in this browser. Try Chrome.]");
      return;
    }
    const SpeechRecognitionCtor =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const rec = new SpeechRecognitionCtor();
    rec.lang = fromLang === "en" ? "en-IN" : "ta-IN";
    rec.continuous = false;
    setListening(true);
    rec.onresult = (e: any) => {
      setInputText(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-6 h-6 text-orange-600" />
          AI Translator
        </CardTitle>
        <p className="text-sm text-gray-500">Local dictionary — no API. English, Tamil, Hindi, Telugu, Malayalam, Kannada.</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select value={fromLang} onValueChange={(v) => setFromLang(v as LangCode)}>
              <SelectTrigger className="rounded-xl bg-gray-50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative mt-2">
              <Textarea
                placeholder="Enter text (e.g. Hello, Thank you)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] rounded-xl bg-gray-50 border-0 pr-12"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn(
                  "absolute right-2 top-2 rounded-lg transition-all duration-300 hover:scale-110",
                  listening && "bg-orange-100 text-orange-600"
                )}
                onClick={startVoiceInput}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <Select value={toLang} onValueChange={(v) => setToLang(v as LangCode)}>
              <SelectTrigger className="rounded-xl bg-gray-50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Translation"
              value={translatedText}
              readOnly
              className="mt-2 min-h-[120px] rounded-xl bg-orange-50/50 border-0"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={handleTranslate}
            disabled={!inputText.trim()}
            className="rounded-xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 hover:scale-105"
          >
            Translate
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={swapLanguages}
            className="rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
