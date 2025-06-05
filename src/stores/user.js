import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // Estado reativo com persistência em localStorage
  const username = ref(localStorage.getItem('username') || '');

  // Define o nome do utilizador e persiste no localStorage
  function setUsername(name) {
    username.value = name;
    localStorage.setItem('username', name);
  }

  // Limpa o nome do utilizador e remove do localStorage
  function logout() {
    username.value = '';
    localStorage.removeItem('username');
  }

  return {
    username,
    setUsername,
    logout,
  };
});
