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
      <!-- Loja -->
      <select v-model="avaliacao.lojaId" required>
        <option value="" disabled>Selecione a loja</option>
        <option v-for="loja in lojas" :key="loja._id" :value="loja._id">
          {{ loja.nome }}
        </option>
      </select>

      <!-- Cliente -->
      <select v-model="avaliacao.clienteId" required>
        <option value="" disabled>Selecione o cliente</option>
        <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
          {{ cliente.nome }} ({{ cliente.email }})
        </option>
      </select>

      <h3>Informações do Equipamento</h3>

      <input v-model="avaliacao.equipamento.nome" placeholder="Nome do equipamento" required />
      <input v-model="avaliacao.equipamento.marca" placeholder="Marca" />
      <input v-model="avaliacao.equipamento.modelo" placeholder="Modelo" />

      <!-- Categoria -->
      <select v-model="avaliacao.equipamento.categoria" required>
        <option value="" disabled>Selecione a categoria</option>
        <option v-for="cat in categorias" :key="cat._id" :value="cat.nome">
          {{ cat.nome }}
        </option>
      </select>

      <!-- Tipo -->
      <select v-model="avaliacao.equipamento.tipo" required>
        <option value="" disabled>Selecione o tipo</option>
        <option v-for="tipo in tipos" :key="tipo._id" :value="tipo.nome">
          {{ tipo.nome }}
        </option>
      </select>

      <input v-model="avaliacao.equipamento.estado" placeholder="Estado do equipamento" />

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

      <!-- futura UI para peçasASubstituir -->

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
  numeroExemplar: null,
  descricaoProblema: '',
  estadoEquipamento: '',
  equipamento: {
    nome: '',
    marca: '',
    modelo: '',
    tipo: '',
    categoria: '',
    estado: ''
  }
})

const lojas = ref([])
const clientes = ref([])
const categorias = ref([])
const tipos = ref([])

const mensagemSucesso = ref('')
const mensagemErro = ref('')
const carregando = ref(false)

onMounted(async () => {
  try {
    const [resLojas, resClientes, resCategorias, resTipos] = await Promise.all([
      axios.get('/api/lojas'),
      axios.get('/api/utilizadores'),
      axios.get('/api/categorias'),
      axios.get('/api/tipos')
    ])

    lojas.value = resLojas.data
    clientes.value = resClientes.data.filter(c => c.role === 'cliente')
    categorias.value = resCategorias.data
    tipos.value = resTipos.data

  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
})

async function submeterAvaliacao() {
  carregando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    // eslint-disable-next-line no-unused-vars
    const token = localStorage.getItem('token')
    await axios.post('/api/avaliacoes', avaliacao.value, {
      headers: {
        withCredentials: true
      }
    })

    mensagemSucesso.value = 'Avaliação registrada com sucesso!'
    avaliacao.value = {
      lojaId: '',
      clienteId: '',
      numeroExemplar: null,
      descricaoProblema: '',
      equipamento: {
        nome: '',
        marca: '',
        modelo: '',
        tipo: '',
        categoria: '',
        estado: ''
      }
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
</style>
