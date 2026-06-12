export default function Match() {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ fontSize: "40px" }}>IT’S A MATCH 🚀</h1>

      <p style={{ marginTop: "10px", color: "#666" }}>
        You and Adam are connected
      </p>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Start Chat
        </button>

        <button
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Keep Swiping
        </button>
      </div>
    </div>
  );
}