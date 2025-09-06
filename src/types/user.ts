export interface User {
  id: string;
  email: string;
  displayName: string;
  personalMessage?: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: Date;
}

export interface Contact extends User {
  groups: string[];
  isBlocked: boolean;
  nickname?: string;
}

export enum UserStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  APPEAR_OFFLINE = 'appear_offline',
  OFFLINE = 'offline'
}

export interface UserProfile {
  displayName: string;
  personalMessage: string;
  avatar?: string;
  status: UserStatus;
}