'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useChat } from '@/contexts/ChatContext';
import { UserStatus } from '@/types/user';
import { USER_STATUS_CONFIG } from '@/lib/constants';

export function ContactsList() {
  const { 
    contacts, 
    contactGroups, 
    openChatWindow, 
    toggleContactGroup, 
    getOnlineContactsCount,
    typingContacts 
  } = useChat();

  const getContactsByGroup = (groupId: string) => {
    const group = contactGroups.find(g => g.id === groupId);
    if (!group) return [];
    
    return group.contactIds
      .map(contactId => contacts.find(contact => contact.id === contactId))
      .filter(Boolean);
  };

  const formatLastSeen = (lastSeen: Date | undefined, status: UserStatus): string => {
    if (status === UserStatus.OFFLINE && lastSeen) {
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Hace un momento';
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `Hace ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `Hace ${diffDays}d`;
    }
    return '';
  };

  const isContactOnline = (status: UserStatus): boolean => {
    return status === UserStatus.ONLINE || 
           status === UserStatus.AWAY || 
           status === UserStatus.BUSY;
  };

  const onlineCount = getOnlineContactsCount();
  const totalContacts = contacts.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Contactos</h2>
          <span className="text-sm text-gray-600">
            {onlineCount}/{totalContacts} en línea
          </span>
        </div>
      </div>

      {/* Groups and Contacts */}
      <div className="max-h-96 overflow-y-auto">
        {contactGroups.map((group) => {
          const groupContacts = getContactsByGroup(group.id);
          const onlineInGroup = groupContacts.filter(contact => isContactOnline(contact!.status));
          
          if (groupContacts.length === 0) return null;

          return (
            <Collapsible key={group.id} open={group.isExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-4 py-2 h-auto hover:bg-gray-50"
                  onClick={() => toggleContactGroup(group.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`transition-transform duration-200 ${group.isExpanded ? 'rotate-90' : ''}`}>
                      <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-600"></div>
                    </div>
                    <span className="font-medium text-sm text-gray-700">
                      {group.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {onlineInGroup.length}/{groupContacts.length}
                  </span>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pb-2">
                  {groupContacts
                    .sort((a, b) => {
                      // Sort by status priority: online > away > busy > offline
                      const statusPriority = {
                        [UserStatus.ONLINE]: 0,
                        [UserStatus.AWAY]: 1,
                        [UserStatus.BUSY]: 2,
                        [UserStatus.APPEAR_OFFLINE]: 3,
                        [UserStatus.OFFLINE]: 4
                      };
                      
                      const aPriority = statusPriority[a!.status];
                      const bPriority = statusPriority[b!.status];
                      
                      if (aPriority !== bPriority) {
                        return aPriority - bPriority;
                      }
                      
                      return a!.displayName.localeCompare(b!.displayName);
                    })
                    .map((contact) => {
                      if (!contact) return null;
                      
                      const statusConfig = USER_STATUS_CONFIG[contact.status];
                      const isTyping = typingContacts.has(contact.id);
                      const lastSeenText = formatLastSeen(contact.lastSeen, contact.status);
                      
                      return (
                        <div
                          key={contact.id}
                          className="flex items-center px-6 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-l-2 border-transparent hover:border-l-blue-300"
                          onClick={() => openChatWindow(contact.id)}
                        >
                          {/* Avatar with status indicator */}
                          <div className="relative mr-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage 
                                src={contact.avatar} 
                                alt={contact.displayName} 
                              />
                              <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                                {contact.displayName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Status indicator */}
                            <div 
                              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                              style={{ backgroundColor: statusConfig.color }}
                              title={statusConfig.label}
                            ></div>
                          </div>

                          {/* Contact info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm text-gray-900 truncate">
                                {contact.nickname || contact.displayName}
                              </span>
                              {isTyping && (
                                <span className="text-xs text-blue-600 animate-pulse">
                                  escribiendo...
                                </span>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-600 truncate mt-0.5">
                              {contact.personalMessage || (
                                <span className="flex items-center">
                                  <span>{statusConfig.label}</span>
                                  {lastSeenText && (
                                    <span className="ml-2 text-gray-400">• {lastSeenText}</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Online indicator */}
                          {isContactOnline(contact.status) && (
                            <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
        
        {/* Empty state */}
        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">📭</div>
            <p className="text-sm">No tienes contactos agregados</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Estado: Conectado</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            Agregar contacto
          </Button>
        </div>
      </div>
    </div>
  );
}