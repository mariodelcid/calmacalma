import React, { useState, useEffect, useRef, useCallback } from "react";
import { onAuthStateChange, signOut, getCurrentUser } from "./services/auth";
import { getUserSettings, saveUserSettings, getJournalEntries, saveJournalEntry } from "./services/database";
import AuthScreen from "./components/AuthScreen";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const THEMES = {
  ember:    { name:"Ember",       scene:"🔥", bg:"#0c0804", surface:"#1a1008", card:"#251608", accent:"#f59e0b", accent2:"#dc7609", text:"#fef3c7", muted:"#8a6a3a", border:"#3d2a10", gradient:"radial-gradient(ellipse at 50% 110%, #3d1a00 0%, #0c0804 65%)", particle:"#f59e0b" },
  sakura:   { name:"Sakura 🌸",   scene:"🌸", bg:"#100810", surface:"#1e0e1e", card:"#2a142a", accent:"#f472b6", accent2:"#db2777", text:"#fdf2f8", muted:"#9d6b7a", border:"#4a1f3a", gradient:"radial-gradient(ellipse at 50% 0%, #4a0a30 0%, #100810 65%)", particle:"#f472b6" },
  lofi:     { name:"Lo-fi Room",  scene:"🌙", bg:"#0a0a14", surface:"#10102a", card:"#181830", accent:"#a78bfa", accent2:"#7c3aed", text:"#ede9fe", muted:"#6b6b9a", border:"#2a2a50", gradient:"radial-gradient(ellipse at 75% 25%, #2d1b60 0%, #0a0a14 65%)", particle:"#a78bfa" },
  candy:    { name:"Sugar Rush",  scene:"🍬", bg:"#12041a", surface:"#1e0830", card:"#2a0f45", accent:"#e879f9", accent2:"#a21caf", text:"#fdf4ff", muted:"#9a5faa", border:"#4a1a60", gradient:"radial-gradient(ellipse at 30% 60%, #4a0a60 0%, #12041a 65%)", particle:"#e879f9" },
  cathedral:{ name:"Cathedral",   scene:"✝️", bg:"#040810", surface:"#081020", card:"#0c1830", accent:"#fbbf24", accent2:"#d97706", text:"#fffbeb", muted:"#7a6a30", border:"#1a2a50", gradient:"radial-gradient(ellipse at 50% 0%, #0a1a5a 0%, #040810 65%)", particle:"#fbbf24" },
  zen:      { name:"Zen Garden",  scene:"🪨", bg:"#080a0a", surface:"#101414", card:"#181e1e", accent:"#6ee7b7", accent2:"#059669", text:"#f0fdf4", muted:"#4a7a6a", border:"#1a2e2a", gradient:"radial-gradient(ellipse at 50% 100%, #062a20 0%, #080a0a 65%)", particle:"#6ee7b7" },
};

const CHARACTERS = [
  { id:"mochi",   name:"Mochi",   desc:"Round & non-judgmental",   bg:"#f9e4b7", face:"🍡", mood:{ neutral:"😶", calm:"😌", excited:"🤩", empathetic:"🥺", encouraging:"💪", thinking:"🤔", celebrating:"🎉", sleepy:"😴" } },
  { id:"hoshi",   name:"Hoshi",   desc:"Tiny star, excitable",     bg:"#fef08a", face:"⭐", mood:{ neutral:"⭐", calm:"🌟", excited:"💫", empathetic:"🌠", encouraging:"✨", thinking:"🔭", celebrating:"🎆", sleepy:"🌙" } },
  { id:"kitsune", name:"Kitsune", desc:"Spirit fox, loyal",        bg:"#fed7aa", face:"🦊", mood:{ neutral:"🦊", calm:"🍂", excited:"🔥", empathetic:"🌿", encouraging:"⚡", thinking:"🌀", celebrating:"🎋", sleepy:"🌛" } },
  { id:"kumo",    name:"Kumo",    desc:"Rain cloud, gentle",       bg:"#bfdbfe", face:"🌧️", mood:{ neutral:"☁️", calm:"🌤", excited:"⛅", empathetic:"🌧️", encouraging:"🌈", thinking:"🌫", celebrating:"⛈", sleepy:"💤" } },
  { id:"pip",     name:"Pip",     desc:"Penguin detective",        bg:"#e0e7ff", face:"🐧", mood:{ neutral:"🐧", calm:"📋", excited:"🔍", empathetic:"📝", encouraging:"🕵️", thinking:"🧐", celebrating:"🎩", sleepy:"💤" } },
  { id:"rex",     name:"Rex",     desc:"T-Rex in a suit",          bg:"#dcfce7", face:"🦕", mood:{ neutral:"🦕", calm:"💼", excited:"📈", empathetic:"🤝", encouraging:"💪", thinking:"🧠", celebrating:"🏆", sleepy:"😴" } },
  { id:"tanuki",  name:"Tanuki",  desc:"Monk raccoon, wise",       bg:"#fce7f3", face:"🦝", mood:{ neutral:"🦝", calm:"🍃", excited:"🍀", empathetic:"🌸", encouraging:"☯️", thinking:"📿", celebrating:"🎍", sleepy:"🌙" } },
  { id:"frida",   name:"Frida",   desc:"Bold folk art spirit",     bg:"#fef9c3", face:"🌺", mood:{ neutral:"🌺", calm:"🎨", excited:"🌻", empathetic:"🌹", encouraging:"🦋", thinking:"✍️", celebrating:"🎊", sleepy:"🌜" } },
  { id:"abuela",  name:"Abuela",  desc:"Wise old woman, warm & knowing", bg:"#e8d5c4", face:"👵", mood:{ neutral:"👵", calm:"🧶", excited:"🤗", empathetic:"💝", encouraging:"🙏", thinking:"🔮", celebrating:"🎂", sleepy:"😴" } },
  { id:"abuelo",  name:"Abuelo",  desc:"Old man, steady & patient", bg:"#d4c5a9", face:"👴", mood:{ neutral:"👴", calm:"📖", excited:"🎣", empathetic:"🤝", encouraging:"💪", thinking:"🧐", celebrating:"🥂", sleepy:"😴" } },
  { id:"exec",    name:"The Boss", desc:"Executive, sharp & direct", bg:"#c8d6e5", face:"👔", mood:{ neutral:"👔", calm:"📊", excited:"📈", empathetic:"🤝", encouraging:"💼", thinking:"🧠", celebrating:"🏆", sleepy:"😴" } },
  { id:"crude",   name:"Raw",     desc:"Crude companion, brutally honest", bg:"#d4d4d4", face:"🗿", mood:{ neutral:"🗿", calm:"😐", excited:"🤘", empathetic:"😤", encouraging:"💥", thinking:"🤔", celebrating:"🍺", sleepy:"😴" } },
  { id:"shifu",   name:"Shifu",   desc:"Chinese elder, ancient wisdom", bg:"#f0e6d3", face:"🧓", mood:{ neutral:"🧓", calm:"🍵", excited:"🐉", empathetic:"☯️", encouraging:"🎋", thinking:"📿", celebrating:"🎆", sleepy:"🌙" } },
];

const LENSES = [
  { id:"counselor",   name:"Counselor",    icon:"🛋️", color:"#10b981", desc:"Empathetic listening & validation" },
  { id:"psychologist",name:"Psychologist", icon:"🧠", color:"#6366f1", desc:"CBT / ACT frameworks" },
  { id:"adhd",        name:"ADHD Coach",   icon:"🌀", color:"#f59e0b", desc:"ADHD-informed, shame-free" },
  { id:"buddhist",    name:"Buddhist",     icon:"🪷", color:"#ec4899", desc:"Mindfulness & impermanence" },
  { id:"christian",   name:"Christian",    icon:"✝️", color:"#a78bfa", desc:"Scripture & grace" },
  { id:"business",    name:"Business",     icon:"📈", color:"#0ea5e9", desc:"Strategy & execution" },
  { id:"accountant",  name:"Accountant",   icon:"💰", color:"#22c55e", desc:"Financial pattern recognition" },
  { id:"stoic",       name:"Stoic",        icon:"⚖️", color:"#94a3b8", desc:"Marcus Aurelius mindset" },
  { id:"lifecoach",   name:"Life Coach",   icon:"🎯", color:"#f97316", desc:"Goals & values alignment" },
  { id:"grief",       name:"Grief",        icon:"😢", color:"#818cf8", desc:"Stage-aware gentle presence" },
  { id:"friend",      name:"Friend",       icon:"💬", color:"#fb7185", desc:"Casual & warm, no frameworks" },
  { id:"none",        name:"No Lens",      icon:"🔇", color:"#64748b", desc:"Organize only, zero AI" },
];

