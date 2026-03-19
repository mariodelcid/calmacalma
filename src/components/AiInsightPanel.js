import React, { useState, useEffect } from "react";
import { LENS_PROMPTS } from "../data/constants";
import { Companion } from "./Companion";

export function AiInsightPanel({ entry, lens, char, t, onClose }) {
  const [status, setStatus] = useState("loading");
  const [insight, setInsight] = useState("");
  const [companionMood, setCompanionMood] = useState("thinking");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setInsight("");
    setCompanionMood("thinking");

    const systemPrompt = LENS_PROMPTS[lens.id] || LENS_PROMPTS.counselor;

    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type": "application/json",
      "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
           },
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:1000,
        system: systemPrompt,
        messages:[{
          role:"user",
          content:`Here is what I wrote in my journal today:\n\n---\n${entry.text}\n---\n\nPlease respond as my ${lens.name} advisor.`
        }]
      })
    })
    .then(r=>r.json())
    .then(data=>{
      if (cancelled) return;
      const text = data.content?.find(b=>b.type==="text")?.text || "I'm here with you.";
      setInsight(text);
      setStatus("done");
      const moodMap = { counselor:"empathetic", psychologist:"thinking", adhd:"encouraging", buddhist:"calm", christian:"calm", business:"encouraging", accountant:"thinking", stoic:"calm", lifecoach:"excited", grief:"empathetic", friend:"calm" };
      setCompanionMood(moodMap[lens.id] || "calm");
    })
    .catch(()=>{
      if (cancelled) return;
      setStatus("error");
      setCompanionMood("neutral");
    });

    return () => { cancelled = true; };
  }, [entry.id, lens.id]);

  return (
    <div className="slide-up" style={{ margin:"12px 24px 0", background:`${lens.color}15`, border:`1px solid ${lens.color}44`, borderRadius:18, padding:16, backdropFilter:"blur(12px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Companion char={char} t={t} size={36} mood={companionMood} />
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:lens.color, fontWeight:600 }}>{lens.icon} {lens.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted }}>AI Advisor · Ember</div>
          </div>
        </div>
        <button className="ember-btn" onClick={onClose} style={{ color:t.muted, fontSize:18, background:"none", border:"none", lineHeight:1 }}>×</button>
      </div>

      {status==="loading" && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0" }}>
          <div style={{ display:"flex", gap:5 }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:lens.color, animation:`pulse 1.2s ${i*0.2}s infinite` }} />
            ))}
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, fontStyle:"italic" }}>
            {char.name} is reading...
          </div>
        </div>
      )}

      {status==="done" && (
        <div className="fade-in" style={{ fontFamily:"'Lora',serif", fontSize:14, color:t.text, lineHeight:1.75, fontStyle:"italic" }}>
          "{insight}"
        </div>
      )}

      {status==="error" && (
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, fontStyle:"italic" }}>
          Something interrupted the connection. Your words were still heard.
        </div>
      )}

      <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${lens.color}22`, fontFamily:"'DM Sans',sans-serif", fontSize:10, color:`${t.muted}88` }}>
        Ember is not a therapist. If you're in crisis, text or call 988.
      </div>
    </div>
  );
}
