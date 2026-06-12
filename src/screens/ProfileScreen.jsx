import { useState } from "react";
import BottomNav from "../components/BottomNav";

const INTENT_HISTORY = [
  { intent: "Coffee", emoji: "☕", count: 12, color: "#FCD34D" },
  { intent: "Walk", emoji: "🚶", count: 7, color: "#6EE7B7" },
  { intent: "Talk", emoji: "💬", count: 5, color: "#C4B5FD" },
];

const BADGES = [
  { label: "Phone verified", color: "#34D399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)" },
  { label: "ID verified", color: "#A78BFA", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)" },
];

export default function ProfileScreen({ onGoFeed, onGoNearby, onGoChat }) {
  const [editing, setEditing] = useState(false);
  const [tagline, setTagline] = useState("Usually around Marsa. Coffee first, everything else after.");

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#0C0C14", color:"#F0EEF8", minHeight:"100vh", maxWidth:390, margin:"0 auto", display:"flex", flexDirection:"column" }}>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#1A0A2E 0%,#0D1A3A 50%,#0A1A1A 100%)", padding:"44px 20px 24px", position:"relative", overflow:"hidden", flexShrink:0 }}>
        <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", top:-60, right:-40, background:"radial-gradient(circle,rgba(100,60,220,0.3) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", bottom:-30, left:20, background:"radial-gradient(circle,rgba(20,180,160,0.2) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, position:"relative" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"rgba(240,238,248,0.5)" }}>Profile</span>
          <div onClick={() => setEditing(!editing)} style={{ fontSize:12, fontWeight:500, padding:"5px 14px", borderRadius:20, cursor:"pointer", background: editing ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.06)", border:`1px solid ${editing ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}`, color: editing ? "#C4B5FD" : "rgba(200,200,220,0.6)", transition:"all 0.2s" }}>{editing ? "Done" : "Edit"}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16, position:"relative" }}>
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#6D28D9,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, color:"#EDE9FE", border:"2px solid rgba(167,139,250,0.3)" }}>YO</div>
            <div style={{ position:"absolute", bottom:2, right:2, width:14, height:14, borderRadius:"50%", background:"#34D399", border:"2.5px solid #0C0C14" }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#F0EEF8" }}>You</span>
              <div style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:"rgba(52,211,153,0.15)", color:"#34D399", border:"1px solid rgba(52,211,153,0.3)" }}>✓ Verified</div>
            </div>
            <div style={{ fontSize:12, color:"rgba(180,175,210,0.5)" }}>Member since May 2025</div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 16px" }}>

        {/* ABOUT */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:500, color:"rgba(160,160,200,0.4)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>About</div>
          {editing ? (
            <>
              <textarea value={tagline} onChange={e => setTagline(e.target.value)} maxLength={80} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(167,139,250,0.3)", borderRadius:14, padding:"12px 14px", color:"#F0EEF8", fontSize:13, fontFamily:"'DM Sans',sans-serif", resize:"none", outline:"none", lineHeight:1.5 }} rows={3} />
              <div style={{ fontSize:10, color:"rgba(160,160,200,0.3)", textAlign:"right", marginTop:4 }}>{tagline.length}/80</div>
            </>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"12px 14px", fontSize:13, color:"rgba(220,216,240,0.75)", lineHeight:1.6 }}>{tagline}</div>
          )}
        </div>

        {/* TRUST */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:500, color:"rgba(160,160,200,0.4)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Trust</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {BADGES.map(b => (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:10, background:b.bg, border:`1px solid ${b.border}`, borderRadius:12, padding:"10px 14px" }}>
                <span style={{ fontSize:13, color:b.color, fontWeight:700 }}>✓</span>
                <span style={{ fontSize:13, color:b.color, fontWeight:500 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INTENT PATTERN */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:500, color:"rgba(160,160,200,0.4)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Usually down for</div>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"14px", display:"flex", flexDirection:"column", gap:10 }}>
            {INTENT_HISTORY.map(item => (
              <div key={item.intent} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:16, width:24, textAlign:"center" }}>{item.emoji}</span>
                <span style={{ fontSize:13, color:"rgba(220,216,240,0.7)", flex:1 }}>{item.intent}</span>
                <div style={{ flex:2, height:4, borderRadius:4, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:4, width:`${(item.count/12)*100}%`, background:item.color, opacity:0.7 }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize:11, color:"rgba(160,160,200,0.3)", marginTop:2 }}>Based on your last 24 meetups</div>
          </div>
        </div>

        {/* ZONE */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, fontWeight:500, color:"rgba(160,160,200,0.4)", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Zone</div>
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:16 }}>📍</span>
            <div>
              <div style={{ fontSize:13, color:"rgba(220,216,240,0.75)", fontWeight:500 }}>Marsa, Tunis</div>
              <div style={{ fontSize:11, color:"rgba(160,160,200,0.4)", marginTop:2 }}>Active zone</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="profile" onFeed={onGoFeed} onNearby={onGoNearby} onChat={onGoChat} onProfile={() => {}} />
    </div>
  );
}
