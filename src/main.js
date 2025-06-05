import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import axios from 'axios';

// Importação de componentes para as rotas
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisEquipamento from './components/RegistrarEquipamento.vue';
import Inicio from './components/PaginaInicio.vue';
import CriarConta from './components/CriarConta.vue';
import ADDCatalogo from './components/AddCatalogo.vue';
import InfoUser from './components/InfoUser.vue';
import PaginaProduto from './components/PaginaProduto.vue';
import Loja from './components/CriarLoja.vue';
import Change from './components/ChangeRole.vue';
import Compra from './components/CompraProduto.vue';
import Carrinho from './components/PaginaCarrinho.vue';

// Configuração das rotas
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Inicio },
    { path: '/login', component: LoginPage },
    { path: '/home', component: HomePage },
    { path: '/registroEquipamento', component: RegisEquipamento },
    { path: '/criar_conta', component: CriarConta },
    { path: '/addToCatalog', component: ADDCatalogo },
    { path: '/infoUtilizador', component: InfoUser },
    { path: '/produto/:id', name: 'DetalhesProduto', component: PaginaProduto },
    { path: '/criarLoja', component: Loja },
    { path: '/changerole', component: Change },
    { path: '/comprar', component: Compra },
    { path: '/carrinho', component: Carrinho },
  ],
});

// Criação da instância do Vue
const app = createApp(App);

// Uso do Pinia ANTES de montar
const pinia = createPinia();
app.use(pinia);

// Registro do Vue Router
app.use(router);

// Monta o app no #app (do index.html)
app.mount('#app');

// Configuração global do Axios
axios.defaults.baseURL = 'http://localhost:3000/api';

// Adiciona o token a cada requisição (se existir)
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
