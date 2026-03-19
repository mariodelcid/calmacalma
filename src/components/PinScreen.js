import React, { useState } from "react";

export function PinScreen({ savedPin, onUnlock, t }) {
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
    <div style={{ height:"844px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:t.gradient }}>
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
