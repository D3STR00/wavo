import { useEffect, useState } from "react";
import { INTENT_CONFIG } from "../data/mockUsers";

export default function MatchPopup({ match, onViewChat, onStayNearby }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onStayNearby, 300); }, 4000);
    return () => clearTimeout(t);
  }, []);

  const c = INTENT_CONFIG[match.intent] || INTENT_CONFIG.Coffee;

  return (
    <>
      <style>{`
        @keyframes matchIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.85); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
        @keyframes matchOut { from { opacity:1; } to { opacity:0; } }
        @keyframes sparkle { 0%,100% { transform:scale(1) rotate(0deg); } 50% { transform:scale(1.1) rotate(5deg); } }
        @keyframes matchPulse { 0%,100% { box-shadow:0 0 0 0 rgba(52,211,153,0.5); } 50% { box-shadow:0 0 0 20px rgba(52,211,153,0); } }
      `}</style>

      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:300, backdropFilter:"blur(8px)" }} />

      <div style={{
        position:"fixed", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:"calc(100% - 40px)", maxWidth:340, zIndex:301,
        background:"linear-gradient(135deg,#0A1A12 0%,#0D1A2E 100%)",
        border:"1px solid rgba(52,211,153,0.3)", borderRadius:24,
        padding:"36px 24px 28px", textAlign:"center",
        animation: visible ? "matchIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "matchOut 0.3s ease forwards",
        boxShadow:"0 0 80px rgba(52,211,153,0.12),0 20px 60px rgba(0,0,0,0.7)",
      }}>
        <div style={{ fontSize:36, marginBottom:16, animation:"sparkle 1s infinite" }}>✨</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"#F0EEF8", marginBottom:8 }}>It's a match</div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, margin:"20px 0" }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#6D28D9,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"#EDE9FE", border:"2px solid rgba(52,211,153,0.4)", animation:"matchPulse 1.5s infinite" }}>YO</div>
          <div style={{ fontSize:20, color:"rgba(52,211,153,0.8)" }}>↔</div>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#065F46,#34D399)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"#D1FAE5", border:"2px solid rgba(52,211,153,0.4)", animation:"matchPulse 1.5s infinite 0.3s" }}>{match.initials}</div>
        </div>

        <div style={{ fontSize:14, color:"rgba(180,175,210,0.6)", marginBottom:24 }}>You're both live for {c.emoji} {match.intent}</div>

        <button onClick={onViewChat} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:10, background:"linear-gradient(90deg,#065F46,#059669)", color:"#F0FFF4" }}>💬 View Chat</button>
        <button onClick={onStayNearby} style={{ width:"100%", padding:"12px", borderRadius:14, border:"none", fontSize:13, fontWeight:500, cursor:"pointer", background:"transparent", color:"rgba(180,175,210,0.4)" }}>Stay in Nearby</button>
      </div>
    </>
  );
}
