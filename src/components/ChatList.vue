<script setup lang="ts">
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
