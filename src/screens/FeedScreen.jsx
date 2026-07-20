import { IntentCard } from "../components/wavo/intent-card";
import { GoLiveControl as GoLive } from "../components/wavo/go-live";
import { useState } from "react";
import BottomNav from "../components/wavo/bottom-nav";
import Avatar from "../components/Avatar";
import { PRESENCE, INTENT_CONFIG } from "../data/mockUsers";
import { useIntentFeed } from "../hooks/useIntentFeed";
import { sendWaveToUser } from "../hooks/useWaveActions";
import { WavoAlert } from "../components/wavo/wavo-alert";
import { MatchModal } from "../components/wavo/match-modal";

const INTENTS = ["☕ Coffee", "🚶 Walk", "💬 Talk", "🏋️ Gym", "+ More"];

export default function FeedScreen({ userState, formatTime, goOffline, onOpenIntentFlow, onGoNearby, onGoChat, onGoProfile }) {
  const [activeIntent, setActiveIntent] = useState(0);
  const { intents, loading } = useIntentFeed();
  const [wavedIds, setWavedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [incomingWave, setIncomingWave] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const isLive = userState.status === "live";
  const liveConfig = isLive ? INTENT_CONFIG[userState.intent] : null;

  const handleWave = async (card) => {
  setWavedIds(prev => [...prev, card.id]);

  const result = await sendWaveToUser(
    card.userId,
    card.intent.toLowerCase()
  );

  if (result?.matched) {
    setMatchedIds(prev => [...prev, card.id]);

    setMatchInfo({
      matchId: result.matchId || card.id,
      name: card.name,
      intent: card.intent.toLowerCase(),
    });
  }
};

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#0C0C14", color:"#F0EEF8", minHeight:"100vh", maxWidth:390, margin:"0 auto", display:"flex", flexDirection:"column" }}>

      {/* BANNER */}
      <div style={{ background:"linear-gradient(135deg,#1A0A2E 0%,#0D1A3A 50%,#0A1A1A 100%)", padding:"36px 20px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", top:-60, right:-40, background:"radial-gradient(circle,rgba(100,60,220,0.35) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", bottom:-30, left:30, background:"radial-gradient(circle,rgba(20,180,160,0.25) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, position:"relative" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, letterSpacing:-1, background:"linear-gradient(90deg,#A78BFA,#34D399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>wavo</span>
          <span style={{ background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.4)", color:"#34D399", fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20 }}>● {intents.length} active</span>
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

      {/* FEED */}
      <div style={{ padding:"14px 16px 16px", flex:1, overflowY:"auto" }}>
        <div style={{ fontSize:11, fontWeight:500, color:"rgba(160,160,200,0.45)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>Near you</div>
        {loading ? (
          <div style={{ textAlign:"center", color:"rgba(180,175,210,0.4)", fontSize:13, marginTop:40 }}>Loading intents...</div>
        ) : intents.length === 0 ? (
          <div style={{ textAlign:"center", color:"rgba(180,175,210,0.4)", fontSize:13, marginTop:40 }}>No active intents nearby. Be the first! ⚡</div>
        ) : (
          intents.map(card => (
            <IntentCard
              key={card.id}
              item={{
                userId: card.userId,
                name: card.name,
                intent: card.intent.toLowerCase(),
                message: card.message,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 300000).toISOString(),
                state: matchedIds.includes(card.id)
                  ? "matched"
                  : "normal",
                waveState: wavedIds.includes(card.id)
                  ? "sent"
                  : "idle",
              }}
              onWave={() => handleWave(card)}
            />
          ))
        )}
      </div>

      {/* FLOATING LIVE BUTTON */}
      {!isLive && (
        <GoLive onClick={onOpenIntentFlow} />
      )}

      <WavoAlert
  wave={incomingWave}
  onWaveBack={() => setIncomingWave(null)}
  onPass={() => setIncomingWave(null)}
/>

<MatchModal
  match={matchInfo}
  onClose={() => setMatchInfo(null)}
/>

<BottomNav active="feed" onFeed={() => {}} onNearby={onGoNearby} onChat={onGoChat} onProfile={onGoProfile} />
    </div>
  );
}