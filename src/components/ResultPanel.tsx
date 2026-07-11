import { useState } from "react";
import { C, gv } from "../lib/catalog";
import { VendorLogo } from "./VendorLogo";

export function ResultPanel({ llm, result, isLoading, onClose, mobile }) {
  const v = gv(llm.vendor);
  const [tab,setTab] = useState("opis");
  const TABS = [
    {id:"opis",label:"OPIS"},{id:"podpiac",label:"PODPIĘCIE"},
    {id:"nowosci",label:"NOWOŚCI"},{id:"agenty",label:"AGENTY"},{id:"prompty",label:"PROMPTY"},
  ];
  const getSection=(text,s)=>{
    if(!text)return"";
    const M={
      opis:    [["## OPIS"],                              ["## JAK PODPIĄĆ","## JAK PODPIAC"]],
      podpiac: [["## JAK PODPIĄĆ","## JAK PODPIAC"],     ["## NOWOŚCI","## NOWOSCI"]],
      nowosci: [["## NOWOŚCI","## NOWOSCI"],              ["## AGENTY"]],
      agenty:  [["## AGENTY"],                            ["## PRZYKŁADOWE PROMPTY","## PRZYKLADOWE PROMPTY"]],
      prompty: [["## PRZYKŁADOWE PROMPTY","## PRZYKLADOWE PROMPTY"], []],
    };
    const findIdx=(t,markers)=>{ let i=-1; for(const m of markers){const x=t.indexOf(m);if(x!==-1&&(i===-1||x<i))i=x;} return i; };
    const [startMarkers,endMarkers]=M[s];
    const si=findIdx(text,startMarkers); if(si===-1)return text;
    const startMarker=startMarkers.find(m=>text.indexOf(m)===si);
    const ei=endMarkers.length?findIdx(text,endMarkers):text.length;
    return text.slice(si+(startMarker||"").length,ei!==-1&&ei>si?ei:undefined).trim();
  };

  const PanelContent = ()=>(
    <>
      <div style={{ padding:"18px 20px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <VendorLogo vendor={llm.vendor} size={44}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:800, color:C.text }}>{llm.name}</div>
          <div style={{ fontSize:10, color:v.color, letterSpacing:"0.06em", marginTop:2, fontWeight:500 }}>{llm.vendor}</div>
        </div>
        <button onClick={onClose} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.textMuted, width:30, height:30, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
      </div>
      <div style={{ display:"flex", gap:4, padding:"10px 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0, overflowX:"auto", scrollbarWidth:"none" }}>
        {TABS.map(t=>{const isA=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            background:isA?v.bg:"transparent",
            border:`1px solid ${isA?v.color+"55":"transparent"}`,
            borderRadius:20, color:isA?v.color:C.textMuted,
            padding:"6px 12px", cursor:"pointer",
            fontSize:9, fontWeight:isA?700:400,
            letterSpacing:"0.07em", whiteSpace:"nowrap", transition:"all 0.12s",
          }}>{t.label}</button>
        );})}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>
        {isLoading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:200, gap:14 }}>
            <div style={{ width:38, height:38, border:`2px solid ${v.color}33`, borderTopColor:v.color, borderRadius:"50%", animation:"spin 0.8s linear infinite", boxShadow:`0 0 16px ${v.color}44` }}/>
            <div style={{ color:C.textMuted, fontSize:10, letterSpacing:"0.1em" }}>GENERUJĘ ANALIZĘ…</div>
          </div>
        ) : (
          <div style={{ color:C.textSub, fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap" }}>
            {getSection(result,tab)||"Brak danych."}
          </div>
        )}
      </div>
    </>
  );

  if(mobile){
    return(
      <div style={{ position:"fixed", inset:0, zIndex:600, display:"flex", flexDirection:"column" }}>
        <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(6,6,10,0.85)", backdropFilter:"blur(6px)" }}/>
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background:"rgba(8,8,16,0.95)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
          borderTop:`2px solid ${v.color}`,
          boxShadow:`0 -8px 40px ${v.color}22`,
          borderRadius:"24px 24px 0 0", maxHeight:"90vh",
          display:"flex", flexDirection:"column",
          animation:"slideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
          paddingBottom:"env(safe-area-inset-bottom,0px)",
        }}>
          <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
            <div style={{ width:32, height:4, borderRadius:2, background:C.border }}/>
          </div>
          <PanelContent/>
        </div>
      </div>
    );
  }

  return(
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"stretch", justifyContent:"flex-end", pointerEvents:"none" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(6,6,10,0.7)", backdropFilter:"blur(4px)", pointerEvents:"all" }}/>
      <div style={{ position:"relative", pointerEvents:"all", width:500, background:"rgba(8,8,16,0.92)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderLeft:`1px solid ${C.border}`, display:"flex", flexDirection:"column", animation:"slideInRight 0.25s ease", boxShadow:"-20px 0 60px rgba(0,0,0,0.5)" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${v.color},${v.color}44)` }}/>
        <PanelContent/>
      </div>
    </div>
  );
}
