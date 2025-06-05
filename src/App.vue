<template>
  <div>
    <AppNavbar />
    <router-view />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';

export default {
  components: {
    AppNavbar,
  },
};
</script>

<style>
/* Estilos globais, se necessário */
</style>
