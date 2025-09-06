import { UserStatus } from '@/types/user';
import { NotificationSound, NotificationEvent } from '@/types/messenger';

export const USER_STATUS_CONFIG = {
  [UserStatus.ONLINE]: {
    label: 'En línea',
    color: '#00CC00',
    icon: '🟢',
    description: 'Disponible para chatear'
  },
  [UserStatus.AWAY]: {
    label: 'Ausente',
    color: '#FF9900',
    icon: '🟡',
    description: 'No estoy en la computadora'
  },
  [UserStatus.BUSY]: {
    label: 'Ocupado',
    color: '#CC0000',
    icon: '🔴',
    description: 'No me molesten'
  },
  [UserStatus.APPEAR_OFFLINE]: {
    label: 'No aparecer conectado',
    color: '#808080',
    icon: '⚪',
    description: 'Invisible para otros contactos'
  },
  [UserStatus.OFFLINE]: {
    label: 'Sin conexión',
    color: '#808080',
    icon: '⚫',
    description: 'No disponible'
  }
};

export const MSN_SOUNDS: NotificationSound[] = [
  {
    id: 'message',
    name: 'Nuevo mensaje',
    audioUrl: '/sounds/message.wav',
    event: NotificationEvent.MESSAGE_RECEIVED
  },
  {
    id: 'online',
    name: 'Contacto conectado',
    audioUrl: '/sounds/online.wav',
    event: NotificationEvent.CONTACT_ONLINE
  },
  {
    id: 'offline',
    name: 'Contacto desconectado',
    audioUrl: '/sounds/offline.wav',
    event: NotificationEvent.CONTACT_OFFLINE
  },
  {
    id: 'nudge',
    name: 'Zumbido',
    audioUrl: '/sounds/nudge.wav',
    event: NotificationEvent.NUDGE
  },
  {
    id: 'login',
    name: 'Inicio de sesión',
    audioUrl: '/sounds/login.wav',
    event: NotificationEvent.LOGIN
  },
  {
    id: 'logout',
    name: 'Cerrar sesión',
    audioUrl: '/sounds/logout.wav',
    event: NotificationEvent.LOGOUT
  }
];

export const MSN_COLORS = {
  primary: '#0066CC',
  primaryDark: '#004499',
  primaryLight: '#4A90E2',
  secondary: '#E6F3FF',
  accent: '#FF6600',
  background: '#F5F5F5',
  windowBg: '#FFFFFF',
  border: '#CCCCCC',
  borderLight: '#E0E0E0',
  text: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  success: '#00CC00',
  warning: '#FF9900',
  error: '#CC0000',
  offline: '#808080'
};

export const CHAT_WINDOW_SETTINGS = {
  defaultWidth: 320,
  defaultHeight: 400,
  minWidth: 280,
  minHeight: 300,
  maxWidth: 500,
  maxHeight: 600,
  defaultPosition: { x: 100, y: 100 },
  positionOffset: 30
};

export const MSN_FONTS = {
  default: 'Tahoma, Arial, sans-serif',
  title: 'Segoe UI, Tahoma, Arial, sans-serif',
  mono: 'Courier New, monospace'
};

export const TYPING_INDICATOR_TIMEOUT = 3000; // 3 seconds
export const MESSAGE_HISTORY_LIMIT = 100;
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const MOCK_USER_CREDENTIALS = {
  email: 'usuario@hotmail.com',
  password: '123456',
  displayName: 'Mi Usuario',
  personalMessage: 'Usando Windows Live Messenger 2005'
};

export const DEFAULT_AVATAR_URL = 'https://placehold.co/32x32?text=Default+MSN+Messenger+avatar+silhouette';