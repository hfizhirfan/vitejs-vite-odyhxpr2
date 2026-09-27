<script setup lang="ts">
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
