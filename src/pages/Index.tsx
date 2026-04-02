import { useState } from "react";
import Icon from "@/components/ui/icon";

// ---- MOCK DATA ----
const CHATS = [
  { id: 1, name: "Анна Морозова", avatar: "АМ", msg: "Окей, увидимся завтра!", time: "14:32", unread: 2, online: true, color: "#8B5CF6" },
  { id: 2, name: "Команда дизайна", avatar: "КД", msg: "Новые макеты уже готовы 🎨", time: "13:10", unread: 5, online: false, color: "#EC4899" },
  { id: 3, name: "Дмитрий Соколов", avatar: "ДС", msg: "Ты смотрел презентацию?", time: "12:47", unread: 0, online: true, color: "#06B6D4" },
  { id: 4, name: "Лена Петрова", avatar: "ЛП", msg: "Спасибо за помощь!", time: "11:20", unread: 0, online: false, color: "#F59E0B" },
  { id: 5, name: "Проект ChatOK", avatar: "ПЧ", msg: "Релиз v2.0 выходит сегодня!", time: "10:05", unread: 1, online: true, color: "#10B981" },
  { id: 6, name: "Максим Волков", avatar: "МВ", msg: "Звонок в 15:00?", time: "09:30", unread: 0, online: true, color: "#EF4444" },
];

const MESSAGES: Record<number, { id: number; text: string; own: boolean; time: string }[]> = {
  1: [
    { id: 1, text: "Привет! Как дела?", own: false, time: "14:20" },
    { id: 2, text: "Отлично! Работаю над новым проектом 🚀", own: true, time: "14:22" },
    { id: 3, text: "Здорово! Расскажи подробнее", own: false, time: "14:25" },
    { id: 4, text: "Делаю мессенджер ChatOK — яркий, современный дизайн с голосовыми звонками", own: true, time: "14:28" },
    { id: 5, text: "Окей, увидимся завтра!", own: false, time: "14:32" },
  ],
  2: [
    { id: 1, text: "Всем привет! Новые макеты готовы к ревью", own: false, time: "13:00" },
    { id: 2, text: "Супер, скидывайте ссылку", own: true, time: "13:05" },
    { id: 3, text: "Новые макеты уже готовы 🎨", own: false, time: "13:10" },
  ],
  3: [
    { id: 1, text: "Привет, ты смотрел презентацию?", own: false, time: "12:47" },
    { id: 2, text: "Ещё не успел, сегодня посмотрю", own: true, time: "12:50" },
  ],
};

const CONTACTS = [
  { id: 1, name: "Анна Морозова", role: "Дизайнер", avatar: "АМ", online: true, color: "#8B5CF6" },
  { id: 2, name: "Дмитрий Соколов", role: "Разработчик", avatar: "ДС", online: true, color: "#06B6D4" },
  { id: 3, name: "Лена Петрова", role: "Маркетолог", avatar: "ЛП", online: false, color: "#F59E0B" },
  { id: 4, name: "Максим Волков", role: "Менеджер", avatar: "МВ", online: true, color: "#EF4444" },
  { id: 5, name: "Ольга Смирнова", role: "Аналитик", avatar: "ОС", online: false, color: "#10B981" },
  { id: 6, name: "Игорь Кузнецов", role: "Тестировщик", avatar: "ИК", online: false, color: "#EC4899" },
];

const NOTIFICATIONS = [
  { id: 1, type: "msg", text: "Анна Морозова написала вам", time: "только что", read: false, avatar: "АМ", color: "#8B5CF6" },
  { id: 2, type: "call", text: "Пропущенный звонок от Дмитрия", time: "10 мин назад", read: false, avatar: "ДС", color: "#06B6D4" },
  { id: 3, type: "contact", text: "Максим Волков добавил вас в контакты", time: "1 ч назад", read: true, avatar: "МВ", color: "#EF4444" },
  { id: 4, type: "msg", text: "Новое сообщение в Команде дизайна", time: "2 ч назад", read: true, avatar: "КД", color: "#EC4899" },
  { id: 5, type: "call", text: "Видеозвонок от Лены Петровой", time: "3 ч назад", read: true, avatar: "ЛП", color: "#F59E0B" },
];

type Section = "chats" | "search" | "contacts" | "notifications" | "settings" | "profile";

// ---- CALL OVERLAY ----
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

