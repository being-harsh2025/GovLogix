"use client";

import { useEffect, useState, useRef } from "react";

type LSP = {
  id: string;
  companyName: string;
  city: string;
};

type Message = {
  id: string;
  fromLspId: string;
  toLspId: string;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  const [lsps, setLsps] = useState<LSP[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch LSPs to simulate login/chat participants
  useEffect(() => {
    fetch("/api/lsp/register")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLsps(data);
      });
  }, []);

  // Fetch messages between currentUser and selectedUser
  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages?from=${currentUser}&to=${selectedUser}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // basic polling
    return () => clearInterval(interval);
  }, [currentUser, selectedUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !currentUser || !selectedUser) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromLspId: currentUser,
          toLspId: selectedUser,
          content: draft,
        }),
      });

      if (res.ok) {
        setDraft("");
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <div className="section" style={{ minHeight: "calc(100vh - 64px - 80px)", display: "flex", flexDirection: "column" }}>
      <div className="container-page" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>LSP Communications</h1>
          <p>Real-time messaging between logistics providers.</p>
        </div>

        {/* Demo "Login" selectors */}
        <div className="card" style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Log in as (You):</label>
            <select className="form-select" value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
              <option value="">-- Select an LSP --</option>
              {lsps.map((l) => (
                <option key={l.id} value={l.id}>{l.companyName} ({l.city})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Chat with:</label>
            <select className="form-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">-- Select an LSP --</option>
              {lsps.filter(l => l.id !== currentUser).map((l) => (
                <option key={l.id} value={l.id}>{l.companyName} ({l.city})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat UI */}
        <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 400, overflow: "hidden" }}>
          {!currentUser || !selectedUser ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>
              Select both yourself and a partner to start chatting.
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                <h3 style={{ fontSize: "1.1rem" }}>
                  {lsps.find(l => l.id === selectedUser)?.companyName}
                </h3>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {loading && messages.length === 0 && <div style={{ textAlign: "center", color: "var(--text-3)" }}>Loading messages...</div>}
                {messages.length === 0 && !loading && (
                  <div style={{ textAlign: "center", color: "var(--text-3)", marginTop: "2rem" }}>No messages yet. Send one to start!</div>
                )}
                {messages.map((msg) => {
                  const isMine = msg.fromLspId === currentUser;
                  return (
                    <div key={msg.id} className={isMine ? "bubble-sent" : "bubble-received"}>
                      <div style={{ marginBottom: "0.2rem" }}>{msg.content}</div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.7, textAlign: "right", marginTop: "0.2rem" }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} style={{ padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.02)" }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
