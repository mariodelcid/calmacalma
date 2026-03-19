import React, { useState } from "react";
import { THEMES, CHARACTERS, LENSES } from "../data/constants";

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("ember");
  const [character, setCharacter] = useState(null);
  const [lens, setLens] = useState(null);
  const [pin, setPin] = useState([]);
  const [confirmPin, setConfirmPin] = useState([]);
  const [pinStage, setPinStage] = useState("set");
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
    <div style={{ height:"844px", display:"flex", flexDirection:"column", background:t.gradient, overflow:"hidden", transition:"background 0.6s" }}>
      <div style={{ height:3, background:`${t.border}44`, position:"absolute", top:0, left:0, right:0 }}>
        <div style={{ height:"100%", width:`${stepProgress*100}%`, background:t.accent, transition:"width 0.5s", boxShadow:`0 0 8px ${t.accent}` }} />
      </div>

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

      {step===1 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", padding:"60px 20px 20px" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:6 }}>Step 1 of 4</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, color:t.text, marginBottom:6 }}>Choose your world</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, marginBottom:20 }}>This wraps every entry in a scene that's yours.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1, overflowY:"auto" }}>
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
          <button className="ember-btn" onClick={()=>setStep(2)} style={{ marginTop:16, background:t.accent, color:"#0c0804", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, width:"100%" }}>Continue →</button>
        </div>
      )}

      {step===2 && (
        <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", padding:"60px 20px 20px" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:t.muted, marginBottom:6 }}>Step 2 of 4</div>
          <div style={{ fontFamily:"'Lora',serif", fontSize:26, color:t.text, marginBottom:6 }}>Choose your companion</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:t.muted, marginBottom:20 }}>They'll sit quietly with you. React to your writing. Celebrate your wins.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, flex:1, overflowY:"auto" }}>
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
          <button className="ember-btn" onClick={()=>character&&setStep(3)} style={{ marginTop:16, background:character?t.accent:`${t.border}88`, color:character?"#0c0804":t.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15, padding:"14px 0", borderRadius:14, width:"100%" }}>
            {character?"Continue →":"Pick a companion first"}
          </button>
        </div>
      )}

      {step===3 && (
        <div className="fade-in" style={{ height:"844px", display:"flex", flexDirection:"column", padding:"60px 20px 0" }}>
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
