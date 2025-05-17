<template>
    <div class="detalhes">
      <header>
        <h1>Detalhes do Produto</h1>
        <button @click="voltar">← Voltar</button>
      </header>
  
      <div v-if="produto" class="produto-info">
        <img :src="produto.imagem" alt="Imagem do produto" />
        <h2>{{ produto.nome }}</h2>
        <p><strong>Marca:</strong> {{ produto.marca }}</p>
        <p><strong>Modelo:</strong> {{ produto.modelo }}</p>
        <p><strong>Estado:</strong> {{ produto.estado }}</p>
        <p><strong>Preço:</strong> € {{ Number(produto.preco).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) }}</p>
      </div>
  
      <div v-else class="carregando">
        <p>Carregando detalhes do produto...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  const produto = ref(null);
  
  function voltar() {
    router.back();
  }
  
  onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(`http://localhost:3000/api/equipamentos/${id}`);
    produto.value = res.data;
  } catch (err) {
    console.error('Erro ao carregar produto:', err);
  }
});

  </script>
  
  <style scoped>
  .detalhes {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  button {
    background-color: #0d6efd;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #084298;
  }
  
  .produto-info {
    text-align: center;
  }
  
  .produto-info img {
    max-width: 300px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  p {
    margin: 10px 0;
    font-size: 18px;
  }
  
  .carregando {
    text-align: center;
    font-size: 18px;
    color: #666;
  }
  </style>
  