import React from "react";

export function Toggle({ on }) {
  return (
    <div style={{ width:42, height:24, borderRadius:12, background:on?"#10b981":"#334155", position:"relative", cursor:"pointer", flexShrink:0 }}>
      <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:on?21:3, transition:"left 0.2s" }} />
    </div>
  );
}
