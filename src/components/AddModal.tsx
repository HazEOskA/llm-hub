import { useState } from "react";
import { C } from "../lib/catalog";

export function AddModal({ onAdd, onClose, mobile }) {
  const [form,setForm] = useState({name:"",vendor:"",tags:"",initial:""});
  const doAdd=()=>{
    if(!form.name.trim())return;
    onAdd({ id:"custom-"+Date.now(), name:form.name.trim(), vendor:form.vendor.trim()||"Niestandardowy", tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean), _initial:form.initial||form.name.slice(0,2).toUpperCase() });
    onClose();
  };
  return(
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,10,0.88)", zIndex:1000, display:"flex", alignItems:mobile?"flex-end":"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ background:C.card, border:`1px solid ${C.pinkDim}`, borderRadius:mobile?"20px 20px 0 0":16, padding:22, width:mobile?"100%":380, maxWidth:"100vw", boxShadow:`0 0 50px ${C.pink}18`, paddingBottom:mobile?"calc(22px + env(safe-area-inset-bottom,0px))":22 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.text, marginBottom:18, letterSpacing:"0.07em" }}>+ DODAJ WŁASNY LLM</div>
        {[{l:"NAZWA *",k:"name",ph:"np. My Model"},{l:"VENDOR *",k:"vendor",ph:"np. OpenAI"},{l:"TAGI",k:"tags",ph:"szybki, tani, kod"},{l:"INICJAŁY (ikona)",k:"initial",ph:"MX"}].map(f=>(
          <div key={f.k} style={{ marginBottom:12 }}>
            <label style={{ fontSize:8, color:C.textMuted, display:"block", marginBottom:4, letterSpacing:"0.1em" }}>{f.l}</label>
            <input value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} style={{ width:"100%", background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"9px 12px", fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
          </div>
        ))}
        <div style={{ display:"flex", gap:8, marginTop:16 }}>
          <button onClick={doAdd} style={{ flex:1, background:`linear-gradient(135deg,${C.pink},#7c3aed)`, border:"none", borderRadius:9, color:"#fff", padding:"11px", cursor:"pointer", fontWeight:700, fontSize:11, letterSpacing:"0.06em" }}>DODAJ</button>
          <button onClick={onClose} style={{ flex:1, background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:9, color:C.textMuted, padding:"11px", cursor:"pointer", fontSize:11 }}>ANULUJ</button>
        </div>
      </div>
    </div>
  );
}
