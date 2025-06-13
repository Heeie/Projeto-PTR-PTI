<template>
  <header>
    <h1>FromU2Me</h1>

    <nav class="nav-container">
      <ul class="nav-center">
        <li><router-link to="/home">Início</router-link></li>
      </ul>
    </nav>
  </header>

  <div class="avaliacao-container">
    <h2>Avaliação de Equipamento Avariado</h2>

    <form @submit.prevent="submeterAvaliacao">
      <select v-model="avaliacao.lojaId" required>
        <option value="" disabled>Selecione a loja</option>
        <option v-for="loja in lojas" :key="loja.id" :value="loja.id">
          {{ loja.nome }}
        </option>
      </select>

      <input v-model="avaliacao.clienteId" placeholder="ID do cliente" required />
      <input v-model="avaliacao.equipamentoId" placeholder="ID do equipamento" required />
      <input
        type="number"
        v-model.number="avaliacao.numeroExemplar"
        placeholder="Número do exemplar"
        required
      />
      <textarea
        v-model="avaliacao.descricaoProblema"
        placeholder="Descrição do problema"
        required
      ></textarea>
      <input
        type="number"
        v-model.number="avaliacao.numeroPedidoOrcamento"
        placeholder="Número do pedido de orçamento"
        required
      />
      <input
        type="number"
        v-model.number="avaliacao.custoEstimadoReparacao"
        placeholder="Custo estimado (€)"
      />
      <input v-model="avaliacao.estadoEquipamento" placeholder="Estado do equipamento" />

      <!-- para peçasASubstituir, precisaria de uma UI para adicionar objetos -->

      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Salvando...' : 'Salvar Avaliação' }}
      </button>
    </form>

    <p v-if="mensagemSucesso" class="sucesso">{{ mensagemSucesso }}</p>
    <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const avaliacao = ref({
  lojaId: '',
  clienteId: '',
  equipamentoId: '',
  numeroExemplar: null,
  descricaoProblema: '',
  numeroPedidoOrcamento: null,
  custoEstimadoReparacao: null,
  estadoEquipamento: ''
})

const lojas = ref([])

const mensagemSucesso = ref('')
const mensagemErro = ref('')
const carregando = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/lojas')
    lojas.value = response.data
  } catch (error) {
    console.error('Erro ao buscar lojas:', error)
  }
})

async function submeterAvaliacao() {
  carregando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    const token = localStorage.getItem('token')
    await axios.post('http://localhost:3000/api/avaliacoes', avaliacao.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    mensagemSucesso.value = 'Avaliação registrada com sucesso!'
    avaliacao.value = {
      lojaId: '',
      clienteId: '',
      equipamentoId: '',
      numeroExemplar: null,
      descricaoProblema: '',
      numeroPedidoOrcamento: null,
      custoEstimadoReparacao: null,
      estadoEquipamento: ''
    }
  } catch (error) {
    mensagemErro.value =
      error.response?.data?.error || 'Erro ao registrar avaliação.'
    console.error('Erro ao registrar avaliação:', error)
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.avaliacao-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

input,
textarea,
select {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #aaa;
}

button {
  padding: 0.6rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button[disabled] {
  background-color: #888;
  cursor: not-allowed;
}

.sucesso {
  color: green;
  margin-top: 1rem;
}

.erro {
  color: red;
  margin-top: 1rem;
}

/* Header */
header {
  background: #0d6efd;
  padding: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 10px 10px;
  margin-bottom: 30px;
}

h1 {
  margin: 10;
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
}

/* ... resto do CSS permanece igual ... */
</style>
