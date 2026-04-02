import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { MESSAGES, type Chat, type Message } from "./data";

function CallOverlay({ name, type, onEnd }: { name: string; type: "voice" | "video"; onEnd: () => void }) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

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
        <div className="w-28 h-28 rounded-full gradient-btn flex items-center justify-center text-3xl font-bold font-montserrat animate-pulse-ring">
          {name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-2xl font-semibold font-montserrat">{name}</p>
          <p className="text-white/60 mt-1">
            {type === "voice" ? "Голосовой звонок" : "Видеозвонок"} · {fmt(duration)}
          </p>
        </div>
        <div className="flex gap-5 mt-4">
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

function VoiceMessage({ audioUrl, duration, own }: { audioUrl: string; duration: number; own: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => { setPlaying(false); setProgress(0); };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) setProgress(audioRef.current.currentTime / audioRef.current.duration * 100);
      };
    }
    if (playing) { audioRef.current.pause(); }
    else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      <button onClick={toggle}
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${own ? "bg-white/20 hover:bg-white/30" : "bg-primary/20 hover:bg-primary/30"}`}>
        <Icon name={playing ? "Pause" : "Play"} size={16} className={own ? "text-white" : "text-primary"} />
      </button>
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%`, background: own ? "rgba(255,255,255,0.7)" : "var(--grad-start)" }} />
        </div>
        <span className={`text-[10px] ${own ? "text-white/50" : "text-muted-foreground"}`}>{fmt(duration)}</span>
      </div>
    </div>
  );
}

function VoiceRecorder({ onSend }: { onSend: (audioUrl: string, duration: number) => void }) {
  const [recording, setRecording] = useState(false);
  const [dur, setDur] = useState(0);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const startTimeRef = useRef(0);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = e => chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        onSend(url, Math.max(elapsed, 1));
      };
      mediaRecRef.current = rec;
      startTimeRef.current = Date.now();
      rec.start();
      setRecording(true);
      setDur(0);
      timerRef.current = setInterval(() => setDur(d => d + 1), 1000);
    } catch {
      // no mic access
    }
  };

  const stop = () => {
    mediaRecRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const cancel = () => {
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.ondataavailable = null;
      mediaRecRef.current.onstop = null;
      mediaRecRef.current.stop();
      mediaRecRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setRecording(false);
    setDur(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (recording) {
    return (
      <div className="flex items-center gap-3 flex-1 animate-fade-in">
        <button onClick={cancel} className="p-2 hover:bg-white/5 rounded-xl transition-all">
          <Icon name="X" size={18} className="text-red-400" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-red-400 font-medium">{fmt(dur)}</span>
          <div className="flex-1 flex items-center gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1 rounded-full bg-red-400/60 transition-all"
                style={{ height: `${Math.random() * 16 + 4}px`, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        </div>
        <button onClick={stop}
          className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
          <Icon name="Send" size={14} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <button onClick={start} className="p-1.5 hover:opacity-70 transition-all" title="Голосовое сообщение">
      <Icon name="Mic" size={20} className="text-muted-foreground" />
    </button>
  );
}

export default function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(MESSAGES[chat.id] || []);
  const [call, setCall] = useState<{ type: "voice" | "video" } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isChannel = chat.type === "channel";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), text: input, own: true,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      author: "Вы"
    }]);
    setInput("");
  };

  const sendVoice = (audioUrl: string, duration: number) => {
    setMessages(prev => [...prev, {
      id: Date.now(), own: true, audioUrl, audioDuration: duration,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      author: "Вы"
    }]);
  };

  return (
    <div className="flex flex-col h-full">
      {call && <CallOverlay name={chat.name} type={call.type} onEnd={() => setCall(null)} />}

      <div className="glass px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 border-b border-white/5">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/5 transition-all flex-shrink-0">
          <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
        </button>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ background: chat.color }}>
            {chat.avatar}
          </div>
          {chat.online && !isChannel && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background"
              style={{ background: "var(--online-color)" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{chat.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {isChannel
              ? `${chat.subscribers?.toLocaleString("ru")} подписчиков`
              : chat.type === "group"
                ? "Общий чат"
                : chat.online ? "в сети" : "не в сети"}
          </p>
        </div>
        {!isChannel && (
          <div className="flex gap-0.5 flex-shrink-0">
            <button onClick={() => setCall({ type: "voice" })}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-white/5 transition-all">
              <Icon name="Phone" size={18} className="text-muted-foreground" />
            </button>
            <button onClick={() => setCall({ type: "video" })}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-white/5 transition-all">
              <Icon name="Video" size={18} className="text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
              {chat.avatar}
            </div>
            <p className="text-muted-foreground text-sm">
              {isChannel ? "Записей пока нет" : "Начните общение!"}
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={m.id} className={`flex ${m.own ? "justify-end" : "justify-start"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.03}s` }}>
            <div className={`max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.own ? "bubble-own rounded-br-sm" : "bubble-other rounded-bl-sm"}`}>
              {m.author && !m.own && (
                <p className="text-xs font-semibold mb-1" style={{ color: chat.color }}>{m.author}</p>
              )}
              {m.audioUrl ? (
                <VoiceMessage audioUrl={m.audioUrl} duration={m.audioDuration || 0} own={m.own} />
              ) : (
                <p>{m.text}</p>
              )}
              <p className={`text-[10px] mt-1 ${m.own ? "text-white/50" : "text-muted-foreground"} text-right`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!isChannel && (
        <div className="p-2.5 sm:p-4 glass border-t border-white/5">
          <div className="flex gap-2 items-center bg-secondary rounded-2xl px-3 sm:px-4 py-2">
            <button className="p-1 hover:opacity-70 transition-all hidden sm:block">
              <Icon name="Smile" size={20} className="text-muted-foreground" />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Сообщение..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground min-w-0"
            />
            <button className="p-1 hover:opacity-70 transition-all hidden sm:block">
              <Icon name="Paperclip" size={20} className="text-muted-foreground" />
            </button>
            <VoiceRecorder onSend={sendVoice} />
            {input.trim() && (
              <button onClick={send}
                className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center flex-shrink-0">
                <Icon name="Send" size={14} className="text-white" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
