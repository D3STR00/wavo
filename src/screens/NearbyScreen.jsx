import { useState } from "react";
import LiveNearbyMap from "../components/LiveNearbyMap";
import BottomNav from "../components/wavo/bottom-nav";
import { INTENT_CONFIG } from "../data/mockUsers";
import { useIntentFeed } from "../hooks/useIntentFeed";

const FILTERS = ["All", "☕ Coffee", "🚶 Walk", "💬 Talk", "🏋️ Gym"];

export default function NearbyScreen({ userState, formatTime, goOffline, onOpenIntentFlow, onGoFeed, onGoChat, onGoProfile }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const { intents } = useIntentFeed();
  const isLive = userState.status === "live";
  const liveConfig = isLive ? INTENT_CONFIG[userState.intent] : null;

  const filtered = intents.filter(u =>
    activeFilter === "All" || activeFilter.includes(u.intent)
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#0C0C14", color:"#F0EEF8", minHeight:"100vh", maxWidth:390, margin:"0 auto", display:"flex", flexDirection:"column" }}>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#1A0A2E 0%,#0D1A3A 50%,#0A1A1A 100%)", padding:"44px 16px 14px", display:"flex", alignItems:"center", gap:12, position:"relative", overflow:"hidden", flexShrink:0 }}>
        <div style={{ position:"absolute", width:140, height:140, borderRadius:"50%", top:-50, right:-30, background:"radial-gradient(circle,rgba(100,60,220,0.3) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#F0EEF8", flex:1 }}>📍 Nearby</div>
        <div style={{ background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.4)", color:"#34D399", fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>● {intents.length} active</div>
      </div>

      {/* LIVE BANNER */}
      {isLive && liveConfig && (
        <div style={{ margin:"8px 14px 0", background:`linear-gradient(90deg,${liveConfig.activeBg},rgba(52,211,153,0.1))`, border:`1px solid ${liveConfig.activeBorder}`, borderRadius:16, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:liveConfig.color, animation:"mpulse 1s infinite" }} />
          <div style={{ flex:1, fontSize:12, color:liveConfig.color, fontWeight:600 }}>{liveConfig.emoji} Live — {userState.intent} · {formatTime(userState.timeLeft)}</div>
          <div onClick={goOffline} style={{ fontSize:11, color:"rgba(180,175,210,0.4)", cursor:"pointer", padding:"2px 8px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)" }}>End</div>
        </div>
      )}

      {/* FILTERS */}
      <div style={{ padding:"10px 14px", display:"flex", gap:8, overflowX:"auto", flexShrink:0 }}>
        {FILTERS.map(f => (
          <div key={f} onClick={() => setActiveFilter(f)} style={{ padding:"6px 14px", borderRadius:30, fontSize:12, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s", background: activeFilter===f ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)", border:`1px solid ${activeFilter===f ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)"}`, color: activeFilter===f ? "#C4B5FD" : "rgba(200,200,220,0.6)" }}>{f}</div>
        ))}
      </div>

      {/* LIVE MAP */}
      <LiveNearbyMap intents={filtered} />

      {/* LIST */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 14px 16px" }}>
        <div style={{ fontSize:11, fontWeight:500, color:"rgba(160,160,200,0.45)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>Near you</div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", color:"rgba(180,175,210,0.4)", fontSize:13, marginTop:40 }}>No one nearby right now. Be the first! ⚡</div>
        ) : (
          filtered.map(u => {
            const s = INTENT_CONFIG[u.intent] || INTENT_CONFIG["Coffee"];
            return (
              <div key={u.id} style={{ background:s.card, border:`1px solid ${s.border}`, borderRadius:18, padding:"12px 14px", marginBottom:9, cursor:"pointer", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", gap:12, transition:"transform 0.18s", boxShadow:`0 4px 20px ${s.shadow}` }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform="none"}
              >
                <div style={{ position:"absolute", right:12, top:8, fontSize:32, opacity:0.06, pointerEvents:"none" }}>{s.emoji}</div>
                <div style={{ position:"relative", width:44, height:44, flexShrink:0 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:s.activeBg, border:`1px solid ${s.activeBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:s.color }}>{u.initials}</div>
                  <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:"#34D399", border:"2px solid #0C0C14" }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:500, fontSize:14, color:"#EEEAF8" }}>{u.name}</div>
                  <div style={{ fontSize:11, color:"rgba(180,175,210,0.5)", marginTop:2 }}>📍 {u.distance} · {u.time}</div>
                </div>
                <div style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background:s.tag.bg, color:s.tag.color, border:`1px solid ${s.tag.border}`, whiteSpace:"nowrap", flexShrink:0 }}>{s.emoji} {u.intent}</div>
              </div>
            );
          })
        )}
      </div>

      {/* FLOATING LIVE BUTTON */}
      {!isLive && (
        <div onClick={onOpenIntentFlow} style={{ position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(90deg,#6D28D9,#4F46E5)", color:"#F0EEF8", fontSize:14, fontWeight:700, padding:"13px 28px", borderRadius:40, cursor:"pointer", boxShadow:"0 4px 24px rgba(109,40,217,0.5)", zIndex:50, whiteSpace:"nowrap", border:"1px solid rgba(167,139,250,0.3)" }}>⚡ I'm down for...</div>
      )}

      <BottomNav active="nearby" onFeed={onGoFeed} onNearby={() => {}} onChat={onGoChat} onProfile={onGoProfile} />
    </div>
  );
}