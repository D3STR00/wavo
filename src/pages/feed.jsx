import { useState } from "react";

export default function Feed() {
  const posts = [
    { id: 1, user: "Adam", activity: "Looking for coffee buddy", tag: "social" },
    { id: 2, user: "Sarah", activity: "Gym partner session", tag: "fitness" },
    { id: 3, user: "Youssef", activity: "Night drive vibe check", tag: "vibe" },
  ];

  const [index, setIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [offsetX, setOffsetX] = useState(0);

  const current = posts[index];

  function next() {
    setOffsetX(0);
    setStartX(null);
    setIndex((p) => (p + 1) % posts.length);
  }

  function onStart(e) {
    setStartX(e.clientX || e.touches[0].clientX);
  }

  function onMove(e) {
    if (startX === null) return;
    const x = e.clientX || e.touches[0].clientX;
    setOffsetX(x - startX);
  }

  function onEnd() {
    if (offsetX > 120) {
      alert("CONNECT 🚀");
      next();
    } else if (offsetX < -120) {
      next();
    } else {
      setOffsetX(0);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Swipe Feed</h2>

      <div
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        style={{
          background: "white",
          border: "1px solid #eee",
          padding: "22px",
          borderRadius: "18px",
          marginTop: "20px",
          transform: `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`,
          transition: startX ? "none" : "0.2s ease",
          userSelect: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h3>{current.user}</h3>
        <p>{current.activity}</p>

        <span
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "20px",
            background: "#f2f2f2",
          }}
        >
          {current.tag}
        </span>
      </div>

      <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
        Swipe right = connect | left = skip
      </p>
    </div>
  );
}