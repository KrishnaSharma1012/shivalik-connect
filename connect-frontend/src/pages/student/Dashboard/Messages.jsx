import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import CrownIcon from "../../../components/common/CrownIcon";

/* ── Icons ── */
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ── Mock Data ── */
const CONVERSATIONS = [
  { id: 1, name: "Rahul Sharma", company: "Google · SWE", lastMessage: "I can guide you for DSA prep.", time: "5m", unread: 2, online: true, avatar: "R", color: "#7C5CFC", membershipTaken: true },
  { id: 2, name: "Ananya Iyer", company: "Amazon · PM", lastMessage: "Join my React workshop this Saturday!", time: "1h", unread: 1, online: true, avatar: "A", color: "#06B6D4", membershipTaken: true },
  { id: 3, name: "Karan Bhatia", company: "Microsoft · ML", lastMessage: "Happy to help with your resume.", time: "3h", unread: 0, online: false, avatar: "K", color: "#10B981", membershipTaken: false },
  { id: 4, name: "Meera Pillai", company: "Flipkart · Backend", lastMessage: "Let me know if you have questions.", time: "1d", unread: 0, online: false, avatar: "M", color: "#F59E0B", membershipTaken: true },
];

const INITIAL_MESSAGES = {
  1: [
    { sender: "them", text: "Hey! What are you preparing for?", time: "10:00 AM" },
    { sender: "me", text: "Hi Rahul! Targeting product companies for SDE roles.", time: "10:05 AM" },
    { sender: "them", text: "I can guide you for DSA prep.", time: "10:10 AM" },
  ],
  2: [
    { sender: "them", text: "Hi! I'm hosting a React workshop this weekend.", time: "Yesterday" },
    { sender: "me", text: "That sounds great! What topics will you cover?", time: "Yesterday" },
    { sender: "them", text: "Join my React workshop this Saturday!", time: "Yesterday" },
  ],
  3: [
    { sender: "them", text: "I noticed you're interested in ML roles.", time: "3h ago" },
    { sender: "them", text: "Happy to help with your resume.", time: "3h ago" },
  ],
  4: [
    { sender: "them", text: "Let me know if you have questions.", time: "1d ago" },
  ],
};

/* ── Conversation Item ── */
function ConversationItem({ chat, active, onClick }) {
  return (
    <div
      onClick={() => onClick(chat)}
      style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)", background: active ? "rgba(124,92,252,0.08)" : "transparent", borderLeft: active ? "2px solid var(--purple)" : "2px solid transparent", transition: "all 0.15s" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: `${chat.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: chat.color, fontWeight: 700, fontSize: 14, fontFamily: "Plus Jakarta Sans" }}>
          {chat.avatar}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {chat.name}
            {chat.membershipTaken && (
              <span style={{ display: "inline-flex", alignItems: "center", color: "#FFB830" }}>
                <CrownIcon size={11} strokeWidth={2.2} />
              </span>
            )}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>{chat.time}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 2, fontWeight: 500 }}>{chat.company}</p>
        <p style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
          {chat.lastMessage}
        </p>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function StudentMessages() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    setMessages(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), { sender: "me", text: input, time: "Just now" }] }));
    setInput("");
  };

  const currentMsgs = messages[activeChat?.id] || [];
  const membershipChats = CONVERSATIONS.filter(c => c.membershipTaken);
  const regularChats = CONVERSATIONS.filter(c => !c.membershipTaken);

  return (
    <MainLayout>
      <div style={{ display: "flex", height: "calc(100vh - 108px)", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>

        {/* LEFT */}
        <div style={{ width: 290, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Header */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
              <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Messages</h2>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-3)" }}>{CONVERSATIONS.length} alumni conversations</p>
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {membershipChats.length > 0 && (
              <>
                <div style={{ padding: "8px 14px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FFB830" }}>
                  Membership Alumni
                </div>
                {membershipChats.map(chat => (
                  <ConversationItem key={chat.id} chat={chat} active={activeChat?.id === chat.id} onClick={setActiveChat} />
                ))}
              </>
            )}

            {regularChats.length > 0 && (
              <>
                <div style={{ padding: "10px 14px 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Other Alumni
                </div>
                {regularChats.map(chat => (
                  <ConversationItem key={chat.id} chat={chat} active={activeChat?.id === chat.id} onClick={setActiveChat} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        {!activeChat ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <p style={{ color: "var(--text-3)", fontSize: 14 }}>Select a conversation</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* Chat header */}
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${activeChat.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: activeChat.color, fontWeight: 700, fontFamily: "Plus Jakarta Sans" }}>
                  {activeChat.avatar}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--text)", margin: 0 }}>{activeChat.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>{activeChat.company}</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {currentMsgs.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.sender === "me" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "68%", padding: "10px 14px", borderRadius: msg.sender === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.sender === "me" ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)" : "var(--bg-4)", border: msg.sender === "me" ? "none" : "1px solid var(--border)", color: msg.sender === "me" ? "white" : "var(--text)", fontSize: 14, lineHeight: 1.5 }}>
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    <p style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: msg.sender === "me" ? "right" : "left", margin: "4px 0 0" }}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: "10px 16px 12px", borderTop: "1px solid var(--border)" }}>

              {/* Input + Send */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Type a message…"
                  style={{ flex: 1, padding: "11px 16px", background: "var(--bg-4)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "DM Sans", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--purple)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button onClick={handleSend} disabled={!input.trim()} style={{ width: 42, height: 42, borderRadius: 12, background: input.trim() ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)" : "var(--bg-4)", border: input.trim() ? "none" : "1px solid var(--border)", color: input.trim() ? "white" : "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", flexShrink: 0, boxShadow: input.trim() ? "0 4px 14px rgba(124,92,252,0.3)" : "none" }}>
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}