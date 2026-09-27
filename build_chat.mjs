import fs from 'fs';
import path from 'path';

const files = {
  'src/types/chat.ts': `export interface Message {
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
`,

  'src/utils/nameFormat.ts': `export function emailToTitleCase(email: string): string {
  if (!email || !email.includes('@')) {
    return email || 'Guest';
  }

  const prefix = email.split('@')[0];
  const cleaned = prefix.replace(/[._\\-+]/g, ' ');

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
`,

  'src/utils/dateFormat.ts': `export function formatChatListTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds >= 0 && diffInSeconds < 60) {
    return 'just now';
  }

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return \`\${hours}:\${minutes}\`;
  }

  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  return \`\${day} \${month}\`;
}

export function formatMessageTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return \`\${hours}:\${minutes}\`;
}
`,

  'src/utils/format.spec.ts': `import { describe, it, expect } from 'vitest';
import { emailToTitleCase } from './nameFormat';
import { formatChatListTime, formatMessageTime } from './dateFormat';

describe('emailToTitleCase', () => {
  it('converts email prefix with underscore to Title Case', () => {
    expect(emailToTitleCase('chris_evans@example.com')).toBe('Chris Evans');
  });

  it('converts email prefix with dot to Title Case', () => {
    expect(emailToTitleCase('tony.stark@marvel.com')).toBe('Tony Stark');
  });

  it('converts single word email prefix to Title Case', () => {
    expect(emailToTitleCase('batman@wayne.enterprises')).toBe('Batman');
  });

  it('handles multiple separators properly', () => {
    expect(emailToTitleCase('peter_parker-spider@dailybugle.com')).toBe('Peter Parker Spider');
  });
});

describe('formatChatListTime', () => {
  it('returns "just now" for dates within 60 seconds', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatChatListTime(recent)).toBe('just now');
  });

  it('returns HH:mm for timestamps on the same day (> 1 min)', () => {
    const today = new Date();
    today.setHours(13, 5, 0, 0);
    if (Math.abs(Date.now() - today.getTime()) < 60000) {
      today.setHours(today.getHours() - 1);
    }
    const formatted = formatChatListTime(today);
    expect(formatted).toMatch(/^\\d{2}:\\d{2}$/);
  });

  it('returns "d Mmm" format for previous dates', () => {
    const pastDate = new Date(2025, 9, 10, 10, 0, 0);
    expect(formatChatListTime(pastDate)).toBe('10 Oct');
  });
});

describe('formatMessageTime', () => {
  it('formats time in HH:mm format', () => {
    const date = new Date(2026, 0, 1, 14, 30);
    expect(formatMessageTime(date)).toBe('14:30');
  });
});
`,

  'src/data/dummyChats.ts': `import { Contact } from '../types/chat';

const now = new Date();
const minutesAgo = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
const hoursAgo = (hrs: number) => new Date(now.getTime() - hrs * 3600 * 1000).toISOString();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 3600 * 1000).toISOString();

export const dummyContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 2,
    lastMessageText: 'Hey! Are we still meeting for coffee this afternoon?',
    lastMessageTime: minutesAgo(0.5),
    messages: [
      { id: 'm1-1', senderId: '1', text: 'Hi there! Did you get a chance to review the Vue project documentation?', timestamp: hoursAgo(2) },
      { id: 'm1-2', senderId: 'me', text: 'Yes, looking into it right now. The design looks very clean and intuitive!', timestamp: hoursAgo(1) },
      { id: 'm1-3', senderId: '1', text: 'Awesome! Let me know if you have any questions.', timestamp: minutesAgo(5) },
      { id: 'm1-4', senderId: '1', text: 'Hey! Are we still meeting for coffee this afternoon?', timestamp: minutesAgo(0.5) },
    ],
  },
  {
    id: '2',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 1,
    lastMessageText: 'The latest pull request has been merged to develop.',
    lastMessageTime: minutesAgo(12),
    messages: [
      { id: 'm2-1', senderId: '2', text: 'Hey! Did you check out the new Tailwind config?', timestamp: hoursAgo(3) },
      { id: 'm2-2', senderId: 'me', text: 'Yes, the indigo palette looks great with dark and light accents.', timestamp: hoursAgo(1) },
      { id: 'm2-3', senderId: '2', text: 'The latest pull request has been merged to develop.', timestamp: minutesAgo(12) },
    ],
  },
  {
    id: '3',
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'Sounds good, see you tomorrow morning!',
    lastMessageTime: hoursAgo(1),
    messages: [
      { id: 'm3-1', senderId: '3', text: 'Do we have a sprint planning session tomorrow?', timestamp: hoursAgo(2) },
      { id: 'm3-2', senderId: 'me', text: 'Yes, at 10:00 AM sharp on Google Meet.', timestamp: hoursAgo(1.5) },
      { id: 'm3-3', senderId: '3', text: 'Sounds good, see you tomorrow morning!', timestamp: hoursAgo(1) },
    ],
  },
  {
    id: '4',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 3,
    lastMessageText: 'Can you verify the API response format for chat lists?',
    lastMessageTime: hoursAgo(3),
    messages: [
      { id: 'm4-1', senderId: '4', text: 'We updated the backend endpoints.', timestamp: hoursAgo(4) },
      { id: 'm4-2', senderId: '4', text: 'The payload now includes unread count and sender timestamps.', timestamp: hoursAgo(3.5) },
      { id: 'm4-3', senderId: '4', text: 'Can you verify the API response format for chat lists?', timestamp: hoursAgo(3) },
    ],
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'Thank you so much for the swift feedback!',
    lastMessageTime: hoursAgo(5),
    messages: [
      { id: 'm5-1', senderId: '5', text: 'I sent over the updated Figma mockups.', timestamp: hoursAgo(6) },
      { id: 'm5-2', senderId: 'me', text: 'Checked them out! The mobile responsiveness is well-thought-out.', timestamp: hoursAgo(5.5) },
      { id: 'm5-3', senderId: '5', text: 'Thank you so much for the swift feedback!', timestamp: hoursAgo(5) },
    ],
  },
  {
    id: '6',
    name: 'David Beckham',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'Great game yesterday, talk soon!',
    lastMessageTime: daysAgo(1),
    messages: [
      { id: 'm6-1', senderId: '6', text: 'Hey! Did you catch the match last night?', timestamp: daysAgo(1.2) },
      { id: 'm6-2', senderId: 'me', text: 'Yes! What an incredible comeback in the 90th minute.', timestamp: daysAgo(1.1) },
      { id: 'm6-3', senderId: '6', text: 'Great game yesterday, talk soon!', timestamp: daysAgo(1) },
    ],
  },
  {
    id: '7',
    name: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 4,
    lastMessageText: 'Could you share the repository link?',
    lastMessageTime: daysAgo(2),
    messages: [
      { id: 'm7-1', senderId: '7', text: 'Hi! Are you ready for the code review?', timestamp: daysAgo(2.1) },
      { id: 'm7-2', senderId: '7', text: 'Could you share the repository link?', timestamp: daysAgo(2) },
    ],
  },
  {
    id: '8',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'I will prepare the deployment notes for production.',
    lastMessageTime: daysAgo(3),
    messages: [
      { id: 'm8-1', senderId: '8', text: 'Production release is scheduled for this Friday.', timestamp: daysAgo(3.2) },
      { id: 'm8-2', senderId: 'me', text: 'All feature branches are tested and good to go.', timestamp: daysAgo(3.1) },
      { id: 'm8-3', senderId: '8', text: 'I will prepare the deployment notes for production.', timestamp: daysAgo(3) },
    ],
  },
  {
    id: '9',
    name: 'Olivia Brown',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 1,
    lastMessageText: 'Let me know your thoughts on the design tokens.',
    lastMessageTime: daysAgo(4),
    messages: [
      { id: 'm9-1', senderId: '9', text: 'Let me know your thoughts on the design tokens.', timestamp: daysAgo(4) },
    ],
  },
  {
    id: '10',
    name: 'Daniel White',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'Got it, thanks for confirming.',
    lastMessageTime: daysAgo(5),
    messages: [
      { id: 'm10-1', senderId: '10', text: 'Did we switch the state manager to Pinia?', timestamp: daysAgo(5.2) },
      { id: 'm10-2', senderId: 'me', text: 'Yes, Pinia is now fully wired up with Composition API.', timestamp: daysAgo(5.1) },
      { id: 'm10-3', senderId: '10', text: 'Got it, thanks for confirming.', timestamp: daysAgo(5) },
    ],
  },
  {
    id: '11',
    name: 'Charlotte Green',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'Have a wonderful weekend ahead!',
    lastMessageTime: daysAgo(6),
    messages: [
      { id: 'm11-1', senderId: '11', text: 'All sprint tasks have been completed.', timestamp: daysAgo(6.2) },
      { id: 'm11-2', senderId: '11', text: 'Have a wonderful weekend ahead!', timestamp: daysAgo(6) },
    ],
  },
  {
    id: '12',
    name: 'Lucas Garcia',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 2,
    lastMessageText: 'Do you have time for a quick 5-min sync?',
    lastMessageTime: daysAgo(7),
    messages: [
      { id: 'm12-1', senderId: '12', text: 'Hey, I have a quick question about router transitions.', timestamp: daysAgo(7.1) },
      { id: 'm12-2', senderId: '12', text: 'Do you have time for a quick 5-min sync?', timestamp: daysAgo(7) },
    ],
  },
  {
    id: '13',
    name: 'Ava Robinson',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'The client loved the prototype demonstration!',
    lastMessageTime: daysAgo(8),
    messages: [
      { id: 'm13-1', senderId: '13', text: 'The client loved the prototype demonstration!', timestamp: daysAgo(8) },
    ],
  },
  {
    id: '14',
    name: 'Ethan Hall',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'Will check it out today.',
    lastMessageTime: daysAgo(10),
    messages: [
      { id: 'm14-1', senderId: 'me', text: 'Hey Ethan, I pushed the unit test specs.', timestamp: daysAgo(10.2) },
      { id: 'm14-2', senderId: '14', text: 'Will check it out today.', timestamp: daysAgo(10) },
    ],
  },
  {
    id: '15',
    name: 'Isabella Lee',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'See you at the tech conference in Surabaya!',
    lastMessageTime: daysAgo(12),
    messages: [
      { id: 'm15-1', senderId: '15', text: 'Are you attending the Vue meetup next month?', timestamp: daysAgo(12.2) },
      { id: 'm15-2', senderId: 'me', text: 'Definitely, wouldn’t miss it.', timestamp: daysAgo(12.1) },
      { id: 'm15-3', senderId: '15', text: 'See you at the tech conference in Surabaya!', timestamp: daysAgo(12) },
    ],
  },
  {
    id: '16',
    name: 'Noah Walker',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 1,
    lastMessageText: 'Please review the security checklist.',
    lastMessageTime: daysAgo(14),
    messages: [
      { id: 'm16-1', senderId: '16', text: 'Please review the security checklist.', timestamp: daysAgo(14) },
    ],
  },
  {
    id: '17',
    name: 'Mia Anderson',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'Everything looks clean and well-structured.',
    lastMessageTime: daysAgo(16),
    messages: [
      { id: 'm17-1', senderId: '17', text: 'Everything looks clean and well-structured.', timestamp: daysAgo(16) },
    ],
  },
  {
    id: '18',
    name: 'Liam Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'Let’s benchmark the performance with Lighthouse.',
    lastMessageTime: daysAgo(18),
    messages: [
      { id: 'm18-1', senderId: '18', text: 'Let’s benchmark the performance with Lighthouse.', timestamp: daysAgo(18) },
    ],
  },
  {
    id: '19',
    name: 'Harper Clark',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'Asset bundle size has been reduced by 40%.',
    lastMessageTime: daysAgo(20),
    messages: [
      { id: 'm19-1', senderId: '19', text: 'Asset bundle size has been reduced by 40%.', timestamp: daysAgo(20) },
    ],
  },
  {
    id: '20',
    name: 'Benjamin Scott',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'Welcome aboard to the team!',
    lastMessageTime: daysAgo(22),
    messages: [
      { id: 'm20-1', senderId: '20', text: 'Welcome aboard to the team!', timestamp: daysAgo(22) },
    ],
  },
  {
    id: '21',
    name: 'Zoe Perez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    online: false,
    unreadCount: 0,
    lastMessageText: 'I will push the localization files today.',
    lastMessageTime: daysAgo(25),
    messages: [
      { id: 'm21-1', senderId: '21', text: 'I will push the localization files today.', timestamp: daysAgo(25) },
    ],
  },
  {
    id: '22',
    name: 'William Turner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 0,
    lastMessageText: 'Looking forward to the demo next week.',
    lastMessageTime: daysAgo(28),
    messages: [
      { id: 'm22-1', senderId: '22', text: 'Looking forward to the demo next week.', timestamp: daysAgo(28) },
    ],
  },
];
`,

  'src/stores/auth.ts': `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CurrentUser } from '../types/chat';
import { emailToTitleCase } from '../utils/nameFormat';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<CurrentUser | null>(null);

  const isAuthenticated = computed(() => currentUser.value !== null);

  function login(email: string, _password: string): boolean {
    if (!email || !_password) {
      return false;
    }

    const formattedName = emailToTitleCase(email);
    const avatarUrl = \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(
      formattedName
    )}&backgroundColor=b6e3f4,c0aede,d1d4f9\`;

    currentUser.value = {
      name: formattedName,
      email: email.trim(),
      avatar: avatarUrl,
    };

    return true;
  }

  function logout() {
    currentUser.value = null;
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
  };
});
`,

  'src/stores/chat.ts': `import { defineStore } from 'pinia';
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
      id: \`msg-\${Date.now()}-\${Math.random().toString(36).substring(2, 6)}\`,
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
        id: \`msg-reply-\${Date.now()}\`,
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
`,

  'src/router/index.ts': `import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../views/LoginView.vue';
import ChatView from '../views/ChatView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: '/chat/:id',
    name: 'ChatDetail',
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Chat' });
  } else {
    next();
  }
});

export default router;
`,

  'src/components/ChatListItem.vue': `<script setup lang="ts">
import { computed } from 'vue';
import { Contact } from '../types/chat';
import { formatChatListTime } from '../utils/dateFormat';

const props = defineProps<{
  contact: Contact;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const formattedTime = computed(() => {
  return formatChatListTime(props.contact.lastMessageTime);
});

function handleClick() {
  emit('select', props.contact.id);
}
</script>

<template>
  <div
    @click="handleClick"
    :class="[
      'flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-all duration-150 border-b border-slate-100',
      isSelected
        ? 'bg-indigo-50/80 border-l-4 border-l-indigo-600'
        : 'hover:bg-slate-50 border-l-4 border-l-transparent',
    ]"
  >
    <div class="relative flex-shrink-0">
      <img
        :src="contact.avatar"
        :alt="contact.name"
        class="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-200 ring-2 ring-white"
        loading="lazy"
      />
      <span
        v-if="contact.online"
        class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"
        title="Online"
      ></span>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-1">
        <h3
          :class="[
            'text-sm font-semibold truncate',
            isSelected ? 'text-indigo-950 font-bold' : 'text-slate-800',
          ]"
        >
          {{ contact.name }}
        </h3>
        <span
          :class="[
            'text-xs flex-shrink-0 ml-2 font-medium',
            contact.unreadCount > 0 ? 'text-indigo-600 font-semibold' : 'text-slate-400',
          ]"
        >
          {{ formattedTime }}
        </span>
      </div>

      <div class="flex items-center justify-between gap-2">
        <p
          :class="[
            'text-xs truncate',
            contact.unreadCount > 0 ? 'font-semibold text-slate-800' : 'text-slate-500',
          ]"
        >
          {{ contact.lastMessageText || 'No messages yet' }}
        </p>

        <span
          v-if="contact.unreadCount > 0"
          class="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-indigo-600 rounded-full shadow-sm"
        >
          {{ contact.unreadCount }}
        </span>
      </div>
    </div>
  </div>
</template>
`,

  'src/components/ChatBubble.vue': `<script setup lang="ts">
import { computed } from 'vue';
import { Message } from '../types/chat';
import { formatMessageTime } from '../utils/dateFormat';

const props = defineProps<{
  message: Message;
  senderName?: string;
  senderAvatar?: string;
}>();

const isMe = computed(() => props.message.senderId === 'me');
const formattedTime = computed(() => formatMessageTime(props.message.timestamp));
</script>

<template>
  <div
    :class="[
      'flex items-end gap-2 group mb-3',
      isMe ? 'justify-end' : 'justify-start',
    ]"
  >
    <img
      v-if="!isMe && senderAvatar"
      :src="senderAvatar"
      :alt="senderName || 'Avatar'"
      class="w-7 h-7 rounded-full object-cover mb-1 shadow-xs flex-shrink-0"
    />

    <div
      :class="[
        'max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm transition-all text-sm leading-relaxed break-words',
        isMe
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs'
          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs',
      ]"
    >
      <div
        v-if="!isMe && senderName"
        class="text-[11px] font-semibold text-indigo-600 mb-0.5"
      >
        {{ senderName }}
      </div>

      <div class="whitespace-pre-wrap">{{ message.text }}</div>

      <div
        :class="[
          'text-[10px] mt-1 text-right flex items-center justify-end gap-1 font-medium',
          isMe ? 'text-indigo-200' : 'text-slate-400',
        ]"
      >
        <span>{{ formattedTime }}</span>
        <svg
          v-if="isMe"
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5 inline-block text-indigo-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  </div>
</template>
`,

  'src/components/ChatInput.vue': `<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'send', message: string): void;
}>();

const text = ref('');

function handleSubmit() {
  if (!text.value.trim()) return;
  emit('send', text.value);
  text.value = '';
}
</script>

<template>
  <div class="p-3 sm:p-4 bg-white border-t border-slate-200/80">
    <form @submit.prevent="handleSubmit" class="flex items-center gap-2">
      <div class="relative flex-1">
        <input
          v-model="text"
          type="text"
          placeholder="Type a message and press Enter..."
          class="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          @keydown.enter.exact.prevent="handleSubmit"
        />
      </div>

      <button
        type="submit"
        :disabled="!text.trim()"
        :class="[
          'p-3 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center',
          text.trim()
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-95 shadow-indigo-200'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed',
        ]"
        title="Send message (Enter)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5 -rotate-45 ml-0.5"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </form>
  </div>
</template>
`,

  'src/components/ChatRoom.vue': `<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { Contact } from '../types/chat';
import ChatBubble from './ChatBubble.vue';
import ChatInput from './ChatInput.vue';

const props = defineProps<{
  contact: Contact;
}>();

const emit = defineEmits<{
  (e: 'send', text: string): void;
  (e: 'back'): void;
}>();

const messagesContainer = ref<HTMLDivElement | null>(null);

function scrollToBottom(smooth = true) {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  });
}

watch(
  () => props.contact.messages.length,
  () => {
    scrollToBottom(true);
  }
);

watch(
  () => props.contact.id,
  () => {
    scrollToBottom(false);
  }
);

onMounted(() => {
  scrollToBottom(false);
});

function handleSendMessage(text: string) {
  emit('send', text);
}
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 relative">
    <div
      class="h-16 px-4 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs z-10"
    >
      <div class="flex items-center gap-3">
        <button
          @click="emit('back')"
          class="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          title="Back to chat list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div class="relative">
          <img
            :src="contact.avatar"
            :alt="contact.name"
            class="w-10 h-10 rounded-full object-cover shadow-xs ring-2 ring-indigo-50"
          />
          <span
            v-if="contact.online"
            class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <div>
          <h2 class="text-sm font-bold text-slate-800 leading-tight">
            {{ contact.name }}
          </h2>
          <p class="text-xs text-slate-500">
            <span v-if="contact.online" class="text-emerald-600 font-medium">Online</span>
            <span v-else>Offline</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1 text-slate-500">
        <button
          class="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Voice Call"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
        <button
          class="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="Video Call"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
    >
      <div class="flex justify-center my-2">
        <span class="px-3 py-1 bg-slate-200/80 text-[11px] font-medium text-slate-600 rounded-full shadow-2xs">
          Beginning of conversation with {{ contact.name }}
        </span>
      </div>

      <ChatBubble
        v-for="msg in contact.messages"
        :key="msg.id"
        :message="msg"
        :sender-name="contact.name"
        :sender-avatar="contact.avatar"
      />
    </div>

    <ChatInput @send="handleSendMessage" />
  </div>
</template>
`,

  'src/components/ChatList.vue': `<script setup lang="ts">
import { computed } from 'vue';
import { Contact, CurrentUser } from '../types/chat';
import ChatListItem from './ChatListItem.vue';

const props = defineProps<{
  contacts: Contact[];
  selectedId: string | null;
  searchQuery: string;
  currentUser: CurrentUser | null;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'select', id: string): void;
  (e: 'logout'): void;
}>();

const unreadTotal = computed(() => {
  return props.contacts.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
});

function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:searchQuery', target.value);
}
</script>

<template>
  <div class="flex flex-col h-full bg-white border-r border-slate-200">
    <div class="h-16 px-4 bg-slate-900 text-white flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img
          v-if="currentUser?.avatar"
          :src="currentUser.avatar"
          :alt="currentUser?.name"
          class="w-9 h-9 rounded-full bg-indigo-200 ring-2 ring-indigo-500/50 object-cover"
        />
        <div class="min-w-0">
          <h2 class="text-sm font-semibold truncate leading-tight">
            {{ currentUser?.name || 'My Account' }}
          </h2>
          <span class="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Now
          </span>
        </div>
      </div>

      <button
        @click="emit('logout')"
        class="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
        title="Sign out"
      >
        <span>Logout</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>

    <div class="p-3 bg-white border-b border-slate-100">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          :value="searchQuery"
          @input="handleSearchInput"
          type="text"
          placeholder="Search conversation..."
          class="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
        />
        <button
          v-if="searchQuery"
          @click="emit('update:searchQuery', '')"
          class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center justify-between mt-2.5 px-1 text-[11px] text-slate-500 font-medium">
        <span>Chats ({{ contacts.length }})</span>
        <span v-if="unreadTotal > 0" class="text-indigo-600 font-semibold">
          {{ unreadTotal }} unread
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
      <div v-if="contacts.length === 0" class="p-8 text-center text-slate-400 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 mx-auto mb-2 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        No conversations found for "{{ searchQuery }}"
      </div>

      <ChatListItem
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
        :is-selected="contact.id === selectedId"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
`,

  'src/views/LoginView.vue': `<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('chris_evans@example.com');
const password = ref('password123');
const errorMessage = ref('');

function handleLogin() {
  errorMessage.value = '';

  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Please provide both email and password to proceed.';
    return;
  }

  const success = authStore.login(email.value, password.value);
  if (success) {
    router.push('/chat');
  }
}

function fillDemo(userEmail: string) {
  email.value = userEmail;
  password.value = 'secret123';
  errorMessage.value = '';
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-slate-100 z-10 transition-all">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Gradin Chat</h1>
        <p class="text-sm text-slate-500 mt-1">Real-time messaging demo experience</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div
          v-if="errorMessage"
          class="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="e.g. chris_evans@example.com"
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Username is auto-derived in Title Case from email prefix</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          Sign In to Gradin Chat
        </button>
      </form>

      <div class="mt-6 pt-5 border-t border-slate-100 text-center">
        <p class="text-xs text-slate-500 mb-2 font-medium">Quick sample accounts:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            @click="fillDemo('chris_evans@example.com')"
            class="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-md transition-colors font-mono cursor-pointer"
          >
            chris_evans@...
          </button>
          <button
            type="button"
            @click="fillDemo('tony_stark@marvel.com')"
            class="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-md transition-colors font-mono cursor-pointer"
          >
            tony_stark@...
          </button>
          <button
            type="button"
            @click="fillDemo('steve.rogers@avengers.org')"
            class="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-md transition-colors font-mono cursor-pointer"
          >
            steve.rogers@...
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
`,

  'src/views/ChatView.vue': `<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';
import ChatList from '../components/ChatList.vue';
import ChatRoom from '../components/ChatRoom.vue';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const authStore = useAuthStore();

function syncRouteParam() {
  const paramId = route.params.id as string | undefined;
  if (paramId) {
    chatStore.selectContact(paramId);
  }
}

onMounted(() => {
  syncRouteParam();
});

watch(
  () => route.params.id,
  () => {
    syncRouteParam();
  }
);

function handleSelectContact(id: string) {
  chatStore.selectContact(id);
  router.push(\`/chat/\${id}\`);
}

function handleBackToList() {
  chatStore.activeContactId = null;
  router.push('/chat');
}

function handleSendMessage(text: string) {
  chatStore.sendMessage(text);
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex bg-slate-100 antialiased">
    <div class="w-full h-full flex flex-row overflow-hidden shadow-2xl">
      <div
        :class="[
          'w-full md:w-80 lg:w-96 flex-shrink-0 h-full transition-all duration-200',
          chatStore.activeContact ? 'hidden md:flex flex-col' : 'flex flex-col',
        ]"
      >
        <ChatList
          :contacts="chatStore.filteredContacts"
          :selected-id="chatStore.activeContactId"
          :search-query="chatStore.searchQuery"
          :current-user="authStore.currentUser"
          @update:search-query="chatStore.searchQuery = $event"
          @select="handleSelectContact"
          @logout="handleLogout"
        />
      </div>

      <div
        :class="[
          'flex-1 h-full bg-slate-50 transition-all duration-200',
          chatStore.activeContact ? 'flex flex-col' : 'hidden md:flex flex-col',
        ]"
      >
        <ChatRoom
          v-if="chatStore.activeContact"
          :contact="chatStore.activeContact"
          @send="handleSendMessage"
          @back="handleBackToList"
        />

        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 select-none"
        >
          <div class="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800">Select a conversation</h2>
          <p class="text-sm text-slate-500 max-w-sm mt-1.5">
            Choose a contact from the list on the left to start messaging in real-time.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
`,

  'src/App.vue': `<script setup lang="ts"></script>

<template>
  <router-view />
</template>
`,

  'src/main.ts': `import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
`,

  'tailwind.config.cjs': `module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
    },
  },
  plugins: [],
};
`,

  'postcss.config.cjs': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.resolve(relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Wrote:', relPath, 'Length:', content.length);
}

console.log('All files written successfully!');
