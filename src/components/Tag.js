import React from "react";

export function Tag({ label, t }) {
  return <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:t.muted, background:`${t.border}88`, borderRadius:6, padding:"1px 7px" }}>#{label}</div>;
}
