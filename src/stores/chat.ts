import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Contact, Message } from '../types/chat';
import { dummyContacts } from '../data/dummyChats';

export const useChatStore = defineStore('chat', () => {
  const contacts = ref<Contact[]>(JSON.parse(JSON.stringify(dummyContacts)));
  const activeContactId = ref<string | null>(null);
  const searchQuery = ref<string>('');

  const activeContact = computed(() => {
    if (!activeContactId.value) return null;
    return contacts.value.find((c) => c.id === activeContactId.value) || null;
  });

  const filteredContacts = computed(() => {
    let list = [...contacts.value];

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    list.sort(
      (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    return list;
  });

  const totalUnreadCount = computed(() => {
    return contacts.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  });

  function selectContact(id: string) {
    activeContactId.value = id;
    const contact = contacts.value.find((c) => c.id === id);
    if (contact) {
      contact.unreadCount = 0;
    }
  }

  function sendMessage(text: string) {
    if (!text.trim() || !activeContactId.value) return;

    const contact = contacts.value.find((c) => c.id === activeContactId.value);
    if (!contact) return;

    const timestamp = new Date().toISOString();
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderId: 'me',
      text: text.trim(),
      timestamp,
    };

    contact.messages.push(newMessage);
    contact.lastMessageText = newMessage.text;
    contact.lastMessageTime = timestamp;

    const contactId = contact.id;
    setTimeout(() => {
      const target = contacts.value.find((c) => c.id === contactId);
      if (!target) return;

      const replyReplies = [
        "That's fantastic! Thanks for the update.",
        'Noted, I will take care of this right away.',
        'Sounds good to me! Let me know if you need anything else.',
        'Got it. Let’s catch up later today.',
        'Awesome, great progress on the project!',
      ];
      const randomReply =
        replyReplies[Math.floor(Math.random() * replyReplies.length)];

      const replyTimestamp = new Date().toISOString();
      const replyMessage: Message = {
        id: `msg-reply-${Date.now()}`,
        senderId: contactId,
        text: randomReply,
        timestamp: replyTimestamp,
      };

      target.messages.push(replyMessage);
      target.lastMessageText = replyMessage.text;
      target.lastMessageTime = replyTimestamp;

      if (activeContactId.value !== contactId) {
        target.unreadCount = (target.unreadCount || 0) + 1;
      }
    }, 1200);
  }

  return {
    contacts,
    activeContactId,
    searchQuery,
    activeContact,
    filteredContacts,
    totalUnreadCount,
    selectContact,
    sendMessage,
  };
});
