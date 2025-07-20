<template>
  <div class="carrinho-page">
    <button class="top-create-btn" @click="$router.push('/home')">
        Voltar ao Home
      </button>
    <h1>🛒 Carrinho de Compras</h1>

    <div v-if="carrinho.length === 0" class="vazio">
      <p>O carrinho está vazio.</p>
      <router-link to="/home">Voltar às compras</router-link>
    </div>

    <div v-else class="itens">
      <div
        v-for="(item, index) in carrinho"
        :key="index"
        class="item-carrinho"
      >
        <img
          :src="item.imagem || '/images/default.jpg'"
          alt="Imagem do produto"
          @click="irParaDetalhes(item._id)"
          style="cursor: pointer;"
        />
        <div @click="irParaDetalhes(item._id)" style="cursor: pointer;">
          <h3>{{ item.nome }}</h3>
          <p>Preço: € {{ Number(item.preco).toFixed(2) }}</p>
        </div>
        <div>
          <p>Quantidade: {{ item.quantidade }}</p>
          <button @click="diminuirQuantidade(index)">➖</button>
          <button @click="removerItem(index)">🗑️</button>
        </div>
      </div>


      <div class="total">
        <h2>Total: € {{ totalCarrinho.toFixed(2) }}</h2>
        <button @click="finalizarCompra">Finalizar Compra</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const carrinho = ref([])
const router = useRouter()

function carregarCarrinho() {
  const dados = JSON.parse(localStorage.getItem('carrinho')) || []
  carrinho.value = dados
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho.value))
}

function removerItem(index) {
  carrinho.value.splice(index, 1)
  salvarCarrinho()
}

function diminuirQuantidade(index) {
  if (carrinho.value[index].quantidade > 1) {
    carrinho.value[index].quantidade--
  } else {
    carrinho.value.splice(index, 1)
  }
  salvarCarrinho()
}

function irParaDetalhes(id) {
  router.push(`/produto/${id}`)
}

const totalCarrinho = computed(() =>
  carrinho.value.reduce((total, item) => total + item.preco * item.quantidade, 0)
)

function finalizarCompra() {
  router.push('/finalizar-compra')
}

onMounted(() => {
  carregarCarrinho()
})
</script>


<style scoped>
.item-carrinho button {
  margin-right: 5px;
}

.carrinho-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.vazio {
  text-align: center;
  font-size: 18px;
}

.item-carrinho {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  gap: 20px;
}

.item-carrinho img {
  width: 100px;
  height: auto;
  border-radius: 5px;
}

.item-carrinho button {
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.item-carrinho button:hover {
  background-color: #bb2d3b;
}

.total {
  text-align: right;
  margin-top: 30px;
}

.total button {
  padding: 10px 20px;
  background-color: #198754;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.total button:hover {
  background-color: #157347;
}
</style>
