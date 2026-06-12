import { useState } from "react";
import { INTENT_CONFIG } from "../data/mockUsers";

const INTENTS = ["Coffee", "Walk", "Talk", "Gym"];

export default function IntentFlow({ onClose, onGoLive }) {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [message, setMessage] = useState("");

  const selected = selectedIntent ? INTENT_CONFIG[selectedIntent] : null;

  const handleGoLive = () => {
    onGoLive({ intent: selectedIntent, message, emoji: selected.emoji, color: selected.color });
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeOverlay { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:100, animation:"fadeOverlay 0.2s ease" }} />

      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:390, zIndex:101,
        background:"#13121E", borderTop:"1px solid rgba(255,255,255,0.08)",
        borderRadius:"24px 24px 0 0", padding:"20px 20px 48px",
        animation:"slideUp 0.25s ease",
      }}>
        <div style={{ width:36, height:4, borderRadius:4, background:"rgba(255,255,255,0.15)", margin:"0 auto 24px" }} />

        {step === 1 && (
          <>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"#F0EEF8", marginBottom:6 }}>What are you down for?</div>
            <div style={{ fontSize:13, color:"rgba(180,175,210,0.5)", marginBottom:24 }}>You'll be live for 5 minutes.</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
              {INTENTS.map(key => {
                const c = INTENT_CONFIG[key];
                return (
                  <div key={key} onClick={() => setSelectedIntent(key)} style={{
                    padding:"18px 14px", borderRadius:16, cursor:"pointer", transition:"all 0.18s",
                    background: selectedIntent === key ? c.activeBg : `${c.color}18`,
                    border: `1px solid ${selectedIntent === key ? c.activeBorder : c.border}`,
                    display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                    transform: selectedIntent === key ? "scale(1.03)" : "scale(1)",
                  }}>
                    <span style={{ fontSize:28 }}>{c.emoji}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:c.color }}>{key}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => selectedIntent && setStep(2)} style={{
              width:"100%", padding:"14px", borderRadius:16, border:"none",
              fontSize:15, fontWeight:600, cursor: selectedIntent ? "pointer" : "not-allowed",
              background: selectedIntent ? "linear-gradient(90deg,#6D28D9,#4F46E5)" : "rgba(255,255,255,0.06)",
              color: selectedIntent ? "#F0EEF8" : "rgba(200,200,220,0.3)", transition:"all 0.2s",
            }}>Continue →</button>
          </>
        )}

        {step === 2 && selected && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:selected.activeBg, border:`1px solid ${selected.activeBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{selected.emoji}</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"#F0EEF8" }}>{selectedIntent}</div>
                <div style={{ fontSize:12, color:"rgba(180,175,210,0.5)" }}>Add a note — or skip</div>
              </div>
            </div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={60}
              placeholder={`e.g. "Near Marsa café, quick one"`}
              style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"12px 14px", color:"#F0EEF8", fontSize:13, fontFamily:"'DM Sans',sans-serif", resize:"none", outline:"none", lineHeight:1.5, marginBottom:6 }}
              rows={2}
            />
            <div style={{ fontSize:10, color:"rgba(160,160,200,0.3)", textAlign:"right", marginBottom:20 }}>{message.length}/60</div>
            <button onClick={handleGoLive} style={{ width:"100%", padding:"14px", borderRadius:16, border:"none", fontSize:15, fontWeight:700, cursor:"pointer", background:"linear-gradient(90deg,#6D28D9,#4F46E5)", color:"#F0EEF8", marginBottom:10 }}>🟢 Go live — 5 min</button>
            <div onClick={() => setStep(1)} style={{ textAlign:"center", fontSize:12, color:"rgba(180,175,210,0.4)", cursor:"pointer", paddingTop:4 }}>← Back</div>
          </>
        )}
      </div>
    </>
  );
}
