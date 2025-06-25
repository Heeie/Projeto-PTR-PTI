<template>
  <header class="navbar">
    <h1 class="logo">Minha Loja</h1>
    <div class="user-info" v-if="userStore.username">
      Olá, {{ userStore.username }}
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<style scoped>
.navbar {
  background-color: #0d6efd;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 10px 10px;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
}

.user-info {
  font-size: 1rem;
}
</style>
