<script setup lang="ts">
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
