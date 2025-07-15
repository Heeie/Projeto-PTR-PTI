<template>
  <div class="detalhes">
    <header>
      <h1>Detalhes do Produto</h1>
      <button @click="voltar">← Voltar</button>
    </header>

    <template v-if="produto">
      <div class="produto-info">

      <img :src="produto.imagem" alt="Imagem do produto" />
      <h2>{{ produto.nome }}</h2>
      <p><strong>Marca:</strong> {{ produto.marca }}</p>
      <p><strong>Modelo:</strong> {{ produto.modelo }}</p>
      <p><strong>Estado:</strong> {{ produto.estado }}</p>
      <p><strong>Preço:</strong> € {{ Number(produto.preco).toLocaleString('pt-PT', { minimumFractionDigits: 2 }) }}</p>
      <button
      v-if="user"
      class="favoritar-btn"
      :class="{ favorito: favoritosMap[produto._id] }"
      @click.stop.prevent="alternarFavorito(produto._id)"
    >
      {{ favoritosMap[produto._id] ? '★ Remover Favorito' : '☆ Favoritar' }}
    </button>



    <button class="comprar-btn" @click="comprarProduto">Adicionar ao Carrinho</button>
    <button
      v-if="carrinhoStore.equipamentos.length > 0"
      id="carrinhoBtn"
      @click="finalizarCompra"
    >
      🛒 Carrinho ({{ carrinhoStore.equipamentos.length }})
    </button>
    

<p v-if="alertaVisivel" class="alerta-carrinho">
  Produto adicionado ao carrinho! Total: {{ carrinhoStore.equipamentos.length }} item(ns)
</p>

   <!-- conteúdo do produto -->
      </div>
    </template>

    <template v-else>
      <div class="carregando">
        <p>Carregando detalhes do produto...</p>
      </div>
    </template>

    

  </div>
</template>

  <script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useCarrinhoStore } from '@/stores/carrinho';

const route = useRoute();
const router = useRouter();
const produto = ref(null);
const user = ref(null);
const carrinhoStore = useCarrinhoStore();
const alertaVisivel = ref(false);

// FAVORITOS MAP
const favoritosMap = ref({});

// Voltar à página anterior
function voltar() {
  router.back();
}

function finalizarCompra() {
  router.push('/comprar');
}


function comprarProduto() {
  carrinhoStore.adicionarAoCarrinho(produto.value);
  alertaVisivel.value = true;

  setTimeout(() => {
    alertaVisivel.value = false;
  }, 2000);
}


async function carregarFavoritos() {
  try {
    const res = await axios.get('/utilizadores/favoritos', {
      withCredentials: true
    });
    const favoritos = res.data;

    favoritosMap.value = {};
    favoritos.forEach(equip => {
      favoritosMap.value[equip._id] = true;
    });
  } catch (err) {
    console.error('Erro ao carregar favoritos:', err);
  }
}

async function alternarFavorito(idEquipamento) {
  try {
    if (favoritosMap.value[idEquipamento]) {
      await axios.post(
        `/utilizadores/remover-favorito/${idEquipamento}`,
        {},
        { withCredentials: true }
      );
      favoritosMap.value[idEquipamento] = false;
    } else {
      await axios.post(
        `/utilizadores/favoritar/${idEquipamento}`,
        {},
        { withCredentials: true }
      );
      favoritosMap.value[idEquipamento] = true;
    }
  } catch (err) {
    console.error('Erro ao alternar favorito:', err);
    alert('Erro ao atualizar favorito.');
  }
}

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(`/equipamentos/${id}`);
    produto.value = res.data;

    const resUser = await axios.get('/utilizadores/perfil', {
      withCredentials: true
    });
    user.value = resUser.data;

    await carregarFavoritos();
  } catch (err) {
    console.error('Erro ao carregar produto ou utilizador:', err);
  }
});

</script>

  
<style scoped>
#carrinhoBtn {
  padding: 10px 20px;
  background-color: #198754;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

#carrinhoBtn:hover {
  background-color: #157347;
}

.favoritar-btn {
  background-color: transparent;
  border: 1px solid red;
  padding: 6px 10px;
  color: red;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
}

  .finalizar-btn {
  margin-top: 12px;
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.finalizar-btn:hover {
  background-color: #084298;
}

.favoritar-btn.favorito {
  background-color: #ffe066;
  color: #d9480f;
  border-color: #ffba08;
  font-weight: bold;
}

  .alerta-carrinho {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
}

  .comprar-btn {
  margin-top: 20px;
  background-color: #198754;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.comprar-btn:hover {
  background-color: #146c43;
}

  .detalhes {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(to bottom right, #ffffff, #f0f4ff);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 10px;
}

header h1 {
  font-size: 28px;
  color: #0d6efd;
  margin: 0;
}

button {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #084298;
}

.produto-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.produto-info img {
  max-width: 100%;
  width: 300px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 25px;
  object-fit: cover;
}

.produto-info h2 {
  font-size: 26px;
  color: #333;
  margin-bottom: 15px;
}

p {
  font-size: 18px;
  color: #444;
  margin: 8px 0;
  line-height: 1.5;
}

strong {
  color: #222;
}

.carregando {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 40px;
}

  </style>