import { useState } from "react";
import BottomNav from "../components/BottomNav";

const MESSAGES = [
  { id: 1, from: "them", text: "Hey! You down for coffee?", time: "2:41 PM" },
  { id: 2, from: "me", text: "Yeah for sure, where are you?", time: "2:42 PM" },
  { id: 3, from: "them", text: "Near the café on Marsa main street, the one with the blue sign", time: "2:42 PM" },
  { id: 4, from: "me", text: "On my way, 5 min", time: "2:43 PM" },
];

export default function ChatScreen({ onGoFeed, onGoNearby, onGoProfile }) {
  const [messages, setMessages] = useState(MESSAGES);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: "me", text: input.trim(), time: "now" }]);
    setInput("");
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#0C0C14", color:"#F0EEF8", minHeight:"100vh", maxWidth:390, margin:"0 auto", display:"flex", flexDirection:"column" }}>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#1A0A2E 0%,#0D1A3A 50%,#0A1A1A 100%)", padding:"44px 16px 16px", display:"flex", alignItems:"center", gap:12, position:"relative", overflow:"hidden", flexShrink:0 }}>
        <div style={{ position:"absolute", width:140, height:140, borderRadius:"50%", top:-50, right:-30, background:"radial-gradient(circle,rgba(100,60,220,0.3) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#6D28D9,#A78BFA)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#EDE9FE", flexShrink:0 }}>KS</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"#F0EEF8" }}>Karim S.</div>
          <div style={{ fontSize:11, color:"rgba(52,211,153,0.8)", marginTop:1 }}>☕ Coffee · 0.3 km away</div>
        </div>
        <div style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(52,211,153,0.15)", color:"#34D399", border:"1px solid rgba(52,211,153,0.3)" }}>● Live</div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: msg.from==="me" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth:"75%", padding:"10px 14px", borderRadius: msg.from==="me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.from==="me" ? "linear-gradient(135deg,#6D28D9,#4F46E5)" : "rgba(255,255,255,0.07)",
              border: msg.from==="me" ? "none" : "1px solid rgba(255,255,255,0.08)",
              fontSize:13, color: msg.from==="me" ? "#F0EEF8" : "rgba(220,216,240,0.85)", lineHeight:1.5,
            }}>{msg.text}</div>
            <div style={{ fontSize:10, color:"rgba(160,160,200,0.3)", marginTop:3, paddingLeft:4, paddingRight:4 }}>{msg.time}</div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{ padding:"8px 16px 12px", display:"flex", gap:10, alignItems:"center", background:"rgba(12,12,20,0.97)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Say something..."
          style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"10px 16px", color:"#F0EEF8", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" }}
        />
        <div onClick={send} style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#6D28D9,#4F46E5)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16, flexShrink:0 }}>→</div>
      </div>

      <BottomNav active="chat" onFeed={onGoFeed} onNearby={onGoNearby} onChat={() => {}} onProfile={onGoProfile} />
    </div>
  );
}
