import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisEquipamento from './components/RegistrarEquipamento.vue';
import Inicio from './components/PaginaInicio.vue';
import CriarConta from './components/CriarConta.vue';
import ADDCatalogo from './components/AddCatalogo.vue';
import InfoUser from './components/InfoUser.vue';


import axios from 'axios';
// Configuração das rotas
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginPage },  // Rota para a página de login
    { path: '/home', component: HomePage },  // Rota para a página inicial
    { path: '/registroEquipamento', component: RegisEquipamento },

    { path: '/', component: Inicio },
    { path: '/criar_conta', component: CriarConta },
    { path: '/addToCatalog', component: ADDCatalogo },
    { path: '/infoUtilizador', component: InfoUser },



    
  ],
});

// Criando a instância do Vue
const app = createApp(App);
app.use(router); // Registrando o Vue Router
app.mount('#app'); // Montando o app



axios.defaults.baseURL = 'http://localhost:3000/api';

// Adiciona o token automaticamente em cada requisição
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

