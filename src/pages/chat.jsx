import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: "system", text: "You matched with Adam 🚀" },
    { from: "him", text: "yo" },
    { from: "you", text: "hey" },
  ]);

  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;

    setMessages([...messages, { from: "you", text: input }]);
    setInput("");
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat</h2>

      <div
        style={{
          background: "white",
          border: "1px solid #eee",
          padding: "12px",
          height: "300px",
          overflowY: "auto",
          borderRadius: "12px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "8px 0", textAlign: m.from === "you" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                background: m.from === "you" ? "#000" : "#eee",
                color: m.from === "you" ? "#fff" : "#000",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "10px", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
          placeholder="Type message..."
        />

        <button onClick={sendMessage} style={{ padding: "10px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
}