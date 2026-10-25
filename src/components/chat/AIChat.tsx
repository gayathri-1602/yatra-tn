"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, User, Bot, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, where, deleteDoc, getDocs } from "firebase/firestore";
import { cn } from "@/lib/utils";
import knowledgeBase from "@/lib/data/knowledge_base.json";

interface Message {
  role: "user" | "ai";
  content: string;
  createdAt: any;
}

export default function AIChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "chats"),
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data() as Message);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim().toLowerCase();
    setInput("");
    setLoading(true);

    // 1. Save user message to Firestore
    await addDoc(collection(db, "chats"), {
      userId,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    });

    // 2. Check knowledge base first
    const kbResponse = findInKnowledgeBase(userMessage);
    if (kbResponse) {
      await addDoc(collection(db, "chats"), {
        userId,
        role: "ai",
        content: kbResponse,
        createdAt: new Date(),
      });
      setLoading(false);
      return;
    }

    // 3. If not in KB, get AI response from backend
    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      // 4. Save AI response to Firestore
      await addDoc(collection(db, "chats"), {
        userId,
        role: "ai",
        content: data.response,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  const findInKnowledgeBase = (query: string) => {
    for (const place of knowledgeBase.places) {
      if (query.includes(place.name.toLowerCase())) {
        return `Here is some information about ${place.name}: ${place.description} The best time to visit is from ${place.best_season}.`;
      }
    }
    if (query.includes("food") || query.includes("eat")) {
      const place = knowledgeBase.places.find(p => query.includes(p.name.toLowerCase()));
      if (place) {
        return `In ${place.name}, you should try: ${place.local_food.join(", ")}.`;
      }
    }
    if (query.includes("emergency") || query.includes("help")) {
      return `For emergencies, please use the following numbers: Police - ${knowledgeBase.emergency_contacts.police}, Ambulance - ${knowledgeBase.emergency_contacts.ambulance}, Fire - ${knowledgeBase.emergency_contacts.fire}.`;
    }
    if (query.includes("tip") || query.includes("advice")) {
      return `Here are some travel tips: ${knowledgeBase.travel_tips.join(" ")}`;
    }
    return null;
  };

  const clearChat = async () => {
    if (!confirm("Are you sure you want to clear your chat history?")) return;
    try {
      const q = query(collection(db, "chats"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Clear chat error:", error);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] border-none shadow-xl bg-white rounded-[32px] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-lg">YatraTN AI Guide</CardTitle>
            <p className="text-xs text-orange-100">Powered by OpenAI</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} className="text-white hover:bg-white/20">
          <Trash2 className="w-5 h-5" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-gray-50">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  msg.role === "user" ? "bg-orange-600 text-white" : "bg-white border border-gray-200 text-orange-600"
                )}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl max-w-[80%] shadow-sm",
                  msg.role === "user" 
                    ? "bg-orange-600 text-white rounded-tr-none" 
                    : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 ml-11">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-150" />
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <Input
              placeholder="Ask me anything..."
              className="h-12 bg-gray-50 border-none rounded-xl px-4 text-base focus-visible:ring-2 focus-visible:ring-orange-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 shrink-0"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
