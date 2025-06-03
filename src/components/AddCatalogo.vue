<template>
  <div>
    <header>
      <h1 @click="() => router.push('/home')" style="cursor:pointer;">FromU2Me</h1>

      <button class="top-create-btn" @click="loginOrRegister">
        Login / Criar Conta
      </button>

      <nav class="nav-container">
        <ul class="nav-center">
          <li><a href="/home">Início</a></li>
          <li><a href="/home#produtos">Produtos</a></li>
          <li><a href="/home#contato">Contato</a></li>
          <li><a href="/addToCatalog">Adicionar Catálogo</a></li>
          <li><a href="/registroEquipamento" style="cursor:pointer;">Registar Equipamento</a></li>
          <li><a @click="finalizarCompra">🛒 Carrinho ({{ carrinhoCount }})</a></li>
        </ul>
      </nav>
    </header>

    <section class="banner">
      <div>
        <h2>Adicionar Categoria</h2>
        <form @submit.prevent="adicionarCategoria">
          <input type="text" v-model="novaCategoria.nome" placeholder="Nome da categoria" required />
          <textarea v-model="novaCategoria.descricao" placeholder="Descrição da categoria"></textarea>
          <button id="regisbtn" type="submit">Adicionar</button>
        </form>
      </div>

      <div style="margin-top: 30px;">
        <h2>Adicionar Tipo</h2>
        <form @submit.prevent="adicionarTipo">
          <input type="text" v-model="novoTipo.nome" placeholder="Nome do tipo" required />
          <textarea v-model="novoTipo.descricao" placeholder="Descrição do tipo"></textarea>
          <button id="regisbtn" type="submit">Adicionar</button>
        </form>
      </div>
    </section>

    <section id="contato" class="contato">
      <h2>Entre em contato</h2>
      <p>Email: contato@fromu2me.com</p>
      <p>Telefone: (11) 99999-9999</p>
    </section>

    <footer>
      <p>&copy; 2025 Loja Tech - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarrinhoStore } from '@/stores/carrinho'

const router = useRouter()
const carrinhoStore = useCarrinhoStore()

const carrinho = computed(() => carrinhoStore.equipamentos)
const carrinhoCount = computed(() =>
  carrinho.value.reduce((total, item) => total + (item.quantidade || 1), 0)
)

const novaCategoria = ref({ nome: '', descricao: '' })
const novoTipo = ref({ nome: '', descricao: '' })

function loginOrRegister() {
  router.push('/login')
}

function finalizarCompra() {
  router.push('/comprar')
}

function adicionarCategoria() {
  fetch('http://localhost:3000/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaCategoria.value)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Categoria adicionada:', data)
      novaCategoria.value = { nome: '', descricao: '' }
    })
    .catch(err => alert('Erro ao adicionar categoria: ' + err.message))
}

function adicionarTipo() {
  fetch('http://localhost:3000/api/tipos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoTipo.value)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Tipo adicionado:', data)
      novoTipo.value = { nome: '', descricao: '' }
    })
    .catch(err => alert('Erro ao adicionar tipo: ' + err.message))
}
</script>
  
  

<style scoped>
/* Header */
header {
  background: #0d6efd;
  padding: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 0 0 10px 10px;
  margin-bottom: 30px;
}

h1 {
  margin: 10;
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
}

/* Botão "Criar Conta" fora da barra central */
.top-create-btn {
  position: absolute;
  top: auto;
  right: 20px;
  background-color: white;
  color: #0d6efd;
  border: 2px solid white;
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  width: auto !important;
}

.top-create-btn:hover {
  background-color: #0d6efd;
  color: white;
  border-color: #ffffff;
}

/* Barra central de navegação */
nav.nav-container {
  max-width: max-content;
  margin: 0 auto 40px auto;
  background: #0d6efd;
  border: 2px solid white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
}

ul.nav-center {
  list-style: none;
  display: flex;
  gap: auto;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  justify-content: center;
}

ul.nav-center li a {
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

ul.nav-center li a:hover {
  background-color: #084298;
  cursor: pointer;
}





.nav-right {
  margin-left: auto;
}

.nav-right button {
  background-color: white;
  color: #0d6efd;
  border: 3px solid #0d6efd;
  padding: 12px 25px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-right button:hover {
  background-color: #0d6efd;
  color: white;
  border-color: white;
}
/* Banner */
.banner {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(to right, #0d6efd, #6610f2);
  color: #fff;
}

/* Botão de registo extra no banner */
.botao-registar {
  margin-top: 20px;
}

.botao-registar button {
  background-color: white;
  color: #0d6efd;
  border: 3px solid white;
  padding: 12px 25px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.botao-registar button:hover {
  background-color: #0d6efd;
  color: white;
  border-color: white;
}

/* Produtos */
.produtos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.produto {
  background: #fff;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.produto img {
  max-width: 100%;
  border-radius: 5px;
}

/* Contato */
.contato {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
}

/* Footer */
footer {
  background: #0d6efd;
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  margin-top: 40px;
  border-radius: 10px 10px 0 0;
}

/* Responsividade */
@media (max-width: 600px) {
  nav.nav-container {
    flex-direction: column;
    gap: 10px;
  }

  ul.nav-center {
    justify-content: center;
  }

  .nav-right {
    margin-left: 0;
  }

  .nav-right button {
    width: 100%;
  }
}
</style>
