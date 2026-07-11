import { C, gv, NAV_ITEMS } from "../lib/catalog";
import { VendorLogo } from "./VendorLogo";

export function Sidebar({ active, setActive, total, analyzed, onAdd }) {
  return (
    <div style={{
      width:224, minHeight:"100vh", background:C.sidebar,
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column", flexShrink:0,
      position:"relative", zIndex:1,
    }}>
      <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:11,
            background:`linear-gradient(135deg,${C.pink},#7c3aed 60%,#33e0ff)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:900, color:"#fff",
            boxShadow:`0 0 20px ${C.pink}66, 0 0 44px ${C.pink}22`,
          }}>L</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, letterSpacing:"0.05em" }}>LLM HUB</div>
            <div style={{ fontSize:9, color:C.textMuted, letterSpacing:"0.1em" }}>MODEL EXPLORER</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:8 }}>
        {[{l:"MODELI",v:total,c:C.text},{l:"ANALIZ",v:analyzed,c:C.pink}].map(s=>(
          <div key={s.l} style={{ flex:1, background:C.card, borderRadius:9, padding:"9px 11px", border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:19, fontWeight:800, color:s.c, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:8, color:C.textMuted, marginTop:3, letterSpacing:"0.1em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <nav style={{ flex:1, padding:"8px 8px", overflowY:"auto" }}>
        <div style={{ fontSize:8, color:C.textMuted, padding:"5px 10px 7px", letterSpacing:"0.12em" }}>VENDORZY</div>
        {NAV_ITEMS.map(n=>{
          const v = gv(n.id); const isA = active===n.id;
          return (
            <div key={n.id} onClick={()=>setActive(n.id)} style={{
              display:"flex", alignItems:"center", gap:9, padding:"8px 10px",
              borderRadius:9, cursor:"pointer", marginBottom:1,
              background:isA?v.bg||C.card:"transparent",
              border:`1px solid ${isA?v.color+"44":"transparent"}`,
              transition:"all 0.15s",
            }}
              onMouseEnter={e=>{ if(!isA) e.currentTarget.style.background=C.card; }}
              onMouseLeave={e=>{ if(!isA) e.currentTarget.style.background="transparent"; }}
            >
              {n.id!=="wszystkie"&&n.id!=="inne" ? (
                <VendorLogo vendor={n.id} size={22}/>
              ) : (
                <span style={{ fontSize:12, width:22, textAlign:"center", color:C.textSub, flexShrink:0 }}>{n.icon}</span>
              )}
              <span style={{ fontSize:10, letterSpacing:"0.04em", color:isA?v.color||C.text:C.textSub, fontWeight:isA?700:400 }}>{n.label}</span>
              {isA && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:v.color||C.pink, boxShadow:`0 0 6px ${v.color||C.pink}` }}/>} 
            </div>
          );
        })}
      </nav>

      <div style={{ padding:"10px 8px", borderTop:`1px solid ${C.border}` }}>
        <div onClick={onAdd} style={{
          display:"flex", alignItems:"center", gap:8, padding:"9px 12px",
          borderRadius:9, cursor:"pointer",
          border:`1px dashed ${C.pinkDim}`,
          color:C.pink, fontSize:10, letterSpacing:"0.05em", transition:"all 0.15s",
        }}
          onMouseEnter={e=>e.currentTarget.style.background=C.pinkGlow}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
        >
          <span style={{ fontSize:15, lineHeight:1 }}>+</span> DODAJ LLM
        </div>
      </div>
    </div>
  );
}
