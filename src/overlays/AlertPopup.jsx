import { useEffect, useState } from "react";
import { INTENT_CONFIG } from "../data/mockUsers";

export default function AlertPopup({ wave, onAccept, onIgnore }) {
  const [timeLeft, setTimeLeft] = useState(12);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { handleIgnore(); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleIgnore = () => { setClosing(true); setTimeout(onIgnore, 200); };
  const handleAccept = () => { setClosing(true); setTimeout(onAccept, 200); };

  const c = INTENT_CONFIG[wave.intent] || INTENT_CONFIG.Coffee;

  return (
    <>
      <style>{`
        @keyframes alertIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.9); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
        @keyframes alertOut { from { opacity:1; transform:translate(-50%,-50%) scale(1); } to { opacity:0; transform:translate(-50%,-50%) scale(0.95); } }
        @keyframes ringPulse { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.15); opacity:0.2; } }
        @keyframes urgentPulse { 0%,100% { box-shadow:0 0 0 0 rgba(167,139,250,0.4); } 50% { box-shadow:0 0 0 16px rgba(167,139,250,0); } }
        @keyframes dotPulse { 0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.5); } 50% { box-shadow:0 0 0 6px rgba(52,211,153,0); } }
      `}</style>

      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, backdropFilter:"blur(6px)" }} />

      <div style={{
        position:"fixed", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:"calc(100% - 40px)", maxWidth:340, zIndex:201,
        background:"linear-gradient(135deg,#1A0A2E 0%,#0D1220 100%)",
        border:"1px solid rgba(167,139,250,0.3)", borderRadius:24,
        padding:"32px 24px 24px", textAlign:"center",
        animation: closing ? "alertOut 0.2s ease forwards" : "alertIn 0.25s ease forwards",
        boxShadow:"0 0 60px rgba(167,139,250,0.15),0 20px 60px rgba(0,0,0,0.6)",
      }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:200, height:200, borderRadius:"50%", border:`1px solid ${c.color}33`, animation:"ringPulse 1.5s infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:150, height:150, borderRadius:"50%", border:`1px solid ${c.color}22`, animation:"ringPulse 1.5s infinite 0.3s", pointerEvents:"none" }} />

        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:20, padding:"4px 12px", marginBottom:20, fontSize:11, fontWeight:600, color:"#34D399" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#34D399", animation:"dotPulse 1s infinite" }} />
          LIVE ALERT
        </div>

        <div style={{ width:64, height:64, borderRadius:"50%", margin:"0 auto 16px", background:"linear-gradient(135deg,#6D28D9,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:22, color:"#EDE9FE", border:`2px solid ${c.color}66`, animation:"urgentPulse 1.2s infinite" }}>{wave.initials}</div>

        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"#F0EEF8", marginBottom:6 }}>{wave.name} is nearby</div>
        <div style={{ fontSize:13, color:"rgba(180,175,210,0.6)", marginBottom:6 }}>Live for {c.emoji} {wave.intent} · {wave.distance}</div>
        <div style={{ fontSize:12, color:"rgba(180,175,210,0.4)", marginBottom:24 }}>They waved at you</div>

        <div style={{ marginBottom:20 }}>
          <div style={{ height:3, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:4, width:`${(timeLeft/12)*100}%`, background: timeLeft <= 3 ? "#F87171" : c.color, transition:"width 1s linear,background 0.3s" }} />
          </div>
          <div style={{ fontSize:11, color:"rgba(180,175,210,0.35)", marginTop:6 }}>{timeLeft}s to respond</div>
        </div>

        <button onClick={handleAccept} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:10, background:"linear-gradient(90deg,#6D28D9,#4F46E5)", color:"#F0EEF8" }}>👋 Match</button>
        <button onClick={handleIgnore} style={{ width:"100%", padding:"12px", borderRadius:14, border:"none", fontSize:13, fontWeight:500, cursor:"pointer", background:"transparent", color:"rgba(180,175,210,0.35)", opacity: timeLeft <= 5 ? 0.5 : 1, transition:"opacity 0.3s" }}>Ignore</button>
      </div>
    </>
  );
}