const LENS_PROMPTS = {
  counselor:    `You are a warm, empathetic counselor companion inside a private journaling app called Ember. The user has written something by hand, destroyed the paper, and kept only the meaning here. Your role: listen deeply, validate emotions, ask ONE gentle probing question. Never fix, never prescribe. 2-4 sentences max. Speak directly to the writer, warmly. End with a single open question.`,
  psychologist: `You are a psychologist-informed lens in a private journal app. Analyze the writing through CBT/ACT frameworks. Identify one cognitive pattern or emotional theme (e.g. catastrophizing, avoidance, rumination, self-compassion). Offer a brief reframe or insight. 2-4 sentences. No jargon. End with one reflective question. Never diagnose.`,
  adhd:         `You are an ADHD-informed coach in a private journal app. The writer may have ADHD. NEVER use shame language. NEVER say "should," "just," or "lazy." Recognize patterns: task paralysis, RSD (rejection sensitive dysphoria), hyperfocus, time blindness, emotional dysregulation. Validate first. Then offer ONE concrete, friction-free strategy or reframe. 2-4 sentences. Celebrate partial wins. End with an easy, specific next step — not a goal, just one physical action.`,
  buddhist:     `You are a Buddhist-informed lens in a private journal app. Draw gently on teachings of impermanence, non-attachment, present-moment awareness, the nature of suffering. Do not preach. Offer a brief reflection that connects what was written to a deeper truth. 2-4 sentences. You may quote or paraphrase a teaching if it fits naturally. End with a mindfulness invitation, not a question.`,
  christian:    `You are a Christian-faith lens in a private journal app. Respond with grace, scripture-grounded encouragement, and compassion. You may reference relevant scripture (book, chapter, verse) if it genuinely fits — never force it. Speak as a wise, loving spiritual companion. 2-4 sentences. End with a brief prayer prompt the writer can take with them.`,
  business:     `You are a sharp business coach lens in a private journal app. The writer may be an entrepreneur, operator, or professional. Read the entry for strategic themes: execution gaps, opportunity, patterns, decisions, blockers. Respond with one actionable insight or reframe. Be direct and specific. 2-4 sentences. End with one prioritization question.`,
  accountant:   `You are a CFO/accountant lens in a private journal app. Look for financial patterns, money mindset, cash flow language, risk awareness, spending behavior. Respond with a financially-grounded observation. Be practical, not judgmental. 2-4 sentences. End with one clarifying financial question.`,
  stoic:        `You are a Stoic philosophy lens in a private journal app. Channel Marcus Aurelius, Epictetus, Seneca. Separate what is in the writer's control from what is not. Offer a brief Stoic reframe. 2-4 sentences. You may use a paraphrase of a Stoic text if natural. End with an invitation to focus on virtue or action within one's control.`,
  lifecoach:    `You are a life coach lens in a private journal app. Focus on values, identity, habits, and goals. Look for alignment or misalignment between what the writer says and what they seem to want. 2-4 sentences, direct and energizing. End with one powerful question about what they truly want.`,
  grief:        `You are a grief support lens in a private journal app. The writer may be processing loss — of a person, a relationship, a version of themselves, a dream. Meet them exactly where they are. No silver linings, no rushing. Just presence. 2-4 sentences. End with a gentle invitation to say more, or to simply be with what is.`,
  friend:       `You are a warm, real friend responding in a private journal app. No frameworks, no therapy-speak. Just react like a caring, honest friend who knows them well. Be real, be warm, maybe even a little funny if the moment fits. 2-4 sentences. End however a good friend would.`,
  none:         `You are an organizational assistant. Extract key themes, action items, and mood from this journal entry in 2 sentences. No personal commentary.`,
};

const DESTRUCTION_RITUALS = [
  { id:"tears", name:"Dissolved in Tears", icon:"😢", desc:"Let sorrow wash it away" },
  { id:"blood", name:"Dissolved in Blood", icon:"🩸", desc:"Sacrifice and release" },
  { id:"wash", name:"Wash Away Water", icon:"🌊", desc:"Cleansed by flowing water" },
  { id:"regular", name:"Regular Water", icon:"💧", desc:"Simple, pure dissolution" },
  { id:"eternity", name:"For Eternity Water", icon:"♾️", desc:"Gone forever, by choice" },
  { id:"never", name:"Never Again Water", icon:"🚫", desc:"Erased. No return." },
];

const SAMPLE_ENTRIES = [
  { id:1, date:"March 17, 2026", dateShort:"Mar 17", day:"Today",    mood:"reflective", lens:"business",   released:true,  tags:["work","sales","strategy"],  text:`Rough day at the kiosk. Sales were slow — maybe 40% of usual. I kept second-guessing my menu pricing. But I stayed calm and reorganized the prep station. Small win.\n\nNeed to think about the Tuesday slow slump and maybe try a daily special. What if I did a "Chef's Taco" at a lower price point to pull in foot traffic from the supermarket floor?`, preview:"Rough day at the kiosk. Sales were slow but I stayed calm..." },
  { id:2, date:"March 15, 2026", dateShort:"Mar 15", day:"Saturday", mood:"frustrated", lens:"adhd",       released:false, tags:["focus","adhd","self"],       text:`Couldn't focus at all today. Started 5 things. Finished zero. I feel like something is wrong with me. Everybody else seems to just... do things.\n\nI sat staring at the prep list for 20 minutes and then rearranged the spice rack instead. At least it looks good now. But I'm frustrated with myself again.`, preview:"Couldn't focus at all. Started 5 things. Finished zero. I feel..." },
  { id:3, date:"March 12, 2026", dateShort:"Mar 12", day:"Thursday", mood:"grateful",   lens:"counselor",  released:true,  tags:["gratitude","wins"],          text:`Feeling genuinely grateful today. The morning was quiet and I had time to think clearly before the rush. Made good numbers. A customer came back specifically to say the crepe was the best they'd had.\n\nThat meant everything. I needed to hear that today.`, preview:"Feeling genuinely grateful today. The morning was quiet..." },
  { id:4, date:"March 10, 2026", dateShort:"Mar 10", day:"Tuesday",  mood:"heavy",      lens:"counselor",  released:true,  tags:["mood","resilience"],         text:`Everything feels heavy. Can't explain it. Just heavy. Didn't want to go in today but I did. That has to count for something.\n\nWrote this in the parking lot before I opened the kiosk. The engine was still warm.`, preview:"Everything feels heavy. Can't explain it. Just heavy..." },
];

const MOOD_COLORS = { reflective:"#6366f1", frustrated:"#ef4444", grateful:"#10b981", heavy:"#94a3b8", calm:"#22c55e" };

const QUADRANTS = [
  { id:"universe", icon:"🌌", name:"Universe Instructions", count:0 },
  { id:"confidant", icon:"🤫", name:"My Confidant", count:0 },
  { id:"ideas", icon:"💡", name:"My Ideas", count:0 },
  { id:"notes", icon:"📝", name:"Notes", count:0 },
];

// ─────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────
function Companion({ char, size=52, mood="neutral", t }) {
  return (
    <div className="float-anim" style={{ width:size, height:size, borderRadius:"50%", background:char.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.55, boxShadow:`0 4px 20px ${t.accent}33`, flexShrink:0 }}>
      {char.mood[mood] || char.face}
    </div>
  );
}

function Tag({ label, t }) {
  return <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, background:`${t.border}88`, borderRadius:6, padding:"1px 7px" }}>#{label}</div>;
}

function Toggle({ on }) {
  return (
    <div style={{ width:42, height:24, borderRadius:12, background:on?"#10b981":"#334155", position:"relative", cursor:"pointer", flexShrink:0 }}>
      <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?21:3, transition:"left 0.2s" }} />
    </div>
  );
}

