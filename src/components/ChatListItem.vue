<script setup lang="ts">
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
