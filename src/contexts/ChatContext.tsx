'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact, ContactGroup, UserStatus } from '@/types/user';
import { ChatWindow, Message, MessageType, NotificationEvent } from '@/types/messenger';
import { MOCK_CONTACTS, DEFAULT_CONTACT_GROUPS } from '@/data/contactsData';
import { CHAT_WINDOW_SETTINGS } from '@/lib/constants';
import { messageService } from '@/lib/messageService';
import { soundManager } from '@/lib/soundManager';
import { useAuth } from './AuthContext';

interface ChatContextType {
  contacts: Contact[];
  contactGroups: ContactGroup[];
  chatWindows: ChatWindow[];
  typingContacts: Set<string>;
  openChatWindow: (contactId: string) => void;
  closeChatWindow: (windowId: string) => void;
  minimizeChatWindow: (windowId: string) => void;
  restoreChatWindow: (windowId: string) => void;
  sendMessage: (windowId: string, content: string) => void;
  toggleContactGroup: (groupId: string) => void;
  addContact: (contact: Contact) => void;
  removeContact: (contactId: string) => void;
  updateContactStatus: (contactId: string, status: UserStatus) => void;
  getContactById: (contactId: string) => Contact | undefined;
  getOnlineContactsCount: () => number;
  sendNudge: (windowId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>([]);
  const [typingContacts, setTypingContacts] = useState<Set<string>>(new Set());

  // Initialize contacts and groups
  useEffect(() => {
    if (isAuthenticated) {
      setContacts(MOCK_CONTACTS);
      setContactGroups(DEFAULT_CONTACT_GROUPS);
    } else {
      setContacts([]);
      setContactGroups([]);
      setChatWindows([]);
      setTypingContacts(new Set());
    }
  }, [isAuthenticated]);

  // Load chat windows from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const storedWindows = localStorage.getItem('msn_chat_windows');
      if (storedWindows) {
        try {
          const parsedWindows = JSON.parse(storedWindows);
          setChatWindows(parsedWindows.map((w: any) => ({
            ...w,
            messages: w.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
          })));
        } catch (error) {
          console.error('Error parsing stored chat windows:', error);
          localStorage.removeItem('msn_chat_windows');
        }
      }
    }
  }, [isAuthenticated]);

  // Save chat windows to localStorage
  useEffect(() => {
    if (isAuthenticated && chatWindows.length > 0) {
      localStorage.setItem('msn_chat_windows', JSON.stringify(chatWindows));
    }
  }, [chatWindows, isAuthenticated]);

  // Simulate random status changes
  useEffect(() => {
    if (!isAuthenticated || contacts.length === 0) return;

    const interval = setInterval(() => {
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      const statuses = [UserStatus.ONLINE, UserStatus.AWAY, UserStatus.BUSY, UserStatus.OFFLINE];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      if (randomContact.status !== newStatus) {
        updateContactStatus(randomContact.id, newStatus);
      }
    }, 30000); // Change status every 30 seconds

    return () => clearInterval(interval);
  }, [contacts, isAuthenticated]);

  const getNextWindowPosition = (): { x: number; y: number } => {
    const offset = CHAT_WINDOW_SETTINGS.positionOffset;
    const openWindows = chatWindows.filter(w => w.isOpen && !w.isMinimized);
    return {
      x: CHAT_WINDOW_SETTINGS.defaultPosition.x + (openWindows.length * offset),
      y: CHAT_WINDOW_SETTINGS.defaultPosition.y + (openWindows.length * offset)
    };
  };

  const openChatWindow = (contactId: string) => {
    const existingWindow = chatWindows.find(w => w.contactId === contactId);
    
    if (existingWindow) {
      // Restore and bring to front
      setChatWindows(prev => prev.map(w => 
        w.id === existingWindow.id 
          ? { ...w, isOpen: true, isMinimized: false }
          : w
      ));
    } else {
      // Create new window
      const newWindow: ChatWindow = {
        id: `chat-${contactId}-${Date.now()}`,
        contactId,
        isOpen: true,
        isMinimized: false,
        messages: messageService.getMessageHistory(contactId),
        isTyping: false,
        position: getNextWindowPosition()
      };
      setChatWindows(prev => [...prev, newWindow]);
    }
  };

  const closeChatWindow = (windowId: string) => {
    setChatWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeChatWindow = (windowId: string) => {
    setChatWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const restoreChatWindow = (windowId: string) => {
    setChatWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ));
  };

  const sendMessage = (windowId: string, content: string) => {
    const window = chatWindows.find(w => w.id === windowId);
    const contact = window ? getContactById(window.contactId) : undefined;
    
    if (!window || !contact) return;

    messageService.sendMessage(
      content,
      contact.id,
      (sentMessage) => {
        setChatWindows(prev => prev.map(w => 
          w.id === windowId 
            ? { ...w, messages: [...w.messages, sentMessage] }
            : w
        ));
      },
      (contactId, isTyping) => {
        setTypingContacts(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(contactId);
          } else {
            newSet.delete(contactId);
          }
          return newSet;
        });
      },
      (receivedMessage) => {
        setChatWindows(prev => prev.map(w => 
          w.contactId === contact.id 
            ? { ...w, messages: [...w.messages, receivedMessage] }
            : w
        ));
        
        // Play message sound
        if (soundManager.isAudioEnabled()) {
          soundManager.playSound(NotificationEvent.MESSAGE_RECEIVED);
        }
      },
      contact
    );
  };

  const toggleContactGroup = (groupId: string) => {
    setContactGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isExpanded: !group.isExpanded }
        : group
    ));
  };

  const addContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const removeContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    closeChatWindow(chatWindows.find(w => w.contactId === contactId)?.id || '');
  };

  const updateContactStatus = (contactId: string, status: UserStatus) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === contactId) {
        const oldStatus = contact.status;
        const newContact = {
          ...contact,
          status,
          lastSeen: status === UserStatus.OFFLINE ? new Date() : contact.lastSeen
        };

        // Play status change sounds
        if (oldStatus !== status && soundManager.isAudioEnabled()) {
          if (status === UserStatus.ONLINE && oldStatus === UserStatus.OFFLINE) {
            soundManager.playSound(NotificationEvent.CONTACT_ONLINE);
          } else if (status === UserStatus.OFFLINE && oldStatus !== UserStatus.OFFLINE) {
            soundManager.playSound(NotificationEvent.CONTACT_OFFLINE);
          }
        }

        return newContact;
      }
      return contact;
    }));
  };

  const getContactById = (contactId: string): Contact | undefined => {
    return contacts.find(c => c.id === contactId);
  };

  const getOnlineContactsCount = (): number => {
    return contacts.filter(contact => 
      contact.status === UserStatus.ONLINE || 
      contact.status === UserStatus.AWAY || 
      contact.status === UserStatus.BUSY
    ).length;
  };

  const sendNudge = (windowId: string) => {
    const window = chatWindows.find(w => w.id === windowId);
    const contact = window ? getContactById(window.contactId) : undefined;
    
    if (!contact) return;

    // Add nudge message to chat
    const nudgeMessage: Message = {
      id: `nudge-${Date.now()}-${Math.random()}`,
      senderId: 'current-user',
      recipientId: contact.id,
      content: 'Has enviado un zumbido',
      timestamp: new Date(),
      type: MessageType.SYSTEM
    };

    setChatWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { ...w, messages: [...w.messages, nudgeMessage] }
        : w
    ));

    // Play nudge sound
    if (soundManager.isAudioEnabled()) {
      soundManager.playSound(NotificationEvent.NUDGE);
    }

    // Simulate contact receiving nudge
    messageService.simulateNudge(contact, (contactId) => {
      const responseMessage: Message = {
        id: `nudge-response-${Date.now()}-${Math.random()}`,
        senderId: contactId,
        recipientId: 'current-user',
        content: `${getContactById(contactId)?.displayName} te ha enviado un zumbido`,
        timestamp: new Date(),
        type: MessageType.SYSTEM
      };

      setChatWindows(prev => prev.map(w => 
        w.contactId === contactId 
          ? { ...w, messages: [...w.messages, responseMessage] }
          : w
      ));

      if (soundManager.isAudioEnabled()) {
        soundManager.playSound(NotificationEvent.NUDGE);
      }
    });
  };

  const contextValue: ChatContextType = {
    contacts,
    contactGroups,
    chatWindows,
    typingContacts,
    openChatWindow,
    closeChatWindow,
    minimizeChatWindow,
    restoreChatWindow,
    sendMessage,
    toggleContactGroup,
    addContact,
    removeContact,
    updateContactStatus,
    getContactById,
    getOnlineContactsCount,
    sendNudge
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}