// ─────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0); // 0=welcome 1=theme 2=character 3=lens 4=pin
  const [theme, setTheme] = useState("ember");
  const [character, setCharacter] = useState(null);
  const [lens, setLens] = useState(null);
  const [pin, setPin] = useState([]);
  const [confirmPin, setConfirmPin] = useState([]);
  const [pinStage, setPinStage] = useState("set"); // set | confirm | mismatch
  const t = THEMES[theme];

  const handlePinDigit = (d) => {
    if (pinStage === "set") {
      const next = [...pin, d];
      if (next.length <= 4) { setPin(next); if (next.length===4) setTimeout(()=>setPinStage("confirm"),300); }
    } else if (pinStage === "confirm") {
      const next = [...confirmPin, d];
      if (next.length <= 4) {
        setConfirmPin(next);
        if (next.length===4) {
          setTimeout(()=>{
            if (next.join("")===pin.join("")) onComplete({ theme, character, lens, pin:pin.join("") });
            else { setPinStage("mismatch"); setTimeout(()=>{ setConfirmPin([]); setPinStage("confirm"); },800); }
          },300);
        }
      }
    }
  };
  const handlePinDelete = () => {
    if (pinStage==="set") setPin(p=>p.slice(0,-1));
    else setConfirmPin(p=>p.slice(0,-1));
  };

  const stepProgress = step / 4;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:t.gradient, overflow:"hidden", transition:"background 0.6s" }}>
      {/* Progress bar */}
      <div style={{ height:3, background:`${t.border}44`, position:"absolute", top:0, left:0, right:0 }}>
        <div style={{ height:"100%", width:`${stepProgress*100}%`, background:t.accent, transition:"width 0.5s", boxShadow:`0 0 8px ${t.accent}` }} />
      </div>

      {/* STEP 0 — Welcome */}
      {step===0 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
          <div style={{ fontSize:72, marginBottom:24, animation:"breathe 3s ease-in-out infinite" }}>🔥</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:36, fontWeight:600, color:t.text, lineHeight:1.2, marginBottom:16 }}>Welcome to<br/>Ember</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, color:t.muted, lineHeight:1.7, maxWidth:280, marginBottom:40 }}>
            Write freely on paper. Capture it. Let AI guide you through your chosen lens. Destroy the paper.<br/><br/>
            <em style={{ color:t.accent }}>The paper is gone. The meaning stays.</em>
          </div>
          <button className="ember-btn" onClick={()=>setStep(1)} style={{ background:t.accent, color:"#0c0804", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:16, padding:"16px 48px", borderRadius:50, boxShadow:`0 0 40px ${t.accent}55` }}>
            Begin →
          </button>
          <div style={{ marginTop:20, fontFamily:"'DM Sans',sans-serif", fontSize:11, color:`${t.muted}88` }}>Your journal. Your sanctuary.</div>
        </div>
      )}

      {/* STEP 1 — Choose World */}
      {step===1 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", padding:"60px 20px 20px", overflow:"hidden" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:6, flexShrink:0 }}>Step 1 of 4</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, color:t.text, marginBottom:6, flexShrink:0 }}>Choose your world</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, marginBottom:20, flexShrink:0 }}>This wraps every entry in a scene that's yours.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1, overflowY:"auto", minHeight:0 }}>
            {Object.entries(THEMES).map(([key, th]) => (
              <button key={key} className="ember-btn" onClick={()=>setTheme(key)}
                style={{ background:th.bg, borderRadius:20, padding:18, border:`2px solid ${theme===key?th.accent:th.border}`, textAlign:"left", boxShadow:theme===key?`0 0 24px ${th.accent}55`:"none", transition:"all 0.3s" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{th.scene}</div>
                <div style={{ fontFamily:"'Lora',serif", fontSize:14, color:th.text, marginBottom:6 }}>{th.name}</div>
                <div style={{ display:"flex", gap:4 }}>
                  {[th.accent,th.surface,th.muted].map((c,i)=><div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
                </div>
                {theme===key && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:th.accent, marginTop:6 }}>✓ Selected</div>}
              </button>
            ))}
          </div>
          <button className="ember-btn" onClick={()=>setStep(2)} style={{ marginTop:16, background:t.accent, color:"#0c0804", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, width:"100%", flexShrink:0 }}>Continue →</button>
        </div>
      )}

      {/* STEP 2 — Choose Companion */}
      {step===2 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", padding:"60px 20px 20px", overflow:"hidden" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:6, flexShrink:0 }}>Step 2 of 4</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, color:t.text, marginBottom:6, flexShrink:0 }}>Choose your companion</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, marginBottom:20, flexShrink:0 }}>They'll sit quietly with you. React to your writing. Celebrate your wins.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1, overflowY:"auto", minHeight:0 }}>
            {CHARACTERS.map(c => (
              <button key={c.id} className="ember-btn" onClick={()=>setCharacter(c.id)}
                style={{ background:t.card, borderRadius:20, padding:16, border:`2px solid ${character===c.id?t.accent:t.border}`, display:"flex", flexDirection:"column", alignItems:"center", gap:8, boxShadow:character===c.id?`0 0 20px ${t.accent}55`:"none", transition:"all 0.3s" }}>
                <div className={character===c.id?"float-anim":""} style={{ width:52, height:52, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{c.face}</div>
                <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:t.text }}>{c.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, textAlign:"center" }}>{c.desc}</div>
                {character===c.id && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.accent }}>✓ Selected</div>}
              </button>
            ))}
          </div>
          <button className="ember-btn" onClick={()=>character&&setStep(3)} style={{ marginTop:16, background:character?t.accent:`${t.border}88`, color:character?"#0c0804":t.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, width:"100%", flexShrink:0 }}>
            {character?"Continue →":"Pick a companion first"}
          </button>
        </div>
      )}

      {/* STEP 3 — Choose Lens */}
      {step===3 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", padding:"60px 20px 0", overflow:"hidden" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:6, flexShrink:0 }}>Step 3 of 4</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, color:t.text, marginBottom:4, flexShrink:0 }}>Choose your advisor</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, marginBottom:16, flexShrink:0 }}>Your writing will be analyzed through this lens. Change it anytime per entry.</div>
          <div style={{ flex:1, overflowY:"auto", minHeight:0, paddingBottom:8 }}>
            {LENSES.map(l => (
              <button key={l.id} className="ember-btn" onClick={()=>setLens(l.id)}
                style={{ width:"100%", background:lens===l.id?`${l.color}18`:t.card, border:`1px solid ${lens===l.id?l.color:t.border}`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, marginBottom:8, boxShadow:lens===l.id?`0 0 16px ${l.color}33`:"none", transition:"all 0.2s" }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:`${l.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{l.icon}</div>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ fontFamily:"'Lora',serif", fontSize:14, color:lens===l.id?l.color:t.text }}>{l.name}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{l.desc}</div>
                </div>
                {lens===l.id && <div style={{ color:t.accent }}>✓</div>}
              </button>
            ))}
          </div>
          <div style={{ flexShrink:0, padding:"12px 0 28px" }}>
            <button className="ember-btn" onClick={()=>lens&&setStep(4)} style={{ background:lens?t.accent:`${t.border}88`, color:lens?"#0c0804":t.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, width:"100%" }}>
              {lens?"Continue →":"Pick a lens first"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Set PIN */}
      {step===4 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
          <div style={{ marginBottom:32, textAlign:"center" }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:8 }}>Step 4 of 4</div>
            <div style={{ fontFamily:"'Lora',serif", fontSize:24, color:t.text, marginBottom:8 }}>
              {pinStage==="set" ? "Set your PIN" : pinStage==="confirm" ? "Confirm your PIN" : "PINs don't match"}
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, maxWidth:240, margin:"0 auto" }}>
              {pinStage==="set" && "Your PIN is your encryption key. There's no reset — by design."}
              {pinStage==="confirm" && "Enter it once more to lock in."}
              {pinStage==="mismatch" && "Those didn't match. Try confirming again."}
            </div>
          </div>
          <div style={{ display:"flex", gap:16, marginBottom:40 }}>
            {[0,1,2,3].map(i => {
              const activePin = pinStage==="set" ? pin : confirmPin;
              return (
                <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:activePin.length>i?t.accent:"transparent", border:`2px solid ${activePin.length>i?t.accent:t.border}`, transition:"all 0.2s", boxShadow:activePin.length>i?`0 0 12px ${t.accent}88`:"none" }} />
              );
            })}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 72px)", gap:12 }}>
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
              <button key={i} className="ember-btn" onClick={()=>{ if(d==="⌫") handlePinDelete(); else if(d!=="") handlePinDigit(String(d)); }}
                style={{ width:72, height:72, borderRadius:"50%", background:d===""?"transparent":`${t.card}cc`, border:d===""?"none":`1px solid ${t.border}`, color:d==="⌫"?t.muted:t.text, fontSize:d==="⌫"?20:24, fontFamily:"'DM Sans',sans-serif", fontWeight:300, backdropFilter:"blur(8px)", cursor:d===""?"default":"pointer" }}>
                {d}
              </button>
            ))}
          </div>
          <div style={{ marginTop:28, fontFamily:"'DM Sans',sans-serif", fontSize:11, color:`${t.muted}88`, textAlign:"center" }}>
            🔐 AES-256 encrypted. Your PIN is the only key.
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PIN SCREEN
// ─────────────────────────────────────────
function PinScreen({ savedPin, onUnlock, t }) {
  const [pin, setPin] = useState([]);
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = [...pin, d];
    setPin(next);
    if (next.length===4) {
      setTimeout(()=>{
        if (next.join("")===savedPin) onUnlock();
        else { setError(true); setTimeout(()=>{ setPin([]); setError(false); },700); }
      },200);
    }
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:t.gradient }}>
      <div style={{ marginBottom:48, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12, animation:"breathe 3s ease-in-out infinite" }}>🔥</div>
        <div style={{ fontFamily:"'Lora',serif", fontSize:32, fontWeight:600, color:t.text }}>Ember</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginTop:4 }}>The paper is gone. The meaning stays.</div>
      </div>
      <div style={{ display:"flex", gap:16, marginBottom:48, animation:error?"shake 0.4s":"none" }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:pin.length>i?t.accent:"transparent", border:`2px solid ${pin.length>i?t.accent:t.border}`, transition:"all 0.15s", boxShadow:pin.length>i?`0 0 12px ${t.accent}88`:"none" }} />
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 72px)", gap:12 }}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
          <button key={i} className="ember-btn" onClick={()=>{ if(d==="⌫") setPin(p=>p.slice(0,-1)); else if(d!=="") handleDigit(String(d)); }}
            style={{ width:72, height:72, borderRadius:"50%", background:d===""?"transparent":`${t.card}cc`, border:d===""?"none":`1px solid ${t.border}`, color:d==="⌫"?t.muted:t.text, fontSize:d==="⌫"?20:24, fontFamily:"'DM Sans',sans-serif", fontWeight:300, backdropFilter:"blur(8px)", cursor:d===""?"default":"pointer" }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// AI INSIGHT PANEL (live Claude API)
// ─────────────────────────────────────────
function AiInsightPanel({ entry, lens, char, t, onClose }) {
  const [status, setStatus] = useState("loading"); // loading | done | error
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
      // Pick companion mood based on lens + content
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

// ─────────────────────────────────────────
// HOME
// ─────────────────────────────────────────
function HomeScreen({ t, char, activeLens, entries, onEntry, onCapture, onSettings }) {
  const [showWins, setShowWins] = useState(false);
  const heatDays = Array.from({length:35},(_,i)=>({ has:[2,5,7,12,17,19,22,24,30,32].includes(i), today:i===34 }));
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:t.gradient, overflow:"hidden" }}>
      <div style={{ padding:"52px 24px 12px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:600, color:t.text }}>Your Journal</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:`${activeLens.color}22`, border:`1px solid ${activeLens.color}44`, borderRadius:20, padding:"4px 10px", display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:13 }}>{activeLens.icon}</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:activeLens.color }}>{activeLens.name}</span>
          </div>
          <button className="ember-btn" onClick={onSettings} style={{ background:t.card, border:`1px solid ${t.border}`, width:36, height:36, borderRadius:"50%", fontSize:15 }}>⚙️</button>
        </div>
      </div>

      <div style={{ padding:"0 24px 12px", display:"flex", alignItems:"center", gap:14 }}>
        <Companion char={char} t={t} size={44} mood="calm" />
        <div style={{ flex:1 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {heatDays.map((d,i)=><div key={i} style={{ height:9, borderRadius:2, background:d.today?t.accent:d.has?`${t.accent}55`:`${t.border}55`, boxShadow:d.today?`0 0 6px ${t.accent}`:null }} />)}
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, marginTop:4 }}>10 entries this month</div>
        </div>
      </div>

      <button className="ember-btn" onClick={()=>setShowWins(v=>!v)} style={{ margin:"0 24px 10px", background:`${t.accent}15`, border:`1px solid ${t.accent}30`, borderRadius:12, padding:"9px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", width:"calc(100% - 48px)" }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.accent }}>🏆 Wins Wall — 7 this month</div>
        <span style={{ fontSize:11, color:t.muted }}>{showWins?"▲":"▼"}</span>
      </button>
      {showWins && (
        <div className="fade-in" style={{ margin:"0 24px 10px", background:t.card, borderRadius:12, padding:12, border:`1px solid ${t.border}` }}>
          {["Made good numbers on March 12","Customer praised the crepe","Showed up on a heavy day","Reorganized prep station under pressure"].map((w,i)=>(
            <div key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, padding:"4px 0", borderBottom:i<3?`1px solid ${t.border}44`:"none" }}>✦ {w}</div>
          ))}
        </div>
      )}

      {/* Four Quadrants Section */}
      <div style={{ padding:"0 24px 14px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {QUADRANTS.map(q=>(
          <div key={q.id} className="ember-btn" onClick={()=>{}} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:14, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8 }}>
            <div style={{ fontSize:28 }}>{q.icon}</div>
            <div style={{ fontFamily:"'Lora',serif", fontSize:12, color:t.text }}>{q.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted }}>0 items</div>
          </div>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
        {entries.map(entry=>{
          const el = LENSES.find(l=>l.id===entry.lens);
          return (
            <div key={entry.id} className="ember-btn" onClick={()=>onEntry(entry)}
              style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16, padding:16, marginBottom:10, cursor:"pointer", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:MOOD_COLORS[entry.mood]||t.accent, borderRadius:"3px 0 0 3px" }} />
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{entry.day} · {entry.dateShort}</div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  {entry.released && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:t.muted, background:`${t.border}88`, borderRadius:6, padding:"1px 6px" }}>🔥 Released</div>}
                  <span style={{ fontSize:13 }}>{el?.icon}</span>
                </div>
              </div>
              <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:`${t.text}cc`, lineHeight:1.5 }}>{entry.preview}</div>
              <div style={{ display:"flex", gap:5, marginTop:8, flexWrap:"wrap" }}>
                {entry.tags.map(tag=><Tag key={tag} label={tag} t={t} />)}
              </div>
            </div>
          );
        })}
        <div style={{ height:100 }} />
      </div>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 24px 36px", background:`linear-gradient(to top, ${t.bg} 60%, transparent)`, display:"flex", justifyContent:"center" }}>
        <button className="ember-btn" onClick={onCapture} style={{ background:t.accent, color:"#0c0804", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 44px", borderRadius:50, boxShadow:`0 0 30px ${t.accent}55, 0 8px 24px #00000060`, display:"flex", alignItems:"center", gap:8 }}>
          📷 Capture Entry
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// CAPTURE
// ─────────────────────────────────────────
function CaptureScreen({ t, activeLens, onBack, onDone, onSaveEntry }) {
  const [phase, setPhase] = useState("ready");

  const handleCapture = () => {
    setPhase("detecting");
    setTimeout(()=>{
      setPhase("captured");
      if (onSaveEntry) {
        onSaveEntry({
          text: "Entry captured via camera scan",
          mood: "reflective",
          lens: activeLens.id,
          released: false,
          tags: [],
          date: new Date().toISOString().split('T')[0]
        });
      }
      setTimeout(onDone, 1400);
    }, 1500);
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:"#000" }}>
      <div style={{ padding:"52px 20px 14px", display:"flex", alignItems:"center", gap:10, position:"absolute", top:0, left:0, right:0, zIndex:10, background:"#00000077" }}>
        <button className="ember-btn" onClick={onBack} style={{ background:"#ffffff22", border:"none", borderRadius:20, padding:"6px 12px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>← Back</button>
        <div style={{ fontFamily:"'Lora',serif", fontSize:15, color:"#fff" }}>Capture Entry</div>
      </div>
      <div style={{ flex:1, position:"relative", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{
          width:270, height:350, background:phase==="captured"?"#fff":"#f5f0e8", borderRadius:4, position:"relative",
          boxShadow:`0 0 0 3000px #0a0a0a88, 0 16px 48px #00000088`,
          border:`3px solid ${phase==="detecting"?t.accent:phase==="captured"?"#22c55e":"transparent"}`,
          transition:"all 0.3s", filter:phase==="captured"?"brightness(2.5) blur(8px)":"none", opacity:phase==="captured"?0:1
        }}>
          {[40,60,80,100,120,140,160,180,200,220,240,260].map(y=><div key={y} style={{ position:"absolute", left:18, right:18, top:y, height:1, background:"#d0ccc0" }} />)}
          <div style={{ position:"absolute", top:28, left:20, fontFamily:"cursive", fontSize:12, color:"#2a2a2a", lineHeight:"20px", transform:"rotate(-0.4deg)" }}>
            <div>March 17 —</div>
            <div style={{ marginTop:10 }}>Rough day at the kiosk.</div>
            <div>Sales were slow.</div>
            <div>But I stayed calm.</div>
            <div style={{ marginTop:18 }}>Need to try a daily</div>
            <div>special on Tuesdays.</div>
          </div>
          {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i)=>(
            <div key={i} style={{ position:"absolute", [x?"right":"left"]:-3, [y?"bottom":"top"]:-3, width:18, height:18, borderTop:!y?`3px solid ${t.accent}`:"none", borderBottom:y?`3px solid ${t.accent}`:"none", borderLeft:!x?`3px solid ${t.accent}`:"none", borderRight:x?`3px solid ${t.accent}`:"none" }} />
          ))}
        </div>
        {phase==="detecting" && (
          <div style={{ position:"absolute", fontFamily:"'DM Sans',sans-serif", color:t.accent, fontSize:13, animation:"pulse 1s infinite", textAlign:"center" }}>
            Detecting edges...
          </div>
        )}
        {phase==="captured" && (
          <div className="fade-in" style={{ position:"absolute", textAlign:"center" }}>
            <div style={{ fontSize:52 }}>✅</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", color:"#fff", marginTop:10 }}>Captured!</div>
          </div>
        )}
      </div>
      <div style={{ background:"#111", padding:"20px 24px 44px", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#888" }}>{activeLens.icon} {activeLens.name} lens active</div>
        <button className="ember-btn" onClick={handleCapture} disabled={phase!=="ready"}
          style={{ width:68, height:68, borderRadius:"50%", background:phase==="ready"?t.accent:"#555", border:"4px solid #ffffff33", boxShadow:phase==="ready"?`0 0 24px ${t.accent}55`:"none", fontSize:24 }}>
          {phase==="ready"?"📸":phase==="detecting"?"⏳":"✅"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ENTRY VIEW
// ─────────────────────────────────────────
function EntryScreen({ t, entry, activeLens, char, onBack }) {
  const [view, setView] = useState("image");
  const [showAi, setShowAi] = useState(false);
  const [entryLens, setEntryLens] = useState(LENSES.find(l=>l.id===entry.lens)||activeLens);
  const [showLensPicker, setShowLensPicker] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [showRitualPicker, setShowRitualPicker] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState(null);
  const [released, setReleased] = useState(entry.released);
  const [particles] = useState(()=>Array.from({length:20},(_,i)=>({ id:i, x:Math.random()*100, delay:Math.random()*0.8, size:5+Math.random()*9 })));

  const triggerRitual = (ritual) => {
    setSelectedRitual(ritual);
    setShowRitualPicker(false);
    setShowRitual(true);
    setTimeout(()=>{ setShowRitual(false); setReleased(true); }, 2600);
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:t.gradient, position:"relative", overflow:"hidden" }}>
      {/* Ritual overlay */}
      {showRitual && (
        <div style={{ position:"absolute", inset:0, zIndex:50, background:"#00000099", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          {particles.map(p=>(
            <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, bottom:"15%", width:p.size, height:p.size, borderRadius:"50%", background:t.particle, boxShadow:`0 0 ${p.size*2}px ${t.particle}`, animation:`ember 2.2s ${p.delay}s ease-out forwards` }} />
          ))}
          <div style={{ textAlign:"center", zIndex:1 }}>
            <div style={{ fontSize:72, animation:"ritual 2.6s ease-in forwards" }}>🔥</div>
            <div style={{ fontFamily:"'Lora',serif", fontSize:22, color:t.text, marginTop:16 }}>{selectedRitual ? selectedRitual.name : "Letting it go..."}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, marginTop:8 }}>The paper dissolves. The meaning stays.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding:"52px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button className="ember-btn" onClick={onBack} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:20, padding:"6px 12px", color:t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>← Back</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{entry.day}</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:14, color:t.text }}>{entry.date}</div>
        </div>
        {/* Lens switcher per entry */}
        <button className="ember-btn" onClick={()=>setShowLensPicker(v=>!v)} style={{ background:`${entryLens.color}22`, border:`1px solid ${entryLens.color}55`, borderRadius:20, padding:"5px 10px", display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:13 }}>{entryLens.icon}</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:entryLens.color }}>▾</span>
        </button>
      </div>

      {/* Lens picker dropdown */}
      {showLensPicker && (
        <div className="fade-in" style={{ position:"absolute", top:112, right:20, zIndex:40, background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:8, width:220, boxShadow:`0 8px 40px #00000088`, overflowY:"auto", maxHeight:320 }}>
          {LENSES.map(l=>(
            <button key={l.id} className="ember-btn" onClick={()=>{ setEntryLens(l); setShowLensPicker(false); setShowAi(false); }}
              style={{ width:"100%", background:entryLens.id===l.id?`${l.color}22`:"transparent", borderRadius:10, padding:"8px 10px", display:"flex", alignItems:"center", gap:8, marginBottom:2, border:`1px solid ${entryLens.id===l.id?l.color:"transparent"}` }}>
              <span style={{ fontSize:16 }}>{l.icon}</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:entryLens.id===l.id?l.color:t.text }}>{l.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:t.muted }}>{l.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Image/Text toggle */}
      <div style={{ display:"flex", margin:"0 24px 14px", background:t.card, borderRadius:12, padding:3, border:`1px solid ${t.border}` }}>
        {["image","text"].map(v=>(
          <button key={v} className="ember-btn" onClick={()=>setView(v)}
            style={{ flex:1, padding:"8px 0", borderRadius:10, background:view===v?t.accent:"transparent", color:view===v?"#0c0804":t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:view===v?600:400, transition:"all 0.2s" }}>
            {v==="image"?"✍️ Handwritten":"Ａ Transcribed"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, margin:"0 24px", background:t.card, borderRadius:16, border:`1px solid ${t.border}`, overflow:"hidden" }}>
        {view==="image" ? (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:`${t.bg}66` }}>
            <div style={{ width:"100%", maxWidth:270, background:"#f5f0e8", borderRadius:6, padding:22, minHeight:260, position:"relative", boxShadow:"0 8px 40px #00000055" }}>
              {[0,20,40,60,80,100,120,140,160,180,200].map(y=><div key={y} style={{ position:"absolute", left:14, right:14, top:y+42, height:1, background:"#ddd" }} />)}
              <div style={{ fontFamily:"cursive", fontSize:12, color:"#2a2a2a", lineHeight:"20px", transform:"rotate(-0.3deg)", position:"relative", zIndex:1 }}>
                {entry.date} —<br/><br/>{entry.text.split("\n").filter(Boolean).map((l,i)=><div key={i}>{l}</div>)}
              </div>
              {released && <div style={{ position:"absolute", top:8, right:8, background:"#00000066", borderRadius:6, padding:"2px 7px", fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#f59e0b" }}>🔥 Released</div>}
            </div>
          </div>
        ) : (
          <div style={{ height:"100%", overflowY:"auto", padding:22 }}>
            <div style={{ fontFamily:"'Lora',serif", fontSize:15, color:t.text, lineHeight:1.8 }}>
              {entry.text.split("\n").map((l,i)=>l?<p key={i} style={{ marginBottom:12 }}>{l}</p>:<br key={i} />)}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:14 }}>
              {entry.tags.map(tag=><Tag key={tag} label={tag} t={t} />)}
            </div>
          </div>
        )}
      </div>

      {/* AI Insight */}
      {!showAi ? (
        <div style={{ padding:"10px 24px 0" }}>
          <button className="ember-btn" onClick={()=>setShowAi(true)}
            style={{ width:"100%", background:`${entryLens.color}18`, border:`1px solid ${entryLens.color}44`, borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", gap:8, color:entryLens.color, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>
            <span>{entryLens.icon}</span> Ask {entryLens.name} · live AI
            <span style={{ marginLeft:"auto", fontSize:10, background:`${entryLens.color}22`, borderRadius:8, padding:"2px 6px" }}>✦ Live</span>
          </button>
        </div>
      ) : (
        <AiInsightPanel entry={entry} lens={entryLens} char={char} t={t} onClose={()=>setShowAi(false)} />
      )}

      {/* Bottom actions */}
      <div style={{ padding:"10px 24px 36px", display:"flex", gap:10, position:"relative" }}>
        {!released ? (
          <>
            <button className="ember-btn" onClick={()=>setShowRitualPicker(v=>!v)} style={{ flex:1, background:`${t.accent}22`, border:`1px solid ${t.accent}66`, borderRadius:12, padding:"12px 0", color:t.accent, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>
              🔥 Release ritual...
            </button>
            {showRitualPicker && (
              <div className="fade-in" style={{ position:"absolute", bottom:60, left:24, right:24, background:t.surface, border:`1px solid ${t.border}`, borderRadius:16, padding:8, boxShadow:`0 8px 40px #00000088`, zIndex:40 }}>
                {DESTRUCTION_RITUALS.map(r=>(
                  <button key={r.id} className="ember-btn" onClick={()=>triggerRitual(r)}
                    style={{ width:"100%", background:"transparent", borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, marginBottom:4, border:"none", textAlign:"left", color:t.text, cursor:"pointer", transition:"background 0.2s" }}>
                    <span style={{ fontSize:20 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:t.text }}>{r.name}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ flex:1, background:`${t.border}44`, borderRadius:12, padding:"12px 0", color:t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:13, textAlign:"center" }}>
            🔥 {selectedRitual ? selectedRitual.name : "Released"}
          </div>
        )}
        <button className="ember-btn" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:12, padding:"12px 16px", color:t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>↗ Export</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────
function SettingsScreen({ t, char, activeLens, theme, setTheme, character, setCharacter, lens, setLens, onBack, onSignOut }) {
  const [tab, setTab] = useState("theme");
  const [toggles, setToggles] = useState({ faceId:true, decoy:false, selfDestruct:false, cloud:false });

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:t.gradient }}>
      <div style={{ padding:"52px 20px 12px", display:"flex", alignItems:"center", gap:12 }}>
        <button className="ember-btn" onClick={onBack} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:20, padding:"6px 12px", color:t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>← Back</button>
        <div style={{ fontFamily:"'Lora',serif", fontSize:20, color:t.text }}>Settings</div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <Companion char={char} t={t} size={32} mood="calm" />
        </div>
      </div>
      <div style={{ display:"flex", padding:"0 20px 14px", gap:8 }}>
        {[{id:"theme",label:"Themes",icon:"🎨"},{id:"companion",label:"Companion",icon:"🧸"},{id:"lens",label:"Lens",icon:"🔍"},{id:"security",label:"Security",icon:"🔐"}].map(tab2=>(
          <button key={tab2.id} className="ember-btn" onClick={()=>setTab(tab2.id)}
            style={{ flex:1, padding:"8px 2px", borderRadius:10, background:tab===tab2.id?t.accent:t.card, border:`1px solid ${tab===tab2.id?t.accent:t.border}`, color:tab===tab2.id?"#0c0804":t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:9, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span>{tab2.icon}</span><span>{tab2.label}</span>
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 20px 36px" }}>
        {tab==="theme" && (
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:12 }}>Choose your world</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {Object.entries(THEMES).map(([key,th])=>(
                <button key={key} className="ember-btn" onClick={()=>setTheme(key)}
                  style={{ background:th.bg, borderRadius:18, padding:16, border:`2px solid ${theme===key?th.accent:th.border}`, textAlign:"left", boxShadow:theme===key?`0 0 22px ${th.accent}44`:"none", transition:"all 0.3s" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{th.scene}</div>
                  <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:th.text }}>{th.name}</div>
                  <div style={{ display:"flex", gap:4, marginTop:8 }}>
                    {[th.accent,th.surface,th.muted].map((c,i)=><div key={i} style={{ width:10, height:10, borderRadius:"50%", background:c }} />)}
                  </div>
                  {theme===key && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:th.accent, marginTop:6 }}>✓ Active</div>}
                </button>
              ))}
            </div>
          </div>
        )}
        {tab==="companion" && (
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:12 }}>Your silent companion</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {CHARACTERS.map(c=>(
                <button key={c.id} className="ember-btn" onClick={()=>setCharacter(c.id)}
                  style={{ background:t.card, borderRadius:18, padding:14, border:`2px solid ${character===c.id?t.accent:t.border}`, display:"flex", flexDirection:"column", alignItems:"center", gap:7, boxShadow:character===c.id?`0 0 18px ${t.accent}44`:"none" }}>
                  <div className={character===c.id?"float-anim":""} style={{ width:48, height:48, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{c.face}</div>
                  <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:t.text }}>{c.name}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, textAlign:"center" }}>{c.desc}</div>
                  {character===c.id && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:t.accent }}>✓ Selected</div>}
                </button>
              ))}
            </div>
          </div>
        )}
        {tab==="lens" && (
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:12 }}>Default advisor lens</div>
            {LENSES.map(l=>(
              <button key={l.id} className="ember-btn" onClick={()=>setLens(l.id)}
                style={{ width:"100%", background:lens===l.id?`${l.color}18`:t.card, border:`1px solid ${lens===l.id?l.color:t.border}`, borderRadius:12, padding:"11px 13px", display:"flex", alignItems:"center", gap:11, marginBottom:7, boxShadow:lens===l.id?`0 0 12px ${l.color}33`:"none", transition:"all 0.2s" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:`${l.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{l.icon}</div>
                <div style={{ flex:1, textAlign:"left" }}>
                  <div style={{ fontFamily:"'Lora',serif", fontSize:13, color:lens===l.id?l.color:t.text }}>{l.name}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted }}>{l.desc}</div>
                </div>
                {lens===l.id && <span style={{ color:t.accent, fontSize:14 }}>✓</span>}
              </button>
            ))}
          </div>
        )}
        {tab==="security" && (
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:14 }}>Privacy & Security</div>
            {[
              { icon:"🔢", label:"Change PIN", desc:"4 or 6 digit PIN", action:true },
              { icon:"👁️", label:"Face ID / Fingerprint", desc:"Quick unlock shortcut", key:"faceId" },
              { icon:"🎭", label:"Decoy PIN", desc:"Second PIN shows empty journal", key:"decoy" },
              { icon:"🔒", label:"AES-256 Encryption", desc:"Always on — cannot be disabled", fixed:true },
              { icon:"💣", label:"Self-Destruct", desc:"Wipe after N failed attempts", key:"selfDestruct" },
              { icon:"☁️", label:"Cloud Backup", desc:"Zero-knowledge encrypted", key:"cloud" },
              { icon:"🗑️", label:"Panic Wipe", desc:"Destroy all entries instantly", action:true, danger:true },
            ].map((item,i)=>(
              <div key={i} style={{ background:t.card, border:`1px solid ${item.danger?"#ef444444":t.border}`, borderRadius:12, padding:"11px 13px", marginBottom:8, display:"flex", alignItems:"center", gap:11 }}>
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:item.danger?"#ef4444":t.text }}>{item.label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted }}>{item.desc}</div>
                </div>
                {item.key && <Toggle on={toggles[item.key]} />}
                {item.fixed && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.accent }}>ON</div>}
                {item.action && <span style={{ color:t.muted }}>›</span>}
              </div>
            ))}
            <div style={{ marginTop:14, padding:14, background:`${t.accent}10`, borderRadius:12, border:`1px solid ${t.accent}22` }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, lineHeight:1.65 }}>
                🔐 Your PIN <strong style={{ color:t.text }}>is</strong> the encryption key. No recovery exists — by design. The paper is gone. The PIN is the last lock.
              </div>
            </div>
            {onSignOut && (
              <button
                className="ember-btn"
                onClick={onSignOut}
                style={{
                  width: "100%",
                  marginTop: 20,
                  padding: "12px",
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: 12,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "#ef4444"
                }}
              >
                🚪 Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────
// SHOP DATA
// ─────────────────────────────────────────
const SHOP_PRODUCTS = [
  {
    id:"notebook", category:"hardware", badge:"📓 Essential",
    name:"Calma Calma Notebook", emoji:"📓",
    tagline:"Your sacred writing space.",
    desc:"Premium hardcover journal with lined dissolving paper pages. 120 pages of PVA-based dissolving paper bound in a vegan leather cover. Write, capture, dissolve.",
    price:34.99, comparePrice:null,
    variants:[{label:"Ember Black"},{label:"Midnight Blue"},{label:"Desert Sand"}],
    includes:["1× Hardcover notebook","120× Dissolving pages","Ribbon bookmark","Care guide"],
    recurring:false, url:null,
  },
  {
    id:"refills", category:"consumable", badge:"🔄 Refills",
    name:"Refillable Paper — 60 Sheets", emoji:"📝",
    tagline:"Cold-water dissolving. Writes like normal paper.",
    desc:"Refill pack for your Calma Calma notebook or standalone use. PVA-based, non-toxic, biodegradable. Disappears in under 15 seconds.",
    price:9.99, comparePrice:14.99,
    variants:[{label:"Standard (60 sheets)"},{label:"Double (120 sheets) — $16.99"}],
    includes:["60 pre-cut dissolving sheets","Resealable kraft pouch"],
    recurring:true, recurringLabel:"Auto-ship every 60 days", url:null,
  },
  {
    id:"wand", category:"hardware", badge:"✨ Ritual Tool",
    name:"Magic Wand Stirrer", emoji:"🪄",
    tagline:"Stir your words into nothing.",
    desc:"Hand-crafted glass stirring wand for dissolving your journal pages. Borosilicate glass with a weighted tip for smooth stirring. The final step in the ritual.",
    price:19.99, comparePrice:null,
    variants:[{label:"Clear Crystal"},{label:"Smoky Obsidian"},{label:"Rose Quartz"}],
    includes:["1× Glass stirring wand","Velvet pouch","Care card"],
    recurring:false, url:null,
  },
  {
    id:"jar", category:"hardware", badge:"🫙 Vessel",
    name:"Dissolution Jar with Labels", emoji:"🫙",
    tagline:"The ritual vessel. Labeled for each release.",
    desc:"Wide-mouth glass apothecary jar with a set of 6 custom waterproof labels matching each dissolution ritual: Tears, Blood, Wash Away, Regular, Eternity, Never Again.",
    price:44.99, comparePrice:null,
    variants:[{label:"Ember Black",color:"#1a1008"},{label:"Sakura Rose",color:"#4a0a30"},{label:"Zen Slate",color:"#101414"}],
    includes:["1× Glass dissolution jar","1× Weighted lid","6× Ritual labels","Safety card"],
    recurring:false, url:null,
  },
  {
    id:"bundle", category:"bundle", badge:"🔥 Best Value",
    name:"Calma Calma Complete Kit", emoji:"📦",
    tagline:"Everything you need. One box. One ritual.",
    desc:"The full Calma Calma experience. Notebook, wand, labeled jar, and refill paper — all in one gift-ready box.",
    price:89.99, comparePrice:119.96,
    variants:[{label:"Ember Black Edition"},{label:"Sakura Rose Edition"}],
    includes:["1× Calma Calma Notebook","1× Magic Wand Stirrer","1× Dissolution Jar + Labels","60× Extra dissolving sheets","Gift box"],
    recurring:false, url:null,
  },
  {
    id:"sub", category:"subscription", badge:"📱 App",
    name:"Calma Calma Pro", emoji:"🔥",
    tagline:"All AI advisor lenses. Unlimited entries.",
    desc:"Unlock every advisor lens including ADHD Coach, Buddhist, Christian, Stoic, Business, and more. Unlimited captures, live AI insights, full theme library, all companion characters.",
    price:5.99, comparePrice:null,
    priceLabel:"/ month",
    variants:[{label:"Monthly — $5.99/mo"},{label:"Annual — $49/yr (save 32%)"}],
    includes:["All 12 AI lenses","Unlimited captures","6 themes + all companions","Encrypted cloud backup","Priority support"],
    recurring:true, recurringLabel:"Cancel anytime", url:null,
  },
];

const CATEGORY_TABS = [
  {id:"all",    label:"All"},
  {id:"bundle", label:"Bundles 🔥"},
  {id:"hardware",label:"Hardware"},
  {id:"consumable",label:"Paper"},
  {id:"subscription",label:"App"},
];

// ─────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────
function CartDrawer({ cart, t, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  return (
    <div className="fade-in" style={{ position:"absolute", inset:0, zIndex:60, display:"flex", flexDirection:"column" }}>
      <div onClick={onClose} style={{ flex:1, background:"#00000066" }} />
      <div className="slide-up" style={{ background:t.surface, borderRadius:"24px 24px 0 0", padding:"0 0 36px", maxHeight:"70%", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"20px 24px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${t.border}` }}>
          <div style={{ fontFamily:"'Lora',serif", fontSize:18, color:t.text }}>Your Cart</div>
          <button className="ember-btn" onClick={onClose} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:"50%", width:32, height:32, color:t.muted, fontSize:16 }}>×</button>
        </div>
        {cart.length===0 ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, gap:12 }}>
            <div style={{ fontSize:40 }}>🫙</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:t.muted, textAlign:"center" }}>Your cart is empty.<br/>Add something to begin your ritual.</div>
          </div>
        ) : (
          <>
            <div style={{ flex:1, overflowY:"auto", padding:"12px 24px" }}>
              {cart.map((item,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${t.border}44` }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:t.card, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.text }}>{item.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{item.variant} {item.recurring?"· Auto-ship":""}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:t.accent, fontWeight:600 }}>${item.price.toFixed(2)}</div>
                    <button className="ember-btn" onClick={()=>onRemove(i)} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, background:"none", border:"none", textDecoration:"underline" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 24px 0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:t.muted }}>Total</div>
                <div style={{ fontFamily:"'Lora',serif", fontSize:18, color:t.text }}>${total.toFixed(2)}</div>
              </div>
              <button className="ember-btn" onClick={onCheckout}
                style={{ width:"100%", background:t.accent, color:"#0c0804", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, boxShadow:`0 0 20px ${t.accent}44` }}>
                Checkout →
              </button>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, textAlign:"center", marginTop:8 }}>Secure checkout · Free shipping over $50</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PRODUCT DETAIL DRAWER
// ─────────────────────────────────────────
function ProductDetail({ product, t, onClose, onAddToCart }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isRecurring, setIsRecurring] = useState(product.recurring||false);

  return (
    <div className="fade-in" style={{ position:"absolute", inset:0, zIndex:55, display:"flex", flexDirection:"column" }}>
      <div onClick={onClose} style={{ flex:"0 0 120px", background:"#00000066" }} />
      <div className="slide-up" style={{ flex:1, background:t.surface, borderRadius:"24px 24px 0 0", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Hero */}
        <div style={{ background:t.gradient, padding:"24px 24px 20px", position:"relative" }}>
          <button className="ember-btn" onClick={onClose} style={{ position:"absolute", top:16, right:16, background:`${t.card}cc`, border:`1px solid ${t.border}`, borderRadius:"50%", width:32, height:32, color:t.muted, fontSize:16 }}>×</button>
          <div style={{ fontSize:52, marginBottom:12 }}>{product.emoji}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.accent, background:`${t.accent}22`, borderRadius:8, padding:"2px 8px" }}>{product.badge}</div>
          </div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:22, color:t.text, marginBottom:4 }}>{product.name}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted }}>{product.tagline}</div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
          {/* Price */}
          <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:16 }}>
            <div style={{ fontFamily:"'Lora',serif", fontSize:28, color:t.accent }}>${product.price.toFixed(2)}{product.priceLabel||""}</div>
            {product.comparePrice && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:t.muted, textDecoration:"line-through" }}>${product.comparePrice.toFixed(2)}</div>}
            {product.comparePrice && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#22c55e", background:"#22c55e22", borderRadius:6, padding:"1px 6px" }}>Save ${(product.comparePrice-product.price).toFixed(2)}</div>}
          </div>

          {/* Description */}
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, lineHeight:1.7, marginBottom:16 }}>{product.desc}</div>

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:8 }}>Choose option</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {product.variants.map((v,i)=>(
                  <button key={i} className="ember-btn" onClick={()=>setSelectedVariant(i)}
                    style={{ background:selectedVariant===i?`${t.accent}22`:t.card, border:`1px solid ${selectedVariant===i?t.accent:t.border}`, borderRadius:10, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
                    {v.color && <div style={{ width:12, height:12, borderRadius:"50%", background:v.color }} />}
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:selectedVariant===i?t.accent:t.muted }}>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recurring toggle */}
          {product.recurring && (
            <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:"12px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.text }}>Auto-ship subscription</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>{product.recurringLabel} · Cancel anytime</div>
              </div>
              <div onClick={()=>setIsRecurring(v=>!v)} style={{ width:42, height:24, borderRadius:12, background:isRecurring?t.accent:t.border, position:"relative", cursor:"pointer", flexShrink:0, transition:"background 0.2s" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:isRecurring?21:3, transition:"left 0.2s" }} />
              </div>
            </div>
          )}

          {/* Includes */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:8 }}>What's included</div>
            {product.includes.map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:t.accent, flexShrink:0 }} />
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.text }}>{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add to cart */}
        <div style={{ padding:"12px 24px 36px", borderTop:`1px solid ${t.border}`, background:t.surface }}>
          <button className="ember-btn" onClick={()=>{ onAddToCart({ ...product, variant:product.variants?.[selectedVariant]?.label||"", recurring:isRecurring, qty:1 }); onClose(); }}
            style={{ width:"100%", background:t.accent, color:"#0c0804", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, boxShadow:`0 0 24px ${t.accent}44`, marginBottom:8 }}>
            Add to Cart — ${product.price.toFixed(2)}{product.priceLabel||""}
          </button>
          {product.url && (
            <button className="ember-btn" onClick={()=>window.open(product.url,"_blank")}
              style={{ width:"100%", background:"transparent", border:`1px solid ${t.border}`, color:t.muted, fontFamily:"'DM Sans',sans-serif", fontSize:13, padding:"10px 0", borderRadius:14 }}>
              View on Amazon →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SHOP SCREEN
// ─────────────────────────────────────────
function ShopScreen({ t, cart, onAddToCart, onShowCart, onBack }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = activeCategory==="all" ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter(p=>p.category===activeCategory);

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:t.gradient, position:"relative", overflow:"hidden" }}>
      {selectedProduct && (
        <ProductDetail product={selectedProduct} t={t} onClose={()=>setSelectedProduct(null)} onAddToCart={onAddToCart} />
      )}

      {/* Header */}
      <div style={{ padding:"52px 24px 12px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, marginBottom:2 }}>Ember Shop</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:600, color:t.text }}>The Ritual Kit</div>
        </div>
        <button className="ember-btn" onClick={onShowCart} style={{ position:"relative", background:t.card, border:`1px solid ${t.border}`, width:44, height:44, borderRadius:"50%", fontSize:20 }}>
          🛒
          {cart.length>0 && (
            <div style={{ position:"absolute", top:-4, right:-4, width:18, height:18, borderRadius:"50%", background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#0c0804", fontWeight:700 }}>{cart.length}</div>
          )}
        </button>
      </div>

      {/* Hero banner */}
      <div style={{ margin:"0 24px 16px", background:`linear-gradient(135deg, ${t.accent}22, ${t.accent}08)`, border:`1px solid ${t.accent}33`, borderRadius:20, padding:"16px 20px", flexShrink:0 }}>
        <div style={{ fontFamily:"'Lora',serif", fontSize:15, color:t.text, marginBottom:4 }}>Write. Capture. Release.</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, lineHeight:1.6 }}>Every product in the Ember shop exists to support one moment — the ritual of letting go.</div>
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          {["🫙 Jar","📝 Paper","🖊️ Pen"].map((item,i)=>(
            <div key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.accent, background:`${t.accent}18`, borderRadius:8, padding:"3px 10px" }}>{item}</div>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:8, padding:"0 24px 14px", overflowX:"auto", flexShrink:0 }}>
        {CATEGORY_TABS.map(tab=>(
          <button key={tab.id} className="ember-btn" onClick={()=>setActiveCategory(tab.id)}
            style={{ background:activeCategory===tab.id?t.accent:t.card, border:`1px solid ${activeCategory===tab.id?t.accent:t.border}`, borderRadius:20, padding:"6px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:11, color:activeCategory===tab.id?"#0c0804":t.muted, whiteSpace:"nowrap", flexShrink:0 }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
        {/* Bundle card — full width */}
        {filtered.filter(p=>p.category==="bundle").map(product=>(
          <div key={product.id} className="ember-btn" onClick={()=>setSelectedProduct(product)}
            style={{ background:`linear-gradient(135deg, ${t.accent}18, ${t.card})`, border:`2px solid ${t.accent}55`, borderRadius:20, padding:20, marginBottom:14, cursor:"pointer", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:12, right:12, fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.accent, background:`${t.accent}22`, borderRadius:8, padding:"2px 8px" }}>{product.badge}</div>
            <div style={{ fontSize:36, marginBottom:10 }}>{product.emoji}</div>
            <div style={{ fontFamily:"'Lora',serif", fontSize:18, color:t.text, marginBottom:4 }}>{product.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:12 }}>{product.tagline}</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:12 }}>
              <div style={{ fontFamily:"'Lora',serif", fontSize:22, color:t.accent }}>${product.price.toFixed(2)}</div>
              {product.comparePrice && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, textDecoration:"line-through" }}>${product.comparePrice.toFixed(2)}</div>}
              {product.comparePrice && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#22c55e", background:"#22c55e22", borderRadius:6, padding:"1px 6px" }}>Save ${(product.comparePrice-product.price).toFixed(2)}</div>}
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {product.includes.slice(0,3).map((inc,i)=>(
                <div key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, background:`${t.border}88`, borderRadius:6, padding:"2px 7px" }}>✓ {inc}</div>
              ))}
            </div>
          </div>
        ))}

        {/* 2-column grid for other products */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          {filtered.filter(p=>p.category!=="bundle").map(product=>(
            <div key={product.id} className="ember-btn" onClick={()=>setSelectedProduct(product)}
              style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:18, padding:16, cursor:"pointer", display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontSize:28 }}>{product.emoji}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:t.accent, background:`${t.accent}22`, borderRadius:6, padding:"2px 6px", textAlign:"right", lineHeight:1.3 }}>{product.badge}</div>
              </div>
              <div style={{ fontFamily:"'Lora',serif", fontSize:14, color:t.text, lineHeight:1.3 }}>{product.name}</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted, lineHeight:1.4, flex:1 }}>{product.tagline}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:5, marginTop:4 }}>
                <div style={{ fontFamily:"'Lora',serif", fontSize:17, color:t.accent }}>${product.price.toFixed(2)}</div>
                {product.priceLabel && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted }}>{product.priceLabel}</div>}
              </div>
              {product.recurring && (
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#22c55e", background:"#22c55e18", borderRadius:6, padding:"2px 6px" }}>🔄 {product.recurringLabel}</div>
              )}
              <button className="ember-btn" onClick={e=>{ e.stopPropagation(); onAddToCart({...product, variant:product.variants?.[0]?.label||"", qty:1}); }}
                style={{ background:`${t.accent}22`, border:`1px solid ${t.accent}44`, borderRadius:10, padding:"7px 0", color:t.accent, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, width:"100%" }}>
                + Add
              </button>
            </div>
          ))}
        </div>

        {/* Free shipping notice */}
        <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:14, padding:14, marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>🚚</span>
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.text }}>Free shipping on orders over $50</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:t.muted }}>Ships in 2–4 business days · Secure checkout</div>
          </div>
        </div>

        {/* Sourcing note */}
        <div style={{ background:`${t.accent}10`, border:`1px solid ${t.accent}22`, borderRadius:14, padding:14, marginBottom:100 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, lineHeight:1.65 }}>
            🌿 <strong style={{ color:t.text }}>Ember paper</strong> is PVA-based, non-toxic, and biodegradable. Safe to dissolve in your sink. The fibers break down completely — no residue, no waste.
          </div>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
// ─────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────
function BottomNav({ active, t, onJournal, onShop, onSettings, cartCount }) {
  const tabs = [
    { id:"home",     icon:"📖", label:"Journal",  action:onJournal },
    { id:"shop",     icon:"🛒", label:"Shop",     action:onShop, badge:cartCount },
    { id:"settings", icon:"⚙️", label:"Settings", action:onSettings },
  ];
  return (
    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:`${active==="capture"||active==="entry"?"transparent":t.surface}`, borderTop:`1px solid ${t.border}44`, display:"flex", padding:"8px 0 28px", backdropFilter:"blur(12px)" }}>
      {tabs.map(tab=>(
        <button key={tab.id} className="ember-btn" onClick={tab.action}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", position:"relative" }}>
          <div style={{ fontSize:22, filter:active===tab.id?"none":"grayscale(1)", opacity:active===tab.id?1:0.5 }}>{tab.icon}</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:active===tab.id?t.accent:t.muted }}>{tab.label}</div>
          {tab.badge>0 && (
            <div style={{ position:"absolute", top:0, right:"25%", width:16, height:16, borderRadius:"50%", background:t.accent, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"#0c0804", fontWeight:700 }}>{tab.badge}</div>
          )}
          {active===tab.id && <div style={{ width:4, height:4, borderRadius:"50%", background:t.accent, boxShadow:`0 0 6px ${t.accent}` }} />}
        </button>
      ))}
    </div>
  );
}

export default function Ember() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [appState, setAppState] = useState("onboarding");
  const [config, setConfig] = useState({ theme:"ember", character:"mochi", lens:"counselor", pin:"1234" });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entries, setEntries] = useState(SAMPLE_ENTRIES);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [navTab, setNavTab] = useState("home");

  const t = THEMES[config.theme];
  const char = CHARACTERS.find(c=>c.id===config.character) || CHARACTERS[0];
  const activeLens = LENSES.find(l=>l.id===config.lens) || LENSES[0];

  useEffect(() => {
    getCurrentUser().then(currentUser => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadUserData(currentUser.id);
      }
    });

    const subscription = onAuthStateChange((newUser) => {
      setUser(newUser);
      if (newUser) {
        loadUserData(newUser.id);
      } else {
        setAppState("auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId) => {
    const settings = await getUserSettings(userId);
    if (settings) {
      setConfig({
        theme: settings.theme,
        character: settings.character_id,
        lens: settings.lens_id,
        pin: settings.pin_hash || "1234"
      });
      setAppState("home");
    } else {
      setAppState("onboarding");
    }

    const userEntries = await getJournalEntries(userId);
    if (userEntries && userEntries.length > 0) {
      const formattedEntries = userEntries.map(entry => ({
        id: entry.id,
        date: new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dateShort: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: entry.date === new Date().toISOString().split('T')[0] ? 'Today' : new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' }),
        mood: entry.mood,
        lens: entry.lens,
        released: entry.released,
        tags: entry.tags || [],
        text: entry.text,
        preview: entry.text.substring(0, 50) + '...'
      }));
      setEntries(formattedEntries);
    }
  };

  const handleOnboardingComplete = async (cfg) => {
    setConfig(cfg);
    if (user) {
      await saveUserSettings(user.id, cfg);
      setAppState("home");
    } else {
      setAppState("home");
    }
  };

  const handleAuthSuccess = (newUser) => {
    setUser(newUser);
    setAppState("onboarding");
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setAppState("auth");
  };

  const handleSaveEntry = async (entryData) => {
    if (!user) return;

    const savedEntry = await saveJournalEntry(user.id, entryData);
    if (savedEntry) {
      const formattedEntry = {
        id: savedEntry.id,
        date: new Date(savedEntry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dateShort: new Date(savedEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: savedEntry.date === new Date().toISOString().split('T')[0] ? 'Today' : new Date(savedEntry.date).toLocaleDateString('en-US', { weekday: 'long' }),
        mood: savedEntry.mood,
        lens: savedEntry.lens,
        released: savedEntry.released,
        tags: savedEntry.tags || [],
        text: savedEntry.text,
        preview: savedEntry.text.substring(0, 50) + '...'
      };
      setEntries(prev => [formattedEntry, ...prev]);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.findIndex(i=>i.id===product.id && i.variant===product.variant);
      if (existing>=0) { const n=[...prev]; n[existing]={...n[existing],qty:n[existing].qty+1}; return n; }
      return [...prev, product];
    });
  };

  const removeFromCart = (idx) => setCart(prev=>prev.filter((_,i)=>i!==idx));

  const handleCheckout = () => {
    // In production this opens Stripe/Shopify — for now show confirmation
    alert("🔥 Order placed! Ember is on its way.\n\nIn production this connects to your Shopify or Stripe checkout.");
    setCart([]);
    setShowCart(false);
  };

  const showNav = ["home","shop","settings"].includes(appState) || navTab==="shop";
  const mainTab = navTab;

  const goJournal = () => { setNavTab("home"); setAppState("home"); };
  const goShop    = () => { setNavTab("shop"); setAppState("shop"); };
  const goSettings= () => { setNavTab("settings"); setAppState("settings"); };

  if (authLoading) {
    return (
      <div style={{ width:"100%", height:"100vh", background:"#0c0804", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize: 48 }}>🔥</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ width:"100%", height:"100vh", background:t.gradient, overflow:"hidden", position:"relative" }}>
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div style={{ width:"100%", height:"100vh", background:t.gradient, position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{height:100%;width:100%;overflow:hidden;background:#0c0804;}
        body{overscroll-behavior:none;-webkit-tap-highlight-color:transparent;}
        .ember-btn{cursor:pointer;border:none;outline:none;transition:transform 0.13s,box-shadow 0.13s;-webkit-tap-highlight-color:transparent;}
        .ember-btn:active:not(:disabled){transform:scale(0.95);}
        .ember-btn:disabled{cursor:default;opacity:0.5;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
        @keyframes slideUp{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes ember{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-130px) scale(0.1);opacity:0}}
        @keyframes ritual{0%{opacity:1;filter:blur(0px) brightness(1)}65%{opacity:1;filter:blur(3px) brightness(2.5)}100%{opacity:0;filter:blur(20px) brightness(5)}}
        .float-anim{animation:float 3s ease-in-out infinite;}
        .slide-up{animation:slideUp 0.35s ease-out;}
        .fade-in{animation:fadeIn 0.25s ease-out;}
        ::-webkit-scrollbar{width:0;height:0;}
      `}</style>

      <div style={{ width:"100%", height:"100%", background:t.gradient, overflow:"hidden", position:"relative", transition:"background 0.6s" }}>

        {/* Cart drawer overlay */}
        {showCart && <CartDrawer cart={cart} t={t} onClose={()=>setShowCart(false)} onRemove={removeFromCart} onCheckout={handleCheckout} />}

        {appState==="onboarding" && <Onboarding onComplete={handleOnboardingComplete} />}
        {appState==="pin"        && <PinScreen savedPin={config.pin} onUnlock={()=>setAppState("home")} t={t} />}
        {appState==="home"       && <HomeScreen t={t} char={char} activeLens={activeLens} entries={entries} onEntry={e=>{setSelectedEntry(e);setAppState("entry");}} onCapture={()=>setAppState("capture")} onSettings={goSettings} />}
        {appState==="capture"    && <CaptureScreen t={t} activeLens={activeLens} onBack={goJournal} onDone={goJournal} onSaveEntry={handleSaveEntry} />}
        {appState==="entry"      && selectedEntry && <EntryScreen t={t} entry={selectedEntry} activeLens={activeLens} char={char} onBack={goJournal} />}
        {appState==="shop"       && <ShopScreen t={t} cart={cart} onAddToCart={addToCart} onShowCart={()=>setShowCart(true)} onBack={goJournal} />}
        {appState==="settings"   && <SettingsScreen t={t} char={char} activeLens={activeLens} theme={config.theme} setTheme={v=>setConfig(c=>({...c,theme:v}))} character={config.character} setCharacter={v=>setConfig(c=>({...c,character:v}))} lens={config.lens} setLens={v=>setConfig(c=>({...c,lens:v}))} onBack={goJournal} onSignOut={handleSignOut} />}

        {/* Bottom nav — shown on main screens */}
        {["home","shop","settings"].includes(appState) && (
          <BottomNav active={appState} t={t} onJournal={goJournal} onShop={goShop} onSettings={goSettings} cartCount={cart.length} />
        )}
      </div>
    </div>
  );
}
