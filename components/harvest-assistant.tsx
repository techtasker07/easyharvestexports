"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { findBotReply } from "@/lib/bot-knowledge";
import { activitySessionId, recordActivity } from "@/lib/activity";
import { supabase, visitorId } from "@/lib/supabase";

type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  intentId?: string;
  route?: string;
  quickReplies?: string[];
};

const welcome: Message = {
  id: "welcome",
  role: "bot",
  content: "Welcome to EasyHarvest. I can help you find the right commodity, prepare a quote request, understand export documents, or track an existing quote.",
  intentId: "welcome.start",
  quickReplies: ["View products", "Request a quote", "Track my quote", "Export documents"]
};

export function HarvestAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const loggedWelcome = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from("products").select("name").eq("active", true).then(({ data }) => {
      setProductNames((data || []).map((product: { name: string }) => product.name));
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  if (pathname !== "/") return null;

  async function logMessage(message: Message) {
    if (!supabase) return;
    await supabase.from("bot_messages").insert({
      visitor_id: visitorId(),
      session_id: activitySessionId(),
      role: message.role,
      content: message.content,
      intent_id: message.intentId || null,
      route: message.route || null,
      page_path: window.location.pathname
    });
  }

  function openChat() {
    setIsOpen(true);
    void recordActivity("bot_open", "EasyHarvest assistant opened");
    if (!loggedWelcome.current) {
      loggedWelcome.current = true;
      void logMessage(welcome);
    }
  }

  function sendMessage(value: string) {
    const input = value.trim();
    if (!input || isTyping) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsTyping(true);
    void logMessage(userMessage);
    void recordActivity("bot_question", input.slice(0, 120));

    window.setTimeout(() => {
      const reply = findBotReply(input, productNames);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content: reply.response,
        intentId: reply.id,
        route: reply.route,
        quickReplies: reply.quickReplies
      };
      setMessages((current) => [...current, botMessage]);
      setIsTyping(false);
      void logMessage(botMessage);
    }, 520);
  }

  return (
    <div className={`harvest-assistant ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <section className="assistant-panel" aria-label="EasyHarvest assistant">
          <header className="assistant-head">
            <div className="assistant-avatar"><BotIcon /></div>
            <div>
              <span>EasyHarvest Assistant</span>
              <small><i /> Online for buyer guidance</small>
            </div>
            <button className="assistant-close" aria-label="Close assistant" onClick={() => setIsOpen(false)} type="button">Close</button>
          </header>
          <div className="assistant-messages" ref={scrollRef}>
            {messages.map((message) => (
              <div className={`assistant-message ${message.role}`} key={message.id}>
                {message.role === "bot" ? <div className="assistant-message-icon"><BotIcon /></div> : null}
                <div className="assistant-bubble">
                  <p>{message.content}</p>
                  {message.route ? <Link className="assistant-route" href={message.route}>Open relevant page</Link> : null}
                  {message.role === "bot" && message.quickReplies?.length ? (
                    <div className="assistant-quick-replies">
                      {message.quickReplies.slice(0, 4).map((reply) => <button key={`${message.id}-${reply}`} onClick={() => sendMessage(reply)} type="button">{reply}</button>)}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {isTyping ? <div className="assistant-message bot"><div className="assistant-message-icon"><BotIcon /></div><div className="assistant-bubble typing"><span /><span /><span /></div></div> : null}
          </div>
          <form className="assistant-compose" onSubmit={(event) => { event.preventDefault(); sendMessage(draft); }}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about products, quotes, or documents" />
            <button aria-label="Send message" type="submit"><SendIcon /></button>
          </form>
        </section>
      ) : null}
      <button className="assistant-launcher" aria-label="Open EasyHarvest assistant" onClick={openChat} type="button">
        <BotIcon />
        <span>Ask EasyHarvest</span>
      </button>
    </div>
  );
}

function BotIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="13" rx="5" /><path d="M12 3v3" /><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M9 15.5c1.8 1 4.2 1 6 0" /></svg>;
}

function SendIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 8-16 8 3.5-8Z" /><path d="M7.5 12H20" /></svg>;
}
