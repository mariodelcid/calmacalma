import React from "react";

export function Companion({ char, size=52, mood="neutral", t }) {
  return (
    <div className="float-anim" style={{ width:size, height:size, borderRadius:"50%", background:char.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.55, boxShadow:`0 4px 20px ${t.accent}33`, flexShrink:0 }}>
      {char.mood[mood] || char.face}
    </div>
  );
}
