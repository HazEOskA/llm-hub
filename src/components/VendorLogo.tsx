import { useState } from "react";
import { C, gv, ICONS } from "../lib/catalog";

export function VendorLogo({ vendor, size=32 }) {
  const v = gv(vendor);
  const emb = ICONS[vendor];
  const [err,setErr] = useState(false);

  if (emb && !err) {
    return (
      <div style={{
        width:size, height:size, borderRadius:12,
        background:`linear-gradient(145deg, ${v.bg}, rgba(0,0,0,0.4))`,
        border:`1px solid ${v.color}44`,
        boxShadow:`0 0 12px ${v.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0, overflow:"hidden", padding: size>30?6:4,
      }}>
        <img src={emb.uri} alt={vendor} onError={()=>setErr(true)}
          style={{ width:"100%", height:"100%", objectFit:"contain",
            filter: emb.white ? "brightness(0) invert(1)" : "none" }}/>
      </div>
    );
  }

  return (
    <div style={{
      width:size, height:size, borderRadius:12,
      background:`linear-gradient(145deg, ${v.bg}, rgba(0,0,0,0.4))`,
      border:`1px solid ${v.color}55`,
      boxShadow:`0 0 12px ${v.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size<32?9:11, fontWeight:800, color:v.color,
      letterSpacing:"0.02em", flexShrink:0,
      textShadow:`0 0 8px ${v.color}88`,
    }}>{v.initial||vendor.slice(0,2).toUpperCase()}</div>
  );
}
