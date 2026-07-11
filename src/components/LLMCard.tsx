import { useState } from "react";
import { C, gv } from "../lib/catalog";
import { VendorLogo } from "./VendorLogo";

export function LLMCard({ llm, onClick, isLoading, hasCache, mobile }) {
  const v = gv(llm.vendor);
  const [hov,setHov] = useState(false);
  const [pressed,setPressed] = useState(false);

  const active = hov || pressed;

  return (
    <div
      onClick={()=>onClick(llm)}
      onMouseEnter={()=>!mobile&&setHov(true)}
      onMouseLeave={()=>{ !mobile&&setHov(false); setPressed(false); }}
      onMouseDown={()=>setPressed(true)}
      onMouseUp={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)}
      onTouchEnd={()=>{ setPressed(false); }}
      style={{
        background: pressed ? v.bg : active ? C.cardHov : C.card,
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
        border:`1px solid ${active ? v.color+"88" : hasCache ? v.color+"44" : C.border}`,
        borderRadius:18, padding: mobile?"15px":"19px 19px 17px",
        cursor:"pointer", position:"relative", overflow:"hidden",
        transition:"all 0.2s cubic-bezier(0.2,0.8,0.3,1)",
        transform: pressed?"scale(0.97)":active?"translateY(-3px)":"none",
        boxShadow: active
          ? `0 12px 36px rgba(0,0,0,0.6), 0 0 24px ${v.color}33, 0 0 60px ${v.color}18, inset 0 1px 0 rgba(255,255,255,0.08)`
          : hasCache
            ? `0 0 18px ${v.color}22, inset 0 1px 0 rgba(255,255,255,0.05)`
            : `inset 0 1px 0 rgba(255,255,255,0.04)`,
        WebkitTapHighlightColor:"transparent",
        userSelect:"none",
      }}
    >
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg, transparent, ${v.color}, transparent)`,
        opacity: active||hasCache ? 1 : 0.45,
        boxShadow: active ? `0 0 12px ${v.color}` : "none",
        transition:"all 0.2s",
      }}/>

      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <VendorLogo vendor={llm.vendor} size={mobile?36:42}/>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          {hasCache && (
            <span style={{
              fontSize:8, color:v.color, background:v.bg,
              padding:"3px 8px", borderRadius:20,
              border:`1px solid ${v.color}44`, letterSpacing:"0.07em", fontWeight:700,
            }}>✓ ANALIZA</span>
          )}
          {isLoading && (
            <span style={{ fontSize:8, color:C.textMuted, letterSpacing:"0.07em", animation:"pulse 1s infinite" }}>ŁADUJĘ…</span>
          )}
          {!hasCache && !isLoading && (
            <span style={{
              fontSize:8, color:active?v.color:C.textMuted,
              letterSpacing:"0.06em",
              opacity:active?1:0.4,
              transition:"all 0.15s",
            }}>KLIKNIJ →</span>
          )}
        </div>
      </div>

      <div style={{ fontSize: mobile?13:14, fontWeight:700, color: active?C.text:"#d0d0e8", marginBottom:3, lineHeight:1.3 }}>{llm.name}</div>
      <div style={{ fontSize:10, color:v.color, marginBottom:10, letterSpacing:"0.05em", fontWeight:500, opacity:0.85 }}>{llm.vendor}</div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
        {llm.tags.slice(0,mobile?2:3).map(t=>(
          <span key={t} style={{
            fontSize:9, color:C.textMuted, background:C.bgDeep,
            padding:"3px 8px", borderRadius:20,
            border:`1px solid ${C.border}`, letterSpacing:"0.04em",
          }}>{t}</span>
        ))}
      </div>

      {active && !mobile && (
        <div style={{
          position:"absolute", bottom:14, right:16,
          fontSize:13, color:v.color, fontWeight:700,
          animation:"fadeIn 0.1s ease",
        }}>→</div>
      )}
    </div>
  );
}
