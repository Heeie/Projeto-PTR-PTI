<template>
  <div class="container">
     <button class="voltar-btn" @click="this.$router.push('/home')">⬅ Voltar à Página Principal</button>
    <h2>📋 Histórico de Transações</h2>

    <div v-if="loading">Carregando transações...</div>
    <div v-else-if="transacoes.length === 0">Nenhuma transação encontrada.</div>

    <div v-else>
      <div v-for="(transacao, index) in transacoes" :key="index" class="transacao-card">
        <h3>{{ transacao.tipo.toUpperCase() }} - {{ formatarData(transacao.createdAt) }}</h3>
        <p><strong>Loja:</strong> {{ transacao.loja_id?.nome || 'Desconhecida' }}</p>
        <p><strong>Total:</strong> €{{ transacao.total.toFixed(2) }}</p>
        <p><strong>Canal:</strong> {{ transacao.canal === 'online' ? 'Online' : 'Loja Física' }}</p>
          <p><strong>Vendedor:</strong> {{ transacao.vendedor_id?.nome || 'Não atribuído' }}</p>


        <ul>
          <li v-for="eq in transacao.equipamentos" :key="eq._id">
            {{ eq.nome }} - {{ eq.marca }} {{ eq.modelo }} (€{{ eq.preco }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const transacoes = ref([])
const loading = ref(true)

const formatarData = (data) => new Date(data).toLocaleString('pt-PT')

onMounted(async () => {
  try {
    const token = localStorage.getItem('token') // ou onde você guardar o JWT
    const response = await axios.get('/transacoes/todas', {

      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    transacoes.value = response.data
  } catch (err) {
    console.error('Erro ao buscar transações:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.transacao-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  background: #f9f9f9;
}
button {
  width: fit-content;
  padding: 8px 16px;
  margin-right: 8px;
  background-color: #0d6efd;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0b5ed7;
}

</style>
