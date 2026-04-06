"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import "./page.css";

const SUGGESTIONS = [
  "How can I improve cash flow this month?",
  "What should I do about overdue invoices?",
  "How do I set up a simple chart of accounts?",
  "What KPIs should I track weekly?",
  "How can I reduce vendor spend without risk?",
];

const AI_INSIGHTS = [
  {
    icon: "📌",
    title: "Receivables",
    text: "If receivables are rising, send reminders at 3/7/14 days and offer card/UPI payment links on invoices.",
  },
  {
    icon: "⚖️",
    title: "Payables",
    text: "Batch vendor payments twice a month to reduce admin time and keep better control of cash outflows.",
  },
  {
    icon: "🧾",
    title: "Invoicing",
    text: "Standardize invoice terms (Net 7/15/30) and add late fees to reduce collection time.",
  },
  {
    icon: "🔍",
    title: "Reconciliation",
    text: "Reconcile weekly to catch duplicates, missing entries, and mismatched amounts early.",
  },
];

const BOT_RESPONSES = {
  cashflow:
    "To improve cash flow this month:\n1) Follow up on top 10 unpaid invoices\n2) Shorten invoice terms for new work (e.g., Net 7/15)\n3) Ask vendors for extended terms on non-critical spend\n4) Pause discretionary expenses for 30 days\n\nIf you tell me your current receivables and payables, I can suggest a priority plan.",
  overdue:
    "For overdue invoices:\n1) Send a friendly reminder (same day)\n2) Call after 48 hours\n3) Re-send invoice with payment link\n4) Offer partial payment to restart momentum\n5) Escalate: late fee / stop-work policy\n\nTip: keep messages short and include invoice number + amount + due date.",
  coa:
    "A simple chart of accounts starter set:\n• Assets: Cash, Accounts Receivable\n• Liabilities: Accounts Payable, Taxes Payable\n• Revenue: Sales/Services\n• Expenses: Payroll, Rent, Software, Marketing, Bank Fees\n\nKeep it small at first—add accounts only when reporting needs it.",
  kpis:
    "Weekly KPIs worth tracking:\n• Cash balance\n• Accounts receivable (and aging)\n• Accounts payable (next 14 days)\n• Net cash flow (week)\n• Sales pipeline / invoices sent\n• Gross margin (if you have COGS)\n\nThe goal is early warning—not perfect accounting.",
  vendors:
    "To reduce vendor spend safely:\n1) Identify top 5 vendors by spend\n2) Negotiate annual discounts / volume tiers\n3) Remove duplicate tools/subscriptions\n4) Consolidate vendors where possible\n5) Require approvals for non-budgeted purchases\n\nStart with the easiest wins: duplicate SaaS + unused services.",
  default:
    "Tell me what you’re trying to optimize (cash flow, receivables, payables, expenses, or reporting), and what time horizon you care about (this week/month/quarter). I’ll propose a concrete action plan.",
};

function getBotResponse(msg) {
  const m = String(msg || "").toLowerCase();
  if (m.includes("cash") || m.includes("flow")) return BOT_RESPONSES.cashflow;
  if (m.includes("overdue") || m.includes("late") || m.includes("invoice")) return BOT_RESPONSES.overdue;
  if (m.includes("chart") || m.includes("accounts") || m.includes("coa")) return BOT_RESPONSES.coa;
  if (m.includes("kpi") || m.includes("metrics")) return BOT_RESPONSES.kpis;
  if (m.includes("vendor") || m.includes("spend") || m.includes("cost")) return BOT_RESPONSES.vendors;
  return BOT_RESPONSES.default;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        "Hi! I’m your Finflow SME assistant.\n\nAsk me about cash flow, invoices, bills, reconciliation, reporting, or operational best practices.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("gemini"); // "gemini" | "demo"
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // If server isn't configured (missing key), the API returns a clear error and we fall back.
    // We keep the default mode as "gemini" but switch to demo after first failure.
    setMode("gemini");
  }, []);

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const nextMessages = [...messages, { role: "user", text: msg }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      if (mode === "demo") {
        await new Promise((r) => setTimeout(r, 500));
        setMessages((m) => [...m, { role: "bot", text: getBotResponse(msg) }]);
        return;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          model: "gemini-1.5-flash",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "AI request failed");
      }

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: String(json.text || "").trim() || "I couldn’t generate a response.",
        },
      ]);
    } catch (e) {
      setMode("demo");
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            "Gemini isn’t configured on the server yet (missing `GEMINI_API_KEY`).\n\nI’ll continue in local demo mode for now. To enable Gemini, add `GEMINI_API_KEY` to `finflow_sme/.env.local` and restart the dev server.",
        },
        { role: "bot", text: getBotResponse(msg) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <header className="ai-header">
        <div className="ai-title">
          <div className="ai-icon">
            <Bot size={18} />
          </div>
          <div>
            <h1>AI Assistant</h1>
            <p className="ai-subtitle">Fast answers for SME finance workflows.</p>
          </div>
        </div>
        <div className="ai-badge">
          <Sparkles size={14} />
          {mode === "gemini" ? "Gemini powered" : "Local demo assistant"}
        </div>
      </header>

      <section className="ai-insights">
        {AI_INSIGHTS.map((ins) => (
          <div key={ins.title} className="wave-card ai-insight-card">
            <div className="ai-insight-icon">{ins.icon}</div>
            <div>
              <div className="ai-insight-title">{ins.title}</div>
              <div className="ai-insight-text">{ins.text}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="ai-grid">
        <div className="wave-card ai-chat">
          <div className="ai-chat-top">
            <div className="ai-chat-avatar">🤖</div>
            <div>
              <div className="ai-chat-name">Finflow AI</div>
              <div className="ai-chat-status">● Online</div>
            </div>
          </div>

          <div className="ai-chat-body">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`ai-msg-row ${m.role === "user" ? "user" : "bot"}`}
              >
                {m.role === "bot" && <div className="ai-msg-avatar">🤖</div>}
                <div className={`ai-msg ${m.role}`}>{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="ai-msg-row bot">
                <div className="ai-msg-avatar">🤖</div>
                <div className="ai-msg bot ai-thinking">Thinking…</div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="ai-chips">
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <button key={s} className="ai-chip" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="ai-input-row">
            <input
              className="ai-input"
              placeholder="Ask about invoices, cash flow, reconciliation…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="wave-btn-primary ai-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>

        <div className="ai-side">
          <div className="wave-card">
            <div className="ai-side-title">Quick Ask</div>
            <div className="ai-side-list">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="ai-side-item" onClick={() => sendMessage(s)}>
                  <span>{s}</span>
                  <span className="ai-side-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="wave-card ai-note">
            <div className="ai-note-title">Connect a real model</div>
            <p className="ai-note-text">
              This is a local demo assistant (no external API calls). If you want real AI responses,
              we can add a server route and connect to a provider using an API key stored in
              <code className="ai-code">.env.local</code>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

