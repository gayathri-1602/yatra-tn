import knowledgeBase from "@/data/knowledgeBase.json";

export function getChatbotResponse(query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return "Please ask something about Tamil Nadu travel, places, food, or safety.";

  // Keyword matching from knowledgeBase.keywords
  const keywords = knowledgeBase.keywords as Array<{ keywords: string[]; answer: string }>;
  for (const item of keywords) {
    const match = item.keywords.some((k) => q.includes(k.toLowerCase()));
    if (match) return item.answer;
  }

  // Place-specific from knowledgeBase.places
  const places = knowledgeBase.places as Array<{
    name: string;
    description: string;
    best_season?: string;
    local_food?: string[];
  }>;
  for (const place of places) {
    if (q.includes(place.name.toLowerCase())) {
      let ans = `${place.name}: ${place.description}`;
      if (place.best_season) ans += ` Best time: ${place.best_season}.`;
      if (place.local_food?.length) ans += ` Try: ${place.local_food.slice(0, 3).join(", ")}.`;
      return ans;
    }
  }

  // Food + place
  if (q.includes("food") || q.includes("eat") || q.includes("try")) {
    for (const place of places) {
      if (q.includes(place.name.toLowerCase()) && place.local_food?.length) {
        return `In ${place.name} you should try: ${place.local_food.join(", ")}.`;
      }
    }
    return "Popular Tamil Nadu foods: Idli, Dosa, Sambar, Chettinad cuisine, Jigarthanda (Madurai), filter coffee. Ask for a specific city for local dishes!";
  }

  // Emergency
  if (q.includes("emergency") || q.includes("help") || q.includes("police") || q.includes("ambulance")) {
    const ec = knowledgeBase.emergency_contacts as { police: string; ambulance: string; fire: string };
    return `Emergency: Police ${ec.police}, Ambulance ${ec.ambulance}, Fire ${ec.fire}. Use the SOS button on screen for quick access.`;
  }

  // Tips
  if (q.includes("tip") || q.includes("advice") || q.includes("safety")) {
    const tips = knowledgeBase.travel_tips as string[];
    return `Travel tips: ${tips.slice(0, 4).join(" ")}`;
  }

  // Festivals
  if (q.includes("festival") || q.includes("festivals")) {
    const f = knowledgeBase.festivals as Array<{ name: string; when: string; where: string; note: string }>;
    return f.map((x) => `${x.name} (${x.when}) - ${x.where}. ${x.note}`).join(" ");
  }

  // Transport
  if (q.includes("transport") || q.includes("reach") || q.includes("how to go")) {
    const t = knowledgeBase.transport as { airports: string; trains: string; bus: string; local?: string };
    return `Transport: Airports - ${t.airports}. Trains - ${t.trains}. Buses: ${t.bus}. Local: ${t.local}`;
  }

  return "I can help with best places in Tamil Nadu, temples, food, best time to visit, transport, safety, and festivals. Try asking: 'Best places in Tamil Nadu', 'Temples near Chennai', 'Food in Madurai', or 'Best time to visit Ooty'.";
}
