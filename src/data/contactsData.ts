import { Contact, ContactGroup, UserStatus } from '@/types/user';

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    email: 'maria.gonzalez@hotmail.com',
    displayName: 'María González',
    personalMessage: 'Estudiando para los exámenes 📚',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+young+woman+with+brown+hair',
    status: UserStatus.ONLINE,
    groups: ['friends', 'university'],
    isBlocked: false,
    nickname: 'Mary',
    lastSeen: new Date()
  },
  {
    id: 'contact-2',
    email: 'carlos.rodriguez@hotmail.com',
    displayName: 'Carlos Rodríguez',
    personalMessage: 'Jugando FIFA 2005 ⚽',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+young+man+with+soccer+ball',
    status: UserStatus.AWAY,
    groups: ['friends', 'gaming'],
    isBlocked: false,
    nickname: 'Charlie',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: 'contact-3',
    email: 'ana.martinez@msn.com',
    displayName: 'Ana Martínez',
    personalMessage: 'Escuchando Shakira 🎵',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+teenage+girl+with+music+headphones',
    status: UserStatus.BUSY,
    groups: ['family', 'music'],
    isBlocked: false,
    nickname: 'Anita',
    lastSeen: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
  },
  {
    id: 'contact-4',
    email: 'luis.fernandez@hotmail.es',
    displayName: 'Luis Fernández',
    personalMessage: '',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+default+avatar+silhouette',
    status: UserStatus.OFFLINE,
    groups: ['work'],
    isBlocked: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 'contact-5',
    email: 'sofia.lopez@hotmail.com',
    displayName: 'Sofía López',
    personalMessage: 'Viendo Friends por 100ª vez 📺',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+woman+with+TV+remote',
    status: UserStatus.ONLINE,
    groups: ['friends', 'tv-shows'],
    isBlocked: false,
    nickname: 'Sofi',
    lastSeen: new Date()
  },
  {
    id: 'contact-6',
    email: 'diego.morales@msn.com',
    displayName: 'Diego Morales',
    personalMessage: 'Programando en Visual Basic 💻',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+programmer+with+computer',
    status: UserStatus.APPEAR_OFFLINE,
    groups: ['university', 'programming'],
    isBlocked: false,
    nickname: 'Dieg',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 'contact-7',
    email: 'valentina.torres@hotmail.com',
    displayName: 'Valentina Torres',
    personalMessage: 'Chateando desde el ciber ☕',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+girl+in+internet+cafe',
    status: UserStatus.ONLINE,
    groups: ['friends'],
    isBlocked: false,
    nickname: 'Vale',
    lastSeen: new Date()
  },
  {
    id: 'contact-8',
    email: 'miguel.santos@hotmail.com',
    displayName: 'Miguel Santos',
    personalMessage: 'Descargando música en Ares 🎶',
    avatar: 'https://placehold.co/32x32?text=Classic+MSN+avatar+young+man+with+CD',
    status: UserStatus.AWAY,
    groups: ['friends', 'music'],
    isBlocked: false,
    nickname: 'Migue',
    lastSeen: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
  }
];

export const DEFAULT_CONTACT_GROUPS: ContactGroup[] = [
  {
    id: 'friends',
    name: 'Amigos',
    isExpanded: true,
    contactIds: ['contact-1', 'contact-2', 'contact-5', 'contact-7', 'contact-8']
  },
  {
    id: 'family',
    name: 'Familia',
    isExpanded: true,
    contactIds: ['contact-3']
  },
  {
    id: 'university',
    name: 'Universidad',
    isExpanded: false,
    contactIds: ['contact-1', 'contact-6']
  },
  {
    id: 'work',
    name: 'Trabajo',
    isExpanded: false,
    contactIds: ['contact-4']
  },
  {
    id: 'gaming',
    name: 'Gaming',
    isExpanded: false,
    contactIds: ['contact-2']
  },
  {
    id: 'music',
    name: 'Música',
    isExpanded: false,
    contactIds: ['contact-3', 'contact-8']
  },
  {
    id: 'tv-shows',
    name: 'Series TV',
    isExpanded: false,
    contactIds: ['contact-5']
  },
  {
    id: 'programming',
    name: 'Programación',
    isExpanded: false,
    contactIds: ['contact-6']
  }
];

export const getContactsByGroup = (groupId: string): Contact[] => {
  const group = DEFAULT_CONTACT_GROUPS.find(g => g.id === groupId);
  if (!group) return [];
  
  return group.contactIds.map(contactId => 
    MOCK_CONTACTS.find(contact => contact.id === contactId)
  ).filter(Boolean) as Contact[];
};

export const getOnlineContactsCount = (): number => {
  return MOCK_CONTACTS.filter(contact => 
    contact.status === UserStatus.ONLINE || contact.status === UserStatus.AWAY || contact.status === UserStatus.BUSY
  ).length;
};