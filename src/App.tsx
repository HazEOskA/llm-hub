import { useCallback, useState } from "react";
import { AddModal } from "./components/AddModal";
import { LLMCard } from "./components/LLMCard";
import { MobileBottomNav, MobileChips } from "./components/MobileNavigation";
import { ResultPanel } from "./components/ResultPanel";
import { Sidebar } from "./components/Sidebar";
import { useIsMobile } from "./hooks/useIsMobile";
import { C, INNE, LLM_LIST } from "./lib/catalog";

export default function App() {
  const mobile = useIsMobile();
  const [llms,setLlms]     = useState(LLM_LIST);
  const [cache,setCache]   = useState({});
  const [loading,setLoad]  = useState(null);
  const [selected,setSel]  = useState(null);
  const [showAdd,setAdd]   = useState(false);
  const [search,setSearch] = useState("");
  const [nav,setNav]       = useState("wszystkie");

  const filtered = llms.filter(l=>{
    const q=search.toLowerCase();
    const ms=!q||l.name.toLowerCase().includes(q)||l.vendor.toLowerCase().includes(q)||l.tags.some(t=>t.toLowerCase().includes(q));
    const mn=nav==="wszystkie"?true:nav==="inne"?INNE.includes(l.vendor):l.vendor===nav;
    return ms&&mn;
  });

  const handleClick = useCallback(async(llm)=>{
    if(cache[llm.id]){setSel({llm,result:cache[llm.id]});return;}
    setLoad(llm.id);setSel({llm,result:null});
    try{
      const res=await fetch("/api/analyze",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",max_tokens:1200,
          system:`Jestes ekspertem od modeli jezykowych (LLM) i piszesz ZAWSZE PO POLSKU.

ZASADY BEZWZGLEDNE:
- NIGDY nie odmawiasz wygenerowania analizy
- NIGDY nie piszesz ze "nie znasz modelu" ani ze "to poza twoja baza wiedzy"
- Jesli model jest nowy lub malo znany - generujesz analize na podstawie jego nazwy, vendora, tagow i ogolnej wiedzy o ekosystemie LLM
- Zawsze wypelniasz KAZDA sekcje konkretnymi tresciami. Zero placeholderow, zero wymowek.
- Jesli brakuje ci pewnych danych - piszesz co PRAWDOPODOBNIE jest prawda dla tego modelu na podstawie vendora i tagow

FORMAT - dokladnie taki:

## OPIS
[2-3 zdania: co to za model, do czego sluzy, jakie sa jego glowne mocne strony]

## JAK PODPIAC
[Konkretny endpoint API, nazwa SDK, przyklad kodu JS lub Python, link do docs vendora]

## NOWOSCI
- [punkt 1]
- [punkt 2]
- [punkt 3]
- [punkt 4]
- [punkt 5]

## AGENTY
[Jakie frameworki wspiera: LangChain, AutoGen, CrewAI, LlamaIndex. Czy ma function calling, tool use, natywne agenty]

## PRZYKLADOWE PROMPTY
1. [konkretny prompt]
2. [konkretny prompt]
3. [konkretny prompt]
4. [konkretny prompt]
5. [konkretny prompt]`,
          messages:[{role:"user",content:`Wygeneruj pelna analize modelu: ${llm.name} od ${llm.vendor}. Tagi: ${llm.tags.join(", ")}. WAZNE: wypelnij kazda sekcje, nie odmawiaj, nie pisz ze nie znasz modelu - zawsze generuj cos konkretnego.`}],
        }),
      });
      const data=await res.json();
      const text=data.content?.find(b=>b.type==="text")?.text||"Błąd odpowiedzi — brak treści w odpowiedzi API.";
      setCache(p=>({...p,[llm.id]:text}));setSel({llm,result:text});
    }catch(e){setSel({llm,result:"## OPIS\nBłąd połączenia z API: "+(e?.message||"nieznany błąd")+"\n\n## JAK PODPIĄĆ\nN/A\n\n## NOWOŚCI\nN/A\n\n## AGENTY\nN/A\n\n## PRZYKŁADOWE PROMPTY\nN/A"});}
    finally{setLoad(null);}
  },[cache]);

  return(
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Space Grotesk','DM Mono',monospace", color:C.text, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", top:"-20%", left:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle, #f04fff14, transparent 65%)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", bottom:"-25%", right:"-10%", width:"55vw", height:"55vw", borderRadius:"50%", background:"radial-gradient(circle, #33e0ff10, transparent 65%)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", top:"30%", right:"25%", width:"30vw", height:"30vw", borderRadius:"50%", background:"radial-gradient(circle, #7c3aed0e, transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input::placeholder{color:${C.textMuted}}
        button{font-family:inherit}
      `}</style>

      {!mobile && <Sidebar active={nav} setActive={setNav} total={llms.length} analyzed={Object.keys(cache).length} onAdd={()=>setAdd(true)}/>}

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, position:"relative", zIndex:1 }}>

        {mobile&&(
          <div style={{ padding:"12px 14px 10px", borderBottom:`1px solid ${C.border}`, background:"rgba(10,10,18,0.85)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", flexShrink:0, position:"sticky", top:0, zIndex:100 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:`linear-gradient(135deg,${C.pink},#7c3aed)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff" }}>L</div>
              <span style={{ fontSize:12, fontWeight:700, color:C.text, letterSpacing:"0.05em" }}>LLM HUB</span>
              {Object.keys(cache).length>0&&<span style={{ marginLeft:"auto", fontSize:9, color:C.pink, letterSpacing:"0.07em" }}>{Object.keys(cache).length} ANALIZ</span>}
            </div>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:C.textMuted, fontSize:13 }}>⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Szukaj…" style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:9, color:C.text, padding:"8px 12px 8px 28px", fontSize:12, outline:"none", fontFamily:"inherit" }}/>
            </div>
          </div>
        )}

        {mobile&&<MobileChips active={nav} setActive={setNav}/>}

        {!mobile&&(
          <div style={{ padding:"12px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, background:"rgba(10,10,18,0.7)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", flexShrink:0 }}>
            <div style={{ position:"relative", flex:"0 0 280px" }}>
              <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.textMuted, fontSize:13 }}>⌕</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Szukaj modelu, vendora, tagu…" style={{ width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:9, color:C.text, padding:"8px 12px 8px 30px", fontSize:12, outline:"none", fontFamily:"inherit", transition:"border-color 0.15s" }} onFocus={e=>e.target.style.borderColor=C.pinkDim} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
            <div style={{ fontSize:9, color:C.textMuted, letterSpacing:"0.08em", marginLeft:"auto" }}>
              {filtered.length} MODELI{Object.keys(cache).length>0&&` · ${Object.keys(cache).length} ANALIZ`}
            </div>
            <button onClick={()=>setAdd(true)} style={{ background:C.pinkGlow, border:`1px solid ${C.pinkDim}`, borderRadius:8, color:C.pink, padding:"7px 14px", cursor:"pointer", fontSize:9, fontWeight:700, letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }} onMouseEnter={e=>{e.currentTarget.style.background=`${C.pink}22`;e.currentTarget.style.boxShadow=`0 0 14px ${C.pink}33`;}} onMouseLeave={e=>{e.currentTarget.style.background=C.pinkGlow;e.currentTarget.style.boxShadow="none";}}>+ DODAJ LLM</button>
          </div>
        )}

        <div style={{ padding:mobile?"10px 14px 2px":"16px 22px 4px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.text, letterSpacing:"0.09em" }}>
            {nav==="wszystkie"?"WSZYSTKIE MODELE":nav==="inne"?"POZOSTAŁE MODELE":nav.toUpperCase()}
          </div>
          <div style={{ fontSize:9, color:C.textMuted, marginTop:2, letterSpacing:"0.05em" }}>
            Kliknij kartę aby wygenerować pełną analizę
          </div>
        </div>

        <div style={{ flex:1, padding:mobile?"8px 12px 88px":"12px 22px 24px", overflowY:"auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(200px,1fr))", gap:mobile?10:14 }}>
            {filtered.map((llm,i)=>(
              <div key={llm.id} style={{ animation:`fadeUp 0.25s ease ${Math.min(i,12)*0.02}s both` }}>
                <LLMCard llm={llm} onClick={handleClick} isLoading={loading===llm.id} hasCache={!!cache[llm.id]} mobile={mobile}/>
              </div>
            ))}
          </div>
          {filtered.length===0&&(
            <div style={{ textAlign:"center", padding:"60px 20px", color:C.textMuted, fontSize:11, letterSpacing:"0.07em" }}>BRAK WYNIKÓW DLA „{search}"</div>
          )}
        </div>
      </div>

      {mobile&&<MobileBottomNav active={nav} setActive={setNav} onAdd={()=>setAdd(true)}/>}
      {selected&&<ResultPanel llm={selected.llm} result={selected.result} isLoading={loading===selected.llm.id} onClose={()=>setSel(null)} mobile={mobile}/>} 
      {showAdd&&<AddModal onAdd={l=>setLlms(p=>[...p,l])} onClose={()=>setAdd(false)} mobile={mobile}/>} 
    </div>
  );
}
