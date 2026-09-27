<script setup lang="ts">
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
