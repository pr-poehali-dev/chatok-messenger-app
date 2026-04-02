import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MESSAGES, type Chat } from "./data";

function CallOverlay({ name, type, onEnd }: { name: string; type: "voice" | "video"; onEnd: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-scale-in"
      style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1a4a 50%, #0f1d3a 100%)" }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--grad-start)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--grad-mid)" }} />
      </div>
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="w-28 h-28 rounded-full gradient-btn flex items-center justify-center text-3xl font-bold font-montserrat animate-pulse-ring">
            {name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div>
          <p className="text-white text-2xl font-semibold font-montserrat">{name}</p>
          <p className="text-white/60 mt-1">{type === "voice" ? "Голосовой звонок..." : "Видеозвонок..."}</p>
        </div>
        <div className="flex gap-6 mt-4">
          {type === "video" && (
            <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
              <Icon name="Video" size={22} className="text-white" />
            </button>
          )}
          <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
            <Icon name="Mic" size={22} className="text-white" />
          </button>
          <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
            <Icon name="Volume2" size={22} className="text-white" />
          </button>
          <button onClick={onEnd}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:opacity-90"
            style={{ background: "#EF4444" }}>
            <Icon name="PhoneOff" size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES[chat.id] || []);
  const [call, setCall] = useState<{ type: "voice" | "video" } | null>(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), text: input, own: true,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })
    }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {call && <CallOverlay name={chat.name} type={call.type} onEnd={() => setCall(null)} />}

      {/* Header */}
      <div className="glass px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/5 transition-all md:hidden">
          <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: chat.color }}>
            {chat.avatar}
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background"
              style={{ background: "var(--online-color)" }} />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{chat.name}</p>
          <p className="text-xs" style={{ color: chat.online ? "var(--online-color)" : "hsl(240 8% 55%)" }}>
            {chat.online ? "в сети" : "не в сети"}
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setCall({ type: "voice" })}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-all">
            <Icon name="Phone" size={18} className="text-muted-foreground" />
          </button>
          <button onClick={() => setCall({ type: "video" })}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-all">
            <Icon name="Video" size={18} className="text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-white/5 transition-all">
            <Icon name="MoreVertical" size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div key={m.id} className={`flex ${m.own ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.04}s` }}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.own ? "bubble-own rounded-br-sm" : "bubble-other rounded-bl-sm"}`}>
              <p>{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.own ? "text-white/60" : "text-muted-foreground"} text-right`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 glass border-t border-white/5">
        <div className="flex gap-2 items-center bg-secondary rounded-2xl px-4 py-2">
          <button className="p-1 hover:opacity-70 transition-all">
            <Icon name="Smile" size={20} className="text-muted-foreground" />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Написать сообщение..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <button className="p-1 hover:opacity-70 transition-all">
            <Icon name="Paperclip" size={20} className="text-muted-foreground" />
          </button>
          <button onClick={send}
            className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center ml-1">
            <Icon name="Send" size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
