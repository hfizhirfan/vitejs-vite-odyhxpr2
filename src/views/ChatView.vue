<script setup lang="ts">
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
  router.push(`/chat/${id}`);
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