// ---- CHAT VIEW ----
function ChatView({ chat, onBack }: { chat: typeof CHATS[0]; onBack: () => void }) {
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

// ---- CHATS LIST ----
function ChatsSection({ onOpenChat }: { onOpenChat: (chat: typeof CHATS[0]) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3">
        <h1 className="text-2xl font-bold font-montserrat gradient-text">Чаты</h1>
        <div className="mt-3 flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2.5">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input placeholder="Поиск чатов..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-1">
        {CHATS.map((chat, i) => (
          <button key={chat.id} onClick={() => onOpenChat(chat)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-all text-left animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: chat.color }}>
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background"
                  style={{ background: "var(--online-color)" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate">{chat.name}</p>
                <p className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.time}</p>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-xs text-muted-foreground truncate">{chat.msg}</p>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full gradient-btn flex items-center justify-center text-[10px] text-white font-bold">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- SEARCH SECTION ----
function SearchSection() {
  const [query, setQuery] = useState("");
  const results = query.length > 0
    ? CONTACTS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full p-5">
      <h1 className="text-2xl font-bold font-montserrat gradient-text mb-4">Поиск</h1>
      <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 border border-white/5 focus-within:border-primary/50 transition-all">
        <Icon name="Search" size={18} className="text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск людей, чатов, сообщений..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {query.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
            <Icon name="Search" size={28} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Введите имя или ключевое слово</p>
        </div>
      )}

      {query.length > 0 && results.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-muted-foreground text-sm">Ничего не найдено по запросу «{query}»</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1">Контакты</p>
          {results.map(c => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary animate-fade-in">
              <div className="relative">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: c.color }}>
                  {c.avatar}
                </div>
                {c.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-secondary"
                    style={{ background: "var(--online-color)" }} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <button className="p-2 rounded-xl hover:bg-white/5 transition-all">
                <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- CONTACTS SECTION ----
function ContactsSection() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-montserrat gradient-text">Контакты</h1>
          <button className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
            <Icon name="UserPlus" size={16} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{CONTACTS.filter(c => c.online).length} в сети из {CONTACTS.length}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-2">
        {CONTACTS.map((c, i) => (
          <div key={c.id}
            className={`flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary transition-all animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: c.color }}>
                {c.avatar}
              </div>
              {c.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background"
                  style={{ background: "var(--online-color)" }} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.role}</p>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-xl hover:bg-white/5 transition-all">
                <Icon name="Phone" size={15} className="text-muted-foreground" />
              </button>
              <button className="p-2 rounded-xl hover:bg-white/5 transition-all">
                <Icon name="MessageCircle" size={15} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- NOTIFICATIONS SECTION ----
function NotificationsSection() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-montserrat gradient-text">Уведомления</h1>
          {unreadCount > 0 && (
            <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-xs text-primary hover:opacity-80 transition-all">
              Прочитать все
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-2">
        {notifs.map((n, i) => (
          <div key={n.id}
            onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer animate-fade-in stagger-${Math.min(i + 1, 5)} ${n.read ? "hover:bg-secondary/50" : "bg-secondary"}`}>
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: n.color }}>
                {n.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
                {n.type === "msg" && <Icon name="MessageCircle" size={10} className="text-primary" />}
                {n.type === "call" && <Icon name="Phone" size={10} className="text-accent" />}
                {n.type === "contact" && <Icon name="UserPlus" size={10} className="text-cyan-400" />}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${n.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>{n.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--grad-start)" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- SETTINGS SECTION ----
function SettingsSection() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkTheme] = useState(true);

  const Row = ({ icon, label, children }: { icon: string; label: string; children?: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
          <Icon name={icon as "Bell"} size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? "gradient-btn" : "bg-muted"}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? "left-7" : "left-1"}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3">
        <h1 className="text-2xl font-bold font-montserrat gradient-text">Настройки</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1 mt-2 mb-1">Уведомления</p>
        <Row icon="Bell" label="Уведомления"><Toggle value={notifications} onChange={setNotifications} /></Row>
        <Row icon="Volume2" label="Звуки"><Toggle value={sounds} onChange={setSounds} /></Row>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1 mt-4 mb-1">Внешний вид</p>
        <Row icon="Moon" label="Тёмная тема"><Toggle value={darkTheme} onChange={() => {}} /></Row>
        <Row icon="Palette" label="Акцентный цвет">
          <div className="flex gap-2">
            {["#8B5CF6", "#EC4899", "#06B6D4", "#10B981"].map(c => (
              <div key={c} className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-all"
                style={{ background: c }} />
            ))}
          </div>
        </Row>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1 mt-4 mb-1">Аккаунт</p>
        <Row icon="Lock" label="Конфиденциальность" />
        <Row icon="Shield" label="Безопасность" />
        <Row icon="HelpCircle" label="Помощь и поддержка" />

        <button className="w-full p-4 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-2 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
            <Icon name="LogOut" size={16} className="text-red-400" />
          </div>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

// ---- PROFILE SECTION ----
function ProfileSection() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-montserrat gradient-text">Профиль</h1>
          <button className="w-9 h-9 rounded-xl bg-secondary hover:bg-muted transition-all flex items-center justify-center">
            <Icon name="Edit2" size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col items-center py-6 animate-fade-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-full gradient-btn flex items-center justify-center text-3xl font-bold font-montserrat text-white">
              АИ
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center hover:bg-muted transition-all">
              <Icon name="Camera" size={14} className="text-muted-foreground" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold font-montserrat">Алексей Иванов</h2>
          <p className="text-sm text-muted-foreground">@alexivanov</p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--online-color)" }} />
            <span className="text-xs" style={{ color: "var(--online-color)" }}>в сети</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Чатов", value: "24" },
            { label: "Контактов", value: "156" },
            { label: "Звонков", value: "48" },
          ].map(s => (
            <div key={s.label} className="bg-secondary rounded-2xl p-3 text-center">
              <p className="text-xl font-bold font-montserrat gradient-text">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {[
            { icon: "Phone", label: "Телефон", value: "+7 999 123-45-67" },
            { icon: "Mail", label: "Email", value: "alex@example.com" },
            { icon: "MapPin", label: "Город", value: "Москва, Россия" },
            { icon: "Info", label: "О себе", value: "Люблю технологии и красивый дизайн ✨" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary">
              <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon as "Phone"} size={15} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- MAIN APP ----
const NAV_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "contacts", icon: "Users", label: "Контакты" },
  { id: "notifications", icon: "Bell", label: "Уведомления" },
  { id: "settings", icon: "Settings", label: "Настройки" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function Index() {
  const [section, setSection] = useState<Section>("chats");
  const [openChat, setOpenChat] = useState<typeof CHATS[0] | null>(null);

  const totalUnread = CHATS.reduce((sum, c) => sum + c.unread, 0);
  const notifUnread = NOTIFICATIONS.filter(n => !n.read).length;

  const renderSection = () => {
    switch (section) {
      case "chats": return <ChatsSection onOpenChat={c => setOpenChat(c)} />;
      case "search": return <SearchSection />;
      case "contacts": return <ContactsSection />;
      case "notifications": return <NotificationsSection />;
      case "settings": return <SettingsSection />;
      case "profile": return <ProfileSection />;
    }
  };

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-2 md:p-4">
      <div
        className="w-full max-w-5xl h-[calc(100vh-16px)] md:h-[680px] glass rounded-3xl overflow-hidden flex shadow-2xl"
        style={{ boxShadow: "0 32px 80px hsl(271 91% 65% / 0.2), 0 0 0 1px hsl(240 12% 22% / 0.6)" }}>

        {/* Sidebar */}
        <div className="w-16 md:w-20 flex flex-col items-center py-5 gap-1 border-r border-white/5 flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center mb-3 flex-shrink-0"
            style={{ boxShadow: "0 4px 16px hsl(271 91% 65% / 0.5)" }}>
            <span className="text-white font-bold text-xs font-montserrat">OK</span>
          </div>

          {NAV_ITEMS.map(item => {
            const badge = item.id === "chats" ? totalUnread : item.id === "notifications" ? notifUnread : 0;
            return (
              <button key={item.id}
                onClick={() => { setSection(item.id); setOpenChat(null); }}
                className={`nav-item w-full flex flex-col items-center gap-1 py-2 px-1 relative ${section === item.id ? "active" : ""}`}
                title={item.label}>
                <div className="nav-icon-wrap w-10 h-10 flex items-center justify-center relative">
                  <Icon name={item.icon as "Search"} size={18} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-btn flex items-center justify-center text-[9px] text-white font-bold">
                      {badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Left panel */}
        <div
          className={`w-72 border-r border-white/5 flex-shrink-0 ${openChat ? "hidden md:block" : "block"}`}
          style={{ background: "hsl(240 18% 8%)" }}>
          {renderSection()}
        </div>

        {/* Right panel */}
        <div className={`flex-1 ${openChat ? "block" : "hidden md:block"}`}>
          {openChat ? (
            <ChatView chat={openChat} onBack={() => setOpenChat(null)} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
              <div
                className="w-20 h-20 rounded-3xl gradient-btn flex items-center justify-center"
                style={{ boxShadow: "0 8px 32px hsl(271 91% 65% / 0.4)" }}>
                <Icon name="MessageCircle" size={36} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-montserrat gradient-text">ChatOK</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                  Выберите чат слева, чтобы начать общение. Голосовые и видеозвонки доступны внутри чата.
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-xs text-muted-foreground">
                  <Icon name="Phone" size={12} />
                  Голосовые звонки
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-xs text-muted-foreground">
                  <Icon name="Video" size={12} />
                  Видеозвонки
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
