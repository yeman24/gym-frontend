import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { sendChatMessage } from "../../api/client";

const welcomeMessage = { role: "assistant", content: "Hi, I’m the IronHouse assistant. Ask me about memberships, classes, coaches, or coming in for a tour." };
const quickQuestions = ["Which membership is right for me?", "What classes are available?", "Where are you located?"];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const submit = async (event, preset) => {
    event?.preventDefault();
    const content = (preset ?? input).trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages); setInput(""); setLoading(true); setError("");
    try { const answer = await sendChatMessage(nextMessages); setMessages((current) => [...current, answer]); }
    catch (requestError) { setError(requestError?.response?.data?.message || "The assistant is unavailable right now. Please email hello@ironhouse.fit."); }
    finally { setLoading(false); }
  };

  return <>
    {open && <section aria-label="IronHouse AI assistant" style={{ position: "fixed", zIndex: 20, right: 24, bottom: 88, width: "min(390px, calc(100vw - 32px))", height: "min(590px, calc(100vh - 120px))", display: "flex", flexDirection: "column", overflow: "hidden", color: "#252521", background: "#fffdf8", border: "1px solid #e3d9ca", borderRadius: 18, boxShadow: "0 18px 50px rgba(54,39,22,.22)" }}>
      <header style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "17px 18px 16px", color: "#252521", background: "#fffdf8", borderBottom: "1px solid #e3d9ca" }}><span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #e9542c 0 38%, #d8f45b 38% 100%)" }} /><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ display: "grid", placeItems: "center", width: 34, height: 34, color: "#fffdf8", background: "#e9542c", border: "3px solid #f7c8b7", borderRadius: "50%" }}><Sparkles size={15} /></span><div><strong style={{ display: "block", font: "600 15px Space Grotesk", letterSpacing: "-.02em" }}>IronHouse assistant</strong><small style={{ color: "#8b8276", font: "10px DM Mono", letterSpacing: ".08em" }}>YOUR DIGITAL FRONT DESK</small></div></div><button onClick={() => setOpen(false)} aria-label="Close chat" style={{ display: "grid", placeItems: "center", width: 30, height: 30, color: "#6d665d", background: "#f3eee5", border: 0, borderRadius: "50%" }}><X size={16} /></button></header>
      <div style={{ flex: 1, overflowY: "auto", padding: "17px 16px 10px", background: "#fbf8f2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, color: "#8b8276", font: "10px DM Mono", letterSpacing: ".07em", textTransform: "uppercase" }}><span style={{ width: 7, height: 7, background: "#76a83c", borderRadius: "50%" }} /> Online · typically replies quickly</div>
        {messages.map((message, index) => <div key={`${message.role}-${index}`} style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start", margin: "10px 0" }}><div style={{ maxWidth: "86%", padding: "11px 13px", color: message.role === "user" ? "#252521" : "#4f493f", background: message.role === "user" ? "#d8f45b" : "#fffdf8", border: message.role === "user" ? "1px solid #c5df51" : "1px solid #e3d9ca", borderRadius: message.role === "user" ? "14px 14px 3px 14px" : "3px 14px 14px 14px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{message.content}</div></div>)}
        {messages.length === 1 && <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 7, marginTop: 16 }}>{quickQuestions.map((question) => <button key={question} onClick={() => submit(null, question)} style={{ padding: "8px 11px", color: "#c84b2a", background: "#fffdf8", border: "1px solid #efb6a7", borderRadius: 999, fontSize: 11, textAlign: "left" }}>{question}</button>)}</div>}
        {loading && <div style={{ display: "flex", alignItems: "flex-end", gap: 8, margin: "14px 0 11px" }}><span style={{ display: "grid", placeItems: "center", width: 25, height: 25, color: "#fffdf8", background: "#e9542c", borderRadius: "50%" }}><Bot size={13} /></span><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", color: "#71695f", background: "#fffdf8", border: "1px solid #e3d9ca", borderRadius: "3px 13px 13px 13px", fontSize: 11 }}><span>Writing a concise reply</span><span style={{ display: "inline-flex", gap: 3 }}><i style={{ width: 4, height: 4, background: "#e9542c", borderRadius: "50%" }} /><i style={{ width: 4, height: 4, background: "#e9542c", borderRadius: "50%" }} /><i style={{ width: 4, height: 4, background: "#e9542c", borderRadius: "50%" }} /></span></div></div>}
        {error && <div style={{ marginTop: 10, padding: "9px 10px", color: "#bf351f", background: "#fbe4da", border: "1px solid #efb6a7", borderRadius: 8, fontSize: 11, lineHeight: 1.4 }}>{error}</div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, padding: 12, background: "#fffdf8", borderTop: "1px solid #e3d9ca" }}><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) submit(event); }} disabled={loading} placeholder="Ask IronHouse…" aria-label="Chat message" style={{ minWidth: 0, flex: 1, padding: "11px 12px", color: "#252521", background: "#fbf8f2", border: "1px solid #d9cdbd", borderRadius: 9, outline: 0, fontSize: 13 }} /><button type="submit" disabled={loading || !input.trim()} aria-label="Send message" style={{ display: "grid", placeItems: "center", width: 40, color: "#252521", background: "#e9542c", border: 0, borderRadius: 9 }}><Send size={16} /></button></form>
    </section>}
    <button onClick={() => setOpen((value) => !value)} aria-label={open ? "Close AI chat" : "Open AI chat"} style={{ position: "fixed", zIndex: 21, right: 24, bottom: 24, display: "flex", alignItems: "center", gap: 9, minHeight: 52, padding: "0 17px", color: "#252521", background: "#d8f45b", border: "3px solid #fffdf8", borderRadius: 999, boxShadow: "0 8px 25px rgba(54,39,22,.25), 0 0 0 1px #b4cd4c", fontSize: 12, fontWeight: 700 }}>{open ? <ChevronDown size={17} /> : <MessageCircle size={17} />} {open ? "Close chat" : "Ask IronHouse"}<span style={{ display: "grid", placeItems: "center", width: 22, height: 22, color: "#fffdf8", background: "#e9542c", borderRadius: "50%" }}><Bot size={13} /></span></button>
  </>;
}
