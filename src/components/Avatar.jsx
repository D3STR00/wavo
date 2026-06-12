const avatarColors = {
  KS: "linear-gradient(135deg, #6D28D9, #A78BFA)",
  MJ: "linear-gradient(135deg, #065F46, #34D399)",
  AL: "linear-gradient(135deg, #9D174D, #F9A8D4)",
  RN: "linear-gradient(135deg, #1E3A5F, #60A5FA)",
  TW: "linear-gradient(135deg, #7C2D12, #FB923C)",
};

const avatarTextColors = {
  KS: "#EDE9FE", MJ: "#D1FAE5", AL: "#FCE7F3", RN: "#DBEAFE", TW: "#FEF3C7",
};

export default function Avatar({ initials, size = 52, showDot = false, online = true }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: avatarColors[initials] || "linear-gradient(135deg,#6D28D9,#A78BFA)",
        border: "2.5px solid #0C0C14",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: size * 0.27,
        color: avatarTextColors[initials] || "#EDE9FE",
      }}>{initials}</div>
      {showDot && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: 10, height: 10, borderRadius: "50%",
          background: online ? "#34D399" : "#FBBF24",
          border: "2px solid #0C0C14",
        }} />
      )}
    </div>
  );
}
