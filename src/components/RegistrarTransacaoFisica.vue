<template>
  <div class="container">
    <h1>📦 Registrar Transação em Loja Física</h1>

    <form @submit.prevent="registrarTransacao">

      <label for="cliente">Cliente:</label>
      <select v-model="clienteId" required>
        <option disabled value="">Selecione um cliente</option>
        <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
          {{ cliente.nome }}
        </option>
      </select>

      <label for="equipamentos">Equipamentos:</label>
      <div v-for="equipamento in equipamentos" :key="equipamento._id">
        <input
          type="checkbox"
          :value="equipamento._id"
          v-model="equipamentosSelecionados"
        />
        {{ equipamento.nome }} - €{{ Number(equipamento.preco).toFixed(2) }}
      </div>

      <label for="vendedor">Vendedor:</label>
      <select v-model="vendedorId" required>
        <option disabled value="">Selecione o vendedor</option>
        <option v-for="vendedor in vendedores" :key="vendedor._id" :value="vendedor._id">
          {{ vendedor.nome }}
        </option>
      </select>

      <label for="loja">Loja:</label>
      <select v-model="lojaId" required>
        <option disabled value="">Selecione a loja</option>
        <option v-for="loja in lojas" :key="loja._id" :value="loja._id">
          {{ loja.nome }}
        </option>
      </select>

      <p><strong>Total:</strong> € {{ calcularTotal().toFixed(2) }}</p>

      <button type="submit">Registrar Transação</button>
      <div v-if="mensagem" class="mensagem">{{ mensagem }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const clienteId = ref('')
const equipamentosSelecionados = ref([])
const vendedorId = ref('')
const lojaId = ref('')
const mensagem = ref('')

const clientes = ref([])
const equipamentos = ref([])
const vendedores = ref([])
const lojas = ref([])

function calcularTotal() {
  return equipamentos.value
    .filter(eq => equipamentosSelecionados.value.includes(eq._id))
    .reduce((soma, eq) => soma + Number(eq.preco), 0)
}

async function registrarTransacao() {
  if (!clienteId.value || equipamentosSelecionados.value.length === 0 || !vendedorId.value || !lojaId.value) {
    mensagem.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  try {
    const token = localStorage.getItem('token')

    await axios.post('http://localhost:3000/api/transacoes', {
      tipo: 'compra',
      cliente_id: clienteId.value,
      loja_id: lojaId.value,
      equipamentos: equipamentosSelecionados.value,
      total: calcularTotal(),
      canal: 'fisico',
      vendedor_id: vendedorId.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    mensagem.value = 'Transação registrada com sucesso!'
    clienteId.value = ''
    vendedorId.value = ''
    lojaId.value = ''
    equipamentosSelecionados.value = []

  } catch (error) {
    console.error(error)
    mensagem.value = 'Erro ao registrar transação.'
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')

  try {
    const [resClientes, resEquipamentos, resVendedores, resLojas] = await Promise.all([
      axios.get('http://localhost:3000/api/utilizadores/clientes', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/equipamentos', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/utilizadores/vendedores', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/lojas', { headers: { Authorization: `Bearer ${token}` } }),
    ])

    clientes.value = resClientes.data
    equipamentos.value = resEquipamentos.data
    vendedores.value = resVendedores.data
    lojas.value = resLojas.data

  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  }
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 30px auto;
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 0 10px #ccc;
}

label {
  font-weight: bold;
  display: block;
  margin-top: 20px;
}

select,
input[type="checkbox"] {
  margin-top: 5px;
  margin-bottom: 15px;
  width: 100%;
  padding: 8px;
}

button {
  background-color: #0d6efd;
  color: white;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #0b5ed7;
}

.mensagem {
  margin-top: 20px;
  font-weight: bold;
  color: green;
}
</style>
