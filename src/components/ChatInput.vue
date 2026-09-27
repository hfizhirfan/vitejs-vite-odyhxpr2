<script setup lang="ts">
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
