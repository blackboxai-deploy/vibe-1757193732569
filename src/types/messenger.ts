export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  emoticons?: EmoticonInMessage[];
}

export enum MessageType {
  TEXT = 'text',
  SYSTEM = 'system',
  TYPING = 'typing'
}

export interface ChatWindow {
  id: string;
  contactId: string;
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isTyping: boolean;
  position: { x: number; y: number };
}

export interface ContactGroup {
  id: string;
  name: string;
  isExpanded: boolean;
  contactIds: string[];
}

export interface Emoticon {
  id: string;
  shortcut: string;
  imageUrl: string;
  description: string;
  category: string;
}

export interface EmoticonInMessage {
  shortcut: string;
  position: number;
}

export interface NotificationSound {
  id: string;
  name: string;
  audioUrl: string;
  event: NotificationEvent;
}

export enum NotificationEvent {
  MESSAGE_RECEIVED = 'message_received',
  CONTACT_ONLINE = 'contact_online',
  CONTACT_OFFLINE = 'contact_offline',
  NUDGE = 'nudge',
  LOGIN = 'login',
  LOGOUT = 'logout'
}