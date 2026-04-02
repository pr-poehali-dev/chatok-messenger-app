import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CHATS, CONTACTS, NOTIFICATIONS, type Chat } from "./data";

export function ChatsSection({ onOpenChat }: { onOpenChat: (chat: Chat) => void }) {
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

export function SearchSection() {
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

export function ContactsSection() {
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

export function NotificationsSection() {
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

export function SettingsSection() {
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

export function ProfileSection() {
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
