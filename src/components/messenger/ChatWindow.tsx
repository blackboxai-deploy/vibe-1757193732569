'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EmoticonPicker } from './EmoticonPicker';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChatWindow as ChatWindowType, MessageType, Emoticon } from '@/types/messenger';
import { UserStatus } from '@/types/user';
import { USER_STATUS_CONFIG } from '@/lib/constants';
import { messageService } from '@/lib/messageService';

interface ChatWindowProps {
  chatWindow: ChatWindowType;
}

export function ChatWindow({ chatWindow }: ChatWindowProps) {
  const { user } = useAuth();
  const { 
    getContactById, 
    closeChatWindow, 
    minimizeChatWindow, 
    sendMessage,
    sendNudge,
    typingContacts 
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  // Drag functionality variables (for future implementation)
  // const [isWindowDragging, setIsWindowDragging] = useState(false);
  // const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const contact = getContactById(chatWindow.contactId);
  
  if (!contact || !user) return null;

  const isTyping = typingContacts.has(contact.id);
  const statusConfig = USER_STATUS_CONFIG[contact.status];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatWindow.messages]);

  // Focus input when window opens
  useEffect(() => {
    if (chatWindow.isOpen && !chatWindow.isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatWindow.isOpen, chatWindow.isMinimized]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(chatWindow.id, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmoticonSelect = (emoticon: Emoticon) => {
    const cursorPosition = inputRef.current?.selectionStart || messageInput.length;
    const beforeCursor = messageInput.slice(0, cursorPosition);
    const afterCursor = messageInput.slice(cursorPosition);
    const newMessage = beforeCursor + emoticon.shortcut + afterCursor;
    
    setMessageInput(newMessage);
    
    // Focus and restore cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          cursorPosition + emoticon.shortcut.length,
          cursorPosition + emoticon.shortcut.length
        );
      }
    }, 0);
  };

  const handleNudge = () => {
    sendNudge(chatWindow.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Drag functionality (for future implementation)
    e.preventDefault();
  };

  const formatMessageContent = (content: string): string => {
    return messageService.replaceEmoticonsInMessage(content);
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (chatWindow.isMinimized) {
    return (
      <div className="fixed bottom-0 left-4">
        <Button
          variant="outline"
          className="h-10 px-4 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={() => {/* restore logic handled by parent */}}
        >
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src={contact.avatar} alt={contact.displayName} />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
              {contact.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate max-w-24">
            {contact.nickname || contact.displayName}
          </span>
        </Button>
      </div>
    );
  }

  return (
    <Card 
      className="fixed bg-white shadow-2xl border-2 border-gray-300 z-50"
      style={{ 
        left: chatWindow.position.x,
        top: chatWindow.position.y,
        width: '320px',
        height: '400px'
      }}
    >
      {/* Window Header */}
      <CardHeader 
        className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Avatar className="w-6 h-6">
              <AvatarImage src={contact.avatar} alt={contact.displayName} />
              <AvatarFallback className="text-xs bg-white text-blue-700">
                {contact.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold truncate">
                {contact.nickname || contact.displayName}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusConfig.color }}
                ></div>
                <span className="text-xs opacity-90">
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Window Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => minimizeChatWindow(chatWindow.id)}
              title="Minimizar"
            >
              <div className="w-3 h-0.5 bg-current"></div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-red-500"
              onClick={() => closeChatWindow(chatWindow.id)}
              title="Cerrar"
            >
              ✕
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="p-0 flex flex-col h-80">
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-2">
            {chatWindow.messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-64 p-2 rounded-lg text-sm ${
                    message.senderId === user.id
                      ? 'bg-blue-500 text-white'
                      : message.type === MessageType.SYSTEM
                        ? 'bg-yellow-100 text-yellow-800 text-center italic'
                        : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.type === MessageType.SYSTEM ? (
                      <span>{message.content}</span>
                    ) : (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content) 
                        }}
                        className="emoticon-content"
                      />
                    )}
                  </div>
                </div>
                
                <div className={`text-xs text-gray-500 px-1 ${
                  message.senderId === user.id ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg text-sm italic">
                  {contact.displayName} está escribiendo...
                  <span className="animate-pulse">●●●</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Area */}
        <div className="p-3 space-y-2">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-blue-50"
                title="Negrita"
              >
                <strong>B</strong>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-blue-50"
                title="Cursiva"
              >
                <em>I</em>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-blue-50"
                title="Subrayado"
              >
                <u>U</u>
              </Button>
              
              <Separator orientation="vertical" className="h-4" />
              
              <EmoticonPicker onEmoticonSelect={handleEmoticonSelect} />
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-orange-600 hover:bg-orange-50"
                onClick={handleNudge}
                title="Enviar zumbido"
                disabled={contact.status === UserStatus.OFFLINE}
              >
                Zumbido
              </Button>
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1 h-8 text-sm"
              disabled={contact.status === UserStatus.OFFLINE}
            />
            <Button
              size="sm"
              className="h-8 px-3"
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || contact.status === UserStatus.OFFLINE}
            >
              Enviar
            </Button>
          </div>

          {/* Status info */}
          {contact.status === UserStatus.OFFLINE && (
            <p className="text-xs text-gray-500 text-center">
              {contact.displayName} está desconectado(a)
            </p>
          )}
        </div>
      </CardContent>


    </Card>
  );
}