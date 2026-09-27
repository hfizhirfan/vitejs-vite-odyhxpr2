export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  messages: Message[];
}

export interface CurrentUser {
  name: string;
  email: string;
  avatar: string;
}
