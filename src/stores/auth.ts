import { defineStore } from 'pinia';
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
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      formattedName
    )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

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
