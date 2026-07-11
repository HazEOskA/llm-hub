import { C, gv, NAV_ITEMS } from "../lib/catalog";
import { VendorLogo } from "./VendorLogo";

export function MobileChips({ active, setActive }) {
  return(
    <div style={{ display:"flex", gap:6, overflowX:"auto", padding:"10px 14px", borderBottom:`1px solid ${C.border}`, scrollbarWidth:"none" }}>
      {NAV_ITEMS.map(n=>{
        const v=gv(n.id); const isA=active===n.id;
        return(
          <div key={n.id} onClick={()=>setActive(n.id)} style={{
            display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
            borderRadius:20, flexShrink:0, cursor:"pointer",
            background:isA?v.bg||C.card:C.card,
            border:`1px solid ${isA?v.color+"55":C.border}`,
            transition:"all 0.15s", WebkitTapHighlightColor:"transparent",
          }}>
            {n.id!=="wszystkie"&&n.id!=="inne"
              ? <VendorLogo vendor={n.id} size={16}/>
              : <span style={{ fontSize:11, color:isA?C.pink:C.textMuted }}>{n.icon}</span>
            }
            <span style={{ fontSize:9, color:isA?v.color||C.pink:C.textMuted, fontWeight:isA?700:400, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{n.label}</span>
          </div>
        );
      })}
    </div>
  );
}
export function MobileBottomNav({ active, setActive, onAdd }) {
  const items = NAV_ITEMS.slice(0,4);
  return(
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200, background:"rgba(10,10,18,0.9)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderTop:`1px solid ${C.border}`, display:"flex", paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
      {items.map(n=>{
        const v=gv(n.id); const isA=active===n.id;
        return(
          <div key={n.id} onClick={()=>setActive(n.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 7px", cursor:"pointer", position:"relative", WebkitTapHighlightColor:"transparent" }}>
            {isA&&<div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2, background:v.color||C.pink, borderRadius:"0 0 3px 3px", boxShadow:`0 0 6px ${v.color||C.pink}` }}/>} 
            {n.id!=="wszystkie"
              ? <VendorLogo vendor={n.id} size={20}/>
              : <span style={{ fontSize:16, color:isA?C.pink:C.textMuted }}>▦</span>
            }
            <span style={{ fontSize:7, color:isA?v.color||C.pink:C.textMuted, marginTop:3, letterSpacing:"0.06em", fontWeight:isA?700:400 }}>{n.label}</span>
          </div>
        );
      })}
      <div onClick={onAdd} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 7px", cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
        <div style={{ width:20, height:20, borderRadius:6, background:C.pinkGlow, border:`1px solid ${C.pinkDim}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.pink }}>+</div>
        <span style={{ fontSize:7, color:C.pink, marginTop:3, letterSpacing:"0.06em" }}>DODAJ</span>
      </div>
    </div>
  );
}
