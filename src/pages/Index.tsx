import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CHATS, NOTIFICATIONS, type Section, type Chat } from "@/components/messenger/data";
import ChatView from "@/components/messenger/ChatView";
import {
  ChatsSection,
  SearchSection,
  ContactsSection,
  NotificationsSection,
  SettingsSection,
  ProfileSection,
} from "@/components/messenger/Sections";

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
  const [openChat, setOpenChat] = useState<Chat | null>(null);

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

  const showLeftPanel = !openChat;
  const showRightPanel = openChat;

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center sm:p-2 md:p-4">
      <div
        className="w-full max-w-5xl h-screen sm:h-[calc(100vh-16px)] md:h-[680px] glass sm:rounded-3xl overflow-hidden flex shadow-2xl"
        style={{ boxShadow: "0 32px 80px hsl(271 91% 65% / 0.2), 0 0 0 1px hsl(240 12% 22% / 0.6)" }}>

        {/* Bottom nav on mobile, sidebar on desktop */}
        <div className="hidden sm:flex w-16 md:w-20 flex-col items-center py-5 gap-1 border-r border-white/5 flex-shrink-0">
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

        {/* Left panel — full width on mobile */}
        <div
          className={`${showLeftPanel ? "flex" : "hidden"} sm:flex w-full sm:w-72 border-r border-white/5 flex-shrink-0 flex-col`}
          style={{ background: "hsl(240 18% 8%)" }}>
          <div className="flex-1 overflow-hidden">
            {renderSection()}
          </div>

          {/* Mobile bottom nav */}
          <div className="flex sm:hidden border-t border-white/5 bg-card/80 backdrop-blur-lg">
            {NAV_ITEMS.map(item => {
              const badge = item.id === "chats" ? totalUnread : item.id === "notifications" ? notifUnread : 0;
              return (
                <button key={item.id}
                  onClick={() => { setSection(item.id); setOpenChat(null); }}
                  className={`nav-item flex-1 flex flex-col items-center gap-0.5 py-2.5 relative ${section === item.id ? "active" : ""}`}>
                  <div className="nav-icon-wrap w-9 h-9 flex items-center justify-center relative">
                    <Icon name={item.icon as "Search"} size={18} />
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full gradient-btn flex items-center justify-center text-[8px] text-white font-bold">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-medium leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel — chat or placeholder */}
        <div className={`flex-1 ${showRightPanel ? "flex flex-col" : "hidden sm:flex sm:flex-col"}`}>
          {openChat ? (
            <ChatView chat={openChat} onBack={() => setOpenChat(null)} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl gradient-btn flex items-center justify-center"
                style={{ boxShadow: "0 8px 32px hsl(271 91% 65% / 0.4)" }}>
                <Icon name="MessageCircle" size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-montserrat gradient-text">ChatOK</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                  Выберите канал или чат, чтобы начать. Голосовые сообщения и звонки доступны внутри.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-xs text-muted-foreground">
                  <Icon name="Mic" size={12} />
                  Голосовые
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-xs text-muted-foreground">
                  <Icon name="Phone" size={12} />
                  Звонки
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-xs text-muted-foreground">
                  <Icon name="Megaphone" size={12} />
                  Каналы
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
