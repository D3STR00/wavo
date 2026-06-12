import { useState } from "react";
import BottomNav from "../components/BottomNav";
import Avatar from "../components/Avatar";
import { MOCK_USERS, PRESENCE, INTENT_CONFIG } from "../data/mockUsers";

const INTENTS = ["☕ Coffee", "🚶 Walk", "💬 Talk", "🏋️ Gym", "+ More"];

function FeedCard({ card, onWave, waved }) {
  const c = INTENT_CONFIG[card.intent];
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background:c.card, border:`1px solid ${c.border}`, borderRadius:20,
      padding:"14px 15px", marginBottom:11, cursor:"pointer",
      position:"relative", overflow:"hidden", transition:"transform 0.18s,box-shadow 0.18s",
      transform: hovered ? "translateY(-2px)" : "none",
      boxShadow: hovered ? `0 8px 32px ${c.hoverShadow}` : `0 4px 24px ${c.shadow}`,
    }}>
      <div style={{ position:"absolute", right:14, top:10, fontSize:38, opacity:0.07, pointerEvents:"none" }}>{c.emoji}</div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
        <Avatar initials={card.initials} size={40} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:500, fontSize:14, color:"#EEEAF8" }}>{card.name}</div>
          <div style={{ fontSize:11, color:"rgba(180,175,210,0.5)", marginTop:1 }}>📍 {card.distance} · {card.time}</div>
        </div>
        <div style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:20, background:c.tag.bg, color:c.tag.color, border:`1px solid ${c.tag.border}` }}>{c.emoji} {card.intent}</div>
      </div>
      <div style={{ fontSize:13, color:"rgba(220,216,240,0.75)", lineHeight:1.55, marginBottom:10 }}>{card.message}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, color:"rgba(180,175,210,0.45)" }}>🚶 {card.walk}</span>
        {card.matched || waved ? (
          <button style={{ padding:"6px 16px", borderRadius:20, fontSize:12, fontWeight:600, background:"linear-gradient(90deg,#065F46,#34D399)", color:"#F0FFF4", border:"none", cursor:"default" }}>✓ Matched</button>
        ) : (
          <button onClick={() => onWave(card.id)} style={{ padding:"6px 16px", borderRadius:20, fontSize:12, fontWeight:600, background:c.btn, color:c.btnColor, border:"none", cursor:"pointer" }}>👋 Wave</button>
        )}
      </div>
    </div>
  );
}

export default function FeedScreen({ userState, wavedIds, sendWave, formatTime, goOffline, onOpenIntentFlow, onGoNearby, onGoChat, onGoProfile }) {
  const [activeIntent, setActiveIntent] = useState(0);
  const isLive = userState.status === "live";
  const liveConfig = isLive ? INTENT_CONFIG[userState.intent] : null;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#0C0C14", color:"#F0EEF8", minHeight:"100vh", maxWidth:390, margin:"0 auto", display:"flex", flexDirection:"column" }}>

      {/* BANNER */}
      <div style={{ background:"linear-gradient(135deg,#1A0A2E 0%,#0D1A3A 50%,#0A1A1A 100%)", padding:"36px 20px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", top:-60, right:-40, background:"radial-gradient(circle,rgba(100,60,220,0.35) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", bottom:-30, left:30, background:"radial-gradient(circle,rgba(20,180,160,0.25) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, position:"relative" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, letterSpacing:-1, background:"linear-gradient(90deg,#A78BFA,#34D399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>wavo</span>
          <span style={{ background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.4)", color:"#34D399", fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>● 24 nearby</span>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16 }}>🔔</div>
        </div>
        <div style={{ fontSize:11, fontWeight:500, color:"rgba(160,160,200,0.7)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>What do you want right now?</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {INTENTS.map((intent, i) => (
            <div key={intent} onClick={() => setActiveIntent(i)} style={{ padding:"8px 16px", borderRadius:40, fontSize:13, fontWeight:500, cursor:"pointer", background: activeIntent===i ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)", border:`1px solid ${activeIntent===i ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)"}`, color: activeIntent===i ? "#C4B5FD" : "rgba(200,200,220,0.7)", transition:"all 0.2s" }}>{intent}</div>
          ))}
        </div>
      </div>

      {/* LIVE BANNER */}
      {isLive && liveConfig && (
        <div style={{ margin:"8px 16px 0", background:`linear-gradient(90deg,${liveConfig.activeBg},rgba(52,211,153,0.1))`, border:`1px solid ${liveConfig.activeBorder}`, borderRadius:16, padding:"11px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:liveConfig.color, animation:"mpulse 1s infinite" }} />
          <div style={{ flex:1, fontSize:12, color:liveConfig.color, fontWeight:600 }}>{liveConfig.emoji} You're live — {userState.intent} · {formatTime(userState.timeLeft)}</div>
          <div onClick={goOffline} style={{ fontSize:11, color:"rgba(180,175,210,0.4)", cursor:"pointer", padding:"2px 8px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)" }}>End</div>
        </div>
      )}

      {/* PRESENCE */}
      <div style={{ padding:"16px 20px 8px" }}>
        <div style={{ fontSize:11, fontWeight:500, color:"rgba(160,160,200,0.5)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>Active now</div>
        <div style={{ display:"flex", alignItems:"center" }}>
          {PRESENCE.map((p, i) => (
            <div key={p.initials} style={{ marginLeft: i===0 ? 0 : -10 }}>
              <Avatar initials={p.initials} size={52} showDot online={p.online} />
            </div>
          ))}
          <div style={{ width:52, height:52, borderRadius:"50%", marginLeft:-10, background:"rgba(255,255,255,0.07)", border:"2px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"rgba(200,200,220,0.7)" }}>+18</div>
        </div>
      </div>

      {/* MATCH BANNER */}
      <div onClick={onGoChat} style={{ margin:"4px 16px 0", background:"linear-gradient(90deg,rgba(167,139,250,0.18),rgba(52,211,153,0.18))", border:"1px solid rgba(167,139,250,0.35)", borderRadius:16, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:"#A78BFA", animation:"mpulse 1.4s infinite" }} />
        <div style={{ flex:1, fontSize:12, color:"#C4B5FD", fontWeight:500 }}>KS matched your coffee intent — say hi 👋</div>
        <span style={{ color:"rgba(196,181,253,0.55)" }}>→</span>
      </div>

      {/* FEED */}
      <div style={{ padding:"14px 16px 16px", flex:1, overflowY:"auto" }}>
        <div style={{ fontSize:11, fontWeight:500, color:"rgba(160,160,200,0.45)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>Near you</div>
        {MOCK_USERS.map(card => (
          <FeedCard key={card.id} card={card} onWave={sendWave} waved={wavedIds.includes(card.id)} />
        ))}
      </div>

      {/* FLOATING LIVE BUTTON */}
      {!isLive && (
        <div onClick={onOpenIntentFlow} style={{
          position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          background:"linear-gradient(90deg,#6D28D9,#4F46E5)",
          color:"#F0EEF8", fontSize:14, fontWeight:700,
          padding:"13px 28px", borderRadius:40, cursor:"pointer",
          boxShadow:"0 4px 24px rgba(109,40,217,0.5)",
          zIndex:50, whiteSpace:"nowrap",
          border:"1px solid rgba(167,139,250,0.3)",
        }}>⚡ I'm down for...</div>
      )}

      <BottomNav active="feed" onFeed={() => {}} onNearby={onGoNearby} onChat={onGoChat} onProfile={onGoProfile} />
    </div>
  );
}
