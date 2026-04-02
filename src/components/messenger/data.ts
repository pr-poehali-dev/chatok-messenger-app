export const CHATS = [
  { id: 1, name: "Анна Морозова", avatar: "АМ", msg: "Окей, увидимся завтра!", time: "14:32", unread: 2, online: true, color: "#8B5CF6" },
  { id: 2, name: "Команда дизайна", avatar: "КД", msg: "Новые макеты уже готовы 🎨", time: "13:10", unread: 5, online: false, color: "#EC4899" },
  { id: 3, name: "Дмитрий Соколов", avatar: "ДС", msg: "Ты смотрел презентацию?", time: "12:47", unread: 0, online: true, color: "#06B6D4" },
  { id: 4, name: "Лена Петрова", avatar: "ЛП", msg: "Спасибо за помощь!", time: "11:20", unread: 0, online: false, color: "#F59E0B" },
  { id: 5, name: "Проект ChatOK", avatar: "ПЧ", msg: "Релиз v2.0 выходит сегодня!", time: "10:05", unread: 1, online: true, color: "#10B981" },
  { id: 6, name: "Максим Волков", avatar: "МВ", msg: "Звонок в 15:00?", time: "09:30", unread: 0, online: true, color: "#EF4444" },
];

export const MESSAGES: Record<number, { id: number; text: string; own: boolean; time: string }[]> = {
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

export const CONTACTS = [
  { id: 1, name: "Анна Морозова", role: "Дизайнер", avatar: "АМ", online: true, color: "#8B5CF6" },
  { id: 2, name: "Дмитрий Соколов", role: "Разработчик", avatar: "ДС", online: true, color: "#06B6D4" },
  { id: 3, name: "Лена Петрова", role: "Маркетолог", avatar: "ЛП", online: false, color: "#F59E0B" },
  { id: 4, name: "Максим Волков", role: "Менеджер", avatar: "МВ", online: true, color: "#EF4444" },
  { id: 5, name: "Ольга Смирнова", role: "Аналитик", avatar: "ОС", online: false, color: "#10B981" },
  { id: 6, name: "Игорь Кузнецов", role: "Тестировщик", avatar: "ИК", online: false, color: "#EC4899" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "msg", text: "Анна Морозова написала вам", time: "только что", read: false, avatar: "АМ", color: "#8B5CF6" },
  { id: 2, type: "call", text: "Пропущенный звонок от Дмитрия", time: "10 мин назад", read: false, avatar: "ДС", color: "#06B6D4" },
  { id: 3, type: "contact", text: "Максим Волков добавил вас в контакты", time: "1 ч назад", read: true, avatar: "МВ", color: "#EF4444" },
  { id: 4, type: "msg", text: "Новое сообщение в Команде дизайна", time: "2 ч назад", read: true, avatar: "КД", color: "#EC4899" },
  { id: 5, type: "call", text: "Видеозвонок от Лены Петровой", time: "3 ч назад", read: true, avatar: "ЛП", color: "#F59E0B" },
];

export type Section = "chats" | "search" | "contacts" | "notifications" | "settings" | "profile";

export type Chat = typeof CHATS[0];
export type Message = { id: number; text: string; own: boolean; time: string };
