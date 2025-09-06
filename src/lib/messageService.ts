import { Message, MessageType, ChatWindow } from '@/types/messenger';
import { Contact, UserStatus } from '@/types/user';
import { CLASSIC_EMOTICONS } from '@/data/emoticonsData';

class MessageService {
  private messageHistory: Message[] = [];
  private autoResponseTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

  // Simulate receiving messages with auto-responses
  public simulateIncomingMessage(
    contact: Contact,
    onMessageReceived: (message: Message) => void,
    onTypingChanged: (contactId: string, isTyping: boolean) => void
  ): void {
    // Don't send messages if contact is offline
    if (contact.status === UserStatus.OFFLINE) {
      return;
    }

    // Clear existing timeout for this contact
    const existingTimeout = this.autoResponseTimeouts.get(contact.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set typing indicator
    onTypingChanged(contact.id, true);

    // Simulate typing delay (1-3 seconds)
    const typingDelay = Math.random() * 2000 + 1000;
    const timeout = setTimeout(() => {
      onTypingChanged(contact.id, false);
      
      // Generate auto-response based on contact personality
      const response = this.generateAutoResponse(contact);
      const message: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        senderId: contact.id,
        recipientId: 'current-user',
        content: response,
        timestamp: new Date(),
        type: MessageType.TEXT,
        emoticons: this.extractEmoticons(response)
      };

      onMessageReceived(message);
      this.messageHistory.push(message);
    }, typingDelay);

    this.autoResponseTimeouts.set(contact.id, timeout);
  }

  private generateAutoResponse(contact: Contact): string {
    const responses = this.getResponsesForContact(contact);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getResponsesForContact(contact: Contact): string[] {
    // Generate responses based on contact's personality and status
    const baseResponses = [
      "¡Hola! ¿Cómo estás? :)",
      "¿Qué tal todo?",
      "¡Hey! ¿Cómo has estado?",
      "¡Hola! :D",
      "¿Todo bien?",
      "¡Buenas! ¿Qué haces?",
    ];

    // Add personality-based responses based on personal message
    if (contact.personalMessage) {
      if (contact.personalMessage.includes('estudian')) {
        baseResponses.push(
          "Estoy estudiando también :S",
          "¡Los exámenes son terribles! :(",
          "¿Ya terminaste de estudiar?",
          "Necesito un descanso de tanto estudio :P"
        );
      }
      
      if (contact.personalMessage.includes('FIFA') || contact.personalMessage.includes('jugan')) {
        baseResponses.push(
          "¡Vamos a jugar FIFA! :D",
          "¿Una partidita?",
          "Estoy mejorando mi técnica ;)",
          "¡Mi equipo favorito va ganando! (y)"
        );
      }

      if (contact.personalMessage.includes('música') || contact.personalMessage.includes('Shakira')) {
        baseResponses.push(
          "¡Amo esa canción! (h)",
          "¿Has escuchado el nuevo álbum?",
          "La música de hoy está genial :D",
          "Compárteme esa canción :P"
        );
      }

      if (contact.personalMessage.includes('Friends') || contact.personalMessage.includes('viendo')) {
        baseResponses.push(
          "¡Friends es lo máximo! :D",
          "¿Cuál es tu episodio favorito?",
          "Ross y Rachel forever (h)",
          "Joey es el mejor :P"
        );
      }

      if (contact.personalMessage.includes('programan') || contact.personalMessage.includes('Visual Basic')) {
        baseResponses.push(
          "¿En qué estás programando?",
          "Visual Basic es genial para empezar",
          "Estoy aprendiendo C++ :S",
          "¿Me ayudas con mi código? :P"
        );
      }
    }

    // Add status-based responses
    switch (contact.status) {
      case UserStatus.BUSY:
        baseResponses.push(
          "Estoy ocupado pero puedo chatear un rato",
          "Solo un ratito, tengo cosas que hacer :S",
          "Rápido, que ando apurado :P"
        );
        break;
      case UserStatus.AWAY:
        baseResponses.push(
          "Acabo de regresar",
          "Estaba haciendo otras cosas",
          "¿Me escribiste hace rato?"
        );
        break;
    }

    return baseResponses;
  }

  public extractEmoticons(message: string): Array<{ shortcut: string; position: number }> {
    const emoticons: Array<{ shortcut: string; position: number }> = [];
    
    for (const emoticon of CLASSIC_EMOTICONS) {
      let searchIndex = 0;
      let position = message.indexOf(emoticon.shortcut, searchIndex);
      
      while (position !== -1) {
        emoticons.push({
          shortcut: emoticon.shortcut,
          position: position
        });
        
        searchIndex = position + emoticon.shortcut.length;
        position = message.indexOf(emoticon.shortcut, searchIndex);
      }
    }

    // Sort by position for proper rendering
    return emoticons.sort((a, b) => a.position - b.position);
  }

  public replaceEmoticonsInMessage(message: string): string {
    let result = message;
    
    // Sort emoticons by shortcut length (longest first) to avoid partial matches
    const sortedEmoticons = [...CLASSIC_EMOTICONS].sort(
      (a, b) => b.shortcut.length - a.shortcut.length
    );
    
    for (const emoticon of sortedEmoticons) {
      const regex = new RegExp(this.escapeRegExp(emoticon.shortcut), 'g');
      result = result.replace(regex, `<img src="${emoticon.imageUrl}" alt="${emoticon.shortcut}" class="inline-emoticon" title="${emoticon.description}" />`);
    }
    
    return result;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public sendMessage(
    content: string,
    recipientId: string,
    onMessageSent: (message: Message) => void,
    onContactTyping: (contactId: string, isTyping: boolean) => void,
    onMessageReceived: (message: Message) => void,
    recipient: Contact
  ): Message {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId: 'current-user',
      recipientId,
      content,
      timestamp: new Date(),
      type: MessageType.TEXT,
      emoticons: this.extractEmoticons(content)
    };

    this.messageHistory.push(message);
    onMessageSent(message);

    // Simulate auto-response after a delay (only if contact is not offline)
    if (recipient.status !== UserStatus.OFFLINE) {
      const responseDelay = Math.random() * 3000 + 2000; // 2-5 seconds
      setTimeout(() => {
        this.simulateIncomingMessage(
          recipient,
          onMessageReceived,
          onContactTyping
        );
      }, responseDelay);
    }

    return message;
  }

  public getMessageHistory(contactId: string): Message[] {
    return this.messageHistory.filter(
      msg => msg.senderId === contactId || msg.recipientId === contactId
    );
  }

  public clearMessageHistory(contactId: string): void {
    this.messageHistory = this.messageHistory.filter(
      msg => msg.senderId !== contactId && msg.recipientId !== contactId
    );
  }

  public simulateNudge(
    fromContact: Contact,
    onNudgeReceived: (contactId: string) => void
  ): void {
    if (fromContact.status === UserStatus.OFFLINE) return;

    setTimeout(() => {
      onNudgeReceived(fromContact.id);
    }, Math.random() * 2000 + 1000);
  }
}

export const messageService = new MessageService();