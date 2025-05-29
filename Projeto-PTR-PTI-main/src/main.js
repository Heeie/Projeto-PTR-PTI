import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisEquipamento from './components/RegistrarEquipamento.vue';
import Inicio from './components/PaginaInicio.vue';
import CriarConta from './components/CriarConta.vue';

// Configuração das rotas
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage },  // Rota para a página de login
    { path: '/home', component: HomePage },  // Rota para a página inicial
    { path: '/registroEquipamento', component: RegisEquipamento },

    { path: '/', component: Inicio },
    { path: '/criar_conta', component: CriarConta },


    
  ],
});

// Criando a instância do Vue
const app = createApp(App);
app.use(router); // Registrando o Vue Router
app.mount('#app'); // Montando o app
