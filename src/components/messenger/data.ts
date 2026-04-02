export type ChatType = "channel" | "group" | "private";

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  msg: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
  type: ChatType;
  subscribers?: number;
  username?: string;
}

export interface Message {
  id: number;
  text?: string;
  own: boolean;
  time: string;
  author?: string;
  audioUrl?: string;
  audioDuration?: number;
}

export const CHATS: Chat[] = [
  { id: 1, name: "ChatOK News", avatar: "📢", msg: "Обновление 2.0 — голосовые сообщения!", time: "15:00", unread: 3, online: false, color: "#8B5CF6", type: "channel", subscribers: 12400, username: "@chatok_news" },
  { id: 2, name: "Дизайн и UI", avatar: "🎨", msg: "Тренды интерфейсов 2026", time: "14:20", unread: 1, online: false, color: "#EC4899", type: "channel", subscribers: 5800, username: "@design_ui" },
  { id: 3, name: "Общий чат", avatar: "💬", msg: "Всем привет!", time: "14:45", unread: 8, online: true, color: "#06B6D4", type: "group" },
];

export const MESSAGES: Record<number, Message[]> = {
  1: [],
  2: [],
  3: [],
};

export const CONTACTS = [
  { id: 1, name: "Анна Морозова", username: "@anna_m", avatar: "АМ", online: true, color: "#8B5CF6" },
  { id: 2, name: "Дмитрий Соколов", username: "@dsokolov", avatar: "ДС", online: true, color: "#06B6D4" },
  { id: 3, name: "Лена Петрова", username: "@lena_p", avatar: "ЛП", online: false, color: "#F59E0B" },
  { id: 4, name: "Максим Волков", username: "@max_v", avatar: "МВ", online: true, color: "#EF4444" },
  { id: 5, name: "Ольга Смирнова", username: "@olga_s", avatar: "ОС", online: false, color: "#10B981" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "channel", text: "Новый пост в ChatOK News", time: "только что", read: false, avatar: "📢", color: "#8B5CF6" },
  { id: 2, type: "msg", text: "Сообщение в Общем чате", time: "5 мин назад", read: false, avatar: "💬", color: "#06B6D4" },
  { id: 3, type: "contact", text: "Максим Волков теперь в ChatOK", time: "1 ч назад", read: true, avatar: "МВ", color: "#EF4444" },
];

export type Section = "chats" | "search" | "contacts" | "notifications" | "settings" | "profile";
