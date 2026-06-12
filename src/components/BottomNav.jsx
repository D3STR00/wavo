export default function BottomNav({ active, onFeed, onNearby, onChat, onProfile }) {
  const tabs = [
    { icon: "🏠", label: "Feed", key: "feed", action: onFeed },
    { icon: "📍", label: "Nearby", key: "nearby", action: onNearby },
    { icon: "💬", label: "Chat", key: "chat", action: onChat },
    { icon: "👤", label: "Profile", key: "profile", action: onProfile },
  ];

  return (
    <div style={{
      padding: "12px 20px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      background: "rgba(12,12,20,0.97)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      flexShrink: 0,
    }}>
      {tabs.map(tab => (
        <div key={tab.key} onClick={tab.action} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          cursor: "pointer",
          opacity: active === tab.key ? 1 : 0.38,
          padding: "4px 12px", borderRadius: 12,
          background: active === tab.key ? "rgba(167,139,250,0.1)" : "transparent",
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 22 }}>{tab.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: 0.5,
            color: active === tab.key ? "#A78BFA" : "rgba(200,200,220,0.45)",
          }}>{tab.label}</span>
        </div>
      ))}
    </div>
  );
}